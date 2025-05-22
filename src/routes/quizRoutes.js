import express from 'express';
import {
  getQuizById,
  submitQuiz,
  getQuizAttempt,
  getUserQuizzes,
} from '../controllers/quizController.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

router.get('/user/:id', authenticateUser, getUserQuizzes);
router.get('/:quizId', authenticateUser, getQuizById);
router.post('/submit', authenticateUser, submitQuiz);
router.get('/attempt/:attemptId', getQuizAttempt);

export default router;
