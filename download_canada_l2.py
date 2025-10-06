#!/usr/bin/env python3
"""
Download Canada TEMPO L2 Data
=============================

Downloads real TEMPO L2 data for Canada with actual measurements.
Uses your Earthdata credentials directly.
"""

import os
import re
import requests
import xarray as xr
import pandas as pd
from pathlib import Path
from tqdm import tqdm
import time

# Your Earthdata credentials
USERNAME = "nmu_77ii"
PASSWORD = "U|f^2Qx.dSWSFQ*"

def extract_urls_from_sh(file_path):
    """Extract URLs from bash script files"""
    print(f"📄 Reading: {file_path}")
    with open(file_path, 'r') as f:
        content = f.read()
        urls = re.findall(r'https://[^\s]+\.nc(?:4)?', content)
    return list(set(urls))  # Remove duplicates

def download_with_retry(url, output_path, username, password, max_retries=3):
    """Download with retry logic"""
    for attempt in range(max_retries):
        try:
            session = requests.Session()
            session.auth = (username, password)
            
            response = session.get(url, stream=True, timeout=30)
            response.raise_for_status()
            
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            return True
            
        except Exception as e:
            print(f"    Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2)  # Wait before retry
            continue
    return False

def verify_l2_measurements(nc_file_path):
    """Verify that the file contains actual measurements"""
    try:
        ds = xr.open_dataset(nc_file_path)
        variables = list(ds.variables.keys())
        
        # Look for measurement variables
        measurement_vars = [var for var in variables if any(keyword in var.lower() 
                          for keyword in ['nitrogen', 'ozone', 'formaldehyde', 'aerosol', 'cloud'])]
        
        if measurement_vars:
            print(f"    ✅ SUCCESS: Found {len(measurement_vars)} measurement variables!")
            print(f"    Variables: {measurement_vars}")
            
            # Show sample data
            for var in measurement_vars[:2]:  # Show first 2 variables
                try:
                    data = ds[var]
                    print(f"    {var}: shape={data.shape}, range={data.min().values:.3f} to {data.max().values:.3f}")
                except:
                    pass
            return True
        else:
            print(f"    ❌ No measurement variables found")
            return False
            
    except Exception as e:
        print(f"    ❌ Error reading file: {e}")
        return False
    finally:
        try:
            ds.close()
        except:
            pass

def main():
    print("🌍 Canada TEMPO L2 Data Downloader")
    print("=" * 50)
    print("Downloading real TEMPO L2 data for Canada...")
    print(f"Using credentials: {USERNAME}")
    print()
    
    # Create output directory
    output_dir = Path("canada_tempo_l2_data")
    output_dir.mkdir(exist_ok=True)
    print(f"📁 Output directory: {output_dir.absolute()}")
    
    # Canada bash scripts
    bash_scripts = [
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_NO2_L2_V03.sh",
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_HCHO_L2_V03.sh",
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_O3TOT_L3_V03.sh"
    ]
    
    total_downloaded = 0
    total_verified = 0
    
    for script_path in bash_scripts:
        if not os.path.exists(script_path):
            print(f"⚠️  Script not found: {script_path}")
            continue
            
        print(f"\n📥 Processing: {os.path.basename(script_path)}")
        
        # Extract URLs
        urls = extract_urls_from_sh(script_path)
        print(f"  Found {len(urls)} URLs")
        
        # Download first few files as test
        test_count = min(3, len(urls))  # Test with first 3 files
        print(f"  Downloading first {test_count} files for testing...")
        
        for i, url in enumerate(urls[:test_count]):
            filename = url.split('/')[-1]
            output_path = output_dir / filename
            
            print(f"  [{i+1}/{test_count}] {filename}")
            
            if download_with_retry(url, output_path, USERNAME, PASSWORD):
                print(f"    ✅ Downloaded successfully")
                total_downloaded += 1
                
                # Verify the data
                if verify_l2_measurements(output_path):
                    total_verified += 1
                    print(f"    🎉 This file contains real measurements!")
                else:
                    print(f"    ⚠️  This file may not contain measurements")
            else:
                print(f"    ❌ Download failed")
    
    print(f"\n📊 DOWNLOAD SUMMARY:")
    print(f"  Files downloaded: {total_downloaded}")
    print(f"  Files with measurements: {total_verified}")
    print(f"  Output directory: {output_dir.absolute()}")
    
    if total_verified > 0:
        print(f"\n🎉 SUCCESS! You now have real TEMPO L2 data!")
        print(f"Next steps:")
        print(f"1. Check the downloaded files in: {output_dir}")
        print(f"2. Update your validation script to use these files")
        print(f"3. Replace the synthetic data with real measurements")
    else:
        print(f"\n❌ No files with measurements were downloaded.")
        print(f"Check your credentials and try again.")

if __name__ == "__main__":
    main()
