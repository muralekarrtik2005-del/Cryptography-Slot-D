import express from 'express';
import { getUserProfile, updateProfile, changePassword } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;
