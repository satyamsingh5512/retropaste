import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paste from '@/models/Paste';
import { generateShortId, calculateExpiresAt, detectLanguage } from '@/lib/utils';
import { analyzeCode } from '@/lib/ai-analysis';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { content, language, visibility, expiresIn, maxViews } = body;

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (content.length > 500000) {
      return NextResponse.json(
        { error: 'Content too large (max 500KB)' },
        { status: 400 }
      );
    }

    // Generate unique short ID
    let shortId = generateShortId();
    let exists = await Paste.findOne({ shortId });
    
    while (exists) {
      shortId = generateShortId();
      exists = await Paste.findOne({ shortId });
    }

    // Detect language if not provided
    const detectedLanguage = language || detectLanguage(content);

    // Calculate expiration
    const expiresAt = calculateExpiresAt(expiresIn || '24h');

    // Get metadata
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create paste
    const paste = await Paste.create({
      shortId,
      content,
      language: detectedLanguage,
      visibility: visibility || 'public',
      expiresAt,
      maxViews: maxViews || undefined,
      viewCount: 0,
      permissions: {
        mode: 'view-only',
        requireAuth: false,
      },
      metadata: {
        ip,
        userAgent,
      },
    });

    // Trigger AI analysis asynchronously (don't wait for it)
    analyzeCode(content, detectedLanguage)
      .then(async (analysis) => {
        await Paste.findByIdAndUpdate(paste._id, {
          aiAnalysis: {
            ...analysis,
            analyzedAt: new Date(),
          },
        });
      })
      .catch(err => console.error('AI analysis failed:', err));

    // Return response
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    return NextResponse.json({
      success: true,
      shortId,
      url: `${baseUrl}/${shortId}`,
      expiresAt,
      language: detectedLanguage,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json(
      { error: 'Failed to create paste' },
      { status: 500 }
    );
  }
}
