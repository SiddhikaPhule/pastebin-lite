# PasteBin Lite 📋

A modern, secure, and simple pastebin application built with Next.js and MongoDB. Create temporary text pastes with optional expiry times and view limits.

## Features

- ✨ **Simple & Fast**: Create and share pastes in seconds
- 🔒 **Secure**: Content is accessed only via shareable links
- ⏰ **Time-based Expiry**: Set optional TTL (time-to-live) for pastes
- 👁️ **View Limits**: Limit the number of times a paste can be viewed
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🛡️ **XSS Protection**: Content is safely rendered without script execution
- 🧪 **Deterministic Testing**: Supports test mode for reliable testing

## Tech Stack

- **Frontend**: Next.js 15+ with React
- **Backend**: Next.js API Routes
- **Database**: MongoDB (with Mongoose ODM)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Persistence Layer

This application uses **MongoDB** as the persistence layer:
- Stores paste content, metadata, and view counts
- Supports TTL indexes for automatic cleanup (can be configured)
- Reliable across all request types and serverless environments

The MongoDB connection details are configured via the `MONGODB_URI` environment variable.

## Running Locally

### Prerequisites

- Node.js 20+ and npm
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pastebin-lite.git
cd pastebin-lite
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with:

```env
MONGODB_URI=your_mongodb_connection_string_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

### Prerequisites

- GitHub account with the repository pushed
- Vercel account

### Deployment Steps

1. **Push to GitHub** (if not already done):

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `NEXT_PUBLIC_API_URL`: Your Vercel deployment URL (e.g., https://your-app.vercel.app)
   - Click "Deploy"

3. **Update environment variables post-deployment**:
   - If you need to update `NEXT_PUBLIC_API_URL` after getting your Vercel domain, update it in Vercel dashboard → Settings → Environment Variables

## API Routes

### Health Check

```
GET /api/healthz
```

Returns `{ "ok": true }` if the service is healthy and database is accessible.

### Create Paste

```
POST /api/pastes
```

**Request body:**

```json
{
  "content": "string (required, non-empty)",
  "ttl_seconds": 3600,
  "max_views": 5
}
```

**Response (201):**

```json
{
  "id": "paste_id",
  "url": "https://your-app.vercel.app/p/paste_id"
}
```

### Get Paste (API)

```
GET /api/pastes/:id
```

**Response (200):**

```json
{
  "content": "your paste content here",
  "remaining_views": 4,
  "expires_at": "2026-01-31T15:30:00.000Z"
}
```

### View Paste (HTML)

```
GET /p/:id
```

Returns HTML page with the paste content. Content is rendered safely without script execution.

## Testing

### Test Mode Support

For deterministic testing, set `TEST_MODE=1` and use the `x-test-now-ms` header:

```bash
curl -H "x-test-now-ms: 1704067200000" http://localhost:3000/api/pastes/paste_id
```

### Local Testing

```bash
# Create a test paste
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello World", "ttl_seconds": 60, "max_views": 3}'

# Get the paste
curl http://localhost:3000/api/pastes/YOUR_PASTE_ID

# View the paste (HTML)
curl http://localhost:3000/p/YOUR_PASTE_ID
```

## Important Design Decisions

1. **Serverless-Ready**: Uses MongoDB instead of in-memory storage to work reliably on serverless platforms like Vercel
2. **XSS Prevention**: All paste content is HTML-escaped when rendered to prevent script injection
3. **Concurrent Safety**: View counts are managed through MongoDB atomic operations
4. **Clean UI**: Focused on usability with responsive design and intuitive error handling
5. **No Global State**: No global mutable state that breaks across requests in serverless environments

## Project Structure

```
pastebin-lite/
├── app/
│   ├── api/
│   │   ├── healthz/
│   │   ├── pastes/
│   │   └── [id]/
│   ├── p/
│   │   └── [id]/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── dbConnect.ts
│   ├── models/
│   │   └── Paste.ts
│   └── utils.ts
├── .env.local
├── package.json
└── README.md
```

## Error Handling

- **Invalid input**: Returns 400 with descriptive error message
- **Expired paste**: Returns 404
- **View limit exceeded**: Returns 404
- **Missing paste**: Returns 404
- **Server errors**: Returns 500

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for secure, simple paste sharing
