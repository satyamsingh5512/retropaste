import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

// This route should be protected in production!
// Only use for initial setup
export async function POST() {
  try {
    await connectDB();

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@retropaste.dev' });
    
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Demo user already exists',
        credentials: {
          email: 'demo@retropaste.dev',
          password: 'demo123456',
          username: 'demo_user',
        },
      });
    }

    // Create demo user
    const passwordHash = await bcrypt.hash('demo123456', 10);
    const apiKey = nanoid(32);

    await User.create({
      email: 'demo@retropaste.dev',
      passwordHash,
      username: 'demo_user',
      apiKey,
      pasteCount: 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Demo user created successfully!',
      credentials: {
        email: 'demo@retropaste.dev',
        password: 'demo123456',
        username: 'demo_user',
      },
    });

  } catch (error) {
    console.error('Error creating demo user:', error);
    return NextResponse.json(
      { error: 'Failed to create demo user' },
      { status: 500 }
    );
  }
}
