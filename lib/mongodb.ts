import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI not set. Database features will not work.');
  console.warn('📝 To fix: Set MONGODB_URI in .env.local or start MongoDB locally');
  console.warn('💡 Quick fix: Use MongoDB Atlas free tier at https://www.mongodb.com/cloud/atlas');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  // Return null if no MongoDB URI is configured
  if (!MONGODB_URI) {
    throw new Error(
      'MongoDB not configured. Please set MONGODB_URI in .env.local\n' +
      'Options:\n' +
      '1. Start local MongoDB: docker run -d -p 27017:27017 mongo\n' +
      '2. Use MongoDB Atlas: https://www.mongodb.com/cloud/atlas (free tier)'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    const error = e as Error;
    throw new Error(
      `Failed to connect to MongoDB: ${error.message}\n` +
      'Please check:\n' +
      '1. MongoDB is running (local or Atlas)\n' +
      '2. MONGODB_URI is correct in .env.local\n' +
      '3. Network connectivity'
    );
  }

  return cached.conn;
}
