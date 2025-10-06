# 🚀 NASA TEMPO Dashboard - VPS Deployment Guide

## Complete 24/7 Deployment with Cloudflare Tunnel

This guide will help you deploy your NASA TEMPO Dashboard to a cloud VPS for 24/7 operation, accessible worldwide even when your laptop is closed.

---

## 🌍 Step 1: Get a Free Cloud VPS

Choose one of these free options:

### 🔹 Oracle Cloud Free Tier (Recommended)
- **Free forever**: 1/8 OCPU, 1GB RAM, 10GB storage
- **Best for**: Permanent hosting
- **Sign up**: https://cloud.oracle.com/free
- **OS**: Ubuntu 22.04 LTS

### 🔹 Google Cloud Trial
- **Free**: $300 credit for 1 month
- **Best for**: Testing and short-term hosting
- **Sign up**: https://cloud.google.com/free
- **OS**: Ubuntu 22.04 LTS

### 🔹 AWS Free Tier
- **Free**: 12 months with t2.micro
- **Best for**: AWS ecosystem integration
- **Sign up**: https://aws.amazon.com/free
- **OS**: Ubuntu 22.04 LTS

---

## 🖥️ Step 2: Connect to Your Server

After creating your VPS, you'll get an IP address (e.g., `132.145.25.77`).

```bash
# Connect via SSH
ssh ubuntu@YOUR_SERVER_IP

# If you have a key file:
ssh -i your-key.pem ubuntu@YOUR_SERVER_IP
```

---

## 🚀 Step 3: One-Click Deployment

### Option A: Direct Script Execution
```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/yourusername/NASA_Space_Apps_2025/main/setup_nasa_server.sh | bash
```

### Option B: Manual Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/NASA_Space_Apps_2025.git
cd NASA_Space_Apps_2025

# Make the script executable
chmod +x setup_nasa_server.sh

