import ChatSession from '../models/ChatSessionModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import Quiz from '../models/quizModel.js';
import Roadmap from '../models/roadmapModel.js';
import User from '../models/userModel.js';

const getDashboardData = async (req, res) => {
  try {
    const users = await User.find().select(
      '_id username email roadmaps role avatar'
    );
    const roadmaps = await Roadmap.find();

    return res.status(200).json({
      users,
      roadmaps,
    });
  } catch (error) {
    console.error('Error fetching Dashboard data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch Dashboard data',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();

    return res.status(200).json({ total: quizzes.length, quizzes });
  } catch (error) {
    console.error('Error fetching Quizzes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch Quizzes',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};
const getAllQuizAttempts = async (req, res) => {
  try {
    const quizAttempts = await QuizAttempt.find();

    return res.status(200).json({ total: quizAttempts.length, quizAttempts });
  } catch (error) {
    console.error('Error fetching Quiz Attempts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch Quiz Attempts',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};
const getAllChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatSession.find();
    res.json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat history',
    });
  }
};
export {
  getDashboardData,
  getAllQuizzes,
  getAllQuizAttempts,
  getAllChatHistory,
};
