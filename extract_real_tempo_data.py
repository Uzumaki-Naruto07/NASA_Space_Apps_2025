#!/usr/bin/env python3
"""
Extract Real TEMPO Data
=======================

Extract real TEMPO L2 data using the correct structure we discovered.
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

def extract_urls_from_sh(file_path):
    """Extract URLs from bash script files"""
    with open(file_path, 'r') as f:
        content = f.read()
        urls = re.findall(r'https://[^\s]+\.nc(?:4)?', content)
    return list(set(urls))  # Remove duplicates

def download_tempo_file(url, output_path, max_size_mb=200):
    """Download a single TEMPO file"""
    try:
        response = requests.get(url, stream=True, timeout=300)
        
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
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

def extract_tempo_data_correct(nc_file_path):
    """Extract TEMPO data using the correct structure"""
    try:
        # Open with correct groups
        product_ds = xr.open_dataset(nc_file_path, engine='h5netcdf', group='product')
        geolocation_ds = xr.open_dataset(nc_file_path, engine='h5netcdf', group='geolocation')
        support_ds = xr.open_dataset(nc_file_path, engine='h5netcdf', group='support_data')
        
        # Extract main measurements
        data_dict = {}
        
        # Product data (main measurements)
        if 'vertical_column_troposphere' in product_ds.variables:
            data_dict['no2_tropospheric_column'] = product_ds['vertical_column_troposphere'].values.flatten()
        if 'vertical_column_stratosphere' in product_ds.variables:
            data_dict['no2_stratospheric_column'] = product_ds['vertical_column_stratosphere'].values.flatten()
        if 'main_data_quality_flag' in product_ds.variables:
            data_dict['quality_flag'] = product_ds['main_data_quality_flag'].values.flatten()
        
        # Geolocation data
        if 'latitude' in geolocation_ds.variables:
            data_dict['latitude'] = geolocation_ds['latitude'].values.flatten()
        if 'longitude' in geolocation_ds.variables:
            data_dict['longitude'] = geolocation_ds['longitude'].values.flatten()
        if 'time' in geolocation_ds.variables:
            data_dict['time'] = geolocation_ds['time'].values.flatten()
        if 'solar_zenith_angle' in geolocation_ds.variables:
            data_dict['solar_zenith_angle'] = geolocation_ds['solar_zenith_angle'].values.flatten()
        
        # Support data
        if 'vertical_column_total' in support_ds.variables:
            data_dict['no2_total_column'] = support_ds['vertical_column_total'].values.flatten()
        if 'eff_cloud_fraction' in support_ds.variables:
            data_dict['cloud_fraction'] = support_ds['eff_cloud_fraction'].values.flatten()
        if 'surface_pressure' in support_ds.variables:
            data_dict['surface_pressure'] = support_ds['surface_pressure'].values.flatten()
        
        # Add filename
        data_dict['filename'] = nc_file_path.name
        
        # Close datasets
        product_ds.close()
        geolocation_ds.close()
        support_ds.close()
        
        print(f"    ✅ Extracted {len(data_dict)} variables")
        return data_dict
        
    except Exception as e:
        print(f"    ❌ Error extracting data: {e}")
        return None

def main():
    print("🌍 Real TEMPO Data Extractor")
    print("=" * 50)
    print("Extracting real TEMPO L2 data using correct structure...")
    print()
    
    # Create output directories
    raw_dir = Path("canada_tempo_raw_complete")
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
        
        # Download first 5 files for testing
        test_urls = urls[:5]
        print(f"  Downloading first {len(test_urls)} files...")
        
        for i, url in enumerate(test_urls):
            filename = url.split('/')[-1]
            output_path = raw_dir / filename
            
            print(f"  [{i+1}/{len(test_urls)}] {filename}")
            
            if download_tempo_file(url, output_path):
                total_downloaded += 1
                
                # Extract data using correct structure
                data = extract_tempo_data_correct(output_path)
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
            
            # Show data types
            print(f"\n📊 Data types:")
            print(final_df.dtypes)
            
        else:
            print(f"❌ No data to combine")
    else:
        print(f"❌ No data downloaded or processed")

if __name__ == "__main__":
    main()
