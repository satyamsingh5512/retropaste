import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paste from '@/models/Paste';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    await connectDB();
    const { shortId } = await params;
    const body = await request.json();
    const { mode, allowedUsers, requireAuth } = body;

    const paste = await Paste.findOne({ shortId });

    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    // Update permissions
    paste.permissions = {
      mode: mode || paste.permissions.mode,
      allowedUsers: allowedUsers || paste.permissions.allowedUsers,
      requireAuth: requireAuth !== undefined ? requireAuth : paste.permissions.requireAuth,
    };

    await paste.save();

    return NextResponse.json({
      success: true,
      permissions: paste.permissions,
    });

  } catch (error) {
    console.error('Error updating permissions:', error);
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}
