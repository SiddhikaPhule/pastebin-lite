import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Paste from '@/lib/models/Paste';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    const paste = await Paste.findById(id);

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    // Get test time if available
    const testTimeMs = req.headers.get('x-test-now-ms');
    const testTime = testTimeMs ? parseInt(testTimeMs) : undefined;

    // Check if paste is unavailable
    if (paste.is_unavailable(testTime)) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    // Increment view count and check if we've exceeded the limit
    paste.increment_views();
    await paste.save();

    // Check if this was the last allowed view
    if (paste.has_exceeded_views()) {
      // Just saved it, now fetch fresh to see remaining views
      const remaining_views = paste.max_views ? Math.max(0, paste.max_views - paste.view_count) : null;
      return NextResponse.json(
        {
          content: paste.content,
          remaining_views,
          expires_at: paste.expires_at ? paste.expires_at.toISOString() : null,
        },
        { status: 200 }
      );
    }

    const remaining_views = paste.max_views ? Math.max(0, paste.max_views - paste.view_count) : null;

    return NextResponse.json(
      {
        content: paste.content,
        remaining_views,
        expires_at: paste.expires_at ? paste.expires_at.toISOString() : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
