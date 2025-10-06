#!/usr/bin/env python3
"""
🛰️ TEMPO Data Extraction Script
Extract actual measurement values from TEMPO NetCDF files
"""

import pandas as pd
import numpy as np
import os
import glob
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

def extract_tempo_measurements():
    """Extract actual measurement values from TEMPO NetCDF files"""
    print("🛰️ EXTRACTING TEMPO SATELLITE DATA")
    print("="*50)
    
    # Define regions and their corresponding directories
    regions = {
        'NYC': {
            'path': 'Tempo and weather/data/NYC/L2_csv',
            'dates': ['2025-06-05', '2025-06-06', '2025-06-07'],
            'lat_range': (35, 50),
            'lon_range': (-85, -65)
        },
        'Canada': {
            'path': 'Tempo and weather/data/Canada/L2_csv', 
            'dates': ['2025-05-23', '2025-05-24', '2025-05-25', '2025-05-26', '2025-05-27', '2025-05-28'],
            'lat_range': (45, 55),
            'lon_range': (-105, -90)
        },
        'Mexico': {
            'path': 'Tempo and weather/data/Mexico/L2_csv',
            'dates': ['2025-05-20', '2025-05-21', '2025-05-22'],
            'lat_range': (18, 21),
            'lon_range': (-103, -97)
        }
    }
    
    all_tempo_data = []
    
    for region_name, config in regions.items():
        print(f"\n🌍 Processing {region_name}...")
        
        # Get all CSV files for this region
        csv_files = glob.glob(f"{config['path']}/*.csv")
        
        if not csv_files:
            print(f"   ⚠️  No CSV files found in {config['path']}")
            continue
            
        print(f"   📁 Found {len(csv_files)} CSV files")
        
        # Process each CSV file
        region_data = []
        for csv_file in csv_files[:10]:  # Limit to first 10 files for demo
            try:
                df = pd.read_csv(csv_file)
                
                # Add region and file info
                df['region'] = region_name
                df['filename'] = os.path.basename(csv_file)
                
                # Filter by geographic bounds
                lat_mask = (df['latitude'] >= config['lat_range'][0]) & (df['latitude'] <= config['lat_range'][1])
                lon_mask = (df['longitude'] >= config['lon_range'][0]) & (df['longitude'] <= config['lon_range'][1])
                df = df[lat_mask & lon_mask]
                
                if len(df) > 0:
                    region_data.append(df)
                    print(f"   ✅ {os.path.basename(csv_file)}: {len(df)} pixels")
                else:
                    print(f"   ⚠️  {os.path.basename(csv_file)}: No pixels in region")
                    
            except Exception as e:
                print(f"   ❌ Error processing {csv_file}: {e}")
        
        if region_data:
            region_df = pd.concat(region_data, ignore_index=True)
            print(f"   📊 Total pixels for {region_name}: {len(region_df)}")
            all_tempo_data.append(region_df)
        else:
            print(f"   ⚠️  No data extracted for {region_name}")
    
    if all_tempo_data:
        tempo_combined = pd.concat(all_tempo_data, ignore_index=True)
        print(f"\n✅ TOTAL TEMPO PIXELS: {len(tempo_combined)}")
        
        # Save the combined data
        os.makedirs('data/tempo', exist_ok=True)
        tempo_combined.to_csv('data/tempo/tempo_combined.csv', index=False)
        print(f"💾 Saved: data/tempo/tempo_combined.csv")
        
        # Show sample data
        print(f"\n📋 SAMPLE TEMPO DATA:")
        print(tempo_combined.head())
        
        return tempo_combined
    else:
        print("\n⚠️  No TEMPO data extracted")
        return pd.DataFrame()

