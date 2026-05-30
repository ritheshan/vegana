import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Trip, TripStatus } from './trip.model';
import { Organizer } from '../organizers/organizer.model';

export const createTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const organizer = await Organizer.findOne({ userId: req.user?._id });
    if (!organizer || !organizer.isApproved) {
      res.status(403);
      throw new Error('Only approved organizers can create trips');
    }

    const tripData = { ...req.body, organizerId: organizer._id, availableSeats: req.body.totalSeats };
    const trip = await Trip.create(tripData);

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    const organizer = await Organizer.findOne({ userId: req.user?._id });
    if (!organizer || String(trip.organizerId) !== String(organizer._id)) {
      res.status(403);
      throw new Error('Not authorized to update this trip');
    }

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTrip);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    const organizer = await Organizer.findOne({ userId: req.user?._id });
    if (!organizer || String(trip.organizerId) !== String(organizer._id)) {
      res.status(403);
      throw new Error('Not authorized to delete this trip');
    }

    await Trip.deleteOne({ _id: trip._id });
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTrips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trips = await Trip.find({ status: TripStatus.PUBLISHED }).populate('organizerId', 'companyName rating logo');
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('organizerId', 'companyName description rating contactNumber website logo');
    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

export const searchTrips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, destination, budget, duration, rating, seats, date } = req.query;

    let query: any = { status: TripStatus.PUBLISHED };

    if (category) query.category = { $regex: category, $options: 'i' };
    if (destination) query.destination = { $regex: destination, $options: 'i' };
    if (budget) query.price = { $lte: Number(budget) };
    if (duration) query.duration = { $eq: Number(duration) };
    if (seats) query.availableSeats = { $gte: Number(seats) };
    if (date) {
      const searchDate = new Date(date as string);
      query.startDate = { $gte: searchDate };
    }

    const trips = await Trip.find(query).populate('organizerId', 'companyName rating logo');
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};
