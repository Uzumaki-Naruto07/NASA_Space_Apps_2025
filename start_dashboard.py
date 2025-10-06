#!/usr/bin/env python3
"""
NASA TEMPO Air Quality Dashboard - Startup Script
==================================================
Starts both backend API and serves frontend for complete dashboard
"""

import subprocess
import sys
import os
import time
import webbrowser
from threading import Thread
import http.server
import socketserver
from pathlib import Path

def start_backend():
    """Start the Flask backend API"""
    print("🚀 Starting NASA TEMPO Backend API...")
    
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    try:
        # Install requirements if needed
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True)
        
        # Start Flask app
        subprocess.run([sys.executable, "app.py"], check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting backend: {e}")
        return False
    except KeyboardInterrupt:
        print("🛑 Backend stopped by user")
        return False

def start_frontend():
    """Start the frontend web server"""
    print("🌐 Starting NASA TEMPO Frontend...")
    
    frontend_dir = Path(__file__).parent / "frontend"
    os.chdir(frontend_dir)
    
    # Start simple HTTP server
    PORT = 8080
    Handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"📱 Frontend available at: http://localhost:{PORT}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("🛑 Frontend stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"⚠️ Port {PORT} already in use, trying {PORT + 1}")
            with socketserver.TCPServer(("", PORT + 1), Handler) as httpd:
                print(f"📱 Frontend available at: http://localhost:{PORT + 1}")
                httpd.serve_forever()

def main():
    """Main startup function"""
    print("🚀 NASA TEMPO Air Quality Dashboard")
    print("=" * 50)
    print("🔬 Advanced satellite data validation and AI forecasting")
    print("🌍 Real-time air quality monitoring for NASA Space Apps 2025")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("backend/app.py").exists():
        print("❌ Error: Please run this script from the NASA_Space_Apps_2025 directory")
        sys.exit(1)
    
    print("\n📋 Starting components:")
    print("   🔧 Backend API (Flask) - Port 5000")
    print("   🌐 Frontend (HTML/JS) - Port 8080")
    print("   📊 Data: TEMPO satellite, ground truth, weather")
    print("   🤖 AI/ML: Validation and 24-72h forecasting")
    print("\n⏳ Starting in 3 seconds...")
    time.sleep(3)
    
    # Start backend in a separate thread
    backend_thread = Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to start
    time.sleep(2)
    
    # Start frontend
    try:
        start_frontend()
    except KeyboardInterrupt:
        print("\n🛑 Dashboard stopped by user")
        print("✅ Thank you for using NASA TEMPO Dashboard!")

if __name__ == "__main__":
    main()
