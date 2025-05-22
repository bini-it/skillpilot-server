import express from 'express';
import verifyTokenFromQuery from '../middleware/verifyTokenFromQuery.js';
import { streamAiTutorReply } from '../controllers/tutorController.js';

const router = express.Router();

router.get('/', verifyTokenFromQuery , streamAiTutorReply);

export default router;
