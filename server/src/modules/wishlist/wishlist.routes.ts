import { Router } from 'express';
import { addToWishlist, removeFromWishlist, getWishlist } from './wishlist.controller';
import { protect, authorize } from '../../middleware/auth.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(protect);
router.use(authorize([UserRole.CUSTOMER]));

router.post('/', addToWishlist);
router.delete('/:tripId', removeFromWishlist);
router.get('/', getWishlist);

export default router;
