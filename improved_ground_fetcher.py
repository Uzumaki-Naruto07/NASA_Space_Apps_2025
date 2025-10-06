#!/usr/bin/env python3
"""
Improved Ground Data Fetcher
===========================
- AirNow: 1-2 day chunks to avoid query limits
- OpenAQ: Verified parameters and proper endpoints
- Fetches data for existing cities from CSV
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

def fetch_airnow_chunked_data(start_date, end_date, bbox, region_name):
    """Fetch AirNow data in 1-2 day chunks to avoid query limits"""
    print(f"🇺🇸 Fetching AirNow data for {region_name} (chunked): {start_date} to {end_date}")
    
    all_data = []
    current_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
    
    chunk_count = 0
    while current_date < end_date_obj:
        chunk_count += 1
        chunk_end = min(current_date + timedelta(days=1), end_date_obj)
        
        print(f"   📅 Chunk {chunk_count}: {current_date.strftime('%Y-%m-%d')} to {chunk_end.strftime('%Y-%m-%d')}")
        
        try:
            response = requests.get(
                "https://www.airnowapi.org/aq/data/",
                params={
                    "startDate": f"{current_date.strftime('%Y-%m-%d')}T00",
                    "endDate": f"{chunk_end.strftime('%Y-%m-%d')}T23",
                    "parameters": "PM25,OZONE,NO2",  # Focus on main pollutants
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
                    print(f"      ✅ {len(data)} measurements")
                    
                    for obs in data:
                        obs['region'] = region_name
                        obs['source'] = 'AirNow'
                        obs['data_type'] = 'historical'
                        all_data.append(obs)
                else:
                    print(f"      ⚠️ No data for this chunk")
            else:
                print(f"      ❌ Error {response.status_code}: {response.text[:100]}")
        
        except Exception as e:
            print(f"      ❌ Exception: {e}")
        
        current_date = chunk_end + timedelta(days=1)
        time.sleep(1)  # Rate limiting between chunks
    
    print(f"   📊 Total AirNow measurements: {len(all_data)}")
    return all_data

def fetch_openaq_verified_data(start_date, end_date, cities_coords, region_name):
    """Fetch OpenAQ data using verified parameters and city coordinates"""
    print(f"🌍 Fetching OpenAQ data for {region_name}: {start_date} to {end_date}")
    
    all_data = []
    headers = {"X-API-Key": OPENAQ_API_KEY}
    
    # OpenAQ verified parameters
    verified_params = ["pm25", "o3", "no2", "pm10", "co", "so2"]
    
    for city_name, coords in cities_coords.items():
        print(f"   📍 {city_name} ({coords['lat']:.3f}, {coords['lon']:.3f})")
        
        try:
            # Use OpenAQ measurements endpoint with city coordinates
            response = requests.get(
                "https://api.openaq.org/v3/measurements",
                headers=headers,
                params={
                    "date_from": f"{start_date}T00:00:00Z",
                    "date_to": f"{end_date}T23:59:59Z",
                    "coordinates": f"{coords['lat']},{coords['lon']}",
                    "radius": 50000,  # 50km radius around city
                    "limit": 1000,    # Reasonable limit per city
                    "order_by": "datetime",
                    "parameter": ",".join(verified_params)
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'results' in data and len(data['results']) > 0:
                    print(f"      ✅ {len(data['results'])} measurements")
                    
                    for meas in data['results']:
                        meas['region'] = region_name
                        meas['city'] = city_name
                        meas['source'] = 'OpenAQ'
                        meas['data_type'] = 'historical'
                        meas['Latitude'] = coords['lat']
                        meas['Longitude'] = coords['lon']
                        all_data.append(meas)
                else:
                    print(f"      ⚠️ No data for {city_name}")
            else:
                print(f"      ❌ OpenAQ error {response.status_code}")
        
        except Exception as e:
            print(f"      ❌ Exception for {city_name}: {e}")
        
        time.sleep(0.5)  # Rate limiting between cities
    
    print(f"   📊 Total OpenAQ measurements: {len(all_data)}")
    return all_data

def get_existing_cities_coords():
    """Get coordinates for existing cities from historical data"""
    print("📍 Loading existing cities from historical data...")
    
    try:
        ground = pd.read_csv('data/ground/historical_combined.csv')
        
        # Get unique cities with their coordinates
        cities_coords = {}
        for city in ground['city'].unique():
            city_data = ground[ground['city'] == city]
            if len(city_data) > 0:
                cities_coords[city] = {
                    'lat': city_data['Latitude'].iloc[0],
                    'lon': city_data['Longitude'].iloc[0]
                }
        
        print(f"✅ Found {len(cities_coords)} cities:")
        for city, coords in cities_coords.items():
            print(f"   {city}: ({coords['lat']:.3f}, {coords['lon']:.3f})")
        
        return cities_coords
    
    except Exception as e:
        print(f"❌ Error loading existing cities: {e}")
        return {}

def main():
    """Main function to fetch improved ground data"""
    print("🚀 IMPROVED GROUND DATA FETCHER")
    print("="*60)
    print("Using chunked AirNow + verified OpenAQ parameters")
    print()
    
    # Create output directory
    os.makedirs("data/ground", exist_ok=True)
    
    # Get existing cities
    cities_coords = get_existing_cities_coords()
    if not cities_coords:
        print("❌ No existing cities found")
        return
    
    # Define TEMPO time windows and regions
    tempo_regions = {
        "Canada": {
            "start_date": "2025-05-23",
            "end_date": "2025-05-28",
            "bbox": "-80,43,-73,46",  # Focused on Eastern Canada
            "cities": ["Montreal", "Toronto", "Hamilton"]
        },
        "NYC": {
            "start_date": "2025-06-05", 
            "end_date": "2025-06-06",
            "bbox": "-80,38,-70,43",  # Focused on Northeast US
            "cities": ["New York City", "Boston", "Philadelphia", "Washington DC"]
        },
        "Mexico": {
            "start_date": "2025-05-10",
            "end_date": "2025-05-15", 
            "bbox": "-100,19,-98,20",  # Focused on Mexico City area
            "cities": ["Mexico City"]
        }
    }
    
    all_ground_data = []
    
    # Fetch data for each TEMPO region
    for region_name, region_info in tempo_regions.items():
        print(f"\n📍 PROCESSING {region_name.upper()}")
        print("="*50)
        print(f"📅 Time window: {region_info['start_date']} to {region_info['end_date']}")
        print(f"🌍 Cities: {', '.join(region_info['cities'])}")
        print()
        
        region_data = []
        
        # Filter cities for this region
        region_cities = {city: coords for city, coords in cities_coords.items() 
                        if city in region_info['cities']}
        
        if not region_cities:
            print(f"   ⚠️ No cities found for {region_name}")
            continue
        
        # Fetch AirNow data (chunked)
        if region_name in ["Canada", "NYC"]:  # AirNow works for US/Canada
            airnow_data = fetch_airnow_chunked_data(
                region_info['start_date'],
                region_info['end_date'],
                region_info['bbox'],
                region_name
            )
            region_data.extend(airnow_data)
        
        # Fetch OpenAQ data (verified parameters)
        openaq_data = fetch_openaq_verified_data(
            region_info['start_date'],
            region_info['end_date'],
            region_cities,
            region_name
        )
        region_data.extend(openaq_data)
        
        if region_data:
            print(f"   📊 Total for {region_name}: {len(region_data)} measurements")
            all_ground_data.extend(region_data)
            
            # Save region-specific data
            region_df = pd.DataFrame(region_data)
            region_path = f"data/ground/{region_name}_improved.csv"
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
        
        # Standardize column names
        column_mapping = {
            'ParameterName': 'Parameter',
            'parameter': 'Parameter',
            'value': 'value',
            'datetime': 'UTC',
            'date': 'UTC'
        }
        
        for old_name, new_name in column_mapping.items():
            if old_name in df.columns and new_name not in df.columns:
                df[new_name] = df[old_name]
        
        # Save combined file
        output_path = "data/ground/improved_ground_data.csv"
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
        sample_cols = ['region', 'city', 'source', 'Parameter', 'value', 'Latitude', 'Longitude', 'UTC']
        available_cols = [col for col in sample_cols if col in df.columns]
        if available_cols:
            print(df[available_cols].head(10).to_string())
        
        print(f"\n🎉 Improved ground data collection complete!")
        print(f"📁 Files saved in: data/ground/")
        print(f"🔗 Use 'improved_ground_data.csv' for validation")
        
    else:
        print("\n❌ No data collected")
        print("This might be due to:")
        print("  1. Future dates (2025) - APIs may not have future data")
        print("  2. API rate limits")
        print("  3. Geographic restrictions")

if __name__ == "__main__":
    main()
