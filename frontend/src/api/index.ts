// API Integration Layer - CleanSkies AI
// =====================================
// Centralized API management for NASA TEMPO Air Quality Dashboard

export { default as apiClient } from './client';
export * from './endpoints';
export * from './services';
export * from './hooks';

// Re-export commonly used services for convenience
export {
  airQualityService,
  validationService,
  forecastingService,
  healthService,
  policyService,
  gameService,
  systemService,
} from './services';

// Re-export commonly used hooks for convenience
export {
  useCurrentAQI,
  useForecast,
  useRegions,
  usePollutants,
  useValidation,
  useRunValidation,
  useRunForecasting,
  useHealthRisk,
  useHotspots,
  useSubmitScore,
  useLeaderboard,
  useSystemHealth,
} from './hooks';
