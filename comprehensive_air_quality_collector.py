#!/usr/bin/env python3
"""
Comprehensive Air Quality Data Collector
Using both OpenAQ and AirNow APIs for maximum coverage
"""

import requests
import json
import pandas as pd
import os
import time
from datetime import datetime, timedelta

# API Keys
OPENAQ_API_KEY = "195913c126a1647b9b7e26dc9bd5aa67f6d0061bca569695c80e1fbb65ea4eef"
AIRNOW_API_KEY = "92CBA9E3-4ADE-4E72-BE33-78A069C1A9CA"  # Correct full key

def collect_airnow_data():
    """Collect data from AirNow API for US cities"""
    print("🇺🇸 COLLECTING AIRNOW DATA (US/Canada)")
    print("="*50)
    
    # US Cities with ZIP codes
    us_cities = {
        "New_York_City": {"zip": "10001", "name": "New York City", "state": "NY"},
        "Philadelphia": {"zip": "19101", "name": "Philadelphia", "state": "PA"},
        "Washington_DC": {"zip": "20001", "name": "Washington DC", "state": "DC"},
        "Boston": {"zip": "02101", "name": "Boston", "state": "MA"},
        "Baltimore": {"zip": "21201", "name": "Baltimore", "state": "MD"},
        "Pittsburgh": {"zip": "15201", "name": "Pittsburgh", "state": "PA"},
        "Hartford": {"zip": "06101", "name": "Hartford", "state": "CT"}
    }
    
    all_airnow_data = []
    
    for city_key, city_info in us_cities.items():
        print(f"\n📍 {city_info['name']}, {city_info['state']} (ZIP: {city_info['zip']})")
        
        # Get current observations
        try:
            current_response = requests.get(
                "https://www.airnowapi.org/aq/observation/zipCode/current/",
                params={
                    "format": "application/json",
                    "zipCode": city_info['zip'],
                    "distance": 25,
                    "API_KEY": AIRNOW_API_KEY
                },
                timeout=10
            )
            
            if current_response.status_code == 200:
                current_data = current_response.json()
                if isinstance(current_data, list) and len(current_data) > 0:
                    print(f"   ✅ Current: {len(current_data)} observations")
                    
                    # Add metadata
                    for obs in current_data:
                        obs['city'] = city_info['name']
                        obs['state'] = city_info['state']
                        obs['source'] = 'AirNow'
                        obs['data_type'] = 'current'
                        all_airnow_data.append(obs)
                else:
                    print(f"   ⚠️  No current data")
            else:
                print(f"   ❌ Current data error: {current_response.status_code}")
        
        except Exception as e:
            print(f"   ❌ Current data exception: {e}")
        
        # Get historical data (last 3 days)
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=3)
            
            historical_response = requests.get(
                "https://www.airnowapi.org/aq/data/",
                params={
                    "startDate": start_date.strftime("%Y-%m-%dT00"),
                    "endDate": end_date.strftime("%Y-%m-%dT23"),
                    "parameters": "PM25,OZONE,PM10,NO2,CO,SO2",
                    "BBOX": f"-85,35,-65,50",  # East Coast region
                    "dataType": "A",
                    "format": "application/json",
                    "verbose": "1",
                    "API_KEY": AIRNOW_API_KEY
                },
                timeout=15
            )
            
            if historical_response.status_code == 200:
                historical_data = historical_response.json()
                if isinstance(historical_data, list) and len(historical_data) > 0:
                    print(f"   ✅ Historical: {len(historical_data)} measurements")
                    
                    # Add metadata
                    for obs in historical_data:
                        obs['city'] = city_info['name']
                        obs['state'] = city_info['state']
                        obs['source'] = 'AirNow'
                        obs['data_type'] = 'historical'
                        all_airnow_data.append(obs)
                else:
                    print(f"   ⚠️  No historical data")
            else:
                print(f"   ❌ Historical data error: {historical_response.status_code}")
        
        except Exception as e:
            print(f"   ❌ Historical data exception: {e}")
        
        time.sleep(0.5)  # Rate limiting
    
    return all_airnow_data

