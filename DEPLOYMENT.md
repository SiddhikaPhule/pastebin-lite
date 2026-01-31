# Steps to Deploy PasteBin Lite

## 1. Push to GitHub

### Create a Repository on GitHub

1. Go to https://github.com/new
2. Name the repository: `pastebin-lite`
3. Make it Public
4. Do NOT initialize with README (we already have one)
5. Click "Create repository"

### Push Code to GitHub

After creating the repository, you'll see commands. Run these in your terminal:

```bash
cd /home/shipmantra/pastebin

# Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/pastebin-lite.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 2. Deploy to Vercel

### Connect and Deploy

1. Go to https://vercel.com
2. Sign in with GitHub (or create account)
3. Click "Add New" → "Project"
4. Select your `pastebin-lite` repository
5. Vercel will auto-detect Next.js - click "Deploy"

### Add Environment Variables

Before the deployment completes:
1. In the Vercel dashboard, find your project settings
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```
MONGODB_URI=mongodb+srv://siddhikaphule:Siddhika%4029@mytask.sclwj.mongodb.net/myTask?retryWrites=true&w=majority

NEXT_PUBLIC_API_URL=https://pastebin-lite.vercel.app
```

Replace the API URL with your actual Vercel domain after deployment.

### Complete Deployment

1. Wait for the deployment to finish
2. You'll get a URL like: `https://pastebin-lite.vercel.app`
3. Test it by visiting the URL
4. Update `NEXT_PUBLIC_API_URL` if needed with the final domain

---

## Testing Your Deployment

Once deployed, test the endpoints:

```bash
# Health check
curl https://pastebin-lite.vercel.app/api/healthz

# Create a paste
curl -X POST https://pastebin-lite.vercel.app/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello World", "ttl_seconds":3600, "max_views":5}'

# View the paste (get the URL from response above)
curl https://pastebin-lite.vercel.app/p/<paste_id>
```

---

## Summary

You now have:
- ✅ Complete PasteBin Lite application
- ✅ MongoDB persistence (already connected)
- ✅ Responsive UI with Tailwind CSS
- ✅ All API routes implemented
- ✅ TTL and view limit support
- ✅ XSS protection
- ✅ Comprehensive documentation

Next steps:
1. Push code to GitHub
2. Deploy to Vercel
3. Test the endpoints
4. Submit the deployment URL and repository link
