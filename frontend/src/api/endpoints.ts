// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Health & Status
  HEALTH: '/api/health',
  HOME: '/',
  
  // Air Quality Data
  CURRENT_AQI: (region: string) => `/api/current-aqi/${region}`,
  FORECAST: (region: string, hours: number) => `/api/forecast/${region}/${hours}`,
  
  // Validation & Analysis
  VALIDATION: '/api/validation',
  VALIDATION_DETAILED: '/api/validation/detailed',
  VALIDATION_PLOTS: '/api/validation/plots',
  VALIDATION_SCATTER_PLOTS: '/api/validation/scatter-plots',
  VALIDATION_MATCHED_DATA: '/api/validation/matched-data',
  RUN_VALIDATION: '/api/run-validation',
  
  // Forecasting
  RUN_FORECASTING: '/api/run-forecasting',
  FORECASTING_ANALYSIS: '/api/forecasting/analysis',
  
  // Data Sources
  REGIONS: '/api/regions',
  POLLUTANTS: '/api/pollutants',
  
  // TEMPO satellite data
  TEMPO_LATEST: (region: string) => `/api/tempo/latest/${region}`,
  TEMPO_HISTORY: (region: string) => `/api/tempo/history/${region}`,
  
  // Weather data
  WEATHER_LATEST: (region: string) => `/api/weather/latest/${region}`,
  
  // Dashboard overview
  DASHBOARD_OVERVIEW: '/api/dashboard/overview',
  
  // Health Assessment
  HEALTH_RISK: '/api/health/risk',
  
  // Policy & Hotspots
  POLICY_HOTSPOTS: '/api/policy/hotspots',
  
  // Gaming
  GAME_SCORE: '/api/game/score',
  LEADERBOARD: '/api/game/leaderboard',
  
  // Global Air Quality
  GLOBAL_AIR_QUALITY: '/api/global-air-quality',
  OPENAQ_DATA: (country: string) => `/api/openaq/${country}`,
  UAE_AIR_QUALITY: '/api/uae-air-quality',
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface CurrentAQIResponse {
  region: string;
  aqi: number;
  pollutant: string;
  timestamp: string;
  location: {
    lat: number;
    lon: number;
  };
}

export interface ForecastResponse {
  region: string;
  forecast_hours: number;
  data: Array<{
    timestamp: string;
    aqi: number;
    pollutant: string;
    confidence: number;
  }>;
}

export interface ValidationResponse {
  total_matches: number;
  regions: string[];
  pollutants: string[];
  overall_metrics: {
    r2: number;
    mae: number;
    rmse: number;
    correlation: number;
  };
}

export interface DetailedValidationResponse {
  validation_summary: {
    total_pairs: number;
    cities: number;
    regions: number;
    date_range: string;
    spatial_radius_km: number;
    temporal_window_hours: number;
  };
  validation_metrics: Record<string, {
    city: string;
    parameter?: string;
    r2: number;
    rmse: number;
    mae: number;
    bias: number;
    n_samples: number;
  }>;
  data_quality: {
    ground_data_range: string;
    tempo_data_range: string;
    distance_range_km: string;
    time_diff_range_hours: string;
  };
  run_manifest: {
    run_timestamp: string;
    spatial_radius_km: number;
    temporal_window_hours: number;
    bootstrap_iterations: number;
    permutation_iterations: number;
  };
}

export interface ValidationPlot {
  name: string;
  url: string;
  description: string;
}

export interface ScatterPlot {
  name: string;
  url: string;
  pollutant: string;
  city: string;
  description: string;
}

export interface MatchedDataResponse {
  data: Array<Record<string, any>>;
  total_records: number;
  columns: string[];
}

export interface HealthRiskResponse {
  risk_score: number;
  level: 'low' | 'moderate' | 'high' | 'very-high' | 'hazardous';
  recommendations: string[];
  safe_activity_window: {
    start: string;
    end: string;
  };
}

export interface PolicyHotspotResponse {
  hotspots: Array<{
    lat: number;
    lon: number;
    intensity: number;
    type: string;
  }>;
}

export interface GameScoreResponse {
  username: string;
  city: string;
  score: number;
  aqi_level: number;
  timestamp: string;
}

// TEMPO satellite data interfaces
export interface TempoDataResponse {
  region: string;
  timestamp: string;
  location: {
    lat: number;
    lon: number;
  };
  pollutants: {
    no2: number;
    o3: number;
    pm25: number;
    hcho: number;
    aerosols: number;
  };
  data_quality: {
    cloud_fraction: number;
    solar_zenith_angle: number;
    quality_flag: number;
  };
}

export interface TempoHistoryResponse {
  region: string;
  data_points: number;
  history: Array<{
    timestamp: string;
    location: {
      lat: number;
      lon: number;
    };
    pollutants: {
      no2: number;
      o3: number;
      pm25: number;
      hcho: number;
      aerosols: number;
    };
  }>;
}

export interface WeatherDataResponse {
  region: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  pressure: number;
  precipitation: number;
}

export interface DashboardOverviewResponse {
  timestamp: string;
  regions: Record<string, {
    tempo: TempoDataResponse | null;
    weather: WeatherDataResponse | null;
    aqi: CurrentAQIResponse | null;
  }>;
  system_health: {
    ground_data: boolean;
    tempo_data: boolean;
    weather_data: boolean;
    validation_results: boolean;
  };
}

// Global Air Quality Data Types
export interface GlobalAirQualityData {
  north_america: Array<{
    city: string;
    lat: number;
    lon: number;
    aqi: number;
    pm25: number;
    no2: number;
    o3: number;
    timestamp: string;
    source: string;
  }>;
  uae: Array<{
    city: string;
    lat: number;
    lon: number;
    aqi: number;
    pm25: number;
    no2: number;
    o3: number;
    timestamp: string;
    source: string;
  }>;
  timestamp: string;
}

export interface OpenAQDataResponse {
  country: string;
  data: Array<{
    value: number;
    parameter: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    city: string;
    date: {
      utc: string;
    };
  }>;
}

export interface UAEAirQualityResponse {
  region: string;
  data: Array<{
    city: string;
    lat: number;
    lon: number;
    aqi: number;
    pm25: number;
    no2: number;
    o3: number;
    timestamp: string;
    source: string;
  }>;
}
