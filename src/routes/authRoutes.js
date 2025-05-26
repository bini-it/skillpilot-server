import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getCurrentUser,
  forgotPassword,
  googleSignin,
  resetPassword,
} from '../controllers/authController.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/me', authenticateUser, getCurrentUser);
router.post('/login', authLimiter, loginUser);
router.post('/register', registerUser);
router.post('/google', authLimiter, googleSignin);
router.post('/logout', logoutUser);
router.get('/refresh-token', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
