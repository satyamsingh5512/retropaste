// Script to create demo user for hackathon judges
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/retropaste';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  pasteCount: { type: Number, default: 0 },
  apiKey: { type: String, unique: true },
});

async function seedDemoUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@retropaste.dev' });
    
    if (existingUser) {
      console.log('ℹ️  Demo user already exists');
      console.log('📧 Email: demo@retropaste.dev');
      console.log('🔑 Password: demo123456');
      await mongoose.disconnect();
      return;
    }

    // Create demo user
    const passwordHash = await bcrypt.hash('demo123456', 10);
    const apiKey = nanoid(32);

    const demoUser = await User.create({
      email: 'demo@retropaste.dev',
      passwordHash,
      username: 'demo_user',
      apiKey,
      pasteCount: 0,
    });

    console.log('✅ Demo user created successfully!');
    console.log('');
    console.log('📋 Demo Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    demo@retropaste.dev');
    console.log('🔑 Password: demo123456');
    console.log('👤 Username: demo_user');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🎯 Use these credentials for hackathon judging!');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding demo user:', error);
    process.exit(1);
  }
}

seedDemoUser();
