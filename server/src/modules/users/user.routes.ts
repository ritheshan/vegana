import { Router } from 'express';
import { getProfile, updateProfile, changePassword, deleteAccount } from './user.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect); // Apply protect middleware to all user routes

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/change-password', changePassword);
router.delete('/', deleteAccount);

export default router;
