import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String, 
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ContextSchema = new Schema({
  roadmapId: {
    type: Schema.Types.ObjectId,
    ref: 'Roadmap',
  },
  roadmapTitle: {
    type: String,
    required: true,
  },
  moduleId: {
    type: Schema.Types.ObjectId,
  },
  moduleTitle: {
    type: String,
    required: true,
  },
  submoduleId: {
    type: Schema.Types.ObjectId,
  },
  submoduleTitle: {
    type: String,
  },
});

const ChatSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    context: {
      type: ContextSchema,
      required: true,
    },
    messages: [MessageSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
ChatSessionSchema.index({
  userId: 1,
  'context.roadmapTitle': 1,
  'context.moduleTitle': 1,
  'context.submoduleTitle': 1,
});
ChatSessionSchema.index({ userId: 1, isActive: 1, updatedAt: -1 });

const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);

export default ChatSession;
