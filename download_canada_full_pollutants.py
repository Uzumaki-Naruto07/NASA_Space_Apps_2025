#!/usr/bin/env python3
"""
Download Canada Full Pollutant Data
===================================

Downloads complete TEMPO L2/L3 data for Canada with all pollutants:
- NO2 (nitrogendioxide_tropospheric_column)
- HCHO (formaldehyde_tropospheric_column) 
- O3 (ozone_tropospheric_column)

Creates: CANADA_FULL_Pollutant.csv
"""

import os
import re
import requests
import xarray as xr
import pandas as pd
import numpy as np
from pathlib import Path
from tqdm import tqdm
import time
import sys

# Install missing packages if needed
def install_package(package):
    try:
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ Installed {package}")
    except:
        print(f"❌ Failed to install {package}")

# Check and install required packages
required_packages = ['xarray', 'netCDF4', 'h5netcdf']
for package in required_packages:
    try:
        __import__(package)
        print(f"✅ {package} is available")
    except ImportError:
        print(f"❌ {package} not found, installing...")
        install_package(package)

# TEMPO Variable Names (Confirmed)
TEMPO_VARIABLES = {
    'TEMPO_NO2_L3_V03': {
        'variables': ['nitrogendioxide_tropospheric_column', 'cloud_fraction', 'latitude', 'longitude', 'time'],
        'description': 'Tropospheric NO₂ column density'
    },
    'TEMPO_HCHO_L3_V03': {
        'variables': ['formaldehyde_tropospheric_column', 'cloud_fraction', 'latitude', 'longitude', 'time'],
        'description': 'Formaldehyde (HCHO) column'
    },
    'TEMPO_O3TOT_L3_V03': {
        'variables': ['ozone_tropospheric_column', 'cloud_fraction', 'latitude', 'longitude', 'time'],
        'description': 'Tropospheric ozone column'
    }
}

def extract_urls_from_sh(file_path):
    """Extract URLs from bash script files"""
    with open(file_path, 'r') as f:
        content = f.read()
        urls = re.findall(r'https://[^\s]+\.nc(?:4)?', content)
    return list(set(urls))  # Remove duplicates

def download_tempo_file(url, output_path, max_size_mb=200):
    """Download a single TEMPO file"""
    try:
        response = requests.get(url, stream=True, timeout=120)
        
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        # Stop if file gets too large
                        if output_path.stat().st_size > max_size_mb * 1024 * 1024:
                            print(f"    ⚠️  File too large, stopping at {max_size_mb}MB")
                            break
            return True
        else:
            print(f"    ❌ Download failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"    ❌ Error: {e}")
        return False

def extract_tempo_data(nc_file_path):
    """Extract TEMPO data from NetCDF file"""
    try:
        ds = xr.open_dataset(nc_file_path)
        variables = list(ds.variables.keys())
        
        # Look for TEMPO variables
        tempo_vars = []
        for var in variables:
            if any(keyword in var.lower() for keyword in [
                'nitrogendioxide_tropospheric_column',
                'formaldehyde_tropospheric_column', 
                'ozone_tropospheric_column',
                'ozone_total_column',
                'cloud_fraction'
            ]):
                tempo_vars.append(var)
        
        if not tempo_vars:
            print(f"    ❌ No TEMPO variables found in {nc_file_path.name}")
            return None
        
        # Extract data
        data_dict = {}
        for var in tempo_vars:
            try:
                data = ds[var].values
                if data.ndim > 1:
                    data = data.flatten()
                data_dict[var] = data
            except:
                pass
        
        # Add coordinates
        if 'latitude' in ds.variables:
            data_dict['latitude'] = ds['latitude'].values.flatten()
        if 'longitude' in ds.variables:
            data_dict['longitude'] = ds['longitude'].values.flatten()
        if 'time' in ds.variables:
            data_dict['time'] = ds['time'].values.flatten()
        
        # Add filename
        data_dict['filename'] = nc_file_path.name
        
        ds.close()
        return data_dict
        
    except Exception as e:
        print(f"    ❌ Error reading {nc_file_path}: {e}")
        return None

def main():
    print("🌍 Canada Full Pollutant Data Downloader")
    print("=" * 60)
    print("Downloading complete TEMPO L2/L3 data for Canada...")
    print("Target: CANADA_FULL_Pollutant.csv")
    print()
    
    # Create output directories
    raw_dir = Path("canada_tempo_raw")
    raw_dir.mkdir(exist_ok=True)
    
    # Canada bash scripts
    bash_scripts = [
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_NO2_L2_V03.sh",
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_HCHO_L2_V03.sh",
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_O3TOT_L3_V03.sh"
    ]
    
    all_data = []
    total_downloaded = 0
    total_processed = 0
    
    for script_path in bash_scripts:
        if not os.path.exists(script_path):
            print(f"❌ Script not found: {script_path}")
            continue
            
        print(f"\n📥 Processing: {os.path.basename(script_path)}")
        
        # Extract URLs
        urls = extract_urls_from_sh(script_path)
        print(f"  Found {len(urls)} URLs")
        
        # Download first 10 files for testing
        test_urls = urls[:10]
        print(f"  Downloading first {len(test_urls)} files...")
        
        for i, url in enumerate(test_urls):
            filename = url.split('/')[-1]
            output_path = raw_dir / filename
            
            print(f"  [{i+1}/{len(test_urls)}] {filename}")
            
            if download_tempo_file(url, output_path):
                total_downloaded += 1
                
                # Extract data
                data = extract_tempo_data(output_path)
                if data:
                    all_data.append(data)
                    total_processed += 1
                    print(f"    ✅ Processed: {len(data)} variables")
                else:
                    print(f"    ❌ No data extracted")
            else:
                print(f"    ❌ Download failed")
    
    print(f"\n📊 DOWNLOAD SUMMARY:")
    print(f"  Files downloaded: {total_downloaded}")
    print(f"  Files processed: {total_processed}")
    print(f"  Data records: {len(all_data)}")
    
    if all_data:
        print(f"\n🔄 Creating CANADA_FULL_Pollutant.csv...")
        
        # Combine all data
        combined_data = []
        for data in all_data:
            # Find the maximum length
            max_len = max(len(v) if isinstance(v, (list, np.ndarray)) else 1 for v in data.values())
            
            # Pad arrays to same length
            padded_data = {}
            for key, value in data.items():
                if isinstance(value, (list, np.ndarray)) and len(value) < max_len:
                    padded_data[key] = np.pad(value, (0, max_len - len(value)), mode='constant', constant_values=np.nan)
                else:
                    padded_data[key] = value
            
            # Convert to DataFrame
            df = pd.DataFrame(padded_data)
            combined_data.append(df)
        
        # Combine all DataFrames
        if combined_data:
            final_df = pd.concat(combined_data, ignore_index=True)
            
            # Save to CSV
            output_file = "CANADA_FULL_Pollutant.csv"
            final_df.to_csv(output_file, index=False)
            
            print(f"✅ SUCCESS! Created {output_file}")
            print(f"  Rows: {len(final_df)}")
            print(f"  Columns: {list(final_df.columns)}")
            print(f"  File size: {os.path.getsize(output_file)} bytes")
            
            # Show sample data
            print(f"\n📋 Sample data:")
            print(final_df.head())
            
        else:
            print(f"❌ No data to combine")
    else:
        print(f"❌ No data downloaded or processed")

if __name__ == "__main__":
    main()
