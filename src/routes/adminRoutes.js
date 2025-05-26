import express from 'express';
import {
  getDashboardData,
  getAllQuizzes,
  getAllQuizAttempts,
  getAllChatHistory,
  deleteUser,
} from '../controllers/adminController.js';
import authenticateUser from '../middleware/authenticateUser.js';
import authorizeRole from '../middleware/authorizeRole.js';

const router = express.Router();

router.get(
  '/dashboard',
  authenticateUser,
  authorizeRole('admin'),
  getDashboardData
);
router.get('/quizzes', getAllQuizzes);
router.get('/quiz-attempts', getAllQuizAttempts);
router.get('/chat', getAllChatHistory);
router.delete(
  '/user/:userId',
  authenticateUser,
  authorizeRole('admin'),
  deleteUser
);

export default router;
