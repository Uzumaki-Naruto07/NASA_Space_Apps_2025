#!/usr/bin/env python3
"""
Diagnostic script to check coordinate and time overlap
between TEMPO and ground data
"""

import pandas as pd
import numpy as np

def diagnose_data_overlap():
    """Check coordinate and time overlap between datasets"""
    print("🔍 DIAGNOSING DATA OVERLAP")
    print("="*50)
    
    # Load ground data
    print("🌍 Loading ground truth data...")
    ground_data = pd.read_csv('data/ground/historical_combined.csv')
    print(f"✅ Ground data loaded: {len(ground_data):,} measurements")
    
    # Clean ground data
    numeric_cols = ['Latitude', 'Longitude', 'AQI']
    for col in numeric_cols:
        if col in ground_data.columns:
            ground_data[col] = pd.to_numeric(ground_data[col], errors='coerce')
    
    ground_data = ground_data.dropna(subset=['Latitude', 'Longitude'])
    
    # Convert timestamps
    if 'UTC' in ground_data.columns:
        ground_data['time_utc'] = pd.to_datetime(ground_data['UTC']).dt.floor('h')
    elif 'datetime' in ground_data.columns:
        ground_data['time_utc'] = pd.to_datetime(ground_data['datetime']).dt.floor('h')
    else:
        ground_data['time_utc'] = pd.date_range('2025-06-06', periods=len(ground_data), freq='h')
    
    print(f"📊 Ground data after cleaning: {len(ground_data):,} measurements")
    
    # Load TEMPO data
    print("\n🛰️ Loading TEMPO satellite data...")
    tempo_df = pd.read_csv('data/tempo/tempo_synthetic.csv')
    print(f"✅ TEMPO data loaded: {len(tempo_df):,} pixels")
    
    # Convert timestamp and apply quality filters
    tempo_df['time'] = pd.to_datetime(tempo_df['time'])
    tempo_df['time_utc'] = tempo_df['time'].dt.floor('h')
    
    # Apply quality filters
    if 'main_data_quality_flag' in tempo_df.columns:
        tempo_df = tempo_df[tempo_df['main_data_quality_flag'] == 0]
    if 'cloud_fraction' in tempo_df.columns:
        tempo_df = tempo_df[tempo_df['cloud_fraction'] < 0.2]
    if 'solar_zenith_angle' in tempo_df.columns:
        tempo_df = tempo_df[tempo_df['solar_zenith_angle'] < 75]
    
    print(f"📊 TEMPO data after quality filters: {len(tempo_df):,} pixels")
    
    # Check coordinate overlap
    print(f"\n📍 COORDINATE OVERLAP ANALYSIS:")
    print(f"Ground data coordinates:")
    print(f"  Latitude:  {ground_data['Latitude'].min():.3f} to {ground_data['Latitude'].max():.3f}")
    print(f"  Longitude: {ground_data['Longitude'].min():.3f} to {ground_data['Longitude'].max():.3f}")
    
    print(f"TEMPO data coordinates:")
    print(f"  Latitude:  {tempo_df['latitude'].min():.3f} to {tempo_df['latitude'].max():.3f}")
    print(f"  Longitude: {tempo_df['longitude'].min():.3f} to {tempo_df['longitude'].max():.3f}")
    
    # Check time overlap
    print(f"\n⏰ TIME OVERLAP ANALYSIS:")
    print(f"Ground data time range:")
    print(f"  {ground_data['time_utc'].min()} to {ground_data['time_utc'].max()}")
    
    print(f"TEMPO data time range:")
    print(f"  {tempo_df['time_utc'].min()} to {tempo_df['time_utc'].max()}")
    
    # Check for overlap
    lat_overlap = (ground_data['Latitude'].max() >= tempo_df['latitude'].min() and 
                   ground_data['Latitude'].min() <= tempo_df['latitude'].max())
    lon_overlap = (ground_data['Longitude'].max() >= tempo_df['longitude'].min() and 
                   ground_data['Longitude'].min() <= tempo_df['longitude'].max())
    time_overlap = (ground_data['time_utc'].max() >= tempo_df['time_utc'].min() and 
                    ground_data['time_utc'].min() <= tempo_df['time_utc'].max())
    
    print(f"\n🔍 OVERLAP ANALYSIS:")
    print(f"  Latitude overlap:  {'✅ YES' if lat_overlap else '❌ NO'}")
    print(f"  Longitude overlap: {'✅ YES' if lon_overlap else '❌ NO'}")
    print(f"  Time overlap:      {'✅ YES' if time_overlap else '❌ NO'}")
    
    # Check cities and parameters
    print(f"\n🏙️ GROUND DATA CITIES:")
    print(ground_data['city'].value_counts())
    
    print(f"\n📊 GROUND DATA PARAMETERS:")
    print(ground_data['ParameterName'].value_counts())
    
    print(f"\n🌍 TEMPO DATA REGIONS:")
    print(tempo_df['region'].value_counts())
    
    # Sample some data for manual inspection
    print(f"\n📋 SAMPLE GROUND DATA:")
    sample_cols = ['city', 'ParameterName', 'Latitude', 'Longitude', 'time_utc', 'AQI']
    available_cols = [col for col in sample_cols if col in ground_data.columns]
    print(ground_data[available_cols].head(10))
    
    print(f"\n📋 SAMPLE TEMPO DATA:")
    sample_cols = ['region', 'latitude', 'longitude', 'time_utc', 'no2', 'o3']
    available_cols = [col for col in sample_cols if col in tempo_df.columns]
    print(tempo_df[available_cols].head(10))
    
    return ground_data, tempo_df

if __name__ == "__main__":
    ground_data, tempo_df = diagnose_data_overlap()
