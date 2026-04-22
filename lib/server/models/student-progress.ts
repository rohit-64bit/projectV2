import { InferSchemaType, Model, Schema, model, models } from 'mongoose';

const studentProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalLessonsCompleted: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    studyHoursThisWeek: { type: Number, default: 0 },
    doubtsAsked: { type: Number, default: 0 },
    materialsDownloaded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

studentProgressSchema.index({ userId: 1 }, { unique: true });

export type StudentProgressDocument = InferSchemaType<typeof studentProgressSchema> & { _id: string };

export const StudentProgressModel: Model<InferSchemaType<typeof studentProgressSchema>> =
  models.StudentProgress || model('StudentProgress', studentProgressSchema);
