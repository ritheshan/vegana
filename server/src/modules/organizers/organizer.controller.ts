import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Organizer } from './organizer.model';
import { UserRole } from '../users/user.model';

export const createProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    if (user.role !== UserRole.ORGANIZER && user.role !== UserRole.ADMIN) {
      res.status(403);
      throw new Error('Only users with ORGANIZER role can create an organizer profile');
    }

    const existingProfile = await Organizer.findOne({ userId: user._id });
    if (existingProfile) {
      res.status(400);
      throw new Error('Organizer profile already exists');
    }

    const { companyName, description, contactNumber, website, address, logo, banner } = req.body;

    const organizer = await Organizer.create({
      userId: user._id,
      companyName,
      description,
      contactNumber,
      website,
      address,
      logo,
      banner,
    });

    res.status(201).json(organizer);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const organizer = await Organizer.findOne({ userId: req.user?._id });
    if (!organizer) {
      res.status(404);
      throw new Error('Organizer profile not found');
    }
    res.status(200).json(organizer);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const organizer = await Organizer.findOne({ userId: req.user?._id });
    if (!organizer) {
      res.status(404);
      throw new Error('Organizer profile not found');
    }

    const updatableFields = ['companyName', 'description', 'contactNumber', 'website', 'address', 'logo', 'banner'];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        (organizer as any)[field] = req.body[field];
      }
    });

    const updatedOrganizer = await organizer.save();
    res.status(200).json(updatedOrganizer);
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const organizer = await Organizer.findOne({ userId: req.user?._id });
    if (!organizer) {
      res.status(404);
      throw new Error('Organizer profile not found');
    }

    // Future: Aggregate data like total revenue, recent bookings, etc.
    const dashboardData = {
      organizerId: organizer._id,
      companyName: organizer.companyName,
      isApproved: organizer.isApproved,
      totalTrips: organizer.totalTrips,
      rating: organizer.rating,
      stats: {
        totalBookings: 0,
        revenue: 0,
      },
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    next(error);
  }
};
