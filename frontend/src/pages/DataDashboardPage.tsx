import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSystemHealth } from '../api';
import { validationService, forecastingService } from '../api/services';
import DataVisualization from '../components/data/DataVisualization';

const DataDashboardPage = () => {
  const { data: systemHealth } = useSystemHealth();
  const [dataStatus, setDataStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDataStatus = async () => {
      try {
        const [validation, forecasting] = await Promise.all([
          validationService.getDetailedValidation(),
          forecastingService.getForecastingAnalysis()
        ]);
        
        setDataStatus({
          validation: validation ? 'Available' : 'Not Available',
          forecasting: forecasting?.available ? 'Available' : 'Not Available',
          systemHealth: systemHealth
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading data status:', error);
        setLoading(false);
      }
    };

    loadDataStatus();
  }, [systemHealth]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-space-accent mx-auto mb-4"></div>
          <p className="text-xl">Loading NASA TEMPO data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-space-accent to-sky-blue bg-clip-text text-transparent mb-4">
            NASA TEMPO Data Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time validation results, AI/ML forecasting, and comprehensive analysis
          </p>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="glass-effect rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {systemHealth?.data_loaded?.ground_data ? '✅' : '❌'}
                </div>
                <div className="text-sm text-muted-foreground">Ground Data</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {systemHealth?.data_loaded?.tempo_data ? '✅' : '❌'}
                </div>
                <div className="text-sm text-muted-foreground">TEMPO Data</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {systemHealth?.data_loaded?.weather_data ? '✅' : '❌'}
                </div>
                <div className="text-sm text-muted-foreground">Weather Data</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {systemHealth?.data_loaded?.validation_results ? '✅' : '❌'}
                </div>
                <div className="text-sm text-muted-foreground">Validation Results</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data Status */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="glass-effect rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Data Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Validation Results</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    dataStatus?.validation === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {dataStatus?.validation || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">AI/ML Forecasting</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    dataStatus?.forecasting === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {dataStatus?.forecasting || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">System Health</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    systemHealth?.status === 'healthy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {systemHealth?.status || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Last Update</span>
                  <span className="text-muted-foreground">
                    {systemHealth?.timestamp ? new Date(systemHealth.timestamp).toLocaleString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comprehensive Data Visualization */}
        <DataVisualization />
      </div>
    </div>
  );
};

export default DataDashboardPage;
