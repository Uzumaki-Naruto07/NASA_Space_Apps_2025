#!/usr/bin/env python3
"""
Download Full TEMPO L2 File
===========================

Download a complete TEMPO L2 file to test if we get real measurements.
"""

import requests
import xarray as xr
from pathlib import Path
import time

def download_full_tempo_file():
    """Download a complete TEMPO L2 file"""
    
    print("🌍 Downloading Full TEMPO L2 File")
    print("=" * 50)
    print("Testing complete download of real TEMPO L2 data...")
    print()
    
    # Test URL for NO2 L2 data
    test_url = "https://data.asdc.earthdata.nasa.gov/asdc-prod-protected/TEMPO/TEMPO_NO2_L2_V03/2025.05.24/TEMPO_NO2_L2_V03_20250524T164226Z_S008G05.nc"
    
    print(f"🔗 Downloading: {test_url}")
    
    try:
        # Download with .netrc authentication
        response = requests.get(test_url, stream=True, timeout=60)
        
        print(f"📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"✅ SUCCESS! Authentication is working!")
            
            # Create output directory
            output_dir = Path("full_tempo_l2")
            output_dir.mkdir(exist_ok=True)
            
            test_file = output_dir / "TEMPO_NO2_L2_V03_20250524T164226Z_S008G05.nc"
            
            print(f"📥 Downloading complete file...")
            print(f"   This may take a few minutes...")
            
            with open(test_file, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            print(f"✅ Downloaded complete file: {test_file}")
            print(f"📁 File size: {test_file.stat().st_size} bytes")
            
            # Try to read the file
            print(f"🔍 Checking file contents...")
            try:
                ds = xr.open_dataset(test_file)
                variables = list(ds.variables.keys())
                print(f"📋 Variables found: {variables}")
                
                # Look for measurement variables
                measurement_vars = [var for var in variables if any(keyword in var.lower() 
                              for keyword in ['nitrogen', 'ozone', 'formaldehyde', 'aerosol', 'cloud'])]
                
                if measurement_vars:
                    print(f"🎉 SUCCESS: Found {len(measurement_vars)} measurement variables!")
                    print(f"   Measurement variables: {measurement_vars}")
                    
                    # Show sample data for first variable
                    if measurement_vars:
                        first_var = measurement_vars[0]
                        data = ds[first_var]
                        print(f"   Sample data from {first_var}:")
                        print(f"     Shape: {data.shape}")
                        print(f"     Range: {data.min().values:.3f} to {data.max().values:.3f}")
                        print(f"     Sample values: {data.values.flatten()[:5]}")
                    
                    print(f"   This is REAL L2 data with actual measurements!")
                    return True
                else:
                    print(f"⚠️  No measurement variables found")
                    print(f"   This might still be L3 data (spatial weights only)")
                    return False
                    
            except Exception as e:
                print(f"❌ Error reading file: {e}")
                return False
                
        elif response.status_code == 401:
            print(f"❌ UNAUTHORIZED: You still need to authorize the application")
            print(f"🔗 Go to: https://urs.earthdata.nasa.gov/profile")
            return False
        else:
            print(f"⚠️  Unexpected status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    success = download_full_tempo_file()
    
    print(f"\n📊 SUMMARY:")
    if success:
        print(f"🎉 SUCCESS! You can now download real TEMPO L2 data!")
        print(f"Next steps:")
        print(f"1. Download multiple L2 files for Canada")
        print(f"2. Use them in your validation system")
        print(f"3. Replace synthetic data with real measurements")
    else:
        print(f"❌ Still having issues with the download")
        print(f"Let's try a different approach")

if __name__ == "__main__":
    main()
