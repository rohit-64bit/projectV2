import { InferSchemaType, Model, Schema, model, models } from 'mongoose';

export type UserRole = 'student' | 'teacher' | 'admin';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
    avatar: { type: String, default: '' },
    institution: { type: String, default: '' },
    department: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: string };

export const UserModel: Model<InferSchemaType<typeof userSchema>> =
  models.User || model('User', userSchema);