def create_synthetic_tempo_data():
    """Create synthetic TEMPO data for demonstration"""
    print("\n🔧 CREATING SYNTHETIC TEMPO DATA FOR DEMONSTRATION")
    print("="*60)
    
    # Create realistic synthetic data based on the actual coordinate structure
    synthetic_data = []
    
    # NYC region (June 5-7, 2025)
    nyc_coords = [
        (40.7, -74.0), (40.8, -73.9), (40.9, -73.8), (40.6, -74.1), (40.5, -74.2),
        (40.4, -73.7), (40.3, -73.6), (40.2, -73.5), (40.1, -73.4), (40.0, -73.3)
    ]
    nyc_times = pd.date_range('2025-06-05', '2025-06-07', freq='H')
    
    for lat, lon in nyc_coords:
        for time in nyc_times:
            synthetic_data.append({
                'latitude': lat,
                'longitude': lon,
                'time': time,
                'no2': np.random.normal(15, 5),  # NO2 in ppb
                'o3': np.random.normal(45, 10),  # O3 in ppb
                'hcho': np.random.normal(2, 0.5),  # HCHO in ppb
                'region': 'NYC',
                'filename': 'synthetic_NYC.nc4'
            })
    
    # Canada region (May 23-28, 2025)
    canada_coords = [
        (43.7, -79.4), (43.8, -79.3), (43.9, -79.2), (43.6, -79.5), (43.5, -79.6),
        (44.0, -79.1), (44.1, -79.0), (44.2, -78.9), (44.3, -78.8), (44.4, -78.7)
    ]
    canada_times = pd.date_range('2025-05-23', '2025-05-28', freq='H')
    
    for lat, lon in canada_coords:
        for time in canada_times:
            synthetic_data.append({
                'latitude': lat,
                'longitude': lon,
                'time': time,
                'no2': np.random.normal(8, 3),   # Lower NO2 in Canada
                'o3': np.random.normal(35, 8),  # Lower O3 in Canada
                'hcho': np.random.normal(1.5, 0.3),  # Lower HCHO in Canada
                'region': 'Canada',
                'filename': 'synthetic_Canada.nc4'
            })
    
    # Mexico region (May 20-22, 2025)
    mexico_coords = [
        (19.4, -99.1), (19.5, -99.0), (19.6, -98.9), (19.3, -99.2), (19.2, -99.3),
        (19.7, -98.8), (19.8, -98.7), (19.9, -98.6), (20.0, -98.5), (20.1, -98.4)
    ]
    mexico_times = pd.date_range('2025-05-20', '2025-05-22', freq='H')
    
    for lat, lon in mexico_coords:
        for time in mexico_times:
            synthetic_data.append({
                'latitude': lat,
                'longitude': lon,
                'time': time,
                'no2': np.random.normal(20, 8),  # Higher NO2 in Mexico City
                'o3': np.random.normal(55, 15),  # Higher O3 in Mexico City
                'hcho': np.random.normal(3, 1),   # Higher HCHO in Mexico City
                'region': 'Mexico',
                'filename': 'synthetic_Mexico.nc4'
            })
    
    # Create DataFrame
    tempo_df = pd.DataFrame(synthetic_data)
    
    # Add quality flags and cloud fraction
    tempo_df['main_data_quality_flag'] = 0  # Good quality
    tempo_df['cloud_fraction'] = np.random.uniform(0, 0.3)  # Low cloud fraction
    tempo_df['solar_zenith_angle'] = np.random.uniform(20, 70)  # Good solar angles
    
    print(f"✅ Created {len(tempo_df)} synthetic TEMPO pixels")
    print(f"   📊 NYC: {len(tempo_df[tempo_df['region'] == 'NYC'])} pixels")
    print(f"   📊 Canada: {len(tempo_df[tempo_df['region'] == 'Canada'])} pixels") 
    print(f"   📊 Mexico: {len(tempo_df[tempo_df['region'] == 'Mexico'])} pixels")
    
    # Save synthetic data
    os.makedirs('data/tempo', exist_ok=True)
    tempo_df.to_csv('data/tempo/tempo_synthetic.csv', index=False)
    print(f"💾 Saved: data/tempo/tempo_synthetic.csv")
    
    return tempo_df

def main():
    print("🚀 TEMPO DATA EXTRACTION SYSTEM")
    print("="*50)
    
    # Try to extract real data first
    real_data = extract_tempo_measurements()
    
    if len(real_data) == 0:
        print("\n⚠️  No real TEMPO data found, creating synthetic data...")
        synthetic_data = create_synthetic_tempo_data()
        return synthetic_data
    else:
        return real_data

if __name__ == "__main__":
    tempo_data = main()
    print(f"\n🎉 TEMPO data extraction complete!")
    print(f"📊 Total pixels: {len(tempo_data)}")
    print(f"📁 Data saved to: data/tempo/")
