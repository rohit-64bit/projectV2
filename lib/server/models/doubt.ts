import { InferSchemaType, Model, Schema, model, models } from 'mongoose';

const doubtReplySchema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true, trim: true },
    authorAvatar: { type: String, default: '' },
    content: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    isAccepted: { type: Boolean, default: false },
  },
  { _id: true }
);

const doubtSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true, trim: true },
    studentAvatar: { type: String, default: '' },
    subject: { type: String, required: true, trim: true },
    question: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['open', 'answered', 'closed'], default: 'open' },
    replies: { type: [doubtReplySchema], default: [] },
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type DoubtDocument = InferSchemaType<typeof doubtSchema> & { _id: string };

export const DoubtModel: Model<InferSchemaType<typeof doubtSchema>> =
  models.Doubt || model('Doubt', doubtSchema);
