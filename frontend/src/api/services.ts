import apiClient from './client';
import { 
  API_ENDPOINTS, 
  type CurrentAQIResponse, 
  type ForecastResponse, 
  type ValidationResponse,
  type DetailedValidationResponse,
  type ValidationPlot,
  type ScatterPlot,
  type MatchedDataResponse,
  type HealthRiskResponse,
  type PolicyHotspotResponse,
  type GameScoreResponse,
  type TempoDataResponse,
  type TempoHistoryResponse,
  type WeatherDataResponse,
  type DashboardOverviewResponse
} from './endpoints';

// Air Quality Services
export const airQualityService = {
  // Get current AQI for a region
  getCurrentAQI: async (region: string): Promise<CurrentAQIResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.CURRENT_AQI(region));
    return response.data;
  },

  // Get forecast for a region
  getForecast: async (region: string, hours: number = 72): Promise<ForecastResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.FORECAST(region, hours));
    return response.data;
  },

  // Get available regions
  getRegions: async (): Promise<string[]> => {
    const response = await apiClient.get(API_ENDPOINTS.REGIONS);
    return response.data.regions;
  },

  // Get available pollutants
  getPollutants: async (): Promise<string[]> => {
    const response = await apiClient.get(API_ENDPOINTS.POLLUTANTS);
    return response.data.pollutants;
  },
};

// Validation Services
export const validationService = {
  // Get validation results
  getValidation: async (): Promise<ValidationResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.VALIDATION);
    return response.data;
  },

  // Get detailed validation results
  getDetailedValidation: async (): Promise<DetailedValidationResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.VALIDATION_DETAILED);
    return response.data;
  },

  // Get validation plots
  getValidationPlots: async (): Promise<ValidationPlot[]> => {
    const response = await apiClient.get(API_ENDPOINTS.VALIDATION_PLOTS);
    return response.data.plots;
  },

  // Get scatter plots
  getScatterPlots: async (): Promise<ScatterPlot[]> => {
    const response = await apiClient.get(API_ENDPOINTS.VALIDATION_SCATTER_PLOTS);
    return response.data.scatter_plots;
  },

  // Get matched data
  getMatchedData: async (limit: number = 100): Promise<MatchedDataResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.VALIDATION_MATCHED_DATA, {
      params: { limit }
    });
    return response.data;
  },

  // Run validation system
  runValidation: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post(API_ENDPOINTS.RUN_VALIDATION);
    return response.data;
  },
};

// Forecasting Services
export const forecastingService = {
  // Run forecasting system
  runForecasting: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post(API_ENDPOINTS.RUN_FORECASTING);
    return response.data;
  },

  // Get forecasting analysis
  getForecastingAnalysis: async (): Promise<{ analysis_plot: string; description: string; available: boolean }> => {
    const response = await apiClient.get(API_ENDPOINTS.FORECASTING_ANALYSIS);
    return response.data;
  },

  // Get forecasting metrics
  getForecastingMetrics: async (): Promise<any> => {
    const response = await apiClient.get('/api/forecasting/metrics');
    return response.data;
  },

  // Get training data information
  getTrainingData: async (): Promise<any> => {
    const response = await apiClient.get('/api/forecasting/training-data');
    return response.data;
  },

  // Get validation gallery
  getValidationGallery: async (): Promise<any> => {
    const response = await apiClient.get('/api/validation/gallery');
    return response.data;
  },

  // Get validation metrics
  getValidationMetrics: async (): Promise<any> => {
    const response = await apiClient.get('/api/validation/metrics');
    return response.data;
  },
};

// Health Services
export const healthService = {
  // Get health risk assessment
  getHealthRisk: async (userData: {
    age: number;
    conditions: string[];
    outdoor_habits: string[];
  }): Promise<HealthRiskResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.HEALTH_RISK, userData);
    return response.data;
  },
};

// Policy Services
export const policyService = {
  // Get policy hotspots
  getHotspots: async (): Promise<PolicyHotspotResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.POLICY_HOTSPOTS);
    return response.data;
  },
};

// Gaming Services
export const gameService = {
  // Submit game score
  submitScore: async (scoreData: {
    username: string;
    city: string;
    score: number;
    aqi_level: number;
  }): Promise<GameScoreResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.GAME_SCORE, scoreData);
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (): Promise<GameScoreResponse[]> => {
    const response = await apiClient.get(API_ENDPOINTS.LEADERBOARD);
    return response.data;
  },
};

// TEMPO Satellite Data Services
export const tempoService = {
  // Get latest TEMPO data for a region
  getLatest: async (region: string): Promise<TempoDataResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.TEMPO_LATEST(region));
    return response.data;
  },

  // Get TEMPO data history for a region
  getHistory: async (region: string, limit?: number): Promise<TempoHistoryResponse> => {
    const params = limit ? { limit } : {};
    const response = await apiClient.get(API_ENDPOINTS.TEMPO_HISTORY(region), { params });
    return response.data;
  },
};

// Weather Services
export const weatherService = {
  // Get latest weather data for a region
  getLatest: async (region: string): Promise<WeatherDataResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.WEATHER_LATEST(region));
    return response.data;
  },
};

// Dashboard Services
export const dashboardService = {
  // Get comprehensive dashboard overview
  getOverview: async (): Promise<DashboardOverviewResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_OVERVIEW);
    return response.data;
  },
};

// System Services
export const systemService = {
  // Health check
  healthCheck: async (): Promise<{
    status: string;
    timestamp: string;
    data_loaded: {
      ground_data: boolean;
      tempo_data: boolean;
      weather_data: boolean;
      validation_results: boolean;
    };
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH);
    return response.data;
  },
};
