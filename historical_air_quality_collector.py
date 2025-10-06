#!/usr/bin/env python3
"""
Historical Air Quality Data Collector
Collects data for specific date ranges and cities as requested
"""

import requests
import json
import pandas as pd
import os
import time
from datetime import datetime, timedelta

# API Keys
OPENAQ_API_KEY = "195913c126a1647b9b7e26dc9bd5aa67f6d0061bca569695c80e1fbb65ea4eef"
AIRNOW_API_KEY = "92CBA9E3-4ADE-4E72-BE33-78A069C1A9CA"

def collect_historical_airnow_data():
    """Collect historical data from AirNow API for specific date ranges"""
    print("🇺🇸 COLLECTING HISTORICAL AIRNOW DATA")
    print("="*60)
    
    # Your requested date ranges and cities
    date_ranges = {
        "NYC_cities": {
            "start": "2025-06-05",
            "end": "2025-06-07",
            "cities": {
                "New_York_City": {"zip": "10001", "name": "New York City", "state": "NY", "bbox": [-74.3, 40.5, -73.7, 41.0]},
                "Philadelphia": {"zip": "19101", "name": "Philadelphia", "state": "PA", "bbox": [-75.3, 39.8, -75.0, 40.1]},
                "Washington_DC": {"zip": "20001", "name": "Washington DC", "state": "DC", "bbox": [-77.2, 38.8, -76.9, 39.0]},
                "Boston": {"zip": "02101", "name": "Boston", "state": "MA", "bbox": [-71.2, 42.2, -70.9, 42.5]}
            }
        },
        "Canada_cities": {
            "start": "2025-05-23", 
            "end": "2025-05-28",
            "cities": {
                "Toronto": {"zip": "M5H", "name": "Toronto", "state": "ON", "bbox": [-79.5, 43.5, -79.2, 43.8]},
                "Montreal": {"zip": "H3A", "name": "Montreal", "state": "QC", "bbox": [-73.8, 45.3, -73.3, 45.7]},
                "Hamilton": {"zip": "L8P", "name": "Hamilton", "state": "ON", "bbox": [-80.0, 43.1, -79.7, 43.4]}
            }
        },
        "Mexico_cities": {
            "start": "2025-05-20",
            "end": "2025-05-22", 
            "cities": {
                "Mexico_City": {"zip": "06000", "name": "Mexico City", "state": "CDMX", "bbox": [-99.4, 19.2, -98.9, 19.6]},
                "Ecatepec": {"zip": "55000", "name": "Ecatepec", "state": "MEX", "bbox": [-99.2, 19.5, -98.9, 19.7]},
                "Toluca": {"zip": "50000", "name": "Toluca", "state": "MEX", "bbox": [-99.8, 19.1, -99.5, 19.5]}
            }
        }
    }
    
    all_historical_data = []
    
    for region_name, region_data in date_ranges.items():
        print(f"\n📍 {region_name.upper()}")
        print(f"   Date Range: {region_data['start']} to {region_data['end']}")
        print(f"   Cities: {len(region_data['cities'])}")
        
        for city_key, city_info in region_data['cities'].items():
            print(f"\n   🏙️ {city_info['name']}, {city_info['state']}")
            
            # Try to get historical data for this city
            try:
                # Convert dates to AirNow format
                start_date = datetime.strptime(region_data['start'], "%Y-%m-%d")
                end_date = datetime.strptime(region_data['end'], "%Y-%m-%d")
                
                # Get data day by day
                current_date = start_date
                city_measurements = []
                
                while current_date <= end_date:
                    date_str = current_date.strftime("%Y-%m-%d")
                    print(f"      📅 {date_str}...", end=" ")
                    
                    try:
                        # Try historical data endpoint
                        response = requests.get(
                            "https://www.airnowapi.org/aq/data/",
                            params={
                                "startDate": f"{date_str}T00",
                                "endDate": f"{date_str}T23",
                                "parameters": "PM25,OZONE,PM10,NO2,CO,SO2",
                                "BBOX": f"{city_info['bbox'][0]},{city_info['bbox'][1]},{city_info['bbox'][2]},{city_info['bbox'][3]}",
                                "dataType": "A",
                                "format": "application/json",
                                "verbose": "1",
                                "API_KEY": AIRNOW_API_KEY
                            },
                            timeout=15
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            if isinstance(data, list) and len(data) > 0:
                                print(f"✅ {len(data)} measurements")
                                
                                # Add metadata
                                for obs in data:
                                    obs['city'] = city_info['name']
                                    obs['state'] = city_info['state']
                                    obs['region'] = region_name
                                    obs['source'] = 'AirNow'
                                    obs['data_type'] = 'historical'
                                    obs['date_range'] = f"{region_data['start']} to {region_data['end']}"
                                    city_measurements.append(obs)
                            else:
                                print("⚠️  No data")
                        else:
                            print(f"❌ Error {response.status_code}")
                    
                    except Exception as e:
                        print(f"❌ Exception: {e}")
                    
                    current_date += timedelta(days=1)
                    time.sleep(0.5)  # Rate limiting
                
                if city_measurements:
                    print(f"      📊 Total for {city_info['name']}: {len(city_measurements)} measurements")
                    all_historical_data.extend(city_measurements)
                else:
                    print(f"      ⚠️  No data found for {city_info['name']}")
            
            except Exception as e:
                print(f"      ❌ Error: {e}")
    
    return all_historical_data

def collect_current_airnow_data():
    """Collect current real-time data from AirNow API"""
    print("\n🌡️ COLLECTING CURRENT AIRNOW DATA")
    print("="*50)
    
    # Current US cities
    us_cities = {
        "New_York_City": {"zip": "10001", "name": "New York City", "state": "NY"},
        "Philadelphia": {"zip": "19101", "name": "Philadelphia", "state": "PA"},
        "Washington_DC": {"zip": "20001", "name": "Washington DC", "state": "DC"},
        "Boston": {"zip": "02101", "name": "Boston", "state": "MA"},
        "Baltimore": {"zip": "21201", "name": "Baltimore", "state": "MD"},
        "Pittsburgh": {"zip": "15201", "name": "Pittsburgh", "state": "PA"},
        "Hartford": {"zip": "06101", "name": "Hartford", "state": "CT"}
    }
    
    all_current_data = []
    
    for city_key, city_info in us_cities.items():
        print(f"📍 {city_info['name']}, {city_info['state']} (ZIP: {city_info['zip']})")
        
        try:
            response = requests.get(
                "https://www.airnowapi.org/aq/observation/zipCode/current/",
                params={
                    "format": "application/json",
                    "zipCode": city_info['zip'],
                    "distance": 25,
                    "API_KEY": AIRNOW_API_KEY
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    print(f"   ✅ Current: {len(data)} observations")
                    
                    for obs in data:
                        obs = obs.copy()
                        obs['city'] = city_info['name']
                        obs['state'] = city_info['state']
                        obs['source'] = 'AirNow'
                        obs['data_type'] = 'current'
                        obs['date_range'] = 'real-time'
                        all_current_data.append(obs)
                else:
                    print(f"   ⚠️  No current data")
            else:
                print(f"   ❌ Error: {response.status_code}")
        
        except Exception as e:
            print(f"   ❌ Exception: {e}")
        
        time.sleep(0.3)  # Rate limiting
    
    return all_current_data

def collect_openaq_data():
    """Collect data from OpenAQ API for global coverage"""
    print("\n🌍 COLLECTING OPENAQ DATA (Global)")
    print("="*50)
    
    headers = {"X-API-Key": OPENAQ_API_KEY}
    all_openaq_data = []
    
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
            
            # Filter for your target regions
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
                                meas['data_type'] = 'current'
                                meas['date_range'] = 'real-time'
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
    print("🚀 HISTORICAL + CURRENT AIR QUALITY DATA COLLECTION")
    print("="*70)
    print("Collecting data for your specific date ranges and cities")
    print()
    
    # Create output directory
    os.makedirs("data/ground", exist_ok=True)
    
    # Collect historical data for your date ranges
    historical_data = collect_historical_airnow_data()
    
    # Collect current real-time data
    current_data = collect_current_airnow_data()
    
    # Collect OpenAQ data
    openaq_data = collect_openaq_data()
    
    # Combine all data
    all_data = []
    
    if historical_data:
        print(f"\n📊 Historical AirNow: {len(historical_data)} measurements")
        all_data.extend(historical_data)
    
    if current_data:
        print(f"📊 Current AirNow: {len(current_data)} measurements")
        all_data.extend(current_data)
    
    if openaq_data:
        print(f"📊 OpenAQ: {len(openaq_data)} measurements")
        all_data.extend(openaq_data)
    
    if all_data:
        print(f"\n✅ TOTAL: {len(all_data)} measurements collected")
        
        # Convert to DataFrame
        df = pd.DataFrame(all_data)
        
        # Save combined file
        output_path = "data/ground/historical_combined.csv"
        df.to_csv(output_path, index=False)
        print(f"💾 Saved: {output_path}")
        
        # Save by data type
        if 'data_type' in df.columns:
            for data_type in df['data_type'].unique():
                type_df = df[df['data_type'] == data_type]
                type_path = f"data/ground/{data_type}_data.csv"
                type_df.to_csv(type_path, index=False)
                print(f"💾 Saved: {type_path}")
        
        # Save by region
        if 'region' in df.columns:
            for region in df['region'].unique():
                region_df = df[df['region'] == region]
                region_path = f"data/ground/{region}_historical.csv"
                region_df.to_csv(region_path, index=False)
                print(f"💾 Saved: {region_path}")
        
        # Summary statistics
        print(f"\n📊 DETAILED SUMMARY:")
        print(f"  Total measurements: {len(df):,}")
        
        if 'data_type' in df.columns:
            print(f"  By data type:")
            print(df['data_type'].value_counts().to_string())
        
        if 'region' in df.columns:
            print(f"  By region:")
            print(df['region'].value_counts().to_string())
        
        if 'city' in df.columns:
            print(f"  By city:")
            print(df['city'].value_counts().head(10).to_string())
        
        # Show sample data
        print(f"\n📋 SAMPLE DATA:")
        sample_cols = ['source', 'city', 'data_type', 'date_range', 'ParameterName', 'AQI']
        available_cols = [col for col in sample_cols if col in df.columns]
        if available_cols:
            print(df[available_cols].head(15).to_string())
        else:
            print(df.head(10).to_string())
        
        print(f"\n🎉 SUCCESS! Historical + Current data collection complete!")
        print(f"📁 Files saved in: data/ground/")
        
    else:
        print("\n❌ No data collected")
        print("Please check:")
        print("  1. API keys are valid")
        print("  2. Internet connection")
        print("  3. Date ranges are valid")

if __name__ == "__main__":
    main()
