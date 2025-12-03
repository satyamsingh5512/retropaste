import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paste from '@/models/Paste';
import { formatTimeRemaining } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    await connectDB();
    const { shortId } = await params;

    const paste = await Paste.findOne({ shortId }).populate('userId', 'username');

    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    // Check if expired
    if (paste.expiresAt && paste.expiresAt < new Date()) {
      await Paste.deleteOne({ shortId });
      return NextResponse.json(
        { error: 'Paste has expired' },
        { status: 410 }
      );
    }

    // Check view limit
    if (paste.maxViews && paste.viewCount >= paste.maxViews) {
      await Paste.deleteOne({ shortId });
      return NextResponse.json(
        { error: 'Paste view limit reached' },
        { status: 410 }
      );
    }

    // Increment view count
    paste.viewCount += 1;
    await paste.save();

    // Calculate remaining info
    const viewsRemaining = paste.maxViews 
      ? paste.maxViews - paste.viewCount 
      : null;
    
    const timeRemaining = paste.expiresAt 
      ? formatTimeRemaining(paste.expiresAt) 
      : 'Never';

    return NextResponse.json({
      shortId: paste.shortId,
      content: paste.content,
      language: paste.language,
      visibility: paste.visibility,
      createdAt: paste.createdAt,
      expiresAt: paste.expiresAt,
      viewCount: paste.viewCount,
      viewsRemaining,
      timeRemaining,
      aiAnalysis: paste.aiAnalysis,
      author: paste.userId ? (paste.userId as any).username : 'Anonymous',
      permissions: paste.permissions || { mode: 'view-only' },
      collaborators: paste.collaborators || [],
    });

  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paste' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    await connectDB();
    const { shortId } = await params;

    const result = await Paste.deleteOne({ shortId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Paste deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting paste:', error);
    return NextResponse.json(
      { error: 'Failed to delete paste' },
      { status: 500 }
    );
  }
}
