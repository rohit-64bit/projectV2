import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectToDatabase() {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error('MONGODB_URI is required');
  }

  if (!global.mongooseConn) {
    global.mongooseConn = mongoose.connect(mongodbUri, {
      dbName: process.env.MONGODB_DB || 'brightflow',
    });
  }

  return global.mongooseConn;
}