def collect_openaq_data():
    """Collect data from OpenAQ API for global coverage"""
    print("\n🌍 COLLECTING OPENAQ DATA (Global)")
    print("="*50)
    
    headers = {"X-API-Key": OPENAQ_API_KEY}
    all_openaq_data = []
    
    # Get all locations
    try:
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
            
            # Filter for regions of interest
            target_regions = {
                "US_East_Coast": {"lat_min": 35, "lat_max": 45, "lon_min": -85, "lon_max": -65},
                "Canada": {"lat_min": 45, "lat_max": 55, "lon_min": -105, "lon_max": -60},
                "Mexico": {"lat_min": 18, "lat_max": 22, "lon_min": -103, "lon_max": -95}
            }
            
            filtered_locations = []
            for loc in locations:
                lat = loc.get('coordinates', {}).get('latitude')
                lon = loc.get('coordinates', {}).get('longitude')
                
                if lat is None or lon is None:
                    continue
                
                for region_name, bounds in target_regions.items():
                    if (bounds['lat_min'] <= lat <= bounds['lat_max'] and
                        bounds['lon_min'] <= lon <= bounds['lon_max']):
                        loc['region'] = region_name
                        filtered_locations.append(loc)
                        break
            
            print(f"📍 Found {len(filtered_locations)} locations in target regions")
            
            # Get data from each location
            for i, loc in enumerate(filtered_locations):
                print(f"  {i+1}/{len(filtered_locations)}: {loc.get('name', 'Unknown')}...", end=" ")
                
                try:
                    latest_response = requests.get(
                        f"https://api.openaq.org/v3/locations/{loc['id']}/latest",
                        headers=headers, timeout=10
                    )
                    
                    if latest_response.status_code == 200:
                        latest_data = latest_response.json()
                        if 'results' in latest_data and len(latest_data['results']) > 0:
                            print(f"✅ {len(latest_data['results'])} measurements")
                            
                            for meas in latest_data['results']:
                                meas['region'] = loc.get('region', 'Unknown')
                                meas['location_name'] = loc.get('name', 'Unknown')
                                meas['country'] = loc.get('country', {}).get('code', 'N/A')
                                meas['source'] = 'OpenAQ'
                                all_openaq_data.append(meas)
                        else:
                            print("⚠️  No data")
                    else:
                        print("❌ Error")
                    
                    time.sleep(0.3)  # Rate limiting
                except Exception as e:
                    print(f"❌ Exception: {e}")
        
        else:
            print(f"❌ OpenAQ Error: {response.status_code}")
    
    except Exception as e:
        print(f"❌ OpenAQ Exception: {e}")
    
    return all_openaq_data

def main():
    """Main data collection function"""
    print("🚀 COMPREHENSIVE AIR QUALITY DATA COLLECTION")
    print("="*60)
    print("Using OpenAQ + AirNow APIs for maximum coverage")
    print()
    
    # Create output directory
    os.makedirs("data/ground", exist_ok=True)
    
    # Collect AirNow data (US/Canada)
    airnow_data = collect_airnow_data()
    
    # Collect OpenAQ data (Global)
    openaq_data = collect_openaq_data()
    
    # Combine all data
    all_data = []
    
    if airnow_data:
        print(f"\n📊 AirNow Summary: {len(airnow_data)} measurements")
        all_data.extend(airnow_data)
    
    if openaq_data:
        print(f"📊 OpenAQ Summary: {len(openaq_data)} measurements")
        all_data.extend(openaq_data)
    
    if all_data:
        print(f"\n✅ TOTAL: {len(all_data)} measurements collected")
        
        # Convert to DataFrame
        df = pd.DataFrame(all_data)
        
        # Save combined file
        output_path = "data/ground/ground_combined.csv"
        df.to_csv(output_path, index=False)
        print(f"💾 Saved: {output_path}")
        
        # Save by source
        if 'source' in df.columns:
            for source in df['source'].unique():
                source_df = df[df['source'] == source]
                source_path = f"data/ground/{source}_data.csv"
                source_df.to_csv(source_path, index=False)
                print(f"💾 Saved: {source_path}")
        
        # Summary statistics
        print(f"\n📊 DETAILED SUMMARY:")
        print(f"  Total measurements: {len(df):,}")
        
        if 'source' in df.columns:
            print(f"  By source:")
            print(df['source'].value_counts().to_string())
        
        if 'city' in df.columns:
            print(f"  By city:")
            print(df['city'].value_counts().head(10).to_string())
        
        if 'region' in df.columns:
            print(f"  By region:")
            print(df['region'].value_counts().to_string())
        
        # Show sample data
        print(f"\n📋 SAMPLE DATA:")
        sample_cols = ['source', 'city', 'ParameterName', 'AQI', 'Latitude', 'Longitude']
        available_cols = [col for col in sample_cols if col in df.columns]
        if available_cols:
            print(df[available_cols].head(10).to_string())
        else:
            print(df.head(10).to_string())
        
        print(f"\n🎉 SUCCESS! Ground-based air quality data collection complete!")
        print(f"📁 Files saved in: data/ground/")
        
    else:
        print("\n❌ No data collected")
        print("Please check:")
        print("  1. API keys are valid")
        print("  2. Internet connection")
        print("  3. API endpoints are accessible")

if __name__ == "__main__":
    main()
