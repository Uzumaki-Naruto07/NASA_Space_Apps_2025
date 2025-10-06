#!/usr/bin/env python3
"""
Extract Weather Data for All Regions
===================================

Extract IMERG (precipitation) and MERRA2 (atmospheric) data for all regions:
- Canada (Wildfire Source Region)
- Mexico City (Ozone Season Pilot)  
- NYC & East Coast (Wildfire Smoke Event)

Creates: CANADA_Weather.csv, MEXICO_Weather.csv, NYC_Weather.csv
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
        urls = re.findall(r'https://[^\s]+\.(?:HDF5|nc4|nc)', content)
    return list(set(urls))  # Remove duplicates

def download_weather_file(url, output_path, max_size_mb=500):
    """Download a single weather file"""
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

def extract_imerg_data(hdf5_file_path):
    """Extract IMERG precipitation data from HDF5 file"""
    try:
        # Open HDF5 file
        ds = xr.open_dataset(hdf5_file_path, engine='h5netcdf')
        
        data_dict = {}
        
        # Extract precipitation data
        if 'precipitationCal' in ds.variables:
            data_dict['precipitation'] = ds['precipitationCal'].values.flatten()
        if 'precipitationUncal' in ds.variables:
            data_dict['precipitation_uncalibrated'] = ds['precipitationUncal'].values.flatten()
        if 'precipitationQuality' in ds.variables:
            data_dict['precipitation_quality'] = ds['precipitationQuality'].values.flatten()
        
        # Extract coordinates
        if 'lon' in ds.variables:
            data_dict['longitude'] = ds['lon'].values.flatten()
        if 'lat' in ds.variables:
            data_dict['latitude'] = ds['lat'].values.flatten()
        if 'time' in ds.variables:
            data_dict['time'] = ds['time'].values.flatten()
        
        # Add filename and data type
        data_dict['filename'] = hdf5_file_path.name
        data_dict['data_type'] = 'IMERG'
        
        ds.close()
        print(f"    ✅ Extracted {len(data_dict)} IMERG variables")
        return data_dict
        
    except Exception as e:
        print(f"    ❌ Error extracting IMERG data: {e}")
        return None

def extract_merra2_data(nc_file_path):
    """Extract MERRA2 atmospheric data from NetCDF file"""
    try:
        # Open NetCDF file
        ds = xr.open_dataset(nc_file_path)
        
        data_dict = {}
        
        # Extract atmospheric variables
        if 'T2M' in ds.variables:  # 2-meter temperature
            data_dict['temperature_2m'] = ds['T2M'].values.flatten()
        if 'U2M' in ds.variables:  # 2-meter eastward wind
            data_dict['wind_u_2m'] = ds['U2M'].values.flatten()
        if 'V2M' in ds.variables:  # 2-meter northward wind
            data_dict['wind_v_2m'] = ds['V2M'].values.flatten()
        if 'PS' in ds.variables:  # Surface pressure
            data_dict['surface_pressure'] = ds['PS'].values.flatten()
        if 'RH2M' in ds.variables:  # 2-meter relative humidity
            data_dict['relative_humidity_2m'] = ds['RH2M'].values.flatten()
        if 'TQV' in ds.variables:  # Total precipitable water vapor
            data_dict['precipitable_water'] = ds['TQV'].values.flatten()
        if 'TO3' in ds.variables:  # Total ozone
            data_dict['total_ozone'] = ds['TO3'].values.flatten()
        
        # Extract coordinates
        if 'lon' in ds.variables:
            data_dict['longitude'] = ds['lon'].values.flatten()
        if 'lat' in ds.variables:
            data_dict['latitude'] = ds['lat'].values.flatten()
        if 'time' in ds.variables:
            data_dict['time'] = ds['time'].values.flatten()
        
        # Add filename and data type
        data_dict['filename'] = nc_file_path.name
        data_dict['data_type'] = 'MERRA2'
        
        ds.close()
        print(f"    ✅ Extracted {len(data_dict)} MERRA2 variables")
        return data_dict
        
    except Exception as e:
        print(f"    ❌ Error extracting MERRA2 data: {e}")
        return None

def process_region(region_name, region_path, output_file):
    """Process weather data for a specific region"""
    print(f"\n🌍 Processing {region_name} Weather Data")
    print("=" * 60)
    
    # Create output directory
    raw_dir = Path(f"{region_name.lower()}_weather_raw")
    raw_dir.mkdir(exist_ok=True)
    
    # Weather bash scripts for this region
    weather_scripts = [
        f"{region_path}/weather/IMERG.sh",
        f"{region_path}/weather/MERRA2.sh"
    ]
    
    all_data = []
    total_downloaded = 0
    total_processed = 0
    
    for script_path in weather_scripts:
        if not os.path.exists(script_path):
            print(f"❌ Script not found: {script_path}")
            continue
            
        print(f"\n📥 Processing: {os.path.basename(script_path)}")
        
        # Extract URLs
        urls = extract_urls_from_sh(script_path)
        print(f"  Found {len(urls)} URLs")
        
        # Download first 3 files for testing
        test_urls = urls[:3]
        print(f"  Downloading first {len(test_urls)} files...")
        
        for i, url in enumerate(test_urls):
            filename = url.split('/')[-1]
            output_path = raw_dir / filename
            
            print(f"  [{i+1}/{len(test_urls)}] {filename}")
            
            if download_weather_file(url, output_path):
                total_downloaded += 1
                
                # Extract data based on file type
                if filename.endswith('.HDF5'):
                    data = extract_imerg_data(output_path)
                elif filename.endswith(('.nc', '.nc4')):
                    data = extract_merra2_data(output_path)
                else:
                    print(f"    ❌ Unknown file type: {filename}")
                    continue
                
                if data:
                    all_data.append(data)
                    total_processed += 1
                    print(f"    ✅ Processed: {len(data)} variables")
                else:
                    print(f"    ❌ No data extracted")
            else:
                print(f"    ❌ Download failed")
    
    print(f"\n📊 DOWNLOAD SUMMARY for {region_name}:")
    print(f"  Files downloaded: {total_downloaded}")
    print(f"  Files processed: {total_processed}")
    print(f"  Data records: {len(all_data)}")
    
    if all_data:
        print(f"\n🔄 Creating {output_file}...")
        
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
                elif isinstance(value, (list, np.ndarray)):
                    padded_data[key] = value
                else:
                    # Convert scalar to array
                    padded_data[key] = np.full(max_len, value)
            
            # Convert to DataFrame
            df = pd.DataFrame(padded_data)
            combined_data.append(df)
        
        # Combine all DataFrames
        if combined_data:
            final_df = pd.concat(combined_data, ignore_index=True)
            
            # Save to CSV
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
            
            # Show measurement statistics
            print(f"\n📊 Measurement statistics:")
            for col in final_df.columns:
                if col not in ['filename', 'time', 'data_type'] and final_df[col].dtype in ['float64', 'float32']:
                    non_null = final_df[col].notna().sum()
                    total = len(final_df)
                    if non_null > 0:
                        print(f"  {col}: {non_null:,}/{total:,} ({non_null/total*100:.1f}% non-null)")
            
        else:
            print(f"❌ No data to combine")
    else:
        print(f"❌ No data downloaded or processed")

def main():
    print("🌍 Weather Data Extractor for All Regions")
    print("=" * 60)
    print("Extracting IMERG (precipitation) and MERRA2 (atmospheric) data...")
    print()
    
    # Define regions
    regions = [
        {
            'name': 'Canada',
            'path': 'Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025',
            'output': 'CANADA_Weather.csv'
        },
        {
            'name': 'Mexico',
            'path': 'Tempo and weather/Mexico City (Ozone Season Pilot)May 10–15, 2025 (ozone contingency season)',
            'output': 'MEXICO_Weather.csv'
        },
        {
            'name': 'NYC',
            'path': 'Tempo and weather/NYC & East Coast (Wildfire Smoke Event) 6-7 Jun 2025',
            'output': 'NYC_Weather.csv'
        }
    ]
    
    # Process each region
    for region in regions:
        if os.path.exists(region['path']):
            process_region(region['name'], region['path'], region['output'])
        else:
            print(f"❌ Region path not found: {region['path']}")
    
    print(f"\n🎉 Weather data extraction completed!")
    print(f"Check the generated CSV files for each region.")

if __name__ == "__main__":
    main()
