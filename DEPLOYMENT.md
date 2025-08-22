# HealthSense Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/healthsense.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `healthsense` repository
   - Vercel will automatically detect the configuration

3. **Set Environment Variables**
   - In your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = your API key
   - Redeploy if needed

### Option 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Set environment variables
   - Deploy

## 🔧 Environment Variables

**Required:**
- `GEMINI_API_KEY`: Your Google Gemini API key

**Optional:**
- `NODE_ENV`: Set to `production` for production builds

## 📁 Project Structure After Cleanup

```
healthsense/
├── .git/                    # Git repository
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
├── DEPLOYMENT.md           # This deployment guide
├── vercel.json            # Vercel configuration
├── index.html             # Main application
├── dashboard.html         # Admin dashboard
└── backend/
    ├── server.js          # Express server
    └── package.json       # Dependencies
```

## ✅ What Was Cleaned Up

- ❌ `start-backend.bat` - Windows batch file (not needed)
- ❌ `Sample Lab Report.pdf` - Sample data (not needed in production)
- ❌ `backend/node_modules/` - Dependencies (installed by Vercel)
- ❌ `backend/package-lock.json` - Lock file (not needed for Vercel)

## 🌐 Post-Deployment

1. **Test the application**
   - Main app: `https://your-project.vercel.app`
   - Admin dashboard: `https://your-project.vercel.app/dashboard.html`

2. **Monitor logs**
   - Check Vercel dashboard for any errors
   - Verify environment variables are set

3. **Update README**
   - Update the live demo URL
   - Test all functionality

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Check Vercel dashboard
   - Redeploy after setting variables

2. **Build Errors**
   - Check Vercel build logs
   - Verify `vercel.json` configuration

3. **API Errors**
   - Verify Gemini API key is valid
   - Check API quotas and limits

### Support

- Check Vercel documentation
- Review build logs in dashboard
- Verify all files are committed to GitHub

---

**Your HealthSense app is now ready for production! 🎉**
