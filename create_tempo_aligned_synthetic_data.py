#!/usr/bin/env python3
"""
Create TEMPO-Aligned Synthetic Ground Data
==========================================
Creates synthetic ground data that perfectly matches TEMPO time windows for validation.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def create_tempo_aligned_synthetic_data():
    """Create synthetic ground data matching TEMPO time windows exactly"""
    print("🔬 CREATING TEMPO-ALIGNED SYNTHETIC GROUND DATA")
    print("="*60)
    print("Creating realistic ground data matching TEMPO time windows")
    print()
    
    # Create output directory
    os.makedirs("data/ground", exist_ok=True)
    
    all_data = []
    
    # Define cities with their coordinates and EXACT TEMPO time windows
    cities_data = {
        "New York City": {
            "lat": 40.7128, "lon": -74.0060,
            "start_date": "2025-06-05", "end_date": "2025-06-06",
            "region": "NYC"
        },
        "Philadelphia": {
            "lat": 39.9526, "lon": -75.1652,
            "start_date": "2025-06-05", "end_date": "2025-06-06", 
            "region": "NYC"
        },
        "Boston": {
            "lat": 42.3601, "lon": -71.0589,
            "start_date": "2025-06-05", "end_date": "2025-06-06",
            "region": "NYC"
        },
        "Washington DC": {
            "lat": 38.9072, "lon": -77.0369,
            "start_date": "2025-06-05", "end_date": "2025-06-06",
            "region": "NYC"
        },
        "Montreal": {
            "lat": 45.5017, "lon": -73.5673,
            "start_date": "2025-06-05", "end_date": "2025-06-06",  # SAME as NYC TEMPO
            "region": "NYC"
        },
        "Toronto": {
            "lat": 43.6532, "lon": -79.3832,
            "start_date": "2025-06-05", "end_date": "2025-06-06",  # SAME as NYC TEMPO
            "region": "NYC"
        },
        "Hamilton": {
            "lat": 43.2557, "lon": -79.8711,
            "start_date": "2025-06-05", "end_date": "2025-06-06",  # SAME as NYC TEMPO
            "region": "NYC"
        },
        "Mexico City": {
            "lat": 19.4326, "lon": -99.1332,
            "start_date": "2025-05-10", "end_date": "2025-05-15",
            "region": "Mexico"
        }
    }
    
    # Pollutants to generate
    pollutants = {
        "OZONE": {"unit": "ppb", "typical_range": (20, 120), "diurnal_pattern": True},
        "NO2": {"unit": "ppb", "typical_range": (5, 50), "diurnal_pattern": True},
        "PM2.5": {"unit": "µg/m³", "typical_range": (5, 35), "diurnal_pattern": False}
    }
    
    for city_name, city_info in cities_data.items():
        print(f"📍 Generating data for {city_name} ({city_info['region']})")
        print(f"   📅 Time window: {city_info['start_date']} to {city_info['end_date']}")
        
        # Parse date range
        start_date = datetime.strptime(city_info['start_date'], "%Y-%m-%d")
        end_date = datetime.strptime(city_info['end_date'], "%Y-%m-%d")
        
        # Generate hourly data
        current_date = start_date
        city_data = []
        
        while current_date <= end_date:
            # Generate data for each hour of the day
            for hour in range(24):
                timestamp = current_date + timedelta(hours=hour)
                
                # Generate data for each pollutant
                for pollutant, poll_info in pollutants.items():
                    # Base value with some randomness
                    base_value = np.random.uniform(
                        poll_info['typical_range'][0],
                        poll_info['typical_range'][1]
                    )
                    
                    # Add diurnal pattern for O3 and NO2
                    if poll_info['diurnal_pattern']:
                        if pollutant == "OZONE":
                            # Ozone peaks in afternoon (2-4 PM)
                            diurnal_factor = 0.3 + 0.7 * np.sin((hour - 6) * np.pi / 12)
                        else:  # NO2
                            # NO2 peaks in morning/evening rush hours
                            diurnal_factor = 0.4 + 0.6 * np.abs(np.sin((hour - 8) * np.pi / 12))
                    else:
                        diurnal_factor = 1.0
                    
                    # Add some noise
                    noise = np.random.normal(0, 0.1)
                    final_value = max(0, base_value * diurnal_factor + noise)
                    
                    # Calculate AQI (simplified)
                    if pollutant == "PM2.5":
                        if final_value <= 12:
                            aqi = int(final_value * 4.17)
                        elif final_value <= 35.4:
                            aqi = int(51 + (final_value - 12.1) * 1.4)
                        else:
                            aqi = int(101 + (final_value - 35.5) * 0.5)
                    else:
                        aqi = int(final_value * 2)  # Simplified for O3/NO2
                    
                    city_data.append({
                        'city': city_name,
                        'Latitude': city_info['lat'],
                        'Longitude': city_info['lon'],
                        'UTC': timestamp.strftime("%Y-%m-%dT%H:%M:%S"),
                        'Parameter': pollutant,
                        'value': round(final_value, 2),
                        'AQI': aqi,
                        'Unit': poll_info['unit'],
                        'region': city_info['region'],
                        'source': 'Synthetic',
                        'data_type': 'synthetic'
                    })
            
            current_date += timedelta(days=1)
        
        print(f"   ✅ Generated {len(city_data)} measurements")
        all_data.extend(city_data)
    
    # Convert to DataFrame
    df = pd.DataFrame(all_data)
    
    # Add some realistic variations
    print("\n🔧 Adding realistic variations...")
    
    # Add some missing data (5% missing)
    missing_mask = np.random.random(len(df)) < 0.05
    df.loc[missing_mask, 'value'] = np.nan
    df.loc[missing_mask, 'AQI'] = -999
    
    # Add some outliers (2% outliers)
    outlier_mask = np.random.random(len(df)) < 0.02
    df.loc[outlier_mask, 'value'] = df.loc[outlier_mask, 'value'] * np.random.uniform(2, 4)
    df.loc[outlier_mask, 'AQI'] = df.loc[outlier_mask, 'AQI'] * np.random.uniform(2, 4)
    
    # Save data
    output_path = "data/ground/tempo_aligned_synthetic_ground_data.csv"
    df.to_csv(output_path, index=False)
    
    print(f"\n✅ SUCCESS! Generated {len(df):,} synthetic measurements")
    print(f"💾 Saved: {output_path}")
    
    # Summary statistics
    print(f"\n📊 SUMMARY:")
    print(f"  Total measurements: {len(df):,}")
    print(f"  Cities: {df['city'].nunique()}")
    print(f"  Pollutants: {', '.join(df['Parameter'].unique())}")
    print(f"  Date range: {df['UTC'].min()} to {df['UTC'].max()}")
    
    print(f"\n📊 BY CITY:")
    for city, count in df['city'].value_counts().items():
        print(f"  {city}: {count:,} measurements")
    
    print(f"\n📊 BY POLLUTANT:")
    for pollutant, count in df['Parameter'].value_counts().items():
        print(f"  {pollutant}: {count:,} measurements")
    
    print(f"\n📊 BY REGION:")
    for region, count in df['region'].value_counts().items():
        print(f"  {region}: {count:,} measurements")
    
    # Show sample data
    print(f"\n📋 SAMPLE DATA:")
    sample_cols = ['city', 'Parameter', 'value', 'AQI', 'Latitude', 'Longitude', 'UTC']
    print(df[sample_cols].head(10).to_string())
    
    print(f"\n🎉 TEMPO-aligned synthetic ground data generation complete!")
    print(f"📁 Use 'tempo_aligned_synthetic_ground_data.csv' for validation")
    
    return df

if __name__ == "__main__":
    create_tempo_aligned_synthetic_data()
