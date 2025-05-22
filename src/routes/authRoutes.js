import express from 'express';
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

router.get('/me', authenticateUser, getCurrentUser);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.get('/refresh-token', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
export default router;
