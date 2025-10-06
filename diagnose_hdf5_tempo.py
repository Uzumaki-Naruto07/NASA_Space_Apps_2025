#!/usr/bin/env python3
"""
Diagnose HDF5 TEMPO Files
=========================

This script properly inspects HDF5 TEMPO files to find the correct variable names.
"""

import os
import xarray as xr
import h5py
from pathlib import Path
import subprocess

def inspect_hdf5_structure(file_path):
    """Inspect HDF5 file structure with groups"""
    print(f"\n🔍 Inspecting HDF5 structure...")
    
    try:
        # Use h5py to explore the structure
        with h5py.File(file_path, 'r') as f:
            print(f"📋 Top-level keys: {list(f.keys())}")
            
            # Explore each group
            for group_name in f.keys():
                group = f[group_name]
                print(f"\n📁 Group '{group_name}':")
                
                if isinstance(group, h5py.Group):
                    print(f"  Variables: {list(group.keys())}")
                    
                    # Look for measurement variables
                    measurement_vars = []
                    for var_name in group.keys():
                        if any(keyword in var_name.lower() for keyword in [
                            'nitrogen', 'ozone', 'formaldehyde', 'aerosol', 'cloud', 
                            'no2', 'o3', 'hcho', 'tropospheric', 'column'
                        ]):
                            measurement_vars.append(var_name)
                            print(f"    🎯 MEASUREMENT VARIABLE: {var_name}")
                    
                    if measurement_vars:
                        print(f"    ✅ Found {len(measurement_vars)} measurement variables!")
                    else:
                        print(f"    ❌ No measurement variables in this group")
                        
                    # Show dimensions for first few variables
                    for var_name in list(group.keys())[:3]:
                        try:
                            var_data = group[var_name]
                            if hasattr(var_data, 'shape'):
                                print(f"    {var_name}: shape={var_data.shape}, dtype={var_data.dtype}")
                        except:
                            pass
                            
    except Exception as e:
        print(f"❌ HDF5 inspection failed: {e}")

def try_xarray_with_groups(file_path):
    """Try xarray with different group specifications"""
    print(f"\n🔍 Trying xarray with different groups...")
    
    # Common group names for TEMPO
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
                return True, measurement_vars, group
            else:
                print(f"  ❌ No measurement variables found")
            
            ds.close()
            
        except Exception as e:
            print(f"  ❌ Failed with group '{group}': {e}")
    
    return False, [], None

def inspect_with_ncdump(file_path):
    """Use ncdump to inspect file header"""
    print(f"\n📋 ncdump header (first 50 lines):")
    try:
        result = subprocess.run(['ncdump', '-h', str(file_path)], 
                              capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            lines = result.stdout.split('\n')[:50]
            for line in lines:
                print(f"  {line}")
        else:
            print(f"❌ ncdump failed: {result.stderr}")
    except Exception as e:
        print(f"❌ ncdump error: {e}")

def main():
    print("🔍 HDF5 TEMPO Files Diagnostic Tool")
    print("=" * 60)
    print("Inspecting HDF5 TEMPO files to find correct variable names and groups...")
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
    
    # Inspect first file in detail
    file_path = nc_files[0]
    print(f"\n{'='*60}")
    print(f"INSPECTING: {file_path.name}")
    print(f"Size: {file_path.stat().st_size} bytes")
    
    # Inspect HDF5 structure
    inspect_hdf5_structure(file_path)
    
    # Try xarray with different groups
    success, measurement_vars, correct_group = try_xarray_with_groups(file_path)
    
    if success:
        print(f"\n🎉 SUCCESS! Found measurement variables:")
        print(f"  Variables: {measurement_vars}")
        print(f"  Correct group: {correct_group}")
        print(f"\n📋 Next steps:")
        print(f"  1. Use group='{correct_group}' in xarray.open_dataset()")
        print(f"  2. Look for variables: {measurement_vars}")
        print(f"  3. Update extraction script with these variable names")
    else:
        print(f"\n❌ No measurement variables found")
        print(f"  Try ncdump for more details...")
        inspect_with_ncdump(file_path)

if __name__ == "__main__":
    main()
