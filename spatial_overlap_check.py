#!/usr/bin/env python3
"""
Spatial Overlap Check
====================
Visualize coordinate overlap between TEMPO and ground data
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def check_spatial_overlap():
    """Check and visualize spatial overlap between datasets"""
    print("🔍 SPATIAL OVERLAP CHECK")
    print("="*50)
    
    # Load ground data
    print("🌍 Loading ground truth data...")
    ground_data = pd.read_csv('data/ground/historical_combined.csv')
    
    # Clean ground data
    numeric_cols = ['Latitude', 'Longitude', 'AQI']
    for col in numeric_cols:
        if col in ground_data.columns:
            ground_data[col] = pd.to_numeric(ground_data[col], errors='coerce')
    
    ground_data = ground_data.dropna(subset=['Latitude', 'Longitude'])
    ground_data = ground_data[(ground_data['AQI'] > 0) & (ground_data['AQI'] < 500)]
    
    print(f"✅ Ground data loaded: {len(ground_data):,} measurements")
    
    # Load TEMPO data
    print("🛰️ Loading TEMPO satellite data...")
    tempo_df = pd.read_csv('data/tempo/tempo_synthetic.csv')
    
    # Convert timestamp and apply quality filters
    tempo_df['time'] = pd.to_datetime(tempo_df['time'])
    tempo_df['time_utc'] = tempo_df['time'].dt.floor('h')
    tempo_df = tempo_df.dropna(subset=['time_utc'])
    
    # Apply quality filters
    if 'main_data_quality_flag' in tempo_df.columns:
        tempo_df = tempo_df[tempo_df['main_data_quality_flag'] == 0]
    if 'cloud_fraction' in tempo_df.columns:
        tempo_df = tempo_df[tempo_df['cloud_fraction'] < 0.2]
    if 'solar_zenith_angle' in tempo_df.columns:
        tempo_df = tempo_df[tempo_df['solar_zenith_angle'] < 75]
    
    print(f"✅ TEMPO data loaded: {len(tempo_df):,} pixels")
    
    # Print coordinate ranges
    print(f"\n📍 COORDINATE RANGES:")
    print(f"Ground data:")
    print(f"  Latitude:  {ground_data['Latitude'].min():.3f} to {ground_data['Latitude'].max():.3f}")
    print(f"  Longitude: {ground_data['Longitude'].min():.3f} to {ground_data['Longitude'].max():.3f}")
    
    print(f"TEMPO data:")
    print(f"  Latitude:  {tempo_df['latitude'].min():.3f} to {tempo_df['latitude'].max():.3f}")
    print(f"  Longitude: {tempo_df['longitude'].min():.3f} to {tempo_df['longitude'].max():.3f}")
    
    # Check by region
    print(f"\n🌍 TEMPO DATA BY REGION:")
    for region in tempo_df['region'].unique():
        region_data = tempo_df[tempo_df['region'] == region]
        print(f"  {region}:")
        print(f"    Latitude:  {region_data['latitude'].min():.3f} to {region_data['latitude'].max():.3f}")
        print(f"    Longitude: {region_data['longitude'].min():.3f} to {region_data['longitude'].max():.3f}")
        print(f"    Pixels: {len(region_data)}")
    
    # Create spatial overlap visualization
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(20, 8))
    
    # Plot 1: All data
    ax1.scatter(tempo_df['longitude'], tempo_df['latitude'], 
               s=1, c='blue', alpha=0.6, label='TEMPO pixels')
    ax1.scatter(ground_data['Longitude'], ground_data['Latitude'], 
               s=20, c='red', alpha=0.8, label='Ground stations')
    ax1.set_xlabel('Longitude')
    ax1.set_ylabel('Latitude')
    ax1.set_title('Spatial Overlap Check - All Data')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Plot 2: By region
    colors = ['blue', 'green', 'orange']
    for i, region in enumerate(tempo_df['region'].unique()):
        region_data = tempo_df[tempo_df['region'] == region]
        ax2.scatter(region_data['longitude'], region_data['latitude'], 
                   s=1, c=colors[i], alpha=0.6, label=f'TEMPO {region}')
    
    ax2.scatter(ground_data['Longitude'], ground_data['Latitude'], 
               s=20, c='red', alpha=0.8, label='Ground stations')
    ax2.set_xlabel('Longitude')
    ax2.set_ylabel('Latitude')
    ax2.set_title('Spatial Overlap Check - By Region')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('artifacts/validation/spatial_overlap_check.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    # Check for actual geographic regions
    print(f"\n🗺️ GEOGRAPHIC REGION ANALYSIS:")
    
    # NYC region should be around 40°N, -74°E
    nyc_ground = ground_data[ground_data['city'].isin(['New York City', 'Philadelphia', 'Boston', 'Washington DC'])]
    if len(nyc_ground) > 0:
        print(f"  NYC Ground stations:")
        print(f"    Latitude:  {nyc_ground['Latitude'].min():.3f} to {nyc_ground['Latitude'].max():.3f}")
        print(f"    Longitude: {nyc_ground['Longitude'].min():.3f} to {nyc_ground['Longitude'].max():.3f}")
    
    # Canada region should be around 43-46°N, -80 to -70°E
    canada_ground = ground_data[ground_data['city'].isin(['Montreal', 'Toronto', 'Hamilton'])]
    if len(canada_ground) > 0:
        print(f"  Canada Ground stations:")
        print(f"    Latitude:  {canada_ground['Latitude'].min():.3f} to {canada_ground['Latitude'].max():.3f}")
        print(f"    Longitude: {canada_ground['Longitude'].min():.3f} to {canada_ground['Longitude'].max():.3f}")
    
    # Mexico region should be around 19°N, -99°E
    mexico_ground = ground_data[ground_data['city'].isin(['Mexico City', 'Ecatepec', 'Toluca'])]
    if len(mexico_ground) > 0:
        print(f"  Mexico Ground stations:")
        print(f"    Latitude:  {mexico_ground['Latitude'].min():.3f} to {mexico_ground['Latitude'].max():.3f}")
        print(f"    Longitude: {mexico_ground['Longitude'].min():.3f} to {mexico_ground['Longitude'].max():.3f}")
    
    return ground_data, tempo_df

if __name__ == "__main__":
    ground_data, tempo_df = check_spatial_overlap()
