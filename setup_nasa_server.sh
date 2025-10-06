#!/bin/bash

# 🚀 NASA TEMPO Dashboard - Complete VPS Setup Script
# ===================================================
# This script automates the entire deployment process for your NASA project
# on a cloud VPS with 24/7 uptime and public access via Cloudflare Tunnel
#
# Usage: 
# 1. Get a free VPS (Oracle Cloud, Google Cloud, AWS)
# 2. SSH into your server: ssh ubuntu@YOUR_SERVER_IP
# 3. Run: curl -fsSL https://raw.githubusercontent.com/yourusername/NASA_Space_Apps_2025/main/setup_nasa_server.sh | bash
#    OR copy this script to your server and run: bash setup_nasa_server.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="nasa-tempo-dashboard"
PROJECT_DIR="/home/ubuntu/NASA_Space_Apps_2025"
BACKEND_PORT=5001
FRONTEND_PORT=3000
DOMAIN_NAME="nasa-tempo.yourdomain.com"  # Change this to your domain

echo -e "${CYAN}🚀 NASA TEMPO Dashboard - VPS Setup Script${NC}"
echo -e "${CYAN}===========================================${NC}"
echo ""
echo -e "${YELLOW}This script will:${NC}"
echo -e "  ✅ Update system packages"
echo -e "  ✅ Install Python, Node.js, and dependencies"
echo -e "  ✅ Clone and setup your NASA project"
echo -e "  ✅ Configure Flask backend with auto-restart"
echo -e "  ✅ Setup Cloudflare Tunnel for public access"
echo -e "  ✅ Configure systemd services for 24/7 uptime"
echo -e "  ✅ Setup security and firewall"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ Please don't run this script as root. Use a regular user with sudo access.${NC}"
    exit 1
fi

# Check if we have sudo access
if ! sudo -n true 2>/dev/null; then
    echo -e "${YELLOW}🔐 This script requires sudo access. Please enter your password when prompted.${NC}"
fi

echo -e "${BLUE}📦 Step 1: Updating System Packages${NC}"
echo "=================================="
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

echo -e "${BLUE}🐍 Step 2: Installing Python 3.11 and pip${NC}"
echo "============================================="
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.11 1

echo -e "${BLUE}📦 Step 3: Installing Node.js 18 LTS${NC}"
echo "===================================="
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

echo -e "${BLUE}🔧 Step 4: Installing Additional Dependencies${NC}"
echo "============================================="
sudo apt install -y nginx ufw fail2ban htop tree jq

echo -e "${BLUE}📁 Step 5: Setting up Project Directory${NC}"
echo "====================================="
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}⚠️  Project directory already exists. Backing up to ${PROJECT_DIR}.backup${NC}"
    sudo mv "$PROJECT_DIR" "${PROJECT_DIR}.backup"
fi

# Create project directory
sudo mkdir -p "$PROJECT_DIR"
sudo chown -R $USER:$USER "$PROJECT_DIR"

echo -e "${BLUE}📥 Step 6: Cloning NASA Project${NC}"
echo "================================="
cd /home/ubuntu

# If you have a GitHub repository, use this:
# git clone https://github.com/yourusername/NASA_Space_Apps_2025.git

# For now, we'll create the project structure
echo -e "${YELLOW}📝 Creating project structure...${NC}"
mkdir -p "$PROJECT_DIR"/{backend,frontend,data/{raw,processed,ground,tempo,weather},artifacts/validation}

# Copy your project files (you'll need to upload them)
echo -e "${YELLOW}📤 Please upload your project files to the server.${NC}"
echo -e "${YELLOW}   You can use scp, rsync, or git clone to transfer your files.${NC}"
echo ""
echo -e "${CYAN}   Example commands to upload from your local machine:${NC}"
echo -e "   ${GREEN}scp -r /path/to/NASA_Space_Apps_2025/* ubuntu@$(curl -s ifconfig.me):$PROJECT_DIR/${NC}"
echo -e "   ${GREEN}rsync -avz /path/to/NASA_Space_Apps_2025/ ubuntu@$(curl -s ifconfig.me):$PROJECT_DIR/${NC}"
echo ""

# Wait for user to upload files
read -p "Press Enter after you've uploaded your project files to continue..."

echo -e "${BLUE}🐍 Step 7: Setting up Python Virtual Environment${NC}"
echo "============================================="
cd "$PROJECT_DIR/backend"
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
if [ -f "requirements.txt" ]; then
    pip install --upgrade pip
    pip install -r requirements.txt
else
    echo -e "${YELLOW}⚠️  requirements.txt not found. Installing basic dependencies...${NC}"
    pip install Flask==2.3.3 Flask-CORS==4.0.0 pandas==2.0.3 numpy==1.24.3 scikit-learn==1.3.0 xgboost==1.7.6 matplotlib==3.7.2 seaborn==0.12.2 scipy==1.11.1 requests==2.31.0 python-dotenv==1.0.0 gunicorn
fi

echo -e "${BLUE}📦 Step 8: Setting up Frontend Dependencies${NC}"
echo "========================================="
cd "$PROJECT_DIR/frontend"
if [ -f "package.json" ]; then
    npm install
    npm run build
else
    echo -e "${YELLOW}⚠️  Frontend package.json not found. Skipping frontend setup...${NC}"
fi

echo -e "${BLUE}🔧 Step 9: Creating Systemd Service for Backend${NC}"
echo "============================================="
sudo tee /etc/systemd/system/nasa-backend.service > /dev/null <<EOF
[Unit]
Description=NASA TEMPO Dashboard Backend
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=$PROJECT_DIR/backend
Environment=PATH=$PROJECT_DIR/backend/venv/bin
ExecStart=$PROJECT_DIR/backend/venv/bin/python app.py
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nasa-backend

