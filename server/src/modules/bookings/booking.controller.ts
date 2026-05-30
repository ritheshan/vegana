import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Booking, BookingStatus, PaymentStatus } from './booking.model';
import { Trip } from '../trips/trip.model';
import { UserRole } from '../users/user.model';
import { Organizer } from '../organizers/organizer.model';

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId, seatsBooked } = req.body;
    const customerId = req.user?._id;

    if (!customerId) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.availableSeats < seatsBooked) {
      res.status(400);
      throw new Error('Not enough available seats');
    }

    const totalAmount = trip.price * seatsBooked;

    const booking = await Booking.create({
      tripId,
      customerId,
      organizerId: trip.organizerId,
      seatsBooked,
      totalAmount,
      bookingStatus: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    });

    // We don't deduct available seats until payment is confirmed or we could hold them.
    // Assuming we hold them upon creation and release upon cancellation:
    trip.availableSeats -= seatsBooked;
    await trip.save();

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    let query = {};
    if (user.role === UserRole.CUSTOMER) {
      query = { customerId: user._id };
    } else if (user.role === UserRole.ORGANIZER) {
      const organizer = await Organizer.findOne({ userId: user._id });
      if (organizer) {
        query = { organizerId: organizer._id };
      } else {
        query = { organizerId: null }; // no bookings
      }
    } else if (user.role !== UserRole.ADMIN) {
      res.status(403);
      throw new Error('Not authorized');
    }
    // ADMIN sees all if no specific query

    const bookings = await Booking.find(query).populate('tripId', 'title startDate endDate meetingPoint images').populate('customerId', 'name email');
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('tripId').populate('customerId', 'name email');
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const userIdStr = String(req.user?._id);
    const organizer = await Organizer.findOne({ userId: req.user?._id });

    // Authorization check
    if (
      req.user?.role !== UserRole.ADMIN &&
      String(booking.customerId._id) !== userIdStr &&
      String(booking.organizerId) !== String(organizer?._id)
    ) {
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const userIdStr = String(req.user?._id);
    const organizer = await Organizer.findOne({ userId: req.user?._id });

    if (
      req.user?.role !== UserRole.ADMIN &&
      String(booking.customerId) !== userIdStr &&
      String(booking.organizerId) !== String(organizer?._id)
    ) {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.bookingStatus === BookingStatus.CANCELLED) {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }

    booking.bookingStatus = BookingStatus.CANCELLED;
    await booking.save();

    // Release seats
    const trip = await Trip.findById(booking.tripId);
    if (trip) {
      trip.availableSeats += booking.seatsBooked;
      await trip.save();
    }

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
};
