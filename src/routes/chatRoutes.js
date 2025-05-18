import express from 'express';
import authenticateUser from '../middleware/authenticateUser.js';
import {
  establishChatContext,
  getUserChatHistory,
  getChatHistoryById,
  getChatHistoryByContext,
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/', authenticateUser, establishChatContext);
router.post('/context', authenticateUser, getChatHistoryByContext);
router.get('/history', authenticateUser, getUserChatHistory);//unused in client
router.get('/:id', authenticateUser, getChatHistoryById);

export default router;
