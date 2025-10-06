#!/usr/bin/env python3
"""
TEMPO-Aligned Ground Data Fetcher
================================
Fetches ground data that perfectly matches TEMPO satellite time windows:
- Canada: May 23-28, 2025
- NYC: June 5-6, 2025  
- Mexico: May 10-15, 2025
"""

import requests
import pandas as pd
import os
import time
from datetime import datetime, timedelta
import json

# API Keys
OPENAQ_API_KEY = "195913c126a1647b9b7e26dc9bd5aa67f6d0061bca569695c80e1fbb65ea4eef"
AIRNOW_API_KEY = "92CBA9E3-4ADE-4E72-BE33-78A069C1A9CA"

def fetch_airnow_historical_data(start_date, end_date, bbox, region_name):
    """Fetch historical AirNow data for specific date range and bounding box"""
    print(f"🇺🇸 Fetching AirNow data for {region_name}: {start_date} to {end_date}")
    
    all_data = []
    
    try:
        # AirNow historical data endpoint
        response = requests.get(
            "https://www.airnowapi.org/aq/data/",
            params={
                "startDate": f"{start_date}T00",
                "endDate": f"{end_date}T23", 
                "parameters": "PM25,OZONE,PM10,NO2,CO,SO2",
                "BBOX": bbox,
                "dataType": "A",
                "format": "application/json",
                "verbose": "1",
                "API_KEY": AIRNOW_API_KEY
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                print(f"   ✅ Found {len(data)} AirNow measurements")
                
                # Add metadata
                for obs in data:
                    obs['region'] = region_name
                    obs['source'] = 'AirNow'
                    obs['data_type'] = 'historical'
                    all_data.append(obs)
            else:
                print(f"   ⚠️ No AirNow data for {region_name}")
        else:
            print(f"   ❌ AirNow error: {response.status_code}")
            if response.status_code == 400:
                print(f"   📝 Response: {response.text}")
    
    except Exception as e:
        print(f"   ❌ AirNow exception: {e}")
    
    return all_data

def fetch_openaq_historical_data(start_date, end_date, bbox, region_name):
    """Fetch historical OpenAQ data for specific date range and bounding box"""
    print(f"🌍 Fetching OpenAQ data for {region_name}: {start_date} to {end_date}")
    
    all_data = []
    headers = {"X-API-Key": OPENAQ_API_KEY}
    
    try:
        # Parse bounding box
        bbox_parts = bbox.split(',')
        lat_min, lon_min, lat_max, lon_max = map(float, bbox_parts)
        
        # OpenAQ measurements endpoint with date range
        response = requests.get(
            "https://api.openaq.org/v3/measurements",
            headers=headers,
            params={
                "date_from": f"{start_date}T00:00:00Z",
                "date_to": f"{end_date}T23:59:59Z",
                "coordinates": f"{lat_min},{lon_min},{lat_max},{lon_max}",
                "radius": 1000,  # 1000km radius
                "limit": 10000,  # Max 10k records per request
                "order_by": "datetime"
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and len(data['results']) > 0:
                print(f"   ✅ Found {len(data['results'])} OpenAQ measurements")
                
                # Add metadata
                for meas in data['results']:
                    meas['region'] = region_name
                    meas['source'] = 'OpenAQ'
                    meas['data_type'] = 'historical'
                    all_data.append(meas)
            else:
                print(f"   ⚠️ No OpenAQ data for {region_name}")
        else:
            print(f"   ❌ OpenAQ error: {response.status_code}")
    
    except Exception as e:
        print(f"   ❌ OpenAQ exception: {e}")
    
    return all_data

def main():
    """Main function to fetch TEMPO-aligned ground data"""
    print("🚀 TEMPO-ALIGNED GROUND DATA FETCHER")
    print("="*60)
    print("Fetching ground data that matches TEMPO satellite time windows")
    print()
    
    # Create output directory
    os.makedirs("data/ground", exist_ok=True)
    
    # Define TEMPO time windows and regions
    tempo_regions = {
        "Canada": {
            "start_date": "2025-05-23",
            "end_date": "2025-05-28", 
            "bbox": "-105,45,-60,55",  # Canada region
            "description": "Canada (Toronto, Montreal, Hamilton)"
        },
        "NYC": {
            "start_date": "2025-06-05",
            "end_date": "2025-06-06",
            "bbox": "-85,35,-65,50",  # East Coast US
            "description": "NYC & East Coast (NYC, Boston, Philadelphia, DC)"
        },
        "Mexico": {
            "start_date": "2025-05-10", 
            "end_date": "2025-05-15",
            "bbox": "-103,18,-95,22",  # Mexico region
            "description": "Mexico (Mexico City, Ecatepec, Toluca)"
        }
    }
    
    all_ground_data = []
    
    # Fetch data for each TEMPO region
    for region_name, region_info in tempo_regions.items():
        print(f"\n📍 PROCESSING {region_name.upper()}")
        print("="*50)
        print(f"📅 Time window: {region_info['start_date']} to {region_info['end_date']}")
        print(f"🌍 Region: {region_info['description']}")
        print(f"📦 Bounding box: {region_info['bbox']}")
        print()
        
        region_data = []
        
        # Fetch AirNow data (US/Canada focus)
        if region_name in ["Canada", "NYC"]:
            airnow_data = fetch_airnow_historical_data(
                region_info['start_date'],
                region_info['end_date'], 
                region_info['bbox'],
                region_name
            )
            region_data.extend(airnow_data)
        
        # Fetch OpenAQ data (global coverage)
        openaq_data = fetch_openaq_historical_data(
            region_info['start_date'],
            region_info['end_date'],
            region_info['bbox'], 
            region_name
        )
        region_data.extend(openaq_data)
        
        if region_data:
            print(f"   📊 Total for {region_name}: {len(region_data)} measurements")
            all_ground_data.extend(region_data)
            
            # Save region-specific data
            region_df = pd.DataFrame(region_data)
            region_path = f"data/ground/{region_name}_tempo_aligned.csv"
            region_df.to_csv(region_path, index=False)
            print(f"   💾 Saved: {region_path}")
        else:
            print(f"   ⚠️ No data found for {region_name}")
        
        time.sleep(2)  # Rate limiting between regions
    
    # Process and save combined data
    if all_ground_data:
        print(f"\n✅ SUCCESS! Collected {len(all_ground_data)} total measurements")
        
        # Convert to DataFrame
        df = pd.DataFrame(all_ground_data)
        
        # Standardize column names for validation
        column_mapping = {
            'ParameterName': 'Parameter',
            'Latitude': 'Latitude', 
            'Longitude': 'Longitude',
            'UTC': 'UTC',
            'Value': 'value',
            'AQI': 'AQI'
        }
        
        # Rename columns if they exist
        for old_name, new_name in column_mapping.items():
            if old_name in df.columns and new_name not in df.columns:
                df[new_name] = df[old_name]
        
        # Add city mapping based on coordinates
        def assign_city(row):
            lat, lon = row.get('Latitude', 0), row.get('Longitude', 0)
            region = row.get('region', '')
            
            # NYC region cities
            if region == 'NYC':
                if 40.5 <= lat <= 41.0 and -74.5 <= lon <= -73.5:
                    return 'New York City'
                elif 42.0 <= lat <= 42.5 and -71.5 <= lon <= -70.5:
                    return 'Boston'
                elif 39.5 <= lat <= 40.5 and -75.5 <= lon <= -74.5:
                    return 'Philadelphia'
                elif 38.5 <= lat <= 39.5 and -77.5 <= lon <= -76.5:
                    return 'Washington DC'
            
            # Canada region cities  
            elif region == 'Canada':
                if 43.5 <= lat <= 45.5 and -74.0 <= lon <= -73.0:
                    return 'Montreal'
                elif 43.0 <= lat <= 44.0 and -79.5 <= lon <= -79.0:
                    return 'Toronto'
                elif 43.0 <= lat <= 44.0 and -80.0 <= lon <= -79.0:
                    return 'Hamilton'
            
            # Mexico region cities
            elif region == 'Mexico':
                if 19.0 <= lat <= 20.0 and -99.5 <= lon <= -98.5:
                    return 'Mexico City'
            
            return 'Unknown'
        
        df['city'] = df.apply(assign_city, axis=1)
        
        # Save combined file
        output_path = "data/ground/tempo_aligned_ground_data.csv"
        df.to_csv(output_path, index=False)
        print(f"💾 Saved combined data: {output_path}")
        
        # Summary statistics
        print(f"\n📊 DETAILED SUMMARY:")
        print(f"  Total measurements: {len(df):,}")
        
        if 'source' in df.columns:
            print(f"  By source:")
            for source, count in df['source'].value_counts().items():
                print(f"    {source}: {count:,}")
        
        if 'city' in df.columns:
            print(f"  By city:")
            for city, count in df['city'].value_counts().items():
                print(f"    {city}: {count:,}")
        
        if 'region' in df.columns:
            print(f"  By region:")
            for region, count in df['region'].value_counts().items():
                print(f"    {region}: {count:,}")
        
        # Show sample data
        print(f"\n📋 SAMPLE DATA:")
        sample_cols = ['region', 'city', 'source', 'Parameter', 'value', 'AQI', 'Latitude', 'Longitude', 'UTC']
        available_cols = [col for col in sample_cols if col in df.columns]
        if available_cols:
            print(df[available_cols].head(10).to_string())
        
        print(f"\n🎉 SUCCESS! TEMPO-aligned ground data collection complete!")
        print(f"📁 Files saved in: data/ground/")
        print(f"🔗 Use 'tempo_aligned_ground_data.csv' for validation")
        
    else:
        print("\n❌ No data collected")
        print("Please check:")
        print("  1. API keys are valid")
        print("  2. Internet connection") 
        print("  3. Date ranges are correct")
        print("  4. API endpoints are accessible")

if __name__ == "__main__":
    main()
