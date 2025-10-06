# 🚀 NASA TEMPO Dashboard - Data Documentation

## 📊 Dataset Overview

This repository includes **sample data** for development and demonstration purposes. For production deployment, you'll need the full dataset.

### 🗂️ Data Structure

```
backend/data/
├── raw/
│   ├── ground/           # Ground truth air quality data
│   ├── tempo/            # TEMPO satellite data
│   └── weather/          # Weather data
└── artifacts/
    └── validation/       # Validation results and plots
```

### 📈 Sample Data Included

- **Ground Data**: 100 sample records from each region
- **TEMPO Data**: 50 sample satellite measurements
- **Weather Data**: 50 sample weather records
- **Validation**: Complete validation artifacts and plots

### 🚀 Full Dataset Download

To get the complete dataset for production:

```bash
cd backend
./download_full_data.sh
```

### 📊 Data Sources

1. **TEMPO Satellite Data**
   - NASA TEMPO L2 products
   - NO2, O3, PM2.5, HCHO measurements
   - 3 regions: NYC, Canada, Mexico

2. **Ground Truth Data**
   - OpenAQ API
   - AirNow API
   - UAE Air Quality API
   - Historical data from multiple sources

3. **Weather Data**
   - Temperature, humidity, wind speed
   - Pressure, precipitation
   - 3 regions: NYC, Canada, Mexico

### 🔧 Usage

The Flask backend automatically loads available data:

```python
# Data loading in app.py
data_manager = DataManager()
# Automatically finds and loads CSV files
```

### 📈 Data Size

- **Sample Data**: ~50MB (included in Git)
- **Full Dataset**: ~9GB (download separately)
- **Validation Artifacts**: ~100MB (included in Git)

### 🌍 Regions Covered

- **New York City (NYC)**
- **Canada (Eastern)**
- **Mexico (Central)**

### 🔬 Validation Results

Complete validation analysis included:
- Scatter plots by city and pollutant
- Bland-Altman analysis
- Statistical tests
- AI/ML forecasting results
