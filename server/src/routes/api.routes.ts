import { Router } from 'express';
import { createGenericOrder, verifyGenericPayment } from '../modules/payments/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Generic checkout routes matching exact specifications
router.post('/create-order', protect, createGenericOrder);
router.post('/verify-payment', protect, verifyGenericPayment);

export default router;
