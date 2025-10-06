#!/bin/bash

# 🚀 NASA TEMPO Dashboard - One-Click Deployment
# Deploys everything directly without GitHub

echo "🚀 NASA TEMPO Dashboard - One-Click Deployment"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the NASA_Space_Apps_2025 directory"
    exit 1
fi

echo "✅ Project structure found"
echo ""

# Install required tools
echo "📦 Installing deployment tools..."
echo ""

# Install Railway CLI
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Install Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔐 Authentication Required"
echo "========================="
echo ""

# Railway login
echo "Please login to Railway:"
railway login

# Vercel login
echo "Please login to Vercel:"
vercel login

echo ""
echo "🚀 Deploying Backend to Railway..."
echo "=================================="
cd backend

# Initialize Railway project
railway init --name nasa-tempo-backend

# Deploy to Railway
echo "Deploying backend..."
railway up

# Get the Railway URL
RAILWAY_URL=$(railway domain)
echo "✅ Backend deployed at: https://$RAILWAY_URL"

cd ..

echo ""
echo "🚀 Deploying Frontend to Vercel..."
echo "=================================="
cd frontend

# Deploy to Vercel
echo "Deploying frontend..."
vercel --prod

# Get the Vercel URL
VERCEL_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
echo "✅ Frontend deployed at: $VERCEL_URL"

cd ..

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "Your NASA TEMPO Dashboard is now live!"
echo ""
echo "🌐 Live URLs:"
echo "Frontend: $VERCEL_URL"
echo "Backend: https://$RAILWAY_URL"
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
echo "📚 For troubleshooting, see DIRECT_DEPLOY.md"
