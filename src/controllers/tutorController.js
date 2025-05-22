import { CohereClientV2 } from 'cohere-ai';
import { generateQuestionForTutor } from '../utils/tutor/generateQuestionForTutor.js';
import ChatSession from '../models/ChatSessionModel.js';
import mongoose from 'mongoose';

const client = new CohereClientV2({ token: process.env.CO_API_KEY });

const streamAiTutorReply = async (req, res) => {
  const { sessionId, question } = req.query;
  const userId = req.user.userId;
  if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
    return res.status(400).json({ error: 'Invalid session ID' });
  }
  try {
    const chatSession = await ChatSession.findOne({
      _id: sessionId,
      userId,
      isActive: true,
    });

    if (!chatSession) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    chatSession.messages.push({
      role: 'user',
      content: question,
      timestamp: new Date(),
    });
    const prompt = generateQuestionForTutor({
      roadmap: chatSession.context.roadmapTitle,
      module: chatSession.context.moduleTitle,
      subModule: chatSession.context.submoduleTitle,
      question,
    });
    let fullResponse = '';
    const response = await client.chatStream({
      model: 'command-a-03-2025',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    for await (const chunk of response) {
      if (chunk.type === 'content-delta') {
        const text = chunk.delta.message.content.text;
        if (text) {
          fullResponse += text;
          const data = JSON.stringify({ text });
          res.write(`data: ${data}\n\n`);
        }
      }
    }
    chatSession.messages.push({
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date(),
    });
    chatSession.updatedAt = new Date();
    await chatSession.save();
    res.write('event: complete\ndata: {}\n\n');
    res.end();
  } catch (error) {
    console.error('Stream error:', error);
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`
    );
    res.end();
  }
};

export { streamAiTutorReply };
