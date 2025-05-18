import Notification from '../models/notificationModel.js';
import Progress from '../models/progressModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import Quiz from '../models/quizModel.js';
import Roadmap from '../models/roadmapModel.js';
import User from '../models/userModel.js';

const clearAllRoadmaps = async () => {
  try {
    const result = await Roadmap.deleteMany({});
    console.log(`Deleted ${result.deletedCount} Roadmaps.`);
  } catch (error) {
    console.error('Error deleting Roadmaps:', error);
  }
};
const clearAllUsers = async () => {
  try {
    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} Users.`);
  } catch (error) {
    console.error('Error deleting Users:', error);
  }
};
const clearAllQuizes = async () => {
  try {
    const result = await Quiz.deleteMany({});
    console.log(`Deleted ${result.deletedCount} Quizzes.`);
  } catch (error) {
    console.error('Error deleting Quizzes:', error);
  }
};
const clearAllNotifications = async () => {
  try {
    const result = await Notification.deleteMany({});
    console.log(`Deleted ${result.deletedCount} Notification.`);
  } catch (error) {
    console.error('Error deleting Notification:', error);
  }
};
const clearAllQuizAttempts = async () => {
  try {
    const result = await QuizAttempt.deleteMany({});
    console.log(`Deleted ${result.deletedCount} Quiz Attempts.`);
  } catch (error) {
    console.error('Error deleting Quiz Attempts:', error);
  }
};
const clearAllProgress = async () => {
  try {
    const result = await Progress.deleteMany({});
    console.log(`Deleted ${result.deletedCount} Progress.`);
  } catch (error) {
    console.error('Error deleting Progress:', error);
  }
};
const clearAllUsersRoadmaps = async () => {
  try {
    const result = await User.updateMany({}, { $set: { roadmaps: [] } });
    console.log(`Updated ${result.modifiedCount} user(s).`);
  } catch (error) {
    console.error('Error clearing roadmaps for all users:', error);
  }
};
export {
  clearAllRoadmaps,
  clearAllUsers,
  clearAllQuizes,
  clearAllQuizAttempts,
  clearAllNotifications,
  clearAllProgress,
  clearAllUsersRoadmaps,
};
