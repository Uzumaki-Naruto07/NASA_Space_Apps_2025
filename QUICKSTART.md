# 🚀 Quick Start Guide - Ground-Based Air Quality Data

## ⚡ Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd "/Users/naruto_uzumaki/Desktop/NASA /NASA_Space_Apps_2025"
pip install -r requirements.txt
```

### Step 2: Launch Jupyter Notebook
```bash
jupyter notebook ground_fetch_airquality.ipynb
```

### Step 3: Run the Notebook
Click **Cell → Run All** or run each cell sequentially

---

## ⚠️ IMPORTANT: Fix Date Ranges First!

The notebook is configured with **future dates** (May/June 2025), but APIs only have **historical data**.

**Before running, update Step 3 with past dates:**

```python
regions = {
    "NYC": {
        "lat_min": 35, 
        "lat_max": 50, 
        "lon_min": -85, 
        "lon_max": -65, 
        "start": "2024-09-01",  # ← Change to past date
        "end": "2024-09-03"     # ← Change to past date
    },
    "Canada": {
        "lat_min": 45, 
        "lat_max": 55, 
        "lon_min": -105, 
        "lon_max": -90, 
        "start": "2024-09-01",  # ← Change to past date
        "end": "2024-09-05"     # ← Change to past date
    },
    "Mexico": {
        "lat_min": 18, 
        "lat_max": 21, 
        "lon_min": -103, 
        "lon_max": -97, 
        "start": "2024-09-01",  # ← Change to past date
        "end": "2024-09-03"     # ← Change to past date
    },
}
```

---

## 📊 What You'll Get

### Output Files:
```
data/ground/
├── ground_combined.csv         ← 🎯 Master file (all regions + sources)
├── NYC/
│   ├── NYC_openaq.csv
│   └── NYC_airnow.csv
├── Canada/
│   ├── Canada_openaq.csv
│   └── Canada_airnow.csv
└── Mexico/
    └── Mexico_openaq.csv
```

### Data Columns:
- `region` - NYC, Canada, or Mexico
- `source` - OpenAQ or AirNow
- `parameter` - pm25, pm10, no2, o3, co, so2
- `value` - Pollutant concentration
- `unit` - Measurement unit
- `latitude`, `longitude` - Station coordinates
- `time` - Timestamp (UTC)
- `location` - Station name

---

## 🧪 Test OpenAQ API First

The notebook includes a test cell (Cell 4) that:
- ✅ Verifies your API key works
- ✅ Shows the response structure
- ✅ Helps debug connection issues

**Run this cell first** before fetching all data!

---

## 🔍 Expected Output

After running, you should see:

```
✅ Setup complete!
✅ API Keys loaded
Regions configured:
  NYC: 2024-09-01 to 2024-09-03
  Canada: 2024-09-01 to 2024-09-05
  Mexico: 2024-09-01 to 2024-09-03

🔍 Testing OpenAQ v3 API...
Status Code: 200
✅ API Test Successful!

======================================================================
 STARTING GROUND-BASED AIR QUALITY DATA COLLECTION
======================================================================

📍 Fetching OpenAQ data for NYC...
  Fetching pm25... ✅ 1234 records
  Fetching pm10... ✅ 890 records
  ...

✅ Total OpenAQ records for NYC: 5,432

📍 Fetching AirNow data for NYC...
  Fetching OZONE... ✅ 456 records
  ...

✅ SUCCESS! Combined data saved to: data/ground/ground_combined.csv
```

---

## 🐛 Troubleshooting

### Problem: "No data found"
**Solution**: Change dates to historical dates (see above)

### Problem: "API Error 401 Unauthorized"
**Solution**: Check API keys are correct in Cell 2

### Problem: "API Error 404 Not Found"
**Solution**: No data exists for that location/date. Try different dates.

### Problem: "Connection timeout"
**Solution**: Check internet connection, try again

---

## 📚 What's Included

1. **ground_fetch_airquality.ipynb** - Main notebook
2. **GROUND_DATA_README.md** - Full documentation
3. **requirements.txt** - Python dependencies
4. **QUICKSTART.md** - This guide

---

## 🎯 Next Steps After Data Collection

### 1. Load and Explore Data
```python
import pandas as pd
df = pd.read_csv("data/ground/ground_combined.csv")
print(df.head())
print(df.describe())
```

### 2. Filter by Pollutant
```python
pm25_data = df[df['parameter'] == 'pm25']
print(f"Average PM2.5: {pm25_data['value'].mean():.2f}")
```

### 3. Compare Regions
```python
regional_avg = df.groupby(['region', 'parameter'])['value'].mean()
print(regional_avg)
```

### 4. Visualize Data
```python
import matplotlib.pyplot as plt

# PM2.5 by region
pm25_data = df[df['parameter'] == 'pm25']
pm25_data.boxplot(column='value', by='region')
plt.title('PM2.5 Distribution by Region')
plt.ylabel('Concentration (µg/m³)')
plt.show()
```

---

## 🔗 Useful Links

- **OpenAQ Docs**: https://api.openaq.org/docs
- **AirNow Docs**: https://docs.airnowapi.org/
- **Pandas Documentation**: https://pandas.pydata.org/docs/
- **Jupyter Notebook Guide**: https://jupyter-notebook.readthedocs.io/

---

## ✅ Checklist

- [ ] Install dependencies (`pip install -r requirements.txt`)
- [ ] Update date ranges to past dates (Cell 3)
- [ ] Run API test cell (Cell 4)
- [ ] Run all cells (Cell → Run All)
- [ ] Verify output files exist in `data/ground/`
- [ ] Check data quality report at the end
- [ ] Start analysis with combined CSV file

---

**Ready to collect ground-based air quality data? Let's go! 🚀**

