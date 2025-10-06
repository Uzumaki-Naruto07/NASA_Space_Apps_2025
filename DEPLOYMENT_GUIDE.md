# 🚀 NASA TEMPO Dashboard - Deployment Guide

This guide will help you deploy your NASA Space Apps project to get a live link you can share.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free)

## 🎯 Quick Deployment (5 minutes)

### Step 1: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your NASA project repository**
5. **Set the root directory to `backend/`**
6. **Railway will automatically detect Python and install dependencies**
7. **Your backend will be available at: `https://your-project-name.railway.app`**

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Set the root directory to `frontend/`**
6. **Set build command: `npm run build`**
7. **Set output directory: `dist`**
8. **Add environment variable: `VITE_API_URL=https://your-backend-url.railway.app`**
9. **Deploy!**

### Step 3: Update Backend URL

After both deployments, update the frontend's `vercel.json` with your actual Railway backend URL.

## 🔧 Manual Deployment Steps

### Backend (Railway)

```bash
# 1. Push to GitHub
git add .
git commit -m "Add deployment configs"
git push origin main

# 2. Go to Railway.app
# 3. Connect GitHub repo
# 4. Set root directory to 'backend/'
# 5. Deploy
```

### Frontend (Vercel)

```bash
# 1. Build the frontend
cd frontend
npm install
npm run build

# 2. Go to Vercel.com
# 3. Connect GitHub repo
# 4. Set root directory to 'frontend/'
# 5. Set build command: npm run build
# 6. Set output directory: dist
# 7. Add environment variable: VITE_API_URL=https://your-backend.railway.app
# 8. Deploy
```

## 🌐 Your Live Links

After deployment, you'll have:

- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-project.railway.app`
- **Health Check**: `https://your-project.railway.app/api/health`

## 🔍 Testing Your Deployment

1. **Check backend health**: Visit `https://your-backend.railway.app/api/health`
2. **Check frontend**: Visit `https://your-frontend.vercel.app`
3. **Test API calls**: Check browser console for any CORS issues

## 🛠️ Troubleshooting

### Backend Issues
- **Port binding**: Railway handles this automatically
- **CORS**: Already configured in `app.py`
- **Data files**: Make sure all data files are in the repository

### Frontend Issues
- **API calls**: Check `VITE_API_URL` environment variable
- **Build errors**: Run `npm run build` locally first
- **CORS**: Backend already has CORS enabled

## 📊 Environment Variables

### Backend (Railway)
- No additional environment variables needed
- All API keys are hardcoded in the app

### Frontend (Vercel)
- `VITE_API_URL`: Your Railway backend URL

## 🎉 Success!

Once deployed, you'll have a live NASA TEMPO Air Quality Dashboard that you can share with anyone!

**Your dashboard will include:**
- ✅ Real-time satellite data visualization
- ✅ AI/ML forecasting (24-72 hours)
- ✅ Health assessment tools
- ✅ Multi-language support (English/Arabic)
- ✅ Interactive maps and charts
- ✅ Complete validation results

## 🔗 Share Your Project

Your live dashboard will be available at:
`https://your-project.vercel.app`

Perfect for:
- NASA Space Apps submission
- Portfolio showcase
- Live demonstrations
- Team collaboration

---

**Built with ❤️ for NASA Space Apps Challenge 2025**
