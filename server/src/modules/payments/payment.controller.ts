import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Payment, PaymentTransactionStatus } from './payment.model';
import { Booking, BookingStatus, PaymentStatus as BookingPaymentStatus } from '../bookings/booking.model';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
});

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (String(booking.customerId) !== String(req.user?._id)) {
      res.status(403);
      throw new Error('Not authorized to pay for this booking');
    }

    if (booking.paymentStatus === BookingPaymentStatus.SUCCESS) {
      res.status(400);
      throw new Error('Booking is already paid for');
    }

    const amountInPaise = Math.round(booking.totalAmount * 100);

    if (amountInPaise < 100) {
      res.status(400);
      throw new Error('Amount must be at least INR 1.00');
    }

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_order_${booking._id}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      res.status(500);
      throw new Error('Failed to create Razorpay order');
    }

    await Payment.create({
      bookingId: booking._id,
      amount: booking.totalAmount,
      razorpayOrderId: order.id,
      status: PaymentTransactionStatus.CREATED,
    });

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret';

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error('Payment verification failed');
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      res.status(404);
      throw new Error('Payment record not found');
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = PaymentTransactionStatus.SUCCESS;
    await payment.save();

    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.paymentStatus = BookingPaymentStatus.SUCCESS;
      booking.bookingStatus = BookingStatus.CONFIRMED;
      await booking.save();
    }

    res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const refundPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Basic refund mockup
    const { bookingId } = req.body;

    const payment = await Payment.findOne({ bookingId, status: PaymentTransactionStatus.SUCCESS });
    if (!payment || !payment.razorpayPaymentId) {
      res.status(404);
      throw new Error('Successful payment record not found');
    }

    // Attempt refund with razorpay...
    // const refund = await razorpay.payments.refund(payment.razorpayPaymentId, { amount: payment.amount * 100 });

    payment.status = PaymentTransactionStatus.REFUNDED;
    await payment.save();

    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.paymentStatus = BookingPaymentStatus.REFUNDED;
      booking.bookingStatus = BookingStatus.CANCELLED;
      await booking.save();
    }

    res.status(200).json({ message: 'Refund initiated successfully' });
  } catch (error) {
    next(error);
  }
};

export const createGenericOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (amount === undefined || amount === null) {
      res.status(400);
      throw new Error('Amount is required');
    }

    const amountInPaise = Number(amount);
    if (isNaN(amountInPaise) || amountInPaise < 100) {
      res.status(400);
      throw new Error('Amount must be a valid number and at least 100 paise (1 INR)');
    }

    const options = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `receipt_gen_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      res.status(500);
      throw new Error('Failed to create Razorpay order');
    }

    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    next(error);
  }
};

export const verifyGenericPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error('Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required');
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'IcdM0qpREIXmEIU32kU681aa';

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error('Payment signature verification failed');
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(400);
    }
    next(error);
  }
};

