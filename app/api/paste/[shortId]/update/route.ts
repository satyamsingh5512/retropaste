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
    const { content, userId, username } = body;

    const paste = await Paste.findOne({ shortId });

    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (paste.permissions.mode === 'view-only') {
      return NextResponse.json(
        { error: 'This paste is view-only' },
        { status: 403 }
      );
    }

    // Update content
    paste.content = content;

    // Track collaborator
    if (userId && username) {
      const existingCollaborator = paste.collaborators?.find(
        (c) => c.userId.toString() === userId
      );

      if (existingCollaborator) {
        existingCollaborator.lastActive = new Date();
      } else {
        if (!paste.collaborators) paste.collaborators = [];
        paste.collaborators.push({
          userId,
          username,
          lastActive: new Date(),
        });
      }
    }

    await paste.save();

    return NextResponse.json({
      success: true,
      content: paste.content,
      collaborators: paste.collaborators,
    });

  } catch (error) {
    console.error('Error updating paste:', error);
    return NextResponse.json(
      { error: 'Failed to update paste' },
      { status: 500 }
    );
  }
}
