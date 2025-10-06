import { motion } from 'framer-motion';
import { useState } from 'react';
import InteractiveMap from '../components/maps/InteractiveMap';
import AQChart from '../components/charts/AQChart';
import { useCurrentAQI, useSystemHealth } from '../api';

const DashboardPage = () => {
  const [selectedRegion] = useState('NYC');
  
  // API Hooks
  const { data: currentAQI, isLoading: aqiLoading } = useCurrentAQI(selectedRegion);
  const { data: systemHealth } = useSystemHealth();

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-space-accent to-sky-blue rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-white">CS</span>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-space-accent to-sky-blue bg-clip-text text-transparent">
                CleanSkies AI
              </h1>
              <p className="text-lg text-muted-foreground">
                NASA Space Apps Challenge 2025
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Real-time global air quality monitoring powered by NASA TEMPO satellite data, 
            integrated with OpenAQ, AirNow, and UAE Air Quality APIs for comprehensive 
            environmental intelligence
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Map */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect rounded-lg p-6 h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Global Air Quality Map</h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
              </div>
              <InteractiveMap />
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Data Freshness */}
            <div className="glass-effect rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                Data Sources
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>NASA TEMPO</span>
                  </div>
                  <span className={systemHealth?.data_loaded?.tempo_data ? "text-green-500 font-medium" : "text-red-500"}>
                    {systemHealth?.data_loaded?.tempo_data ? "Live" : "Offline"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>OpenAQ</span>
                  </div>
                  <span className="text-green-500 font-medium">Live</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span>UAE Air Quality</span>
                  </div>
                  <span className="text-green-500 font-medium">Live</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span>AirNow</span>
                  </div>
                  <span className="text-green-500 font-medium">Live</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                    <span>Ground Stations</span>
                  </div>
                  <span className={systemHealth?.data_loaded?.ground_data ? "text-green-500 font-medium" : "text-red-500"}>
                    {systemHealth?.data_loaded?.ground_data ? "Active" : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-effect rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                Global Overview
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-space-accent mb-1">
                    {aqiLoading ? "..." : currentAQI?.aqi || "45"}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Global AQI</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-green-500/10 rounded-lg">
                    <div className="font-semibold text-green-500">13</div>
                    <div className="text-xs text-muted-foreground">Cities Monitored</div>
                  </div>
                  <div className="text-center p-2 bg-blue-500/10 rounded-lg">
                    <div className="font-semibold text-blue-500">5</div>
                    <div className="text-xs text-muted-foreground">Data Sources</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Last Update</span>
                  <span className="font-semibold text-space-accent">
                    {currentAQI?.timestamp ? new Date(currentAQI.timestamp).toLocaleTimeString() : "Live"}
                  </span>
                </div>
              </div>
            </div>

            {/* Layer Controls */}
            <div className="glass-effect rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></div>
                Data Layers
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'TEMPO NO₂', active: true, color: 'bg-green-500' },
                  { name: 'TEMPO HCHO', active: true, color: 'bg-blue-500' },
                  { name: 'TEMPO O₃', active: true, color: 'bg-yellow-500' },
                  { name: 'OpenAQ Data', active: true, color: 'bg-blue-500' },
                  { name: 'UAE Air Quality', active: true, color: 'bg-purple-500' },
                  { name: 'AirNow Data', active: true, color: 'bg-orange-500' },
                ].map((layer, index) => (
                  <label key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked={layer.active}
                      className="rounded accent-space-accent"
                    />
                    <div className={`w-3 h-3 rounded-full ${layer.color}`}></div>
                    <span className="text-sm font-medium">{layer.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="glass-effect rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Air Quality Trends</h2>
            <AQChart />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
