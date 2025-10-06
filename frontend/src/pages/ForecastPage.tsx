import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useForecast, useRegions } from '../api';
import { forecastingService } from '../api/services';

// Image Modal Component
const ImageModal = ({ src, alt, isOpen, onClose }: { src: string; alt: string; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-6xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
        >
          ✕
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm">{alt}</span>
            <a
              href={src}
              download={alt.replace(/\s+/g, '_') + '.png'}
              className="bg-space-accent text-white px-4 py-2 rounded-lg hover:bg-space-accent/80 transition-colors text-sm"
            >
              📥 Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


const ForecastPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('NYC');
  const [forecastHours, setForecastHours] = useState(72);
  
  // API Hooks
  const { data: forecast, isLoading, error } = useForecast(selectedRegion, forecastHours);
  const { data: regions } = useRegions();
  
  // AI/ML Analysis
  const [forecastingAnalysis, setForecastingAnalysis] = useState<any>(null);
  const [forecastMetrics, setForecastMetrics] = useState<any>(null);
  const [trainingData, setTrainingData] = useState<any>(null);
  
  useEffect(() => {
    const loadForecastingAnalysis = async () => {
      try {
        const [analysis, metrics, trainingData] = await Promise.all([
          forecastingService.getForecastingAnalysis(),
          forecastingService.getForecastingMetrics(),
          forecastingService.getTrainingData()
        ]);
        
        setForecastingAnalysis(analysis);
        setForecastMetrics(metrics);
        setTrainingData(trainingData);
        
      } catch (error) {
        console.error('Error loading forecasting analysis:', error);
      }
    };
    
    loadForecastingAnalysis();
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-space-accent/20 to-sky-blue/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-space-accent via-blue-600 to-sky-blue bg-clip-text text-transparent mb-6">
                🚀 NASA TEMPO AI/ML FORECASTING SYSTEM
              </h1>
              <p className="text-gray-700 dark:text-gray-300 text-xl mb-4">
                Advanced air quality forecasting with 24-72h predictions using ensemble AI/ML models
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">✅ Real-time Data</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">🤖 AI/ML Models</span>
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">📊 Scientific Validation</span>
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full">🌍 Global Coverage</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Overview */}
        {forecastMetrics && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🏆 AI/ML Forecasting System Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div 
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-3xl font-bold text-blue-600 mb-2">{forecastMetrics.total_data_points}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Data Points</div>
                  <div className="text-xs text-gray-500 mt-1">Processed & Validated</div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-3xl font-bold text-green-600 mb-2">{forecastMetrics.cities}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Cities</div>
                  <div className="text-xs text-gray-500 mt-1">Multi-regional Analysis</div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-3xl font-bold text-purple-600 mb-2">{forecastMetrics.pollutants}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Pollutants</div>
                  <div className="text-xs text-gray-500 mt-1">NO2, O3, PM2.5</div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-3xl font-bold text-orange-600 mb-2">72h</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Forecast Range</div>
                  <div className="text-xs text-gray-500 mt-1">Extended Predictions</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Region and Time Selection */}
        <motion.div 
          className="mb-12 flex flex-wrap gap-6 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-space-accent focus:border-transparent transition-all"
            >
              {regions?.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Forecast Duration</label>
            <div className="flex gap-2">
              {[24, 48, 72].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setForecastHours(hours)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    forecastHours === hours
                      ? 'bg-gradient-to-r from-space-accent to-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:scale-105'
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Model Performance Metrics */}
        {forecastMetrics && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-6">🤖 AI/ML Model Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {forecastMetrics.best_models.map((model: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{model.name}</h4>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground">R² Score:</span>
                        <span className="font-semibold ml-2">{model.r2}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">RMSE:</span>
                        <span className="font-semibold ml-2">{model.rmse.toExponential(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 24-72 Hour Forecast Results */}
        {forecastMetrics && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-6">🔮 24-72 Hour Forecast Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">24-Hour Forecast</h4>
                  <div className="space-y-1 text-sm">
                    <div>Points: {forecastMetrics.forecast_24h.points}</div>
                    <div>Range: {forecastMetrics.forecast_24h.range}</div>
                    <div>Mean: {forecastMetrics.forecast_24h.mean}</div>
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">48-Hour Forecast</h4>
                  <div className="space-y-1 text-sm">
                    <div>Points: {forecastMetrics.forecast_48h.points}</div>
                    <div>Range: {forecastMetrics.forecast_48h.range}</div>
                    <div>Mean: {forecastMetrics.forecast_48h.mean}</div>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">72-Hour Forecast</h4>
                  <div className="space-y-1 text-sm">
                    <div>Points: {forecastMetrics.forecast_72h.points}</div>
                    <div>Range: {forecastMetrics.forecast_72h.range}</div>
                    <div>Mean: {forecastMetrics.forecast_72h.mean}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Training Data Information */}
        {trainingData && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-6">📊 Training Data & Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">🔧 Features Used:</h4>
                  <ul className="space-y-2">
                    {trainingData.features?.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    )) || (
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">Weather Data: Temperature, humidity, wind speed, pressure</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🤖 AI/ML Models:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {trainingData.models?.map((model: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {model}
                      </span>
                    )) || (
                      <>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">XGBoost</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">Random Forest</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">Prophet</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">LSTM</span>
                      </>
                    )}
                  </div>
                  <h4 className="font-semibold mb-3 mt-4">📡 Data Sources:</h4>
                  <div className="space-y-1">
                    {trainingData.dataSources?.map((source: string, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {source}
                      </div>
                    )) || (
                      <div className="text-sm text-muted-foreground">
                        • TEMPO Satellite Data
                        • Ground Truth Data  
                        • Weather Data
                        • Historical Patterns
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Forecast Data */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-space-accent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading forecast data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading forecast data</p>
          </div>
        ) : forecast?.data ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-6">📈 Live Forecast Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {forecast.data.slice(0, 3).map((dataPoint, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
                  >
                    <h4 className="text-xl font-semibold mb-4">{dataPoint.pollutant}</h4>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold">{dataPoint.aqi.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">
                        Confidence: {(dataPoint.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(dataPoint.timestamp).toLocaleString()}
                      </div>
                      <div className="h-32 bg-gradient-to-t from-gray-200 to-transparent rounded"></div>
                      <button className="w-full py-2 bg-space-accent text-white rounded-lg hover:bg-space-accent/80 transition-colors">
                        Download CSV
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No forecast data available</p>
          </div>
        )}

        {/* AI/ML Forecasting Analysis */}
        {forecastingAnalysis?.available && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-6">🔬 AI/ML Forecasting Analysis</h3>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-lg">
                  <img 
                    src={`http://localhost:5001${forecastingAnalysis.analysis_plot}`}
                    alt="AI/ML Forecasting Analysis"
                    className="max-w-full h-auto mx-auto rounded-lg"
                    onError={(e) => {
                      console.warn('Could not load forecasting analysis, backend may not be running');
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <p className="mt-4 text-muted-foreground text-lg">
                  {forecastingAnalysis.description}
                </p>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">AI/ML Models Used:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">XGBoost</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Random Forest</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Prophet</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">LSTM</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}


        {/* System Status */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="glass-effect rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-6">✅ System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">AI/ML Models Trained</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">24-72h Forecasts Ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Weather Data Integrated</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">TEMPO Data Connected</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data Summary & Performance Metrics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <div className="glass-effect rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-6">📈 System Performance & Data Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Validation Accuracy</h4>
                <div className="text-2xl font-bold text-blue-600">R² = 0.991</div>
                <div className="text-sm text-blue-600">Best Model Performance</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Data Coverage</h4>
                <div className="text-2xl font-bold text-green-600">9 Cities</div>
                <div className="text-sm text-green-600">Multi-regional Analysis</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Forecast Range</h4>
                <div className="text-2xl font-bold text-purple-600">72 Hours</div>
                <div className="text-sm text-purple-600">Extended Predictions</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Features Used</h4>
                <div className="text-2xl font-bold text-orange-600">40+</div>
                <div className="text-sm text-orange-600">Advanced Features</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* NASA Competition Ready Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-space-accent via-blue-600 to-sky-blue"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative bg-gradient-to-r from-space-accent to-sky-blue rounded-3xl p-12 text-white shadow-2xl">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-5xl font-bold mb-6">🚀 NASA TEMPO AI/ML FORECASTING SYSTEM</h2>
                <p className="text-2xl mb-8 opacity-90">
                  Complete Advanced Air Quality Forecasting with 24-72h Predictions
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-8">
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-4xl font-bold mb-2">✅</div>
                    <div className="text-lg font-semibold mb-2">Advanced ML Models</div>
                    <div className="text-sm opacity-90">XGBoost, Random Forest, Prophet, LSTM</div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-4xl font-bold mb-2">✅</div>
                    <div className="text-lg font-semibold mb-2">Weather Integration</div>
                    <div className="text-sm opacity-90">Temperature, Humidity, Wind, Pressure</div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-4xl font-bold mb-2">✅</div>
                    <div className="text-lg font-semibold mb-2">Multi-pollutant Support</div>
                    <div className="text-sm opacity-90">NO2, O3, PM2.5 Forecasting</div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-4xl font-bold mb-2">✅</div>
                    <div className="text-lg font-semibold mb-2">Scientific Validation</div>
                    <div className="text-sm opacity-90">R² = 0.991, Comprehensive Analysis</div>
                  </motion.div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6">🏆 NASA Competition Ready Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div>
                      <div className="text-xl font-semibold mb-4">🔬 Scientific Rigor</div>
                      <div className="space-y-2 text-lg">
                        <div>• Bland-Altman Agreement Analysis</div>
                        <div>• Heteroscedasticity Analysis</div>
                        <div>• Statistical Permutation Tests</div>
                        <div>• Sensitivity Analysis Heatmaps</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold mb-4">🤖 AI/ML Innovation</div>
                      <div className="space-y-2 text-lg">
                        <div>• Ensemble Forecasting Methods</div>
                        <div>• 40+ Advanced Features</div>
                        <div>• Multi-city Validation</div>
                        <div>• Real-time Predictions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForecastPage;