#!/usr/bin/env python3
"""
Diagnose TEMPO Files
====================

This script inspects downloaded TEMPO files to understand their structure
and find the correct variable names for extraction.
"""

import os
import xarray as xr
import h5py
from pathlib import Path
import subprocess

def check_file_type(file_path):
    """Check if file is actually NetCDF or HTML login page"""
    print(f"\n📁 File: {file_path.name}")
    print(f"📊 Size: {file_path.stat().st_size} bytes")
    
    # Check file type
    try:
        result = subprocess.run(['file', str(file_path)], capture_output=True, text=True)
        file_type = result.stdout.strip()
        print(f"🔍 File type: {file_type}")
        
        if "NetCDF" in file_type:
            print("✅ This is a real NetCDF file")
            return True
        elif "ASCII text" in file_type:
            print("❌ This is HTML login page, not NetCDF data")
            return False
        else:
            print(f"⚠️  Unknown file type: {file_type}")
            return False
    except:
        print("❌ Could not determine file type")
        return False

def inspect_netcdf_structure(file_path):
    """Inspect NetCDF file structure"""
    print(f"\n🔍 Inspecting NetCDF structure...")
    
    try:
        # Try standard xarray
        print("📋 Standard xarray open:")
        ds = xr.open_dataset(file_path)
        print(f"  Variables: {list(ds.variables.keys())}")
        print(f"  Data variables: {list(ds.data_vars.keys())}")
        print(f"  Coordinates: {list(ds.coords.keys())}")
        print(f"  Dimensions: {dict(ds.dims)}")
        ds.close()
        
    except Exception as e:
        print(f"❌ Standard xarray failed: {e}")
    
    try:
        # Try with h5netcdf engine
        print("\n📋 With h5netcdf engine:")
        ds = xr.open_dataset(file_path, engine='h5netcdf')
        print(f"  Variables: {list(ds.variables.keys())}")
        print(f"  Data variables: {list(ds.data_vars.keys())}")
        print(f"  Coordinates: {list(ds.coords.keys())}")
        print(f"  Dimensions: {dict(ds.dims)}")
        ds.close()
        
    except Exception as e:
        print(f"❌ h5netcdf engine failed: {e}")
    
    try:
        # Try with h5py to check groups
        print("\n📋 With h5py (checking groups):")
        with h5py.File(file_path, 'r') as f:
            print(f"  Top-level keys: {list(f.keys())}")
            
            # Check each group
            for key in f.keys():
                if isinstance(f[key], h5py.Group):
                    print(f"  Group '{key}' variables: {list(f[key].keys())}")
                    
                    # Look for measurement variables in this group
                    for var_key in f[key].keys():
                        if any(keyword in var_key.lower() for keyword in [
                            'nitrogen', 'ozone', 'formaldehyde', 'aerosol', 'cloud', 'no2', 'o3', 'hcho'
                        ]):
                            print(f"    🎯 Found measurement variable: {var_key}")
                            
    except Exception as e:
        print(f"❌ h5py inspection failed: {e}")

def inspect_with_ncdump(file_path):
    """Use ncdump to inspect file header"""
    print(f"\n📋 ncdump header (first 40 lines):")
    try:
        result = subprocess.run(['ncdump', '-h', str(file_path)], 
                              capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            lines = result.stdout.split('\n')[:40]
            for line in lines:
                print(f"  {line}")
        else:
            print(f"❌ ncdump failed: {result.stderr}")
    except Exception as e:
        print(f"❌ ncdump error: {e}")

def main():
    print("🔍 TEMPO Files Diagnostic Tool")
    print("=" * 50)
    print("Inspecting downloaded TEMPO files to find correct variable names...")
    print()
    
    # Check raw directory
    raw_dir = Path("canada_tempo_raw")
    if not raw_dir.exists():
        print("❌ Raw directory not found. Run the download script first.")
        return
    
    # Find downloaded files
    nc_files = list(raw_dir.glob("*.nc")) + list(raw_dir.glob("*.nc4"))
    
    if not nc_files:
        print("❌ No NetCDF files found in raw directory")
        return
    
    print(f"📁 Found {len(nc_files)} files to inspect")
    
    # Inspect first few files
    for i, file_path in enumerate(nc_files[:3]):  # Inspect first 3 files
        print(f"\n{'='*60}")
        print(f"FILE {i+1}/{min(3, len(nc_files))}")
        
        # Check file type
        is_netcdf = check_file_type(file_path)
        
        if is_netcdf:
            # Inspect structure
            inspect_netcdf_structure(file_path)
            
            # Try ncdump
            inspect_with_ncdump(file_path)
        else:
            print("❌ Skipping inspection - not a valid NetCDF file")
    
    print(f"\n📊 SUMMARY:")
    print(f"  Files inspected: {min(3, len(nc_files))}")
    print(f"  Next steps:")
    print(f"  1. Look for measurement variables in the output above")
    print(f"  2. Update the extraction script with correct variable names")
    print(f"  3. Use the correct NetCDF engine (h5netcdf vs standard)")

if __name__ == "__main__":
    main()
