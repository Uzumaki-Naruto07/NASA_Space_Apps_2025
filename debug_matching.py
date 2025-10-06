#!/usr/bin/env python3
"""
Debug TEMPO-Ground Matching
===========================
Step-by-step diagnosis of why no matches are found
"""

import pandas as pd
import numpy as np
from scipy.spatial.distance import cdist

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate haversine distance between two points in km"""
    R = 6371  # Earth's radius in km
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    return R * c

def debug_matching():
    print("🔍 DEBUGGING TEMPO-GROUND MATCHING")
    print("="*50)
    
    # Load data
    print("📊 Loading data...")
    ground = pd.read_csv('data/ground/historical_combined.csv')
    tempo_nyc = pd.read_csv('NYC_FULL_Pollutant.csv')
    
    # Convert time columns
    ground['UTC'] = pd.to_datetime(ground['UTC'])
    tempo_nyc['time'] = pd.to_datetime(tempo_nyc['time'])
    
    print(f"✅ Ground data: {len(ground)} records")
    print(f"✅ TEMPO data: {len(tempo_nyc)} records")
    
    # Filter for NYC and OZONE only
    nyc_ground = ground[(ground['city'] == 'New York City') & (ground['Parameter'] == 'OZONE')]
    print(f"✅ NYC OZONE ground records: {len(nyc_ground)}")
    
    if len(nyc_ground) == 0:
        print("❌ No NYC OZONE ground data found!")
        return
    
    # Check time overlap
    print(f"\n🕒 TIME OVERLAP CHECK:")
    print(f"Ground time range: {nyc_ground['UTC'].min()} to {nyc_ground['UTC'].max()}")
    print(f"TEMPO time range: {tempo_nyc['time'].min()} to {tempo_nyc['time'].max()}")
    
    # Check geographic overlap
    print(f"\n🌍 GEOGRAPHIC OVERLAP CHECK:")
    print(f"Ground lat range: {nyc_ground['Latitude'].min():.3f} to {nyc_ground['Latitude'].max():.3f}")
    print(f"Ground lon range: {nyc_ground['Longitude'].min():.3f} to {nyc_ground['Longitude'].max():.3f}")
    print(f"TEMPO lat range: {tempo_nyc['latitude'].min():.3f} to {tempo_nyc['latitude'].max():.3f}")
    print(f"TEMPO lon range: {tempo_nyc['longitude'].min():.3f} to {tempo_nyc['longitude'].max():.3f}")
    
    # Test with first ground record
    print(f"\n🧪 TESTING WITH FIRST GROUND RECORD:")
    test_ground = nyc_ground.iloc[0]
    print(f"Test ground: {test_ground['Latitude']:.3f}, {test_ground['Longitude']:.3f}, {test_ground['UTC']}")
    
    # Calculate distances to all TEMPO pixels
    print("Calculating distances...")
    distances = haversine_distance(
        test_ground['Latitude'], test_ground['Longitude'],
        tempo_nyc['latitude'], tempo_nyc['longitude']
    )
    
    print(f"Distance range: {distances.min():.2f} to {distances.max():.2f} km")
    print(f"Min distance: {distances.min():.2f} km")
    print(f"Pixels within 50km: {(distances <= 50).sum()}")
    print(f"Pixels within 100km: {(distances <= 100).sum()}")
    print(f"Pixels within 200km: {(distances <= 200).sum()}")
    
    # Check time differences
    print(f"\n⏰ TIME DIFFERENCE CHECK:")
    time_diff = abs((tempo_nyc['time'] - test_ground['UTC']).dt.total_seconds() / 3600)
    print(f"Time difference range: {time_diff.min():.2f} to {time_diff.max():.2f} hours")
    print(f"Min time difference: {time_diff.min():.2f} hours")
    print(f"Pixels within 6h: {(time_diff <= 6).sum()}")
    print(f"Pixels within 12h: {(time_diff <= 12).sum()}")
    print(f"Pixels within 24h: {(time_diff <= 24).sum()}")
    
    # Check combined spatial-temporal
    print(f"\n🔗 COMBINED SPATIAL-TEMPORAL CHECK:")
    nearby_spatial = distances <= 50
    nearby_temporal = time_diff <= 6
    combined = nearby_spatial & nearby_temporal
    print(f"Spatial (≤50km): {nearby_spatial.sum()}")
    print(f"Temporal (≤6h): {nearby_temporal.sum()}")
    print(f"Combined: {combined.sum()}")
    
    if combined.sum() > 0:
        print("✅ FOUND MATCHES!")
        closest_idx = distances[combined].idxmin()
        closest_tempo = tempo_nyc.loc[closest_idx]
        print(f"Closest match: {closest_tempo['latitude']:.3f}, {closest_tempo['longitude']:.3f}")
        print(f"Distance: {distances[closest_idx]:.2f} km")
        print(f"Time diff: {time_diff[closest_idx]:.2f} hours")
        print(f"Quality flag: {closest_tempo['quality_flag']}")
        print(f"Cloud fraction: {closest_tempo['cloud_fraction']}")
    else:
        print("❌ NO MATCHES FOUND")
        
        # Try relaxed criteria
        print(f"\n🔄 TRYING RELAXED CRITERIA:")
        relaxed_spatial = distances <= 200
        relaxed_temporal = time_diff <= 24
        relaxed_combined = relaxed_spatial & relaxed_temporal
        print(f"Relaxed spatial (≤200km): {relaxed_spatial.sum()}")
        print(f"Relaxed temporal (≤24h): {relaxed_temporal.sum()}")
        print(f"Relaxed combined: {relaxed_combined.sum()}")
        
        if relaxed_combined.sum() > 0:
            print("✅ FOUND MATCHES WITH RELAXED CRITERIA!")
            closest_idx = distances[relaxed_combined].idxmin()
            closest_tempo = tempo_nyc.loc[closest_idx]
            print(f"Closest match: {closest_tempo['latitude']:.3f}, {closest_tempo['longitude']:.3f}")
            print(f"Distance: {distances[closest_idx]:.2f} km")
            print(f"Time diff: {time_diff[closest_idx]:.2f} hours")
        else:
            print("❌ STILL NO MATCHES - CHECK DATA ALIGNMENT")

if __name__ == "__main__":
    debug_matching()
