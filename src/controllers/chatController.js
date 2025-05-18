import ChatSession from '../models/chatSessionModel.js';
import jwt from 'jsonwebtoken';

const establishChatContext = async (req, res) => {
  const userId = req.user.userId;
  const context = req.body;
  const sseToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  try {
    // Check for existing active session with same context
    let chatSession = await ChatSession.findOne({
      userId,
      'context.roadmapTitle': context.roadmapTitle,
      'context.moduleTitle': context.moduleTitle,
      'context.submoduleTitle': context.submoduleTitle,
      isActive: true,
    });

    // Create new session if none exists with this context
    if (!chatSession) {
      chatSession = new ChatSession({
        userId,
        context,
        messages: [],
      });
      await chatSession.save();
    }
    res.json({
      success: true,
      sessionId: chatSession._id,
      context: chatSession.context,
      token: sseToken,
    });
  } catch (error) {
    console.error('Error establishing context:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to establish chat context',
    });
  }
};

const getUserChatHistory = async (req, res) => {
  try {
    const userChatHistory = await ChatSession.find({ userId: req.user.userId });
    res.json({
      success: true,
      history: userChatHistory || [],
    });
    console.log('userChatHistory>', userChatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat history',
    });
  }
};

const getChatHistoryById = async (req, res) => {
  try {
    const userChatHistory = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!userChatHistory) {
      return res.status(404).json({
        success: false,
        error: 'Chat history not found',
      });
    }
    const history = userChatHistory.messages.slice(0, -2) || [];
    res.json({
      success: true,
      history,
    });

    console.log('userChatHistory>', userChatHistory);
  } catch (error) {
    console.error('Error fetching chat history by ID:', error);

    // If there's an error, respond with a 500 status and an error message
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat history',
    });
  }
};

const getChatHistoryByContext = async (req, res) => {
  const userId = req.user.userId;
  const { roadmapTitle, moduleTitle, submoduleTitle } = req.body;
  // Validate required fields
  if (!roadmapTitle || !moduleTitle || !submoduleTitle) {
    return res.status(400).json({
      success: false,
      error:
        'Missing required context fields (roadmapTitle, moduleTitle, submoduleTitle)',
    });
  }
  try {
    const chatHistory = await ChatSession.findOne({
      userId,
      'context.roadmapTitle': roadmapTitle,
      'context.moduleTitle': moduleTitle,
      'context.submoduleTitle': submoduleTitle,
    });
    if (!chatHistory) {
      return res.status(200).json({
        success: false,
        error: 'No chat history in this context',
      });
    }
    return res.status(200).json({
      success: true,
      history: chatHistory.messages,
    });
  } catch (error) {
    console.error('Error fetching chat history by context:', error);

    res.status(500).json({
      success: false,
      error: 'No chat history in this context',
    });
  }
};
export {
  establishChatContext,
  getUserChatHistory,
  getChatHistoryById,
  getChatHistoryByContext,
};
