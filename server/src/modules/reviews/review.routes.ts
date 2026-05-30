import { Router } from 'express';
import { createReview, updateReview, deleteReview, getTripReviews } from './review.controller';
import { protect, authorize } from '../../middleware/auth.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.get('/:tripId', getTripReviews);

router.use(protect);
router.post('/', authorize([UserRole.CUSTOMER]), createReview);
router.patch('/:id', authorize([UserRole.CUSTOMER]), updateReview);
router.delete('/:id', authorize([UserRole.CUSTOMER, UserRole.ADMIN]), deleteReview);

export default router;
