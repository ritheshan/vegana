import { Router } from 'express';
import {
  getUsers,
  getOrganizers,
  approveOrganizer,
  rejectOrganizer,
  blockUser,
  getAnalytics,
} from './admin.controller';
import { protect, authorize } from '../../middleware/auth.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(protect);
router.use(authorize([UserRole.ADMIN]));

router.get('/users', getUsers);
router.get('/organizers', getOrganizers);
router.patch('/organizers/approve', approveOrganizer);
router.patch('/organizers/reject', rejectOrganizer);
router.patch('/users/block', blockUser);
router.get('/analytics', getAnalytics);

export default router;
