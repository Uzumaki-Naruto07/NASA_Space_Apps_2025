#!/usr/bin/env python3
"""
Download Single Complete TEMPO File
===================================

Download one complete TEMPO file and inspect it properly to find the correct structure.
"""

import os
import re
import requests
import xarray as xr
import h5py
from pathlib import Path
import time

def extract_urls_from_sh(file_path):
    """Extract URLs from bash script files"""
    with open(file_path, 'r') as f:
        content = f.read()
        urls = re.findall(r'https://[^\s]+\.nc(?:4)?', content)
    return list(set(urls))  # Remove duplicates

def download_complete_file(url, output_path):
    """Download a complete file without interruption"""
    print(f"📥 Downloading: {output_path.name}")
    print(f"   URL: {url}")
    
    try:
        response = requests.get(url, stream=True, timeout=300)  # 5 minute timeout
        
        if response.status_code == 200:
            total_size = 0
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        total_size += len(chunk)
                        
                        # Show progress every 10MB
                        if total_size % (10 * 1024 * 1024) == 0:
                            print(f"   Downloaded: {total_size / (1024*1024):.1f} MB")
            
            print(f"✅ Download complete: {total_size} bytes")
            return True
        else:
            print(f"❌ Download failed: HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Download error: {e}")
        return False

def inspect_complete_file(file_path):
    """Inspect a complete TEMPO file"""
    print(f"\n🔍 Inspecting complete file: {file_path.name}")
    print(f"📊 File size: {file_path.stat().st_size} bytes")
    
    # Check if it's a valid HDF5 file
    try:
        with h5py.File(file_path, 'r') as f:
            print(f"✅ Valid HDF5 file")
            print(f"📋 Top-level keys: {list(f.keys())}")
            
            # Explore structure
            for group_name in f.keys():
                group = f[group_name]
                print(f"\n📁 Group '{group_name}':")
                
                if isinstance(group, h5py.Group):
                    variables = list(group.keys())
                    print(f"  Variables ({len(variables)}): {variables[:10]}...")  # Show first 10
                    
                    # Look for measurement variables
                    measurement_vars = []
                    for var_name in variables:
                        if any(keyword in var_name.lower() for keyword in [
                            'nitrogen', 'ozone', 'formaldehyde', 'aerosol', 'cloud', 
                            'no2', 'o3', 'hcho', 'tropospheric', 'column'
                        ]):
                            measurement_vars.append(var_name)
                    
                    if measurement_vars:
                        print(f"  🎯 MEASUREMENT VARIABLES ({len(measurement_vars)}):")
                        for var in measurement_vars:
                            print(f"    - {var}")
                    else:
                        print(f"  ❌ No measurement variables found")
                        
                    # Show sample data for first few variables
                    for var_name in variables[:3]:
                        try:
                            var_data = group[var_name]
                            if hasattr(var_data, 'shape'):
                                print(f"  {var_name}: shape={var_data.shape}, dtype={var_data.dtype}")
                        except:
                            pass
                            
    except Exception as e:
        print(f"❌ HDF5 inspection failed: {e}")
        return False
    
    # Try xarray with different groups
    print(f"\n🔍 Trying xarray with different groups...")
    
    possible_groups = [None, "PRODUCT", "Data_Fields", "Geolocation_Fields", "Support_Data"]
    
    for group in possible_groups:
        try:
            if group is None:
                print(f"📋 Standard xarray (no group):")
                ds = xr.open_dataset(file_path, engine='h5netcdf')
            else:
                print(f"📋 xarray with group '{group}':")
                ds = xr.open_dataset(file_path, engine='h5netcdf', group=group)
            
            print(f"  Variables: {list(ds.variables.keys())}")
            print(f"  Data variables: {list(ds.data_vars.keys())}")
            print(f"  Coordinates: {list(ds.coords.keys())}")
            print(f"  Dimensions: {dict(ds.dims)}")
            
            # Look for measurement variables
            measurement_vars = []
            for var in ds.variables.keys():
                if any(keyword in var.lower() for keyword in [
                    'nitrogen', 'ozone', 'formaldehyde', 'aerosol', 'cloud', 
                    'no2', 'o3', 'hcho', 'tropospheric', 'column'
                ]):
                    measurement_vars.append(var)
            
            if measurement_vars:
                print(f"  🎯 MEASUREMENT VARIABLES: {measurement_vars}")
                print(f"  ✅ SUCCESS! Use group='{group}' and variables: {measurement_vars}")
                return True, measurement_vars, group
            else:
                print(f"  ❌ No measurement variables found")
            
            ds.close()
            
        except Exception as e:
            print(f"  ❌ Failed with group '{group}': {e}")
    
    return False, [], None

def main():
    print("🌍 Single Complete TEMPO File Downloader")
    print("=" * 60)
    print("Downloading one complete file to inspect structure...")
    print()
    
    # Get URLs from bash script
    script_path = "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_NO2_L2_V03.sh"
    
    if not os.path.exists(script_path):
        print(f"❌ Script not found: {script_path}")
        return
    
    print(f"📄 Reading: {script_path}")
    urls = extract_urls_from_sh(script_path)
    print(f"📊 Found {len(urls)} URLs")
    
    # Take first URL
    test_url = urls[0]
    print(f"🔗 Testing URL: {test_url}")
    
    # Create output directory
    output_dir = Path("single_tempo_test")
    output_dir.mkdir(exist_ok=True)
    
    filename = test_url.split('/')[-1]
    output_path = output_dir / filename
    
    # Download complete file
    if download_complete_file(test_url, output_path):
        print(f"\n🎉 Download successful!")
        
        # Inspect the complete file
        success, measurement_vars, correct_group = inspect_complete_file(output_path)
        
        if success:
            print(f"\n📋 EXTRACTION RECIPE:")
            print(f"  Group: {correct_group}")
            print(f"  Variables: {measurement_vars}")
            print(f"  Engine: h5netcdf")
            print(f"\n📝 Python code:")
            print(f"  ds = xr.open_dataset('{filename}', engine='h5netcdf', group='{correct_group}')")
            print(f"  variables = {measurement_vars}")
        else:
            print(f"\n❌ Could not find measurement variables")
            print(f"  File might not contain the expected data")
    else:
        print(f"\n❌ Download failed")

if __name__ == "__main__":
    main()
