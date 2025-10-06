#!/usr/bin/env python3
"""
Check TEMPO Data Types
======================

This script helps you understand the difference between L2 and L3 TEMPO data
and shows you what variables are available in each type.
"""

import xarray as xr
import os
from pathlib import Path

def analyze_tempo_file(file_path):
    """Analyze a TEMPO file and show what variables it contains"""
    print(f"\n📁 File: {os.path.basename(file_path)}")
    print("=" * 60)
    
    try:
        ds = xr.open_dataset(file_path)
        
        print(f"📊 File Info:")
        print(f"  Dimensions: {dict(ds.dims)}")
        print(f"  Coordinates: {list(ds.coords.keys())}")
        print(f"  Data variables: {list(ds.data_vars.keys())}")
        print(f"  All variables: {list(ds.variables.keys())}")
        
        # Check for measurement variables
        all_vars = list(ds.variables.keys())
        measurement_vars = [var for var in all_vars if any(keyword in var.lower() 
                          for keyword in ['nitrogen', 'ozone', 'formaldehyde', 'aerosol', 'cloud', 'pm'])]
        
        print(f"\n🔬 Measurement Analysis:")
        print(f"  Potential measurement variables: {measurement_vars}")
        
        if measurement_vars:
            print(f"  ✅ FOUND MEASUREMENT DATA!")
            for var in measurement_vars:
                try:
                    data = ds[var]
                    print(f"    {var}: shape={data.shape}, dtype={data.dtype}")
                    if hasattr(data, 'values') and data.size > 0:
                        print(f"      Sample values: {data.values.flatten()[:5]}")
                except Exception as e:
                    print(f"    {var}: Error reading - {e}")
        else:
            print(f"  ❌ NO MEASUREMENT DATA FOUND")
            print(f"  This appears to be L3 regridded data (spatial weights only)")
        
        # Check file type indicators
        if 'weight' in all_vars:
            print(f"\n⚠️  L3 REGRIDDED DATA DETECTED:")
            print(f"  - Contains 'weight' variable (spatial regridding weights)")
            print(f"  - This is NOT the original L2 measurements")
            print(f"  - You need L2 files for actual pollutant measurements")
        
        ds.close()
        return len(measurement_vars) > 0
        
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return False

def main():
    print("🔍 TEMPO Data Type Checker")
    print("=" * 50)
    print("This script helps you understand what type of TEMPO data you have.")
    print("L2 = Original measurements with pollutants")
    print("L3 = Regridded data with only spatial weights")
    print()
    
    # Test files to check
    test_files = [
        # Your current L3 files
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/TEMPO_NO2_L3_V03-20251003_151957/TEMPO_NO2_L3_V03_20250524T141551Z_S006_subsetted.nc4",
        "Tempo and weather/Mexico City (Ozone Season Pilot)May 10–15, 2025 (ozone contingency season)/TEMPO_NO2_L3_V03-20251004_121426/TEMPO_NO2_L3_V03_20250520T003735Z_S017_subsetted.nc4",
        "Tempo and weather/NYC & East Coast (Wildfire Smoke Event) 6-7 Jun 2025/TEMPO_NO2_L3_V03-20251001_210154/TEMPO_NO2_L3_V03_20250606T191449Z_S011_subsetted.nc4"
    ]
    
    print("🔍 Checking your current files...")
    has_measurements = False
    
    for file_path in test_files:
        if os.path.exists(file_path):
            if analyze_tempo_file(file_path):
                has_measurements = True
        else:
            print(f"\n❌ File not found: {file_path}")
    
    print(f"\n📋 SUMMARY:")
    if has_measurements:
        print("✅ You have some files with measurement data!")
    else:
        print("❌ Your current files are L3 regridded data (spatial weights only)")
        print("   You need to download L2 files for actual measurements")
        print()
        print("🚀 NEXT STEPS:")
        print("1. Run: python download_real_tempo_l2.py")
        print("2. Provide your Earthdata credentials")
        print("3. Download real L2 files with measurements")
        print("4. Use those files in your validation system")

if __name__ == "__main__":
    main()
