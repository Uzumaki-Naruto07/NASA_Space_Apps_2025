#!/bin/bash

# 🌐 NASA TEMPO Dashboard - Cloudflare Tunnel Setup
# ================================================
# This script sets up Cloudflare Tunnel for public access
# Run this after your VPS deployment is complete

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🌐 NASA TEMPO Dashboard - Cloudflare Tunnel Setup${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo -e "${BLUE}📦 Installing Cloudflare Tunnel...${NC}"
    curl -fsSL https://pkg.cloudflare.com/install.sh | sudo bash
else
    echo -e "${GREEN}✅ Cloudflare Tunnel already installed${NC}"
fi

echo -e "${YELLOW}🔐 Step 1: Login to Cloudflare${NC}"
echo "================================"
echo -e "${YELLOW}This will open a browser window for authentication...${NC}"
echo ""
read -p "Press Enter to continue with Cloudflare login..."

cloudflared tunnel login

echo ""
echo -e "${YELLOW}🔧 Step 2: Create Tunnel${NC}"
echo "========================"
echo -e "${YELLOW}Creating tunnel named 'nasa-tunnel'...${NC}"

cloudflared tunnel create nasa-tunnel

echo ""
echo -e "${YELLOW}🌍 Step 3: Configure DNS${NC}"
echo "======================="
echo ""
echo -e "${CYAN}Choose your domain setup:${NC}"
echo ""
echo -e "${GREEN}Option 1: Use your own domain${NC}"
echo -e "  Example: nasa-tempo.yourdomain.com"
echo ""
echo -e "${GREEN}Option 2: Use Cloudflare's free subdomain${NC}"
echo -e "  Example: nasa-tempo.trycloudflare.com"
echo ""

read -p "Enter your domain (e.g., nasa-tempo.yourdomain.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Domain is required${NC}"
    exit 1
fi

echo -e "${BLUE}🔧 Configuring DNS for $DOMAIN...${NC}"

# Configure DNS
cloudflared tunnel route dns nasa-tunnel "$DOMAIN"

# Also configure API subdomain
API_DOMAIN="api.${DOMAIN}"
cloudflared tunnel route dns nasa-tunnel "$API_DOMAIN"

echo ""
echo -e "${YELLOW}⚙️ Step 4: Create Tunnel Configuration${NC}"
echo "====================================="

# Create tunnel configuration
sudo mkdir -p /etc/cloudflared
sudo tee /etc/cloudflared/config.yml > /dev/null <<EOF
tunnel: nasa-tunnel
credentials-file: /etc/cloudflared/nasa-tunnel.json

ingress:
  - hostname: $DOMAIN
    service: http://localhost:3000
  - hostname: $API_DOMAIN
    service: http://localhost:5001
  - service: http_status:404
EOF

echo -e "${GREEN}✅ Tunnel configuration created${NC}"

echo ""
echo -e "${YELLOW}🔧 Step 5: Create Systemd Service${NC}"
echo "=================================="

# Create systemd service
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

# Create cloudflared user
sudo useradd -r -s /bin/false cloudflared || true

# Set permissions
sudo chown -R cloudflared:cloudflared /etc/cloudflared/
sudo chmod 600 /etc/cloudflared/nasa-tunnel.json

echo -e "${GREEN}✅ Systemd service created${NC}"

echo ""
echo -e "${YELLOW}🚀 Step 6: Start Tunnel Service${NC}"
echo "================================="

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable cloudflared
sudo systemctl start cloudflared

# Wait a moment for service to start
sleep 5

# Check service status
echo -e "${BLUE}🔍 Checking tunnel status...${NC}"
sudo systemctl status cloudflared --no-pager -l

echo ""
echo -e "${GREEN}🎉 Cloudflare Tunnel Setup Complete!${NC}"
echo -e "${GREEN}===================================${NC}"
echo ""
echo -e "${CYAN}🌍 Your NASA TEMPO Dashboard is now publicly accessible:${NC}"
echo -e "  ${GREEN}Main Dashboard: https://$DOMAIN${NC}"
echo -e "  ${GREEN}API Endpoint: https://$API_DOMAIN${NC}"
echo -e "  ${GREEN}Health Check: https://$API_DOMAIN/health${NC}"
echo ""
echo -e "${CYAN}🔧 Management Commands:${NC}"
echo -e "  ${YELLOW}sudo systemctl status cloudflared${NC}     # Check tunnel status"
echo -e "  ${YELLOW}sudo systemctl restart cloudflared${NC}    # Restart tunnel"
echo -e "  ${YELLOW}sudo journalctl -u cloudflared -f${NC}     # View tunnel logs"
echo ""
echo -e "${CYAN}📊 Features:${NC}"
echo -e "  ✅ HTTPS encryption"
echo -e "  ✅ Global CDN"
echo -e "  ✅ DDoS protection"
echo -e "  ✅ 24/7 uptime"
echo ""
echo -e "${GREEN}🚀 Your dashboard is now live worldwide!${NC}"
echo -e "${GREEN}Share the URL: https://$DOMAIN${NC}"
