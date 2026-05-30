import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Wishlist } from './wishlist.model';

export const addToWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.body;
    const customerId = req.user?._id;

    const existingWishlistItem = await Wishlist.findOne({ tripId, customerId });
    if (existingWishlistItem) {
      res.status(400);
      throw new Error('Trip already in wishlist');
    }

    const wishlistItem = await Wishlist.create({ tripId, customerId });
    res.status(201).json(wishlistItem);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?._id;
    const tripId = req.params.tripId;

    const result = await Wishlist.deleteOne({ tripId, customerId });
    if (result.deletedCount === 0) {
      res.status(404);
      throw new Error('Trip not found in wishlist');
    }

    res.status(200).json({ message: 'Trip removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?._id;
    const wishlist = await Wishlist.find({ customerId }).populate('tripId');
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};
