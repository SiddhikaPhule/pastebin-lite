'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePaste() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const router = useRouter();

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setError('');
  };

  const handleTtlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTtlSeconds(e.target.value);
    setError('');
  };

  const handleMaxViewsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxViews(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShareUrl('');

    try {
      const payload: any = { content };

      if (ttlSeconds) {
        payload.ttl_seconds = parseInt(ttlSeconds);
      }

      if (maxViews) {
        payload.max_views = parseInt(maxViews);
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create paste');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setShareUrl(data.url);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError('Error creating paste. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            📋 PasteBin Lite
          </h1>
          <p className="text-slate-300 text-lg">
            Share your text snippets securely
          </p>
        </div>

        {/* Share URL Card */}
        {shareUrl && (
          <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-lg p-6 animate-in fade-in slide-in-from-top">
            <h2 className="text-lg font-semibold text-green-900 mb-3">
              ✅ Paste Created Successfully!
            </h2>
            <div className="bg-white border border-green-200 rounded p-3 mb-4">
              <p className="text-sm text-slate-600 mb-1">Share this link:</p>
              <a
                href={shareUrl}
                className="text-blue-600 hover:text-blue-800 font-mono text-sm break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shareUrl}
              </a>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert('Copied to clipboard!');
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
            >
              📋 Copy Link
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Create a Paste</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Paste Content *
              </label>
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Enter your text here..."
                required
                className="w-full h-64 p-4 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                {content.length} characters
              </p>
            </div>

            {/* TTL Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ⏱️ Auto-Expire (seconds) - Optional
              </label>
              <input
                type="number"
                value={ttlSeconds}
                onChange={handleTtlChange}
                placeholder="e.g., 3600 (1 hour)"
                min="1"
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Leave empty for unlimited time
              </p>
            </div>

            {/* View Count Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                👁️ Max Views - Optional
              </label>
              <input
                type="number"
                value={maxViews}
                onChange={handleMaxViewsChange}
                placeholder="e.g., 5"
                min="1"
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Leave empty for unlimited views
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-3 rounded-lg transition disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Paste...' : '🚀 Create Paste'}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">🔒 Secure</h3>
            <p className="text-sm text-blue-700">
              Your pastes are stored securely and accessed only by shared link.
            </p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h3 className="font-semibold text-purple-900 mb-2">⏰ Expiring</h3>
            <p className="text-sm text-purple-700">
              Set auto-expiry time and view limits for ephemeral sharing.
            </p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h3 className="font-semibold text-green-900 mb-2">📱 Mobile</h3>
            <p className="text-sm text-green-700">
              Works seamlessly on all devices with responsive design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
