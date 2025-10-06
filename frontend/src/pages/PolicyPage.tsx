import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

// Enhanced Image Modal Component
const ImageModal = ({ src, alt, isOpen, onClose }: { src: string; alt: string; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-6xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain rounded-2xl"
        />
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

const PolicyPage = () => {
  const { t } = useTranslation();
  const [selectedPolicy, setSelectedPolicy] = useState('sensitivity');

  // Policy impact data
  const policyData = {
    sensitivity: {
      title: "Sensitivity Analysis Heatmap",
      description: "Advanced sensitivity analysis showing how different policy parameters affect air quality predictions across various regions",
      image: "/api/assets/sensitivity_heatmap.png",
      metrics: [
        { parameter: "Industrial Emission Limits", impact: "High", confidence: "95%" },
        { parameter: "Vehicle Emission Standards", impact: "High", confidence: "92%" },
        { parameter: "Green Space Requirements", impact: "Medium", confidence: "88%" },
        { parameter: "Traffic Management", impact: "Medium", confidence: "85%" },
        { parameter: "Construction Regulations", impact: "Low", confidence: "78%" }
      ]
    },
    environmental: {
      title: "Environmental Justice Impact",
      description: "Policy impact analysis focusing on vulnerable communities and environmental justice",
      image: "/api/assets/environmental_justice.png",
      metrics: [
        { parameter: "Low-Income Communities", impact: "Critical", confidence: "98%" },
        { parameter: "Minority Populations", impact: "High", confidence: "94%" },
        { parameter: "Children & Elderly", impact: "High", confidence: "91%" },
        { parameter: "Industrial Workers", impact: "Medium", confidence: "87%" }
      ]
    },
    economic: {
      title: "Economic Impact Assessment",
      description: "Cost-benefit analysis of policy interventions and their economic implications",
      image: "/api/assets/economic_impact.png",
      metrics: [
        { parameter: "Healthcare Cost Reduction", impact: "High", confidence: "93%" },
        { parameter: "Productivity Gains", impact: "Medium", confidence: "89%" },
        { parameter: "Implementation Costs", impact: "Variable", confidence: "85%" },
        { parameter: "Long-term Benefits", impact: "High", confidence: "91%" }
      ]
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 bg-clip-text text-transparent mb-6">
            🏛️ Policy Impact Center
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            AI-Powered Environmental Policy Analysis & Impact Assessment
          </p>
          
          {/* NASA Competition Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 rounded-full text-white font-bold text-lg shadow-2xl">
            🚀 NASA Space Apps 2025 - Policy Innovation
          </div>
        </motion.div>

        {/* Policy Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">📊 Policy Analysis Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(policyData).map(([key, policy]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPolicy(key)}
                  className={`p-6 rounded-xl transition-all duration-300 ${
                    selectedPolicy === key
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30 hover:scale-105'
                  }`}
                >
                  <div className="text-3xl mb-3">
                    {key === 'sensitivity' && '🔬'}
                    {key === 'environmental' && '⚖️'}
                    {key === 'economic' && '💰'}
                  </div>
                  <div className="text-lg font-semibold mb-2">{policy.title}</div>
                  <div className="text-sm opacity-75">{policy.description}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Analysis Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">
              {policyData[selectedPolicy as keyof typeof policyData].title}
            </h2>
            <p className="text-lg text-gray-300 text-center mb-8">
              {policyData[selectedPolicy as keyof typeof policyData].description}
            </p>
            
            {/* Sensitivity Heatmap */}
            <div className="flex justify-center mb-8">
              <ImageCard
                src={`http://localhost:5001${policyData[selectedPolicy as keyof typeof policyData].image}`}
                alt={policyData[selectedPolicy as keyof typeof policyData].title}
                title={policyData[selectedPolicy as keyof typeof policyData].title}
                description={policyData[selectedPolicy as keyof typeof policyData].description}
              />
            </div>

            {/* Metrics Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policyData[selectedPolicy as keyof typeof policyData].metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white/10 rounded-xl p-6"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-semibold">{metric.parameter}</span>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      metric.impact === 'High' || metric.impact === 'Critical' ? 'bg-red-500/30 text-red-300' :
                      metric.impact === 'Medium' ? 'bg-yellow-500/30 text-yellow-300' :
                      'bg-green-500/30 text-green-300'
                    }`}>
                      {metric.impact}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    <strong>Confidence:</strong> {metric.confidence}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.impact === 'High' || metric.impact === 'Critical' ? 'bg-red-500' :
                        metric.impact === 'Medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ 
                        width: `${parseInt(metric.confidence)}%` 
                      }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Critical Zones Analysis */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">🎯 Critical Impact Zones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Industrial District', aqi: 145, risk: 'High', population: '15,000', priority: 'Critical' },
                { name: 'Downtown Core', aqi: 128, risk: 'High', population: '25,000', priority: 'Critical' },
                { name: 'Airport Vicinity', aqi: 112, risk: 'Moderate', population: '8,000', priority: 'High' },
                { name: 'Port Area', aqi: 98, risk: 'Moderate', population: '12,000', priority: 'High' },
                { name: 'Highway Corridor', aqi: 89, risk: 'Moderate', population: '18,000', priority: 'Medium' },
                { name: 'Residential Zone A', aqi: 75, risk: 'Low', population: '30,000', priority: 'Medium' }
              ].map((zone, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="bg-white/10 rounded-xl p-6 hover:bg-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{zone.name}</h3>
                      <div className="text-sm text-gray-300">Population: {zone.population}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{zone.aqi}</div>
                      <div className="text-sm text-gray-300">AQI</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-300">Risk Level:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      zone.risk === 'High' ? 'bg-red-500/30 text-red-300' : 
                      zone.risk === 'Moderate' ? 'bg-yellow-500/30 text-yellow-300' : 
                      'bg-green-500/30 text-green-300'
                    }`}>
                      {zone.risk}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Priority:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      zone.priority === 'Critical' ? 'bg-red-500/30 text-red-300' : 
                      zone.priority === 'High' ? 'bg-orange-500/30 text-orange-300' : 
                      'bg-yellow-500/30 text-yellow-300'
                    }`}>
                      {zone.priority}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl">
            📊 Generate Policy Report
          </button>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl">
            📧 Export Analysis
          </button>
          <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl">
            🎯 Policy Recommendations
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PolicyPage;
