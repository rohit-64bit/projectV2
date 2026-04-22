import { InferSchemaType, Model, Schema, model, models } from 'mongoose';

const chatMessageSchema = new Schema(
  {
    classId: { type: String, required: true, trim: true },
    userId: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    userAvatar: { type: String, default: '' },
    content: { type: String, required: true, trim: true },
    isAI: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

chatMessageSchema.index({ classId: 1, timestamp: 1 });

export type ChatMessageDocument = InferSchemaType<typeof chatMessageSchema> & { _id: string };

export const ChatMessageModel: Model<InferSchemaType<typeof chatMessageSchema>> =
  models.ChatMessage || model('ChatMessage', chatMessageSchema);
