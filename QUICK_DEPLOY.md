# 🚀 NASA TEMPO Dashboard - Quick Deploy

**Get your NASA Space Apps project live in 5 minutes!**

## 🎯 One-Click Deployment

### Option 1: Railway + Vercel (Recommended)

**Backend (Railway):**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your NASA repository
5. Set root directory to `backend/`
6. Deploy! ✅

**Frontend (Vercel):**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your NASA repository
5. Set root directory to `frontend/`
6. Set build command: `npm run build`
7. Set output directory: `dist`
8. Add environment variable: `VITE_API_URL=https://your-backend.railway.app`
9. Deploy! ✅

### Option 2: Heroku + Netlify

**Backend (Heroku):**
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Run: `git subtree push --prefix=backend heroku main`

**Frontend (Netlify):**
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL=https://your-app.herokuapp.com`

## 🔧 Manual Setup

If you prefer manual deployment:

```bash
# 1. Push to GitHub
git add .
git commit -m "Add deployment configs"
git push origin main

# 2. Follow platform-specific instructions above
```

## 🌐 Your Live Links

After deployment:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-project.railway.app`
- **Health Check**: `https://your-project.railway.app/api/health`

## ✅ What You'll Get

Your live NASA TEMPO Dashboard will include:

- 🛰️ **Real-time satellite data visualization**
- 🤖 **AI/ML forecasting (24-72 hours)**
- 🏥 **Health assessment tools**
- 🌍 **Multi-language support (English/Arabic)**
- 📊 **Interactive maps and charts**
- 🔬 **Complete validation results**
- 📱 **Mobile-responsive design**

## 🎉 Success!

Once deployed, you'll have a professional NASA Space Apps project that you can:
- Submit to NASA Space Apps Challenge
- Share with judges and team members
- Use for portfolio and demonstrations
- Access from anywhere in the world

## 🆘 Need Help?

1. **Check the logs** in your deployment platform
2. **Verify environment variables** are set correctly
3. **Test the health endpoint**: `https://your-backend.railway.app/api/health`
4. **Check browser console** for any frontend errors

## 📚 Full Documentation

For detailed instructions, see:
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `README.md` - Project overview
- `QUICKSTART.md` - Local development

---

**🚀 Ready to deploy your NASA project and get that live link!**
