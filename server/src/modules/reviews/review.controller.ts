import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Review } from './review.model';
import { Booking, BookingStatus } from '../bookings/booking.model';

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId, rating, review } = req.body;
    const customerId = req.user?._id;

    // Check if user actually completed the trip
    const booking = await Booking.findOne({
      tripId,
      customerId,
      bookingStatus: BookingStatus.COMPLETED,
    });

    if (!booking) {
      res.status(403);
      throw new Error('You can only review trips you have completed');
    }

    const existingReview = await Review.findOne({ tripId, customerId });
    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this trip');
    }

    const newReview = await Review.create({
      tripId,
      customerId,
      rating,
      review,
    });

    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (String(review.customerId) !== String(req.user?._id)) {
      res.status(403);
      throw new Error('Not authorized to update this review');
    }

    review.rating = req.body.rating || review.rating;
    review.review = req.body.review || review.review;

    const updatedReview = await review.save();
    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (String(review.customerId) !== String(req.user?._id)) {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    await Review.deleteOne({ _id: review._id });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTripReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find({ tripId: req.params.tripId }).populate('customerId', 'name profileImage');
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