[Install]
WantedBy=multi-user.target
EOF

echo -e "${BLUE}🔧 Step 10: Creating Systemd Service for Frontend${NC}"
echo "=============================================="
sudo tee /etc/systemd/system/nasa-frontend.service > /dev/null <<EOF
[Unit]
Description=NASA TEMPO Dashboard Frontend
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=$PROJECT_DIR/frontend
Environment=PATH=/usr/bin:/usr/local/bin
ExecStart=/usr/bin/npm run preview -- --host 0.0.0.0 --port $FRONTEND_PORT
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nasa-frontend

[Install]
WantedBy=multi-user.target
EOF

echo -e "${BLUE}🌐 Step 11: Installing and Configuring Cloudflare Tunnel${NC}"
echo "====================================================="
# Install cloudflared
curl -fsSL https://pkg.cloudflare.com/install.sh | sudo bash

# Create tunnel configuration
sudo mkdir -p /etc/cloudflared
sudo tee /etc/cloudflared/config.yml > /dev/null <<EOF
tunnel: nasa-tunnel
credentials-file: /etc/cloudflared/nasa-tunnel.json

ingress:
  - hostname: $DOMAIN_NAME
    service: http://localhost:$FRONTEND_PORT
  - hostname: api.$DOMAIN_NAME
    service: http://localhost:$BACKEND_PORT
  - service: http_status:404
EOF

# Create systemd service for cloudflared
sudo tee /etc/systemd/system/cloudflared.service > /dev/null <<EOF
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=cloudflared
ExecStart=/usr/local/bin/cloudflared tunnel --config /etc/cloudflared/config.yml run
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=cloudflared

[Install]
WantedBy=multi-user.target
EOF

echo -e "${BLUE}🔐 Step 12: Setting up Security${NC}"
echo "============================="
# Configure UFW firewall
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Configure fail2ban
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

echo -e "${BLUE}🚀 Step 13: Starting Services${NC}"
echo "============================="
# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable nasa-backend
sudo systemctl enable nasa-frontend
sudo systemctl enable cloudflared

sudo systemctl start nasa-backend
sudo systemctl start nasa-frontend

echo -e "${BLUE}📊 Step 14: Verifying Installation${NC}"
echo "================================="
sleep 10

# Check service status
echo -e "${CYAN}🔍 Service Status:${NC}"
sudo systemctl status nasa-backend --no-pager -l
echo ""
sudo systemctl status nasa-frontend --no-pager -l
echo ""

# Test endpoints
echo -e "${CYAN}🧪 Testing Endpoints:${NC}"
if curl -s http://localhost:$BACKEND_PORT/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on port $BACKEND_PORT${NC}"
else
    echo -e "${RED}❌ Backend is not responding${NC}"
fi

if curl -s http://localhost:$FRONTEND_PORT > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running on port $FRONTEND_PORT${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
fi

echo -e "${BLUE}🎉 Step 15: Cloudflare Tunnel Setup${NC}"
echo "===================================="
echo -e "${YELLOW}🔐 IMPORTANT: You need to complete the Cloudflare Tunnel setup manually:${NC}"
echo ""
echo -e "${CYAN}1. Login to Cloudflare:${NC}"
echo -e "   ${GREEN}cloudflared tunnel login${NC}"
echo ""
echo -e "${CYAN}2. Create a tunnel:${NC}"
echo -e "   ${GREEN}cloudflared tunnel create nasa-tunnel${NC}"
echo ""
echo -e "${CYAN}3. Configure DNS:${NC}"
echo -e "   ${GREEN}cloudflared tunnel route dns nasa-tunnel $DOMAIN_NAME${NC}"
echo -e "   ${GREEN}cloudflared tunnel route dns nasa-tunnel api.$DOMAIN_NAME${NC}"
echo ""
echo -e "${CYAN}4. Start the tunnel:${NC}"
echo -e "   ${GREEN}sudo systemctl start cloudflared${NC}"
echo ""

echo -e "${GREEN}🎉 NASA TEMPO Dashboard Setup Complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${CYAN}📊 Your dashboard is now running:${NC}"
echo -e "  🌐 Frontend: http://localhost:$FRONTEND_PORT"
echo -e "  🔧 Backend: http://localhost:$BACKEND_PORT"
echo -e "  📈 Health Check: http://localhost:$BACKEND_PORT/health"
echo ""
echo -e "${CYAN}🔧 Management Commands:${NC}"
echo -e "  ${GREEN}sudo systemctl status nasa-backend${NC}     # Check backend status"
echo -e "  ${GREEN}sudo systemctl status nasa-frontend${NC}    # Check frontend status"
echo -e "  ${GREEN}sudo systemctl restart nasa-backend${NC}    # Restart backend"
echo -e "  ${GREEN}sudo systemctl restart nasa-frontend${NC}   # Restart frontend"
echo -e "  ${GREEN}sudo journalctl -u nasa-backend -f${NC}      # View backend logs"
echo -e "  ${GREEN}sudo journalctl -u nasa-frontend -f${NC}   # View frontend logs"
echo ""
echo -e "${CYAN}🌐 After setting up Cloudflare Tunnel:${NC}"
echo -e "  🌍 Public URL: https://$DOMAIN_NAME"
echo -e "  🔧 API URL: https://api.$DOMAIN_NAME"
echo ""
echo -e "${YELLOW}⚠️  Remember to:${NC}"
echo -e "  1. Complete Cloudflare Tunnel setup"
echo -e "  2. Update domain name in this script if needed"
echo -e "  3. Monitor logs for any issues"
echo -e "  4. Set up SSL certificates if using custom domain"
echo ""
echo -e "${GREEN}🚀 Your NASA TEMPO Dashboard is ready for 24/7 operation!${NC}"
