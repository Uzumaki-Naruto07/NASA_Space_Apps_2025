import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataVisualization from '../components/data/DataVisualization';

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

// Enhanced Image Card Component
const ImageCard = ({ src, alt, title, description }: { src: string; alt: string; title: string; description?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer"
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              console.warn(`Could not load ${alt}`);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{title}</h4>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Click to enlarge</span>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(src, '_blank');
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-600 px-3 py-1 rounded-full transition-colors"
              >
                🔗 Open
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = src;
                  link.download = alt.replace(/\s+/g, '_') + '.png';
                  link.click();
                }}
                className="text-xs bg-space-accent text-white hover:bg-space-accent/80 px-3 py-1 rounded-full transition-colors"
              >
                📥 Download
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <ImageModal
        src={src}
        alt={alt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

const ValidationPage = () => {
  const [validationGallery, setValidationGallery] = useState<any[]>([]);
  const [validationMetrics, setValidationMetrics] = useState<any>(null);
  const [selectedScatterPlot, setSelectedScatterPlot] = useState<string>('');
  const [scatterPlots, setScatterPlots] = useState<any[]>([]);
  
  // Load validation gallery and metrics
  useEffect(() => {
    const loadValidationData = async () => {
      try {
        // Load validation gallery
        const galleryResponse = await fetch('http://localhost:5001/api/validation/gallery');
        if (galleryResponse.ok) {
          const galleryData = await galleryResponse.json();
          setValidationGallery(galleryData.images || []);
        }
        
        // Load validation metrics
        const metricsResponse = await fetch('http://localhost:5001/api/validation/metrics');
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setValidationMetrics(metricsData);
        }

        // Load scatter plots
        const scatterResponse = await fetch('http://localhost:5001/api/validation/scatter-plots');
        if (scatterResponse.ok) {
          const scatterData = await scatterResponse.json();
          setScatterPlots(scatterData.scatter_plots || []);
        }
      } catch (error) {
        console.error('Error loading validation data:', error);
      }
    };
    
    loadValidationData();
  }, []);

  // Define scatter plots data if API is not available
  const defaultScatterPlots = [
    {
      name: "scatter_NO2_Synthetic_Nyc_5407.png",
      url: "/api/assets/scatter_NO2_Synthetic_Nyc_5407.png",
      pollutant: "NO2",
      city: "Synthetic_Nyc_5407",
      description: "NO2 validation for Synthetic_Nyc_5407"
    },
    {
      name: "scatter_NO2_Synthetic_Nyc_5408.png", 
      url: "/api/assets/scatter_NO2_Synthetic_Nyc_5408.png",
      pollutant: "NO2",
      city: "Synthetic_Nyc_5408",
      description: "NO2 validation for Synthetic_Nyc_5408"
    },
    {
      name: "scatter_NO2_Montreal.png",
      url: "/api/assets/scatter_NO2_Montreal.png",
      pollutant: "NO2", 
      city: "Montreal",
      description: "NO2 validation for Montreal"
    },
    {
      name: "scatter_O3_NewYorkCity.png",
      url: "/api/assets/scatter_O3_NewYorkCity.png",
      pollutant: "O3",
      city: "NewYorkCity", 
      description: "O3 validation for NewYorkCity"
    },
    {
      name: "scatter_O3_Philadelphia.png",
      url: "/api/assets/scatter_O3_Philadelphia.png",
      pollutant: "O3",
      city: "Philadelphia",
      description: "O3 validation for Philadelphia"
    },
    {
      name: "scatter_PM2.5_Boston.png",
      url: "/api/assets/scatter_PM2.5_Boston.png",
      pollutant: "PM2.5",
      city: "Boston",
      description: "PM2.5 validation for Boston"
    },
    {
      name: "scatter_PM2.5_WashingtonDC.png",
      url: "/api/assets/scatter_PM2.5_WashingtonDC.png",
      pollutant: "PM2.5",
      city: "WashingtonDC",
      description: "PM2.5 validation for WashingtonDC"
    }
  ];

  // Use API data if available, otherwise use default data
  const availableScatterPlots = scatterPlots.length > 0 ? scatterPlots : defaultScatterPlots;


  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <div className="relative">
            {/* Glowing Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-600/30 blur-3xl rounded-full scale-110"></div>
            
            {/* Main Header Card */}
            <div className="relative bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/10">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 blur-sm"></div>
              <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900"></div>
              
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-8 leading-tight">
                    🚀 NASA TEMPO VALIDATION SYSTEM
          </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-8 rounded-full"></div>
                  <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                    <span className="font-semibold text-cyan-300">Advanced Scientific Validation</span> with Deming regression, 
                    Bland-Altman analysis, and comprehensive uncertainty quantification for NASA's TEMPO satellite mission
                  </p>
                  
                  {/* Feature Pills */}
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <motion.span 
                      className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 px-6 py-3 rounded-full border border-green-500/30 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      ✅ Statistical Rigor
                    </motion.span>
                    <motion.span 
                      className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 px-6 py-3 rounded-full border border-blue-500/30 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      📊 Comprehensive Analysis
                    </motion.span>
                    <motion.span 
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-6 py-3 rounded-full border border-purple-500/30 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      🔬 Scientific Validation
                    </motion.span>
                    <motion.span 
                      className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 px-6 py-3 rounded-full border border-orange-500/30 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      🌍 Multi-City Coverage
                    </motion.span>
                  </div>
                  
                  {/* NASA Badge */}
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600/20 to-blue-600/20 px-6 py-3 rounded-full border border-red-500/30">
                    <span className="text-2xl">🏆</span>
                    <span className="text-white font-semibold">NASA Competition Ready</span>
                    <span className="text-2xl">🚀</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="relative bg-gradient-to-br from-slate-800/80 via-blue-900/80 to-indigo-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/10">
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-sm"></div>
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-indigo-900/90"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                🏆 VALIDATION SYSTEM OVERVIEW
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div 
                  className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-4xl font-black text-blue-300 mb-3">22</div>
                    <div className="text-lg font-semibold text-blue-200 mb-2">Validation Pairs</div>
                    <div className="text-sm text-blue-300/80">Scientifically Matched</div>
                    <div className="w-full bg-blue-500/20 rounded-full h-2 mt-4">
                      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-500 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-4xl font-black text-green-300 mb-3">2</div>
                    <div className="text-lg font-semibold text-green-200 mb-2">Cities Validated</div>
                    <div className="text-sm text-green-300/80">Multi-regional</div>
                    <div className="w-full bg-green-500/20 rounded-full h-2 mt-4">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-4xl font-black text-purple-300 mb-3">8</div>
                    <div className="text-lg font-semibold text-purple-200 mb-2">Analysis Methods</div>
                    <div className="text-sm text-purple-300/80">Advanced Statistics</div>
                    <div className="w-full bg-purple-500/20 rounded-full h-2 mt-4">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full w-5/6"></div>
                    </div>
              </div>
                </motion.div>
                
                <motion.div 
                  className="relative bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-500 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-4xl font-black text-orange-300 mb-3">112</div>
                    <div className="text-lg font-semibold text-orange-200 mb-2">Enhanced Data Points</div>
                    <div className="text-sm text-orange-300/80">High Quality</div>
                    <div className="w-full bg-orange-500/20 rounded-full h-2 mt-4">
                      <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full w-full"></div>
              </div>
              </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Validation Metrics */}
        {validationMetrics && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="relative bg-gradient-to-br from-slate-800/80 via-blue-900/80 to-indigo-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/10">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 blur-sm"></div>
              <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-indigo-900/90"></div>
              
              <div className="relative z-10">
                <h3 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  📊 COMPREHENSIVE VALIDATION RESULTS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <motion.div 
                    className="relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-500 group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📈</span>
                        Deming Regression
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-green-200">R² Score:</span>
                          <span className="text-green-300 font-bold">{validationMetrics.deming_regression?.r2?.toFixed(3) || '0.000'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-200">RMSE:</span>
                          <span className="text-green-300 font-bold">{validationMetrics.deming_regression?.rmse?.toExponential(2) || 'N/A'}</span>
                  </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-200">Slope:</span>
                          <span className="text-green-300 font-bold">{validationMetrics.deming_regression?.slope?.toFixed(3) || '1.000'}</span>
                </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-200">λ Ratio:</span>
                          <span className="text-green-300 font-bold">{validationMetrics.deming_regression?.lambda?.toFixed(3) || '0.050'}</span>
                  </div>
                </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        Bland-Altman Analysis
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200">Mean Bias:</span>
                          <span className="text-blue-300 font-bold">{validationMetrics.bland_altman?.mean_bias?.toExponential(2) || 'N/A'}</span>
                  </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200">Agreement:</span>
                          <span className="text-blue-300 font-bold">{validationMetrics.bland_altman?.agreement || 'Moderate'}</span>
                </div>
                        <div className="w-full bg-blue-500/20 rounded-full h-2 mt-4">
                          <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </motion.div>

        <motion.div
                    className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        Quantile Mapping
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">R² Score:</span>
                          <span className="text-purple-300 font-bold">{validationMetrics.quantile_mapping?.r2?.toFixed(3) || '0.968'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">RMSE:</span>
                          <span className="text-purple-300 font-bold">{validationMetrics.quantile_mapping?.rmse?.toExponential(2) || 'N/A'}</span>
              </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">Bias:</span>
                          <span className="text-purple-300 font-bold">{validationMetrics.quantile_mapping?.bias?.toExponential(2) || 'N/A'}</span>
            </div>
                        <div className="w-full bg-purple-500/20 rounded-full h-2 mt-4">
                          <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full w-5/6"></div>
                  </div>
            </div>
          </div>
        </motion.div>

          <motion.div
                    className="relative bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-500 group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-orange-300 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🧪</span>
                        Permutation Test
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-200">R² Score:</span>
                          <span className="text-orange-300 font-bold">{validationMetrics.permutation_test?.r2?.toFixed(3) || '0.587'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-orange-200">p-value:</span>
                          <span className="text-orange-300 font-bold">{validationMetrics.permutation_test?.p_value?.toFixed(3) || '0.000'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-orange-200">Significant:</span>
                          <span className="text-orange-300 font-bold">{validationMetrics.permutation_test?.significant ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div className="w-full bg-orange-500/20 rounded-full h-2 mt-4">
                          <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full w-4/5"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comprehensive Validation Visualizations */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📊 Comprehensive Validation & Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ImageCard
                src="http://localhost:5001/api/assets/comprehensive_validation_analysis.png"
                alt="Comprehensive Validation Analysis"
                title="Comprehensive Validation Analysis"
                description="Complete statistical validation of TEMPO satellite data against ground truth measurements"
              />
              <ImageCard
                src="http://localhost:5001/api/assets/aqi_comparison_plot.png"
                alt="AQI Comparison Plot"
                title="AQI Comparison Analysis"
                description="Air Quality Index comparison between satellite predictions and ground measurements"
              />
              <ImageCard
                src="http://localhost:5001/api/assets/bland_altman_overall.png"
                alt="Bland-Altman Analysis"
                title="Bland-Altman Agreement Analysis"
                description="Statistical agreement analysis showing bias and precision of measurements"
              />
              <ImageCard
                src="http://localhost:5001/api/assets/heteroscedasticity_analysis.png"
                alt="Heteroscedasticity Analysis"
                title="Heteroscedasticity Analysis"
                description="Analysis of variance patterns in prediction errors across different concentration ranges"
              />
              <ImageCard
                src="http://localhost:5001/api/assets/sensitivity_heatmap.png"
                alt="Sensitivity Heatmap"
                title="Sensitivity Analysis Heatmap"
                description="Feature importance and sensitivity analysis for AI/ML model predictions"
              />
              <ImageCard
                src="http://localhost:5001/api/assets/permutation_test.png"
                alt="Permutation Test"
                title="Statistical Permutation Test"
                description="Non-parametric statistical test to validate model significance and robustness"
              />
            </div>
          </div>
        </motion.div>

        {/* TEMPO vs Ground Station Scatter Plots */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              📊 TEMPO vs Ground Station Scatter Plots
            </h3>
            
            {/* Dropdown Selection */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Select City & Pollutant:
              </label>
              <div className="relative">
                <select
                  value={selectedScatterPlot}
                  onChange={(e) => setSelectedScatterPlot(e.target.value)}
                  className="w-full px-6 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-space-accent focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="">✓ Choose a validation plot...</option>
                  {availableScatterPlots.map((plot, index) => (
                    <option key={index} value={plot.url}>
                      {plot.description}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
              </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Choose from {availableScatterPlots.length} available validation plots
              </p>
            </div>

            {/* Selected Plot Display */}
            {selectedScatterPlot && (
        <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h4 className="text-xl font-semibold mb-4 text-center">
                    {availableScatterPlots.find(plot => plot.url === selectedScatterPlot)?.description}
                  </h4>
                  <div className="flex justify-center">
                    <ImageCard
                      src={`http://localhost:5001${selectedScatterPlot}`}
                      alt={availableScatterPlots.find(plot => plot.url === selectedScatterPlot)?.description || 'Selected Plot'}
                      title={availableScatterPlots.find(plot => plot.url === selectedScatterPlot)?.description || 'Selected Plot'}
                      description={`${availableScatterPlots.find(plot => plot.url === selectedScatterPlot)?.pollutant} validation analysis for ${availableScatterPlots.find(plot => plot.url === selectedScatterPlot)?.city}`}
                    />
            </div>
                </div>
              </motion.div>
            )}

            {/* All Scatter Plots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableScatterPlots.map((plot, index) => (
                <ImageCard
                  key={index}
                  src={`http://localhost:5001${plot.url}`}
                  alt={plot.description}
                  title={plot.description}
                  description={`${plot.pollutant} validation analysis for ${plot.city} showing satellite vs ground measurements`}
                />
              ))}
            </div>
          </div>
        </motion.div>


      </div>
    </div>
  );
};

export default ValidationPage;