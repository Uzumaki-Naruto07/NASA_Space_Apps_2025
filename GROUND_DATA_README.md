# Ground-Based Air Quality Data Collection

## 📋 Overview

This project fetches ground-based air quality monitoring data from two major sources:
- **OpenAQ v3 API**: Global air quality measurements from various monitoring stations
- **AirNow API**: US Environmental Protection Agency's air quality data for US/Canada regions

## 🚀 Quick Start

### Prerequisites

Install required packages:

```bash
pip install pandas requests tqdm jupyter
```

### Running the Notebook

1. Open the notebook:
   ```bash
   cd "/Users/naruto_uzumaki/Desktop/NASA /NASA_Space_Apps_2025"
   jupyter notebook ground_fetch_airquality.ipynb
   ```

2. Run cells sequentially (Cell → Run All) or step-by-step

3. The notebook will:
   - Test the OpenAQ API first to verify connectivity
   - Fetch data for all three regions (NYC, Canada, Mexico)
   - Save individual region files
   - Create a combined master CSV file

## 📂 Output Structure

```
data/ground/
├── ground_combined.csv         # Master file with all data
├── NYC/
│   ├── NYC_openaq.csv
│   └── NYC_airnow.csv
├── Canada/
│   ├── Canada_openaq.csv
│   └── Canada_airnow.csv
└── Mexico/
    └── Mexico_openaq.csv
```

## 🗺️ Regions Configured

### NYC Region
- **Coordinates**: 35°N to 50°N, -85°W to -65°W
- **Date Range**: June 5-7, 2025
- **Data Sources**: OpenAQ + AirNow

### Canada Region
- **Coordinates**: 45°N to 55°N, -105°W to -90°W
- **Date Range**: May 23-28, 2025
- **Data Sources**: OpenAQ + AirNow

### Mexico Region
- **Coordinates**: 18°N to 21°N, -103°W to -97°W
- **Date Range**: May 20-22, 2025
- **Data Sources**: OpenAQ only (AirNow doesn't cover Mexico)

## 🔑 API Keys

The notebook includes your API keys:
- **OpenAQ**: `195913c126a1647b9b7e26dc9bd5aa67f6d0061bca569695c80e1fbb65ea4eef`
- **AirNow**: `92CBA9E3-4ADE-4E72-BE33-78A069C1A9C`

> ⚠️ **Important**: Keep these keys secure! Don't commit them to public repositories.

## 📊 Data Fields

### Combined CSV Columns:
- `region` - Geographic region (NYC, Canada, Mexico)
- `source` - Data source (OpenAQ, AirNow)
- `parameter` - Pollutant type (pm25, pm10, no2, o3, co, so2)
- `value` - Measurement value
- `unit` - Unit of measurement (µg/m³, ppm, etc.)
- `latitude` - Station latitude
- `longitude` - Station longitude
- `time` - Timestamp (UTC)
- `location` - Station name/identifier
- `location_id` - Unique location ID

## 🔬 Pollutants Monitored

### OpenAQ
- PM2.5 (Particulate Matter < 2.5μm)
- PM10 (Particulate Matter < 10μm)
- NO₂ (Nitrogen Dioxide)
- O₃ (Ozone)
- CO (Carbon Monoxide)
- SO₂ (Sulfur Dioxide)

### AirNow
- OZONE (O₃)
- PM25 (PM2.5)
- PM10
- NO2 (NO₂)
- CO (Carbon Monoxide)
- SO2 (SO₂)

## 🛠️ Troubleshooting

### No data returned?
1. **Check dates**: The dates in the config are in the future (May/June 2025). APIs typically only have historical data.
   - **Solution**: Change the dates to past dates in Step 3 of the notebook
   - Example: Change `"2025-06-05"` to `"2024-10-01"`

2. **API key issues**: Verify your keys are valid
   - Test them at: https://api.openaq.org/ and https://www.airnowapi.org/

3. **Rate limiting**: If you get errors, the notebook includes automatic delays (0.3-0.5 seconds between requests)

4. **404 errors**: This means no data exists for that location/date combination. Try different dates or regions.

### Modify Date Ranges

Edit Step 3 in the notebook:

```python
regions = {
    "NYC": {
        "lat_min": 35, 
        "lat_max": 50, 
        "lon_min": -85, 
        "lon_max": -65, 
        "start": "2024-10-01",  # Change these
        "end": "2024-10-03"     # to valid dates
    },
    # ... other regions
}
```

## 📈 Next Steps

After collecting the data, you can:

1. **Analyze Air Quality Trends**
   ```python
   import pandas as pd
   df = pd.read_csv("data/ground/ground_combined.csv")
   
   # Average PM2.5 by region
   pm25_data = df[df['parameter'] == 'pm25']
   print(pm25_data.groupby('region')['value'].mean())
   ```

2. **Visualize Geographic Distribution**
   ```python
   import matplotlib.pyplot as plt
   
   plt.scatter(df['longitude'], df['latitude'], 
               c=df['value'], cmap='RdYlGn_r', alpha=0.5)
   plt.colorbar(label='Pollutant Concentration')
   plt.xlabel('Longitude')
   plt.ylabel('Latitude')
   plt.title('Air Quality Monitoring Stations')
   plt.show()
   ```

3. **Time Series Analysis**
   ```python
   df['time'] = pd.to_datetime(df['time'])
   df_time = df.set_index('time')
   df_time.groupby('parameter')['value'].resample('D').mean().plot()
   ```

## 🔄 API Version Notes

### OpenAQ v3
- **Status**: Active (v1 and v2 retired as of Jan 31, 2025)
- **Authentication**: X-API-Key header required
- **Rate Limits**: ~1000 requests/hour (monitor your usage)
- **Documentation**: https://api.openaq.org/docs

### AirNow API
- **Status**: Active
- **Authentication**: API_KEY parameter in URL
- **Rate Limits**: Varies by account type
- **Coverage**: US, Canada, parts of Mexico
- **Documentation**: https://docs.airnowapi.org/

## 📞 Support

If you encounter issues:
1. Check the "Data Quality Report" section in the notebook output
2. Review error messages for specific API problems
3. Verify your internet connection
4. Ensure API keys are valid and have proper permissions

## 📄 License

This code is provided for the NASA Space Apps Challenge 2025. Please review the LICENSE file in the repository.

---

**Created**: October 2025  
**Version**: 1.0  
**Author**: NASA Space Apps Team

