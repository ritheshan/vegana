import { Router } from 'express';
import { createOrder, verifyPayment, refundPayment } from './payment.controller';
import { protect, authorize } from '../../middleware/auth.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(protect); // all payment routes require auth

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

// Only admins can trigger refunds directly via this endpoint
router.post('/refund', authorize([UserRole.ADMIN]), refundPayment);

export default router;
