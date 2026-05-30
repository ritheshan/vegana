import { Request, Response, NextFunction } from 'express';
import { User, UserStatus } from '../users/user.model';
import { Organizer } from '../organizers/organizer.model';
import { Trip } from '../trips/trip.model';
import { Booking } from '../bookings/booking.model';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getOrganizers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizers = await Organizer.find().populate('userId', 'name email status');
    res.status(200).json(organizers);
  } catch (error) {
    next(error);
  }
};

export const approveOrganizer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { organizerId } = req.body;
    const organizer = await Organizer.findById(organizerId);

    if (!organizer) {
      res.status(404);
      throw new Error('Organizer not found');
    }

    organizer.isApproved = true;
    await organizer.save();

    res.status(200).json({ message: 'Organizer approved successfully', organizer });
  } catch (error) {
    next(error);
  }
};

export const rejectOrganizer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { organizerId } = req.body;
    const organizer = await Organizer.findById(organizerId);

    if (!organizer) {
      res.status(404);
      throw new Error('Organizer not found');
    }

    organizer.isApproved = false;
    await organizer.save();

    res.status(200).json({ message: 'Organizer rejected successfully', organizer });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.status = UserStatus.BLOCKED;
    await user.save();

    res.status(200).json({ message: 'User blocked successfully', user });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrganizers = await Organizer.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Basic revenue calculation
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalAmount, 0);

    res.status(200).json({
      totalUsers,
      totalOrganizers,
      totalTrips,
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};
