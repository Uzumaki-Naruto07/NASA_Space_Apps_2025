#!/bin/bash

# 🚀 NASA TEMPO Dashboard - Direct Deployment (No GitHub)
# This script deploys your project directly without GitHub

echo "🚀 NASA TEMPO Dashboard - Direct Deployment"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the NASA_Space_Apps_2025 directory"
    exit 1
fi

echo "✅ Project structure found"
echo ""

# Check for CLI tools
echo "🔍 Checking for deployment tools..."

# Check Railway CLI
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI found"
    RAILWAY_AVAILABLE=true
else
    echo "⚠️ Railway CLI not found"
    RAILWAY_AVAILABLE=false
fi

# Check Vercel CLI
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI found"
    VERCEL_AVAILABLE=true
else
    echo "⚠️ Vercel CLI not found"
    VERCEL_AVAILABLE=false
fi

echo ""

# Installation prompt
if [ "$RAILWAY_AVAILABLE" = false ] || [ "$VERCEL_AVAILABLE" = false ]; then
    echo "📦 Installing deployment tools..."
    echo ""
    
    if [ "$RAILWAY_AVAILABLE" = false ]; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    if [ "$VERCEL_AVAILABLE" = false ]; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    echo ""
    echo "✅ Tools installed! Please run this script again."
    exit 0
fi

echo "🎯 Deployment Options:"
echo "====================="
echo ""
echo "1. 🚀 Deploy with CLI (Railway + Vercel) - RECOMMENDED"
echo "2. 📁 Create deployment packages for manual upload"
echo "3. 🐳 Create Docker deployment"
echo "4. ❌ Exit"
echo ""

read -p "Choose deployment option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 CLI Deployment"
        echo "================="
        echo ""
        
        # Check if logged in
        echo "🔐 Checking authentication..."
        
        # Railway login check
        if ! railway whoami &> /dev/null; then
            echo "Please login to Railway:"
            railway login
        else
            echo "✅ Railway authenticated"
        fi
        
        # Vercel login check
        if ! vercel whoami &> /dev/null; then
            echo "Please login to Vercel:"
            vercel login
        else
            echo "✅ Vercel authenticated"
        fi
        
        echo ""
        echo "🚀 Deploying Backend to Railway..."
        echo "=================================="
        cd backend
        railway init --name nasa-tempo-backend
        railway up
        echo "✅ Backend deployed!"
        
        echo ""
        echo "🚀 Deploying Frontend to Vercel..."
        echo "==================================="
        cd ../frontend
        vercel --prod
        echo "✅ Frontend deployed!"
        
        echo ""
        echo "🎉 Deployment Complete!"
        echo "======================"
        echo ""
        echo "Your NASA TEMPO Dashboard is now live!"
        echo "Check your Railway and Vercel dashboards for the URLs."
        ;;
        
    2)
        echo ""
        echo "📁 Creating Deployment Packages"
        echo "==============================="
        echo ""
        
        # Create backend package
        echo "📦 Creating backend package..."
        cd backend
        tar -czf ../nasa-backend-package.tar.gz .
        cd ..
        echo "✅ Backend package created: nasa-backend-package.tar.gz"
        
        # Create frontend package
        echo "📦 Creating frontend package..."
        cd frontend
        tar -czf ../nasa-frontend-package.tar.gz .
        cd ..
        echo "✅ Frontend package created: nasa-frontend-package.tar.gz"
        
        echo ""
        echo "📋 Manual Upload Instructions:"
        echo "============================="
        echo ""
        echo "Backend (Railway):"
        echo "1. Go to https://railway.app"
        echo "2. Create new project"
        echo "3. Upload nasa-backend-package.tar.gz"
        echo "4. Extract and deploy"
        echo ""
        echo "Frontend (Vercel):"
        echo "1. Go to https://vercel.com"
        echo "2. Create new project"
        echo "3. Upload nasa-frontend-package.tar.gz"
        echo "4. Set build command: npm run build"
        echo "5. Set output directory: dist"
        echo ""
        ;;
        
    3)
        echo ""
        echo "🐳 Creating Docker Deployment"
        echo "============================"
        echo ""
        
        # Create Dockerfile for backend
        cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["python", "app.py"]
EOF
        
        # Create docker-compose.yml
        cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
    volumes:
      - ./backend/data:/app/data
EOF
        
        echo "✅ Docker files created!"
        echo ""
        echo "🐳 Docker Deployment Instructions:"
        echo "================================="
        echo ""
        echo "1. Build and run locally:"
        echo "   docker-compose up --build"
        echo ""
        echo "2. Deploy to cloud:"
        echo "   - Railway: Supports Docker directly"
        echo "   - Render: Supports Docker"
        echo "   - DigitalOcean: Supports Docker"
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
echo "🎉 Deployment Setup Complete!"
echo "============================"
echo ""
echo "Your NASA TEMPO Dashboard is ready to deploy!"
echo ""
echo "📊 Features you'll get:"
echo "✅ Real-time satellite data"
echo "✅ AI/ML forecasting"
echo "✅ Health assessment"
echo "✅ Multi-language support"
echo "✅ Interactive maps"
echo ""
echo "🔗 Once deployed, you'll have live URLs to share!"
echo ""
echo "📚 For detailed instructions, see DIRECT_DEPLOY.md"
