import { InferSchemaType, Model, Schema, model, models } from 'mongoose';

const materialSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedByName: { type: String, required: true, trim: true },
    uploadedAt: { type: Date, default: Date.now },
    fileUrl: { type: String, default: '#' },
    fileType: { type: String, default: 'pdf' },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type MaterialDocument = InferSchemaType<typeof materialSchema> & { _id: string };

export const MaterialModel: Model<InferSchemaType<typeof materialSchema>> =
  models.Material || model('Material', materialSchema);
