import { Router } from 'express';
import {
  createTrip,
  updateTrip,
  deleteTrip,
  getTrips,
  getTripById,
  searchTrips,
} from './trip.controller';
import { protect, authorize } from '../../middleware/auth.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

// Public routes
router.get('/search', searchTrips);
router.get('/', getTrips);
router.get('/:id', getTripById);

// Protected routes (Organizer only)
router.use(protect);
router.use(authorize([UserRole.ORGANIZER, UserRole.ADMIN]));

router.post('/', createTrip);
router.patch('/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;
