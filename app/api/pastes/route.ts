import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Paste from '@/lib/models/Paste';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json(
        { error: 'ttl_seconds must be an integer >= 1' },
        { status: 400 }
      );
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json(
        { error: 'max_views must be an integer >= 1' },
        { status: 400 }
      );
    }

    // Create paste
    const paste = new Paste({
      content,
      ttl_seconds: ttl_seconds || undefined,
      max_views: max_views || undefined,
    });

    await paste.save();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = `${apiUrl}/p/${paste._id}`;

    return NextResponse.json(
      {
        id: paste._id.toString(),
        url,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
