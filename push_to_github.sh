#!/bin/bash

# 🚀 NASA TEMPO Dashboard - GitHub Push Script
# ============================================
# Efficiently organizes and pushes all files to GitHub

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🚀 NASA TEMPO Dashboard - GitHub Push${NC}"
echo -e "${CYAN}====================================${NC}"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not in a Git repository. Initializing...${NC}"
    git init
fi

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}🔗 No remote repository found.${NC}"
    echo -e "${YELLOW}Please add your GitHub repository:${NC}"
    echo -e "${YELLOW}git remote add origin https://github.com/USERNAME/REPO_NAME.git${NC}"
    echo ""
    read -p "Enter your GitHub repository URL: " REPO_URL
    if [ ! -z "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
        echo -e "${GREEN}✅ Remote repository added${NC}"
    fi
fi

echo -e "${BLUE}📁 Step 1: Cleaning up files...${NC}"
echo "================================"

# Remove large data files that shouldn't be in Git
echo -e "${YELLOW}🗑️  Removing large data files...${NC}"
rm -rf canada_tempo_raw_complete/
rm -rf canada_weather_raw/
rm -rf mexico_tempo_raw_complete/
rm -rf mexico_weather_raw/
rm -rf nyc_tempo_raw_complete/
rm -rf nyc_weather_raw/
rm -rf full_tempo_l2/
rm -rf real_tempo_l2_data/
rm -rf test_canada_l2/
rm -rf test_l2_data/
rm -rf test_tempo_l2/
rm -rf single_tempo_test/
rm -rf "Tempo and weather/"
rm -rf artifacts/
rm -rf data/raw/
rm -rf data/processed/
rm -f nasa-backend-package.tar.gz
rm -f *.nc
rm -f *.nc4
rm -f *.HDF5
rm -f *.h5
rm -f *.hdf5

# Remove Python cache
echo -e "${YELLOW}🗑️  Removing Python cache...${NC}"
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name "*.pyo" -delete 2>/dev/null || true

# Remove IDE files
echo -e "${YELLOW}🗑️  Removing IDE files...${NC}"
rm -rf .vscode/
rm -rf .idea/
rm -f .DS_Store
rm -rf .ipynb_checkpoints/

# Remove virtual environments
echo -e "${YELLOW}🗑️  Removing virtual environments...${NC}"
rm -rf venv/ 2>/dev/null || true
rm -rf tempo_env/ 2>/dev/null || true
rm -rf env/ 2>/dev/null || true

echo -e "${GREEN}✅ Cleanup complete${NC}"

echo ""
echo -e "${BLUE}📝 Step 2: Adding files to Git...${NC}"
echo "================================="

# Add all files
git add .

# Check what we're about to commit
echo -e "${YELLOW}📋 Files to be committed:${NC}"
git status --porcelain | head -20
if [ $(git status --porcelain | wc -l) -gt 20 ]; then
    echo -e "${YELLOW}... and $(($(git status --porcelain | wc -l) - 20)) more files${NC}"
fi

echo ""
echo -e "${BLUE}💾 Step 3: Committing changes...${NC}"
echo "=================================="

# Create commit message
COMMIT_MSG="🚀 NASA TEMPO Dashboard - Complete System

✅ Features:
- Real-time satellite data processing
- AI/ML forecasting system
- Health assessment dashboard
- Multi-region support (NYC, Canada, Mexico)
- VPS deployment scripts
- Cloudflare tunnel configuration

🔧 Components:
- Flask backend with comprehensive API
- React frontend with real-time updates
- Data validation and analysis
- External API integrations
- 24/7 deployment setup

📊 Data Sources:
- TEMPO satellite data
- Ground truth validation
- Weather data integration
- OpenAQ, AirNow, UAE APIs

🌍 Deployment:
- One-click VPS setup
- Cloudflare tunnel for public access
- Auto-restart services
- Security hardening

Ready for NASA Space Apps 2025! 🚀"

git commit -m "$COMMIT_MSG"

echo -e "${GREEN}✅ Commit created${NC}"

echo ""
echo -e "${BLUE}🚀 Step 4: Pushing to GitHub...${NC}"
echo "================================="

# Push to GitHub
echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
git push origin main

echo ""
echo -e "${GREEN}🎉 Successfully pushed to GitHub!${NC}"
echo -e "${GREEN}===============================${NC}"
echo ""
echo -e "${CYAN}🌍 Your NASA TEMPO Dashboard is now on GitHub!${NC}"
echo ""
echo -e "${BLUE}📊 Repository includes:${NC}"
echo -e "  ✅ Complete Flask backend"
echo -e "  ✅ React frontend"
echo -e "  ✅ AI/ML forecasting system"
echo -e "  ✅ Data validation tools"
echo -e "  ✅ VPS deployment scripts"
echo -e "  ✅ Cloudflare tunnel setup"
echo -e "  ✅ Comprehensive documentation"
echo ""
echo -e "${BLUE}🔗 Next steps:${NC}"
echo -e "  1. Share your GitHub repository URL"
echo -e "  2. Use the VPS deployment scripts for 24/7 hosting"
echo -e "  3. Set up Cloudflare tunnel for public access"
echo ""
echo -e "${GREEN}🚀 Your NASA project is ready for the world!${NC}"
