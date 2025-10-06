import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  airQualityService, 
  validationService, 
  forecastingService, 
  healthService, 
  policyService, 
  gameService, 
  systemService,
  tempoService,
  weatherService,
  dashboardService
} from './services';
import { API_ENDPOINTS } from './endpoints';

// Air Quality Hooks
export const useCurrentAQI = (region: string) => {
  return useQuery({
    queryKey: ['current-aqi', region],
    queryFn: () => airQualityService.getCurrentAQI(region),
    enabled: !!region,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useForecast = (region: string, hours: number = 72) => {
  return useQuery({
    queryKey: ['forecast', region, hours],
    queryFn: () => airQualityService.getForecast(region, hours),
    enabled: !!region,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: airQualityService.getRegions,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const usePollutants = () => {
  return useQuery({
    queryKey: ['pollutants'],
    queryFn: airQualityService.getPollutants,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Validation Hooks
export const useValidation = () => {
  return useQuery({
    queryKey: ['validation'],
    queryFn: validationService.getValidation,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useRunValidation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: validationService.runValidation,
    onSuccess: () => {
      // Invalidate validation queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['validation'] });
    },
  });
};

// Forecasting Hooks
export const useRunForecasting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: forecastingService.runForecasting,
    onSuccess: () => {
      // Invalidate forecast queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['forecast'] });
    },
  });
};

// Health Hooks
export const useHealthRisk = (userData: {
  age: number;
  conditions: string[];
  outdoor_habits: string[];
}) => {
  return useQuery({
    queryKey: ['health-risk', userData],
    queryFn: () => healthService.getHealthRisk(userData),
    enabled: !!userData.age,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Policy Hooks
export const useHotspots = () => {
  return useQuery({
    queryKey: ['hotspots'],
    queryFn: policyService.getHotspots,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Gaming Hooks
export const useSubmitScore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: gameService.submitScore,
    onSuccess: () => {
      // Invalidate leaderboard to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
};

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: gameService.getLeaderboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// TEMPO Satellite Data Hooks
export const useTempoLatest = (region: string) => {
  return useQuery({
    queryKey: ['tempo-latest', region],
    queryFn: () => tempoService.getLatest(region),
    refetchInterval: 60 * 1000, // Refetch every minute
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useTempoHistory = (region: string, limit?: number) => {
  return useQuery({
    queryKey: ['tempo-history', region, limit],
    queryFn: () => tempoService.getHistory(region, limit),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Weather Hooks
export const useWeatherLatest = (region: string) => {
  return useQuery({
    queryKey: ['weather-latest', region],
    queryFn: () => weatherService.getLatest(region),
    refetchInterval: 60 * 1000, // Refetch every minute
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Dashboard Hooks
export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardService.getOverview,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 15 * 1000, // 15 seconds
  });
};

// System Hooks
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: systemService.healthCheck,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 10 * 1000, // 10 seconds
  });
};

// Global Air Quality Hooks
export const useGlobalAirQuality = () => {
  return useQuery({
    queryKey: ['global-air-quality'],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001${API_ENDPOINTS.GLOBAL_AIR_QUALITY}`);
      if (!response.ok) throw new Error('Failed to fetch global air quality data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useOpenAQData = (country: string) => {
  return useQuery({
    queryKey: ['openaq-data', country],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001${API_ENDPOINTS.OPENAQ_DATA(country)}`);
      if (!response.ok) throw new Error('Failed to fetch OpenAQ data');
      return response.json();
    },
    enabled: !!country,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUAEAirQuality = () => {
  return useQuery({
    queryKey: ['uae-air-quality'],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001${API_ENDPOINTS.UAE_AIR_QUALITY}`);
      if (!response.ok) throw new Error('Failed to fetch UAE air quality data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
