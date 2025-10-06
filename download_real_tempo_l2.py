#!/usr/bin/env python3
"""
Download Real TEMPO L2 Data
===========================

This script downloads actual TEMPO L2 data that contains the real measurements
(nitrogendioxide_tropospheric_column, formaldehyde_tropospheric_column, etc.)
instead of the L3 regridded products that only contain spatial weights.

Usage:
    python download_real_tempo_l2.py

You'll need to provide your Earthdata credentials when prompted.
"""

import os
import re
import requests
import xarray as xr
import pandas as pd
from pathlib import Path
from tqdm import tqdm
import getpass

def extract_urls_from_sh(file_path):
    """Extract URLs from bash script files"""
    with open(file_path, 'r') as f:
        content = f.read()
        urls = re.findall(r'https://[^\s]+\.nc(?:4)?', content)
    return list(set(urls))  # Remove duplicates

def download_l2_file(url, output_path, username, password):
    """Download a single L2 file with authentication"""
    try:
        session = requests.Session()
        session.auth = (username, password)
        
        response = session.get(url, stream=True)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def verify_l2_data(nc_file_path):
    """Verify that the downloaded file contains actual measurements"""
    try:
        ds = xr.open_dataset(nc_file_path)
        variables = list(ds.variables.keys())
        
        # Check for measurement variables
        measurement_vars = [var for var in variables if any(keyword in var.lower() 
                          for keyword in ['nitrogen', 'ozone', 'formaldehyde', 'aerosol', 'cloud'])]
        
        print(f"  Variables found: {variables}")
        print(f"  Measurement variables: {measurement_vars}")
        
        if measurement_vars:
            print(f"  ✅ SUCCESS: Found {len(measurement_vars)} measurement variables!")
            return True
        else:
            print(f"  ❌ WARNING: No measurement variables found")
            return False
            
    except Exception as e:
        print(f"  ❌ ERROR: Could not read file: {e}")
        return False

def main():
    print("🌍 TEMPO L2 Data Downloader")
    print("=" * 50)
    print("This will download REAL TEMPO L2 data with actual measurements.")
    print("You'll need your Earthdata credentials.\n")
    
    # Get credentials
    username = input("Enter your Earthdata username: ").strip()
    password = getpass.getpass("Enter your Earthdata password: ")
    
    # Create output directory
    output_dir = Path("real_tempo_l2_data")
    output_dir.mkdir(exist_ok=True)
    
    # Find bash scripts
    bash_scripts = [
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_NO2_L2_V03.sh",
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_HCHO_L2_V03.sh"
    ]
    
    for script_path in bash_scripts:
        if not os.path.exists(script_path):
            print(f"⚠️  Script not found: {script_path}")
            continue
            
        print(f"\n📥 Processing: {script_path}")
        
        # Extract URLs
        urls = extract_urls_from_sh(script_path)
        print(f"  Found {len(urls)} URLs")
        
        # Download first few files as test
        test_count = min(3, len(urls))
        print(f"  Downloading first {test_count} files for testing...")
        
        for i, url in enumerate(urls[:test_count]):
            filename = url.split('/')[-1]
            output_path = output_dir / filename
            
            print(f"  [{i+1}/{test_count}] Downloading {filename}...")
            
            if download_l2_file(url, output_path, username, password):
                print(f"    ✅ Downloaded successfully")
                
                # Verify the data
                if verify_l2_data(output_path):
                    print(f"    🎉 SUCCESS: This file contains real measurements!")
                else:
                    print(f"    ⚠️  WARNING: This file may not contain measurements")
            else:
                print(f"    ❌ Download failed")
    
    print(f"\n📊 Summary:")
    print(f"  Downloaded files are in: {output_dir.absolute()}")
    print(f"  Check the files to verify they contain measurement data")
    print(f"  If successful, you can use these instead of synthetic data!")

if __name__ == "__main__":
    main()
