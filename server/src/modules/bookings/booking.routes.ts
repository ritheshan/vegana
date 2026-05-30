import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
} from './booking.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect); // all routes require authentication

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

export default router;
