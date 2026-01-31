# 🚀 Complete Deployment Guide for PasteBin Lite

I've built your complete PasteBin Lite application! Here's everything you need to do to push it to GitHub and deploy it on Vercel.

## What's Been Built

✅ **Full-stack application with:**
- Next.js 15 backend with TypeScript
- MongoDB integration (your cluster already added)
- Responsive React frontend with Tailwind CSS
- All required API endpoints
- TTL support & view count limits
- XSS protection
- Deterministic testing support

---

## Step-by-Step Deployment Instructions

### **STEP 1: Push Code to GitHub**

#### 1.1 Create Repository on GitHub

1. Go to **https://github.com/new**
2. Fill in:
   - Repository name: `pastebin-lite`
   - Description: `A modern pastebin application with TTL and view limits`
   - Select: **Public**
3. **Do NOT** check "Initialize with README" (we already have files)
4. Click **"Create repository"**

#### 1.2 Push Code from Your Computer

Open your terminal and run these commands:

```bash
cd /home/shipmantra/pastebin

# Add the remote repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/pastebin-lite.git

# Rename branch to main (if not already)
git branch -M main

# Push code
git push -u origin main
```

**Replace `YOUR_GITHUB_USERNAME`** with your actual GitHub username.

After this completes, visit your GitHub repository URL and you should see all your code!

---

### **STEP 2: Deploy to Vercel**

#### 2.1 Connect Vercel to GitHub

1. Go to **https://vercel.com**
2. Click **"Sign Up"** and choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. You'll be redirected to the Vercel dashboard

#### 2.2 Import Your Repository

1. Click **"Add New"** → **"Project"**
2. Under "Import Git Repository", paste: `https://github.com/YOUR_GITHUB_USERNAME/pastebin-lite`
3. Or just click on your repository from the list if shown
4. Click **"Import"**

#### 2.3 Configure Environment Variables

Before deploying:

1. On the "Configure Project" page, find **"Environment Variables"**
2. Add two variables:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://siddhikaphule:Siddhika%4029@mytask.sclwj.mongodb.net/myTask?retryWrites=true&w=majority` |
| `NEXT_PUBLIC_API_URL` | `https://pastebin-lite.vercel.app` |

**Note:** Replace `pastebin-lite` with your actual project name if different!

3. Click **"Deploy"**

#### 2.4 Wait for Deployment

- The deployment will take 2-3 minutes
- You'll see a progress indicator
- Once complete, you'll get a "Congratulations!" message with your deployment URL

---

### **STEP 3: Update Environment Variables (After Deployment)**

Once Vercel gives you your final domain (usually something like `https://pastebin-lite-xyz.vercel.app`):

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_API_URL` and set it to your actual Vercel domain
4. Click **Save**
5. Go to **Deployments** and click **"Redeploy"** on the latest deployment

---

## Testing Your Deployed Application

Once deployed, test with these commands:

```bash
# Replace with your actual Vercel URL
VERCEL_URL="https://your-app.vercel.app"

# Test health check
curl $VERCEL_URL/api/healthz

# Create a paste
PASTE_RESPONSE=$(curl -s -X POST $VERCEL_URL/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello World! Testing PasteBin Lite", "ttl_seconds":3600, "max_views":5}')

echo $PASTE_RESPONSE | jq .

# Extract the paste ID from response and test viewing
# The URL will be something like: https://your-app.vercel.app/p/PASTE_ID
```

---

## Testing API Endpoints Locally (Optional)

If you want to test locally before deploying:

```bash
cd /home/shipmantra/pastebin

# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev

# In another terminal, test:
curl http://localhost:3000/api/healthz

# Create test paste
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Test paste","ttl_seconds":60,"max_views":3}'
```

---

## Submission Checklist

Once deployed, you need to submit:

- [ ] **Deployed URL** - Your Vercel app URL (e.g., `https://pastebin-lite.vercel.app`)
- [ ] **GitHub Repository URL** - Your public GitHub repo link
- [ ] **Short Notes** - Already in README.md:
  - ✅ Persistence layer: MongoDB
  - ✅ Design decisions documented
  - ✅ Instructions for running locally included

---

## Important Files in Your Project

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `app/page.tsx` | Home page with paste creation UI |
| `app/api/pastes/route.ts` | POST endpoint to create pastes |
| `app/api/pastes/[id]/route.ts` | GET endpoint to fetch paste data |
| `app/p/[id]/route.ts` | HTML page to view paste |
| `app/api/healthz/route.ts` | Health check endpoint |
| `lib/models/Paste.ts` | MongoDB Paste model |
| `lib/dbConnect.ts` | MongoDB connection logic |

---

## Troubleshooting

### Build Fails on Vercel
- Check that all environment variables are set correctly
- Make sure MongoDB URI is correct and the connection is active

### Paste Creation Returns 500
- Check MongoDB URI is correct
- Verify the paste is being saved to MongoDB

### Styling looks broken
- Ensure Tailwind CSS is installed (should be automatic)
- Try clearing Vercel cache and redeploying

---

## Key Features to Verify After Deployment

✅ Create a paste with TTL
✅ Create a paste with view limit
✅ View the paste via shareable link
✅ Content is HTML-escaped (no script execution)
✅ Paste expires after TTL
✅ Paste returns 404 after view limit reached
✅ Health check returns 200
✅ Responsive design on mobile

---

## Quick Reference: Commands You Need

```bash
# From /home/shipmantra/pastebin directory

# Push to GitHub
git remote add origin https://github.com/USERNAME/pastebin-lite.git
git branch -M main
git push -u origin main

# Local testing (optional)
npm run dev
```

---

**You're all set! Follow these steps and your application will be live! 🎉**
