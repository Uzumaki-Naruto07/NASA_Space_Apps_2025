#!/usr/bin/env python3
"""
Simple Canada TEMPO L2 Downloader
=================================

Downloads a few TEMPO L2 files to test if we can get real measurements.
Uses direct URL access with proper authentication.
"""

import os
import requests
import xarray as xr
from pathlib import Path
import time

# Your Earthdata credentials
USERNAME = "nmu_77ii"
PASSWORD = "U|f^2Qx.dSWSFQ*"

def download_file(url, output_path, username, password):
    """Download a single file with authentication"""
    try:
        session = requests.Session()
        session.auth = (username, password)
        
        print(f"  Downloading: {os.path.basename(output_path)}")
        response = session.get(url, stream=True, timeout=60)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        print(f"    ✅ Downloaded successfully ({output_path.stat().st_size} bytes)")
        return True
        
    except Exception as e:
        print(f"    ❌ Download failed: {e}")
        return False

def verify_measurements(file_path):
    """Check if the file contains real measurements"""
    try:
        ds = xr.open_dataset(file_path)
        variables = list(ds.variables.keys())
        
        # Look for measurement variables
        measurement_vars = [var for var in variables if any(keyword in var.lower() 
                          for keyword in ['nitrogen', 'ozone', 'formaldehyde', 'aerosol', 'cloud'])]
        
        print(f"    Variables found: {variables}")
        print(f"    Measurement variables: {measurement_vars}")
        
        if measurement_vars:
            print(f"    🎉 SUCCESS: Found {len(measurement_vars)} measurement variables!")
            for var in measurement_vars[:2]:
                try:
                    data = ds[var]
                    print(f"      {var}: shape={data.shape}, range={data.min().values:.3f} to {data.max().values:.3f}")
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
    print("🌍 Simple Canada TEMPO L2 Downloader")
    print("=" * 50)
    print("Testing download of real TEMPO L2 data...")
    print()
    
    # Create output directory
    output_dir = Path("test_canada_l2")
    output_dir.mkdir(exist_ok=True)
    print(f"📁 Output directory: {output_dir.absolute()}")
    
    # Test URLs from the bash scripts (first few files)
    test_urls = [
        "https://data.asdc.earthdata.nasa.gov/asdc-prod-protected/TEMPO/TEMPO_NO2_L2_V03/2025.05.24/TEMPO_NO2_L2_V03_20250524T164226Z_S008G05.nc",
        "https://data.asdc.earthdata.nasa.gov/asdc-prod-protected/TEMPO/TEMPO_HCHO_L2_V03/2025.05.24/TEMPO_HCHO_L2_V03_20250524T164226Z_S008G05.nc",
        "https://data.asdc.earthdata.nasa.gov/asdc-prod-protected/TEMPO/TEMPO_O3TOT_L3_V03/2025.05.24/TEMPO_O3TOT_L3_V03_20250524T164226Z_S008G05.nc"
    ]
    
    downloaded = 0
    verified = 0
    
    for i, url in enumerate(test_urls):
        print(f"\n[{i+1}/{len(test_urls)}] Testing: {os.path.basename(url)}")
        
        filename = url.split('/')[-1]
        output_path = output_dir / filename
        
        if download_file(url, output_path, USERNAME, PASSWORD):
            downloaded += 1
            
            if verify_measurements(output_path):
                verified += 1
                print(f"    🎉 This file contains real measurements!")
            else:
                print(f"    ⚠️  This file may not contain measurements")
        else:
            print(f"    ❌ Download failed")
    
    print(f"\n📊 SUMMARY:")
    print(f"  Files downloaded: {downloaded}/{len(test_urls)}")
    print(f"  Files with measurements: {verified}/{downloaded}")
    print(f"  Output directory: {output_dir.absolute()}")
    
    if verified > 0:
        print(f"\n🎉 SUCCESS! You have real TEMPO L2 data!")
        print(f"Next steps:")
        print(f"1. Check the files in: {output_dir}")
        print(f"2. Use these files in your validation system")
        print(f"3. Replace synthetic data with real measurements")
    else:
        print(f"\n❌ No files with measurements were downloaded.")
        print(f"This might be due to:")
        print(f"1. Authentication issues")
        print(f"2. URLs not accessible")
        print(f"3. Files not containing measurements")

if __name__ == "__main__":
    main()
