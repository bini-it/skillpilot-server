import ChatSession from '../models/ChatSessionModel.js';
import Notification from '../models/notificationModel.js';
import Progress from '../models/progressModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import Quiz from '../models/quizModel.js';
import Roadmap from '../models/roadmapModel.js';
import User from '../models/userModel.js';
import buildRoadmapResponse from '../utils/roadmap/buildRoadmapResponse.js';

const getDashboardData = async (req, res) => {
  try {
    const users = await User.find().select(
      '_id username email roadmaps role avatar'
    );
    const roadmaps = await Roadmap.find();
    const chats = await ChatSession.find().populate({
      path: 'userId',
      select: 'username',
    });

    const quizzes = await Quiz.find().populate({
      path: 'roadmapId',
      select: 'roadmapTitle ',
    });

    const quizAttemptsRaw = await QuizAttempt.find()
      .populate({
        path: 'userId',
        select: 'username',
      })
      .populate({
        path: 'quizId',
        select: 'quizTitle questions',
      })
      .populate({
        path: 'roadmapId',
        select: 'roadmapTitle',
      });
    const quizAttempts = quizAttemptsRaw.map((attempt) => ({
      _id: attempt._id,
      username: attempt.userId.username,
      roadmapTitle: attempt.roadmapId.roadmapTitle,
      score: attempt.score,
      isPassed: attempt.isPassed,
      userAnswers: attempt.userAnswers,
      quiz: {
        quizTitle: attempt.quizId.quizTitle,
        questions: attempt.quizId.questions.map((question) => ({
          _id: question._id,
          question: question.question,
          options: question.options,
          correctOption: question.correctOption,
        })),
      },
      quizAttemptDate: attempt.createdAt,
    }));
    return res.status(200).json({
      users,
      roadmaps: roadmaps.map((roadmap) => buildRoadmapResponse(roadmap, null)),
      chats,
      quizzes,
      quizAttempts,
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
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    if (user.role === 'admin') {
      return res
        .status(403)
        .json({ success: false, error: 'Cannot delete admin user.' });
    }
    await User.findByIdAndDelete(userId);
    await Promise.all([
      Progress.deleteMany({ userId }),
      Notification.deleteMany({ receiverUserId: userId }),
      QuizAttempt.deleteMany({ userId }),
      ChatSession.deleteMany({ userId }),
    ]);
    return res
      .status(200)
      .json({ success: true, message: 'User and related data deleted.' });
  } catch (error) {
    console.error('Error deleting user:', error.message, error.stack);
    return res
      .status(500)
      .json({ success: false, error: 'Server error while deleting user.' });
  }
};
export {
  getDashboardData,
  getAllQuizzes,
  getAllQuizAttempts,
  getAllChatHistory,
  deleteUser,
};
