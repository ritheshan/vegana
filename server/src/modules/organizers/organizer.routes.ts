import { Router } from 'express';
import { createProfile, getProfile, updateProfile, getDashboard } from './organizer.controller';
import { protect, authorize } from '../../middleware/auth.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(protect);
router.use(authorize([UserRole.ORGANIZER, UserRole.ADMIN]));

router.post('/', createProfile);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/dashboard', getDashboard);

export default router;
