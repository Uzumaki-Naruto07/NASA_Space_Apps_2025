#!/usr/bin/env python3
"""
CleanSkies AI - Complete System Startup Script
==============================================
Starts both Flask backend and React frontend for the NASA Space Apps project
"""

import subprocess
import os
import sys
import time
import signal
import threading
from pathlib import Path

def start_backend():
    """Start the Flask backend server"""
    print("🚀 Starting Flask backend...")
    backend_path = Path(__file__).parent / "backend"
    
    # Change to backend directory
    os.chdir(backend_path)
    
    # Start Flask app
    process = subprocess.Popen([
        sys.executable, "app.py"
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    print(f"✅ Flask backend started with PID: {process.pid}")
    print("   Backend URL: http://localhost:5000")
    return process

def start_frontend():
    """Start the React frontend development server"""
    print("🎨 Starting React frontend...")
    frontend_path = Path(__file__).parent / "frontend"
    
    # Change to frontend directory
    os.chdir(frontend_path)
    
    # Start Vite dev server
    process = subprocess.Popen([
        "npm", "run", "dev"
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    print(f"✅ React frontend started with PID: {process.pid}")
    print("   Frontend URL: http://localhost:5173")
    return process

def monitor_process(process, name):
    """Monitor a process and print its output"""
    while process.poll() is None:
        output = process.stdout.readline()
        if output:
            print(f"[{name}] {output.strip()}")
        time.sleep(0.1)

def main():
    """Main startup function"""
    print("🌟 CleanSkies AI - NASA Space Apps 2025")
    print("=" * 50)
    
    backend_process = None
    frontend_process = None
    
    try:
        # Start backend
        backend_process = start_backend()
        time.sleep(3)  # Give backend time to start
        
        # Start frontend
        frontend_process = start_frontend()
        time.sleep(3)  # Give frontend time to start
        
        print("\n🎉 CleanSkies AI is now running!")
        print("=" * 50)
        print("📊 Backend API: http://localhost:5001")
        print("🌐 Frontend: http://localhost:5173")
        print("📚 API Documentation: http://localhost:5001")
        print("\nPress Ctrl+C to stop both servers")
        print("=" * 50)
        
        # Monitor both processes
        backend_thread = threading.Thread(
            target=monitor_process, 
            args=(backend_process, "BACKEND")
        )
        frontend_thread = threading.Thread(
            target=monitor_process, 
            args=(frontend_process, "FRONTEND")
        )
        
        backend_thread.daemon = True
        frontend_thread.daemon = True
        backend_thread.start()
        frontend_thread.start()
        
        # Keep main thread alive
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Shutting down CleanSkies AI...")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        
    finally:
        # Cleanup processes
        if frontend_process:
            print("🛑 Stopping frontend...")
            frontend_process.terminate()
            try:
                frontend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                frontend_process.kill()
                
        if backend_process:
            print("🛑 Stopping backend...")
            backend_process.terminate()
            try:
                backend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                backend_process.kill()
                
        print("✅ CleanSkies AI stopped successfully")

if __name__ == "__main__":
    main()
