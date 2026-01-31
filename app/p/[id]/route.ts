import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Paste from '@/lib/models/Paste';
import { ObjectId } from 'mongodb';
import { escapeHtml } from '@/lib/utils';

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
      return new NextResponse('Paste not found', { status: 404 });
    }

    // Get test time if available
    const testTimeMs = req.headers.get('x-test-now-ms');
    const testTime = testTimeMs ? parseInt(testTimeMs) : undefined;

    // Check if paste is unavailable
    if (paste.is_unavailable(testTime)) {
      return new NextResponse('Paste not found', { status: 404 });
    }

    // Increment view count
    paste.increment_views();
    await paste.save();

    // Escape content to prevent XSS
    const escapedContent = escapeHtml(paste.content);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PasteBin Lite - View Paste</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
    <div class="min-h-screen flex items-center justify-center px-4 py-8">
        <div class="w-full max-w-4xl">
            <div class="bg-white rounded-lg shadow-2xl overflow-hidden">
                <div class="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                    <h1 class="text-2xl font-bold text-white">📋 Your Paste</h1>
                </div>
                <div class="p-6">
                    <div class="bg-slate-50 border-2 border-slate-200 rounded-lg p-6 mb-4">
                        <pre class="font-mono text-sm text-slate-700 whitespace-pre-wrap break-words overflow-auto max-h-96"><code>${escapedContent}</code></pre>
                    </div>
                    <div class="flex gap-3 flex-wrap">
                        <button onclick="copyToClipboard()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                            📋 Copy to Clipboard
                        </button>
                        <a href="/" class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition">
                            ➕ Create New Paste
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function copyToClipboard() {
            const text = document.querySelector('pre code').textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert('Copied to clipboard!');
            }).catch(() => {
                alert('Failed to copy');
            });
        }
    </script>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching paste:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
