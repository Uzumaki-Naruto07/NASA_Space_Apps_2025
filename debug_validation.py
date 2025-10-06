#!/usr/bin/env python3
"""
Debug Validation Script
======================
Simple test to debug the validation matching issue
"""

import pandas as pd
import numpy as np

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate haversine distance between two points"""
    R = 6371  # Earth's radius in km
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    return R * c

def main():
    print("🔍 DEBUG VALIDATION SCRIPT")
    print("="*40)
    
    # Load data
    print("📊 Loading data...")
    ground = pd.read_csv('data/ground/improved_ground_data_tagged.csv')
    tempo_nyc = pd.read_csv('NYC_FULL_Pollutant.csv')
    
    print(f"Ground data: {len(ground)} records")
    print(f"NYC TEMPO: {len(tempo_nyc)} records")
    
    # Convert time columns
    ground['UTC'] = pd.to_datetime(ground['UTC'], errors='coerce', utc=True)
    tempo_nyc['time'] = pd.to_datetime(tempo_nyc['time'], errors='coerce', utc=True)
    
    # Filter for NYC region
    nyc_ground = ground[ground['region'] == 'NYC']
    print(f"NYC ground records: {len(nyc_ground)}")
    
    # Filter for Washington DC
    washington = nyc_ground[nyc_ground['city'] == 'Washington DC']
    print(f"Washington DC records: {len(washington)}")
    
    if len(washington) > 0:
        test_ground = washington.iloc[0]
        print(f"\nTest record:")
        print(f"  City: {test_ground['city']}")
        print(f"  Lat: {test_ground['Latitude']}")
        print(f"  Lon: {test_ground['Longitude']}")
        print(f"  Time: {test_ground['UTC']}")
        print(f"  Parameter: {test_ground['Parameter']}")
        print(f"  Value: {test_ground['value']}")
        
        # Test distance calculation
        print(f"\nTesting distance calculation...")
        distances = haversine_distance(
            test_ground['Latitude'], test_ground['Longitude'],
            tempo_nyc['latitude'], tempo_nyc['longitude']
        )
        
        print(f"Distance range: {distances.min():.2f} to {distances.max():.2f} km")
        print(f"Pixels within 150km: {(distances <= 150).sum()}")
        
        # Test temporal matching
        print(f"\nTesting temporal matching...")
        time_diff = abs((tempo_nyc['time'] - test_ground['UTC']).dt.total_seconds() / 3600)
        print(f"Time difference range: {time_diff.min():.2f} to {time_diff.max():.2f} hours")
        print(f"TEMPO records within 72h: {(time_diff <= 72).sum()}")
        
        # Test combined matching
        nearby_tempo = tempo_nyc[distances <= 150]
        if len(nearby_tempo) > 0:
            time_diff_nearby = abs((nearby_tempo['time'] - test_ground['UTC']).dt.total_seconds() / 3600)
            valid_tempo = nearby_tempo[time_diff_nearby <= 72]
            print(f"Combined matches: {len(valid_tempo)}")
            
            if len(valid_tempo) > 0:
                print("✅ SUCCESS! Found matches!")
                print(f"Closest match: {distances[distances <= 150].min():.2f} km, {time_diff_nearby.min():.2f} hours")
            else:
                print("❌ No combined matches")
        else:
            print("❌ No nearby pixels")

if __name__ == "__main__":
    main()
