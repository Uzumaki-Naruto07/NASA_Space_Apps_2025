export interface AirQualityData {
  city: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  hcho: number;
  timestamp: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ForecastData {
  timestamp: string;
  aqi: number;
  pm25: number;
  no2: number;
  o3: number;
  hcho: number;
  uncertainty: number;
  confidence: number;
}

export interface ValidationMetrics {
  r2: number;
  mae: number;
  rmse: number;
  correlation: number;
  sampleSize: number;
}

export interface HealthRisk {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'very-high' | 'hazardous';
  recommendations: string[];
  safeActivityWindow: {
    start: string;
    end: string;
  };
}

export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
}

export interface Language {
  code: 'en' | 'ar';
  name: string;
  direction: 'ltr' | 'rtl';
}

export interface GameScore {
  username: string;
  city: string;
  score: number;
  aqiLevel: number;
  timestamp: string;
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'tempo' | 'ground' | 'weather';
  visible: boolean;
  opacity: number;
  data: any;
}