# Run the setup script
./setup_nasa_server.sh
```

---

## 📤 Step 4: Upload Your Project Files

If you don't have a GitHub repository, upload your files manually:

### From Your Local Machine:
```bash
# Using SCP
scp -r /path/to/NASA_Space_Apps_2025/* ubuntu@YOUR_SERVER_IP:/home/ubuntu/NASA_Space_Apps_2025/

# Using RSYNC (recommended)
rsync -avz /path/to/NASA_Space_Apps_2025/ ubuntu@YOUR_SERVER_IP:/home/ubuntu/NASA_Space_Apps_2025/
```

### From Your Laptop:
```bash
# Create a tar archive
tar -czf nasa-project.tar.gz NASA_Space_Apps_2025/

# Upload to server
scp nasa-project.tar.gz ubuntu@YOUR_SERVER_IP:/home/ubuntu/

# On the server, extract
ssh ubuntu@YOUR_SERVER_IP
tar -xzf nasa-project.tar.gz
```

---

## 🌐 Step 5: Configure Cloudflare Tunnel

### 5.1 Login to Cloudflare
```bash
cloudflared tunnel login
```
This will open a browser window for authentication.

### 5.2 Create a Tunnel
```bash
cloudflared tunnel create nasa-tunnel
```

### 5.3 Configure DNS (Choose your domain)
```bash
# Option A: Use a subdomain of your existing domain
cloudflared tunnel route dns nasa-tunnel nasa-tempo.yourdomain.com
cloudflared tunnel route dns nasa-tunnel api.yourdomain.com

# Option B: Use Cloudflare's free subdomain
cloudflared tunnel route dns nasa-tunnel nasa-tempo.trycloudflare.com
```

### 5.4 Start the Tunnel
```bash
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

---

## ✅ Step 6: Verify Your Deployment

### Check Service Status
```bash
# Check all services
sudo systemctl status nasa-backend
sudo systemctl status nasa-frontend
sudo systemctl status cloudflared

# View logs
sudo journalctl -u nasa-backend -f
sudo journalctl -u nasa-frontend -f
```

### Test Your Endpoints
```bash
# Test backend
curl http://localhost:5001/health

# Test frontend
curl http://localhost:3000

# Test public access (after tunnel setup)
curl https://nasa-tempo.yourdomain.com
```

---

## 🔧 Management Commands

### Service Management
```bash
# Restart services
sudo systemctl restart nasa-backend
sudo systemctl restart nasa-frontend
sudo systemctl restart cloudflared

# Stop services
sudo systemctl stop nasa-backend
sudo systemctl stop nasa-frontend

# View logs
sudo journalctl -u nasa-backend -f
sudo journalctl -u nasa-frontend -f
sudo journalctl -u cloudflared -f
```

### Update Your Application
```bash
# Pull latest changes
cd /home/ubuntu/NASA_Space_Apps_2025
git pull origin main

# Restart services
sudo systemctl restart nasa-backend
sudo systemctl restart nasa-frontend
```

---

## 🛡️ Security Features

The setup script automatically configures:

- **UFW Firewall**: Only allows SSH, HTTP, and HTTPS
- **Fail2ban**: Protects against brute force attacks
- **Systemd Services**: Auto-restart on failure
- **User Permissions**: Runs as non-root user
- **Cloudflare Tunnel**: Secure HTTPS connection

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Services Won't Start
```bash
# Check service status
sudo systemctl status nasa-backend

# Check logs for errors
sudo journalctl -u nasa-backend -n 50

# Common fixes
sudo systemctl daemon-reload
sudo systemctl restart nasa-backend
```

#### 2. Port Already in Use
```bash
# Find what's using the port
sudo lsof -i :5001
sudo lsof -i :3000

# Kill the process
sudo kill -9 PID_NUMBER
```

#### 3. Cloudflare Tunnel Issues
```bash
# Check tunnel status
cloudflared tunnel list

# Test tunnel connection
cloudflared tunnel run nasa-tunnel

# Check tunnel logs
sudo journalctl -u cloudflared -f
```

#### 4. Permission Issues
```bash
# Fix ownership
sudo chown -R ubuntu:ubuntu /home/ubuntu/NASA_Space_Apps_2025

# Fix permissions
chmod +x /home/ubuntu/NASA_Space_Apps_2025/setup_nasa_server.sh
```

#### 5. Python Dependencies Issues
```bash
# Recreate virtual environment
cd /home/ubuntu/NASA_Space_Apps_2025/backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 📊 Monitoring Your Deployment

### Health Check Endpoints
- **Backend Health**: `http://localhost:5001/health`
- **API Status**: `http://localhost:5001/`
- **Frontend**: `http://localhost:3000`

### Log Monitoring
```bash
# Real-time logs
sudo journalctl -u nasa-backend -f
sudo journalctl -u nasa-frontend -f

# Log files
tail -f /var/log/syslog | grep nasa
```

### Resource Monitoring
```bash
# System resources
htop
df -h
free -h

# Service status
systemctl list-units --type=service --state=failed
```

---

## 🌍 Public Access URLs

After completing the setup, your dashboard will be accessible at:

- **Main Dashboard**: `https://nasa-tempo.yourdomain.com`
- **API Endpoint**: `https://api.yourdomain.com`
- **Health Check**: `https://api.yourdomain.com/health`

---

## 💰 Cost Breakdown

### Free Tier Options:
- **Oracle Cloud**: $0/month (permanent)
- **Google Cloud**: $0 for 1 month, then ~$5-10/month
- **AWS**: $0 for 12 months, then ~$5-10/month

### Optional Upgrades:
- **Custom Domain**: $10-15/year
- **Cloudflare Pro**: $20/month (optional)
- **Larger VPS**: $5-20/month

---

## 🎯 Final Checklist

- [ ] VPS created and accessible
- [ ] Project files uploaded
- [ ] Setup script completed successfully
- [ ] All services running (`systemctl status`)
- [ ] Cloudflare tunnel configured
- [ ] Public URLs working
- [ ] Health checks passing
- [ ] Logs showing no errors

---

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs**: `sudo journalctl -u service-name -f`
2. **Verify service status**: `sudo systemctl status service-name`
3. **Test endpoints**: `curl http://localhost:PORT`
4. **Check firewall**: `sudo ufw status`
5. **Review this guide**: Look for your specific error

---

## 🎉 Success!

Once everything is working, your NASA TEMPO Dashboard will be:

✅ **Online 24/7** - Even when your laptop is closed  
✅ **Publicly accessible** - Anyone can visit your dashboard  
✅ **Auto-restarting** - Services restart if they crash  
✅ **Secure** - Protected by firewall and Cloudflare  
✅ **Scalable** - Easy to upgrade resources  

Your dashboard is now ready to serve the world! 🌍🚀
