#!/usr/bin/env python3
"""
Working Air Quality Data Collector
Based on actual OpenAQ data availability
"""

import requests
import json
import pandas as pd
import os
import time
from datetime import datetime

# API Keys
OPENAQ_API_KEY = "195913c126a1647b9b7e26dc9bd5aa67f6d0061bca569695c80e1fbb65ea4eef"
AIRNOW_API_KEY = "92CBA9E3-4ADE-4E72-BE33-78A069C1A9C"

def get_available_locations():
    """Get all available monitoring locations from OpenAQ"""
    print("🔍 Fetching available monitoring locations...")
    
    headers = {"X-API-Key": OPENAQ_API_KEY}
    
    # Get all locations
    response = requests.get(
        "https://api.openaq.org/v3/locations",
        headers=headers,
        params={"limit": 200, "monitor": "true"},
        timeout=15
    )
    
    if response.status_code == 200:
        data = response.json()
        locations = data['results']
        print(f"✅ Found {len(locations)} monitoring locations")
        return locations
    else:
        print(f"❌ Error: {response.status_code}")
        return []

def filter_locations_by_region(locations, target_regions):
    """Filter locations by geographic regions"""
    filtered_locations = []
    
    for loc in locations:
        lat = loc.get('coordinates', {}).get('latitude')
        lon = loc.get('coordinates', {}).get('longitude')
        country = loc.get('country', {}).get('code', '')
        
        if lat is None or lon is None:
            continue
            
        # Check if location is in any target region
        for region_name, region_bounds in target_regions.items():
            if (region_bounds['lat_min'] <= lat <= region_bounds['lat_max'] and
                region_bounds['lon_min'] <= lon <= region_bounds['lon_max']):
                loc['region'] = region_name
                filtered_locations.append(loc)
                break
    
    return filtered_locations

def get_recent_data_for_location(location_id, headers):
    """Get recent data for a specific location"""
    try:
        response = requests.get(
            f"https://api.openaq.org/v3/locations/{location_id}/latest",
            headers=headers, timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and len(data['results']) > 0:
                return data['results']
    except:
        pass
    return []

def collect_air_quality_data():
    """Main function to collect air quality data"""
    print("🌍 GROUND-BASED AIR QUALITY DATA COLLECTION")
    print("="*60)
    print()
    
    # Define target regions (your requested areas)
    target_regions = {
        "East_Coast_US": {
            "lat_min": 35, "lat_max": 45,
            "lon_min": -85, "lon_max": -65,
            "description": "East Coast US (NYC, Boston, DC, Philadelphia)"
        },
        "Canada": {
            "lat_min": 45, "lat_max": 55,
            "lon_min": -105, "lon_max": -60,
            "description": "Canada (Toronto, Montreal, Hamilton)"
        },
        "Mexico": {
            "lat_min": 18, "lat_max": 22,
            "lon_min": -103, "lon_max": -95,
            "description": "Mexico (Mexico City, Ecatepec, Toluca)"
        }
    }
    
    # Get all available locations
    all_locations = get_available_locations()
    if not all_locations:
        print("❌ No locations found")
        return
    
    # Filter by regions
    print("\n📍 Filtering locations by target regions...")
    filtered_locations = filter_locations_by_region(all_locations, target_regions)
    
    print(f"✅ Found {len(filtered_locations)} locations in target regions")
    
    # Group by region
    regions_data = {}
    for loc in filtered_locations:
        region = loc.get('region', 'Unknown')
        if region not in regions_data:
            regions_data[region] = []
        regions_data[region].append(loc)
    
    print("\n📊 LOCATIONS BY REGION:")
    for region, locs in regions_data.items():
        print(f"  {region}: {len(locs)} locations")
        for loc in locs[:3]:  # Show first 3
            print(f"    - {loc.get('name', 'Unknown')} ({loc.get('country', {}).get('code', 'N/A')})")
        if len(locs) > 3:
            print(f"    ... and {len(locs) - 3} more")
        print()
    
    # Collect data from locations with recent data
    print("🕒 COLLECTING RECENT DATA:")
    print("="*40)
    
    headers = {"X-API-Key": OPENAQ_API_KEY}
    all_measurements = []
    
    for region, locations in regions_data.items():
        print(f"\n📍 Processing {region} ({len(locations)} locations)...")
        
        region_measurements = []
        for i, loc in enumerate(locations):
            print(f"  {i+1}/{len(locations)}: {loc.get('name', 'Unknown')}...", end=" ")
            
            measurements = get_recent_data_for_location(loc['id'], headers)
            if measurements:
                print(f"✅ {len(measurements)} measurements")
                
                # Add metadata to each measurement
                for meas in measurements:
                    meas['region'] = region
                    meas['location_name'] = loc.get('name', 'Unknown')
                    meas['location_id'] = loc['id']
                    meas['country'] = loc.get('country', {}).get('code', 'N/A')
                    meas['coordinates'] = loc.get('coordinates', {})
                    region_measurements.append(meas)
            else:
                print("⚠️  No recent data")
            
            time.sleep(0.3)  # Rate limiting
        
        if region_measurements:
            print(f"  📊 Total for {region}: {len(region_measurements)} measurements")
            all_measurements.extend(region_measurements)
        else:
            print(f"  ⚠️  No data found for {region}")
    
    # Process and save data
    if all_measurements:
        print(f"\n✅ SUCCESS! Collected {len(all_measurements)} total measurements")
        
        # Convert to DataFrame
        df = pd.DataFrame(all_measurements)
        
        # Create output directory
        os.makedirs("data/ground", exist_ok=True)
        
        # Save combined file
        output_path = "data/ground/ground_combined.csv"
        df.to_csv(output_path, index=False)
        print(f"💾 Saved: {output_path}")
        
        # Save by region
        for region in df['region'].unique():
            region_df = df[df['region'] == region]
            region_path = f"data/ground/{region}_data.csv"
            region_df.to_csv(region_path, index=False)
            print(f"💾 Saved: {region_path}")
        
        # Summary statistics
        print(f"\n📊 SUMMARY:")
        print(f"  Total measurements: {len(df):,}")
        print(f"  Regions: {', '.join(df['region'].unique())}")
        print(f"  Countries: {', '.join(df['country'].unique())}")
        print(f"  Locations: {df['location_name'].nunique()}")
        
        # Show sample data
        print(f"\n📋 SAMPLE DATA:")
        print(df[['region', 'location_name', 'country', 'value', 'datetime']].head(10).to_string())
        
    else:
        print("\n❌ No recent data found in target regions")
        print("\n💡 SUGGESTIONS:")
        print("  1. Try different date ranges (historical data)")
        print("  2. Expand geographic regions")
        print("  3. Check regions with good coverage:")
        
        # Show regions with good coverage
        country_counts = {}
        for loc in all_locations:
            country = loc.get('country', {}).get('code', 'Unknown')
            country_counts[country] = country_counts.get(country, 0) + 1
        
        print("  Available regions with good coverage:")
        for country, count in sorted(country_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"    - {country}: {count} locations")

def main():
    """Main execution function"""
    try:
        collect_air_quality_data()
    except KeyboardInterrupt:
        print("\n\n⏹️  Collection interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
