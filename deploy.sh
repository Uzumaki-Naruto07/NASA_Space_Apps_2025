#!/bin/bash

# 🚀 NASA TEMPO Dashboard - Quick Deploy Script
# This script helps you deploy your NASA project to get a live link

echo "🚀 NASA TEMPO Dashboard - Deployment Helper"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: NASA TEMPO Air Quality Dashboard"
    echo "✅ Git repository initialized"
    echo ""
fi

echo "🔍 Checking project structure..."
echo ""

# Check frontend
if [ -d "frontend" ]; then
    echo "✅ Frontend directory found"
    if [ -f "frontend/package.json" ]; then
        echo "✅ Frontend package.json found"
    else
        echo "❌ Frontend package.json missing"
    fi
else
    echo "❌ Frontend directory not found"
fi

# Check backend
if [ -d "backend" ]; then
    echo "✅ Backend directory found"
    if [ -f "backend/app.py" ]; then
        echo "✅ Backend app.py found"
    else
        echo "❌ Backend app.py missing"
    fi
    if [ -f "backend/requirements.txt" ]; then
        echo "✅ Backend requirements.txt found"
    else
        echo "❌ Backend requirements.txt missing"
    fi
else
    echo "❌ Backend directory not found"
fi

echo ""
echo "📋 Deployment Options:"
echo "====================="
echo ""
echo "1. 🚀 Deploy to Railway (Backend) + Vercel (Frontend) - RECOMMENDED"
echo "2. 🌐 Deploy to Heroku (Backend) + Netlify (Frontend)"
echo "3. 🔧 Manual deployment instructions"
echo "4. ❌ Exit"
echo ""

read -p "Choose deployment option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Railway + Vercel Deployment"
        echo "=============================="
        echo ""
        echo "Step 1: Deploy Backend to Railway"
        echo "---------------------------------"
        echo "1. Go to https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "4. Select this repository"
        echo "5. Set root directory to 'backend/'"
        echo "6. Railway will auto-detect Python and deploy"
        echo ""
        echo "Step 2: Deploy Frontend to Vercel"
        echo "----------------------------------"
        echo "1. Go to https://vercel.com"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New Project'"
        echo "4. Import this repository"
        echo "5. Set root directory to 'frontend/'"
        echo "6. Set build command: npm run build"
        echo "7. Set output directory: dist"
        echo "8. Add environment variable: VITE_API_URL=https://your-backend.railway.app"
        echo "9. Deploy!"
        echo ""
        echo "Step 3: Update Configuration"
        echo "-----------------------------"
        echo "After both deployments, update frontend/vercel.json with your Railway URL"
        echo ""
        ;;
    2)
        echo ""
        echo "🌐 Heroku + Netlify Deployment"
        echo "=============================="
        echo ""
        echo "Step 1: Deploy Backend to Heroku"
        echo "--------------------------------"
        echo "1. Install Heroku CLI"
        echo "2. Run: heroku create your-app-name"
        echo "3. Run: git subtree push --prefix=backend heroku main"
        echo ""
        echo "Step 2: Deploy Frontend to Netlify"
        echo "----------------------------------"
        echo "1. Go to https://netlify.com"
        echo "2. Connect GitHub repository"
        echo "3. Set build command: cd frontend && npm run build"
        echo "4. Set publish directory: frontend/dist"
        echo "5. Add environment variable: VITE_API_URL=https://your-app.herokuapp.com"
        echo ""
        ;;
    3)
        echo ""
        echo "🔧 Manual Deployment Instructions"
        echo "================================="
        echo ""
        echo "Backend Deployment:"
        echo "------------------"
        echo "1. Push to GitHub: git add . && git commit -m 'Deploy' && git push"
        echo "2. Choose a platform: Railway, Heroku, Render, or DigitalOcean"
        echo "3. Connect your GitHub repository"
        echo "4. Set root directory to 'backend/'"
        echo "5. Deploy!"
        echo ""
        echo "Frontend Deployment:"
        echo "-------------------"
        echo "1. Build frontend: cd frontend && npm install && npm run build"
        echo "2. Choose a platform: Vercel, Netlify, or GitHub Pages"
        echo "3. Connect your GitHub repository"
        echo "4. Set build command: npm run build"
        echo "5. Set output directory: dist"
        echo "6. Add environment variable: VITE_API_URL=https://your-backend-url"
        echo "7. Deploy!"
        echo ""
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please choose 1-4."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "Your NASA TEMPO Dashboard will be live at:"
echo "Frontend: https://your-project.vercel.app (or your chosen platform)"
echo "Backend: https://your-project.railway.app (or your chosen platform)"
echo ""
echo "📊 Features available:"
echo "✅ Real-time satellite data"
echo "✅ AI/ML forecasting"
echo "✅ Health assessment"
echo "✅ Multi-language support"
echo "✅ Interactive maps"
echo ""
echo "🔗 Share your live dashboard with anyone!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
