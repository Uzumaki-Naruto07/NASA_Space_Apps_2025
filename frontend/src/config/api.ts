// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Core endpoints
  CURRENT_AQI: (region: string) => `${API_BASE_URL}/api/current-aqi/${region}`,
  FORECAST: (region: string, hours: number) => `${API_BASE_URL}/api/forecast/${region}/${hours}`,
  VALIDATION: `${API_BASE_URL}/api/validation`,
  REGIONS: `${API_BASE_URL}/api/regions`,
  POLLUTANTS: `${API_BASE_URL}/api/pollutants`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
  
  // Detailed endpoints
  DETAILED_VALIDATION: `${API_BASE_URL}/api/validation/detailed`,
  VALIDATION_PLOTS: `${API_BASE_URL}/api/validation/plots`,
  VALIDATION_GALLERY: `${API_BASE_URL}/api/validation/gallery`,
  VALIDATION_METRICS: `${API_BASE_URL}/api/validation/metrics`,
  
  // TEMPO data
  TEMPO_LATEST: (region: string) => `${API_BASE_URL}/api/tempo/latest/${region}`,
  TEMPO_HISTORY: (region: string) => `${API_BASE_URL}/api/tempo/history/${region}`,
  
  // Weather data
  WEATHER_LATEST: (region: string) => `${API_BASE_URL}/api/weather/latest/${region}`,
  
  // Dashboard
  DASHBOARD_OVERVIEW: `${API_BASE_URL}/api/dashboard/overview`,
  
  // Global data
  GLOBAL_AIR_QUALITY: `${API_BASE_URL}/api/global-air-quality`,
  OPENAQ_DATA: (country: string) => `${API_BASE_URL}/api/openaq/${country}`,
  UAE_AIR_QUALITY: `${API_BASE_URL}/api/uae-air-quality`,
  
  // Forecasting
  FORECASTING_ANALYSIS: `${API_BASE_URL}/api/forecasting/analysis`,
  FORECASTING_METRICS: `${API_BASE_URL}/api/forecasting/metrics`,
  FORECASTING_TRAINING_DATA: `${API_BASE_URL}/api/forecasting/training-data`,
  
  // Assets
  ASSETS: (filename: string) => `${API_BASE_URL}/api/assets/${filename}`,
};

export default API_BASE_URL;