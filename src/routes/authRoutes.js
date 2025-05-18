import express from 'express';
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getCurrentUser,
} from '../controllers/authController.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

router.get('/me', authenticateUser, getCurrentUser);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.get('/refresh-token', refreshAccessToken);

export default router;
