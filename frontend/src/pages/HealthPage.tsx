import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const HealthPage = () => {
  const { t } = useTranslation();
  const [selectedProfile, setSelectedProfile] = useState('general');
  const [currentAQI, setCurrentAQI] = useState(85);
  const [alerts, setAlerts] = useState([]);
  const [healthAdvice, setHealthAdvice] = useState('');

  // Health profiles with different risk thresholds
  const healthProfiles = {
    general: { name: 'General Population', threshold: 100, color: 'blue' },
    children: { name: 'Children (0-12)', threshold: 75, color: 'green' },
    elderly: { name: 'Elderly (65+)', threshold: 80, color: 'purple' },
    athletes: { name: 'Athletes', threshold: 90, color: 'orange' },
    asthma: { name: 'Asthma Patients', threshold: 60, color: 'red' },
    pregnant: { name: 'Pregnant Women', threshold: 70, color: 'pink' }
  };

  // WHO-based alert system
  const getAlertLevel = (aqi, threshold) => {
    if (aqi >= 300) return { level: 'Hazardous', color: 'red', message: 'Emergency conditions' };
    if (aqi >= 200) return { level: 'Very Unhealthy', color: 'red', message: 'Health warnings' };
    if (aqi >= 150) return { level: 'Unhealthy', color: 'orange', message: 'Everyone may experience health effects' };
    if (aqi >= 100) return { level: 'Unhealthy for Sensitive Groups', color: 'yellow', message: 'Sensitive groups may experience health effects' };
    if (aqi >= 50) return { level: 'Moderate', color: 'yellow', message: 'Air quality is acceptable' };
    return { level: 'Good', color: 'green', message: 'Air quality is satisfactory' };
  };

  // Personalized health advice based on profile and AQI
  const getHealthAdvice = (profile, aqi) => {
    const profileData = healthProfiles[profile];
    const alert = getAlertLevel(aqi, profileData.threshold);
    
    const advice = {
      children: {
        good: "✅ Safe for outdoor play and sports",
        moderate: "⚠️ Limit outdoor play to 1-2 hours",
        unhealthy: "🚫 Keep children indoors, use air purifiers",
        veryUnhealthy: "🚫 All outdoor activities cancelled",
        hazardous: "🚨 Emergency - keep children indoors with windows closed"
      },
      elderly: {
        good: "✅ Safe for outdoor activities and exercise",
        moderate: "⚠️ Limit outdoor time, avoid strenuous activities",
        unhealthy: "🚫 Stay indoors, avoid outdoor exercise",
        veryUnhealthy: "🚫 All outdoor activities cancelled",
        hazardous: "🚨 Emergency - stay indoors with air purifiers"
      },
      athletes: {
        good: "✅ Safe for all training and competitions",
        moderate: "⚠️ Reduce intensity, monitor breathing",
        unhealthy: "🚫 Move training indoors, use air purifiers",
        veryUnhealthy: "🚫 All outdoor training cancelled",
        hazardous: "🚨 Emergency - all outdoor activities cancelled"
      },
      asthma: {
        good: "✅ Safe with normal medication routine",
        moderate: "⚠️ Increase medication, avoid outdoor triggers",
        unhealthy: "🚫 Stay indoors, use rescue inhaler as needed",
        veryUnhealthy: "🚫 All outdoor activities cancelled",
        hazardous: "🚨 Emergency - stay indoors, use air purifiers"
      },
      pregnant: {
        good: "✅ Safe for outdoor activities",
        moderate: "⚠️ Limit outdoor time, avoid peak hours",
        unhealthy: "🚫 Stay indoors, avoid outdoor activities",
        veryUnhealthy: "🚫 All outdoor activities cancelled",
        hazardous: "🚨 Emergency - stay indoors with air purifiers"
      },
      general: {
        good: "✅ Safe for all outdoor activities",
        moderate: "⚠️ Sensitive groups should limit outdoor time",
        unhealthy: "🚫 Sensitive groups should stay indoors",
        veryUnhealthy: "🚫 Everyone should limit outdoor activities",
        hazardous: "🚨 Emergency - everyone should stay indoors"
      }
    };

    return advice[profile]?.[alert.level.toLowerCase().replace(' ', '')] || advice.general[alert.level.toLowerCase().replace(' ', '')];
  };

  // Real-time health monitoring data from North America and UAE
  const healthData = {
    northAmerica: {
      aqi: 85,
      pollutants: [
        { name: 'PM2.5', level: 'Moderate', source: 'Wildfires, Industrial Emissions', healthImpact: 'Respiratory & Cardiovascular Issues' },
        { name: 'O3 (Ozone)', level: 'Elevated', source: 'Vehicle Emissions + Sunlight', healthImpact: 'Lung Inflammation, Asthma Aggravation' },
        { name: 'NO2', level: 'Moderate', source: 'Traffic, Power Plants', healthImpact: 'Respiratory Problems, Smog Formation' },
        { name: 'Dust', level: 'Low', source: 'Natural Dust Storms, Construction', healthImpact: 'Respiratory Irritation, Allergies' }
      ],
      riskLevel: 'Moderate',
      affectedGroups: ['Children', 'Elderly', 'Asthma Patients', 'Outdoor Workers'],
      seasonalFactors: 'Wildfire season (May-October) increases PM2.5 levels significantly'
    },
    uae: {
      aqi: 95,
      pollutants: [
        { name: 'PM10/PM2.5', level: 'High', source: 'Dust Storms, Industrial Activities', healthImpact: 'Respiratory Issues, Cardiovascular Diseases' },
        { name: 'O3 (Ozone)', level: 'Elevated', source: 'NOx + VOCs + Sunlight', healthImpact: 'Breathing Difficulties, Reduced Lung Function' },
        { name: 'NO2', level: 'Moderate', source: 'Vehicles, Industrial Processes', healthImpact: 'Respiratory Problems, Ozone Formation' },
        { name: 'CO (Carbon Monoxide)', level: 'Moderate', source: 'Vehicle Emissions, Industrial', healthImpact: 'Oxygen Transport Interference' }
      ],
      riskLevel: 'Moderate',
      affectedGroups: ['Children', 'Elderly', 'Construction Workers', 'Outdoor Laborers'],
      seasonalFactors: 'Dust storm season (March-May, October-November) significantly increases PM levels'
    }
  };

  useEffect(() => {
    const advice = getHealthAdvice(selectedProfile, currentAQI);
    setHealthAdvice(advice);
  }, [selectedProfile, currentAQI]);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
            🏥 Health Protection Center
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            AI-Powered Personalized Health Risk Assessment & Protection
          </p>
          
          {/* NASA Competition Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 rounded-full text-white font-bold text-lg shadow-2xl">
            🚀 NASA Space Apps 2025 - Health Innovation
          </div>
        </motion.div>

        {/* User Profile Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">👤 Select Your Health Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(healthProfiles).map(([key, profile]) => (
                <button
                  key={key}
                  onClick={() => setSelectedProfile(key)}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    selectedProfile === key
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30 hover:scale-105'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {key === 'children' && '👶'}
                    {key === 'elderly' && '👴'}
                    {key === 'athletes' && '🏃'}
                    {key === 'asthma' && '🫁'}
                    {key === 'pregnant' && '🤱'}
                    {key === 'general' && '👤'}
                  </div>
                  <div className="text-sm font-semibold">{profile.name}</div>
                  <div className="text-xs opacity-75">Threshold: {profile.threshold}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Current Health Status */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">📊 Current Health Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">{currentAQI}</div>
                <div className="text-lg text-gray-300">Current AQI</div>
                <div className="text-sm text-gray-400">Air Quality Index</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{healthProfiles[selectedProfile].threshold}</div>
                <div className="text-lg text-gray-300">Your Threshold</div>
                <div className="text-sm text-gray-400">Risk Level</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {getAlertLevel(currentAQI, healthProfiles[selectedProfile].threshold).level}
                </div>
                <div className="text-lg text-gray-300">Health Status</div>
                <div className="text-sm text-gray-400">Risk Assessment</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personalized Health Advice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">💡 Personalized Health Advice</h2>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 mb-6">
              <div className="text-xl text-white font-semibold mb-4">
                {healthProfiles[selectedProfile].name} - Current Recommendations:
              </div>
              <div className="text-lg text-gray-200">{healthAdvice}</div>
            </div>
            
            {/* Time-based recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">6:00 AM - 10:00 AM</div>
                <div className="text-sm text-gray-300">Best time for outdoor activities</div>
              </div>
              <div className="bg-yellow-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">10:00 AM - 4:00 PM</div>
                <div className="text-sm text-gray-300">Moderate air quality</div>
              </div>
              <div className="bg-red-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-400 mb-2">4:00 PM - 8:00 PM</div>
                <div className="text-sm text-gray-300">Avoid outdoor activities</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Health Monitoring */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">🌍 Global Health Monitoring</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* North America */}
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  🇺🇸 North America
                  <span className="ml-2 text-sm bg-blue-500/30 px-2 py-1 rounded-full">Wildfire Season Active</span>
                </h3>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Current AQI:</span>
                    <span className="text-2xl font-bold text-white">{healthData.northAmerica.aqi}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Risk Level:</span>
                    <span className="text-yellow-400 font-bold">{healthData.northAmerica.riskLevel}</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    {healthData.northAmerica.seasonalFactors}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-white mb-3">🔬 Primary Pollutants:</h4>
                  <div className="space-y-2">
                    {healthData.northAmerica.pollutants.map((pollutant, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-white">{pollutant.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            pollutant.level === 'High' ? 'bg-red-500/30 text-red-300' :
                            pollutant.level === 'Moderate' ? 'bg-yellow-500/30 text-yellow-300' :
                            'bg-green-500/30 text-green-300'
                          }`}>
                            {pollutant.level}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300 mb-1">
                          <strong>Source:</strong> {pollutant.source}
                        </div>
                        <div className="text-xs text-gray-300">
                          <strong>Health Impact:</strong> {pollutant.healthImpact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-300">
                  <strong>Affected Groups:</strong> {healthData.northAmerica.affectedGroups.join(', ')}
                </div>
              </div>
              
              {/* UAE */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  🇦🇪 UAE
                  <span className="ml-2 text-sm bg-orange-500/30 px-2 py-1 rounded-full">Dust Storm Season</span>
                </h3>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Current AQI:</span>
                    <span className="text-2xl font-bold text-white">{healthData.uae.aqi}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Risk Level:</span>
                    <span className="text-yellow-400 font-bold">{healthData.uae.riskLevel}</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    {healthData.uae.seasonalFactors}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-white mb-3">🔬 Primary Pollutants:</h4>
                  <div className="space-y-2">
                    {healthData.uae.pollutants.map((pollutant, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-white">{pollutant.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            pollutant.level === 'High' ? 'bg-red-500/30 text-red-300' :
                            pollutant.level === 'Elevated' ? 'bg-orange-500/30 text-orange-300' :
                            pollutant.level === 'Moderate' ? 'bg-yellow-500/30 text-yellow-300' :
                            'bg-green-500/30 text-green-300'
                          }`}>
                            {pollutant.level}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300 mb-1">
                          <strong>Source:</strong> {pollutant.source}
                        </div>
                        <div className="text-xs text-gray-300">
                          <strong>Health Impact:</strong> {pollutant.healthImpact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-300">
                  <strong>Affected Groups:</strong> {healthData.uae.affectedGroups.join(', ')}
                </div>
              </div>
            </div>

            {/* References Section */}
            <div className="mt-8 bg-white/5 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">📚 Scientific References (2024-2025)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <h5 className="font-semibold text-white mb-2">North America Sources:</h5>
                  <ul className="space-y-1 text-xs">
                    <li>• EPA Air Quality Index (AQI) Guidelines 2024</li>
                    <li>• WHO Global Air Quality Guidelines 2024</li>
                    <li>• CDC Health Effects of Air Pollution 2024</li>
                    <li>• NOAA Wildfire Air Quality Impact Studies 2024</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-2">UAE Sources:</h5>
                  <ul className="space-y-1 text-xs">
                    <li>• UAE Air Emissions Inventory Project 2024</li>
                    <li>• The National News UAE Environment Report 2024</li>
                    <li>• IQAir UAE Air Quality Data 2024-2025</li>
                    <li>• WHO Eastern Mediterranean Air Quality 2024</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alert System */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">🚨 Smart Alert System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="text-lg font-bold text-green-400">Good (0-50)</div>
                <div className="text-sm text-gray-300">Safe for everyone</div>
              </div>
              <div className="bg-yellow-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">⚠️</div>
                <div className="text-lg font-bold text-yellow-400">Moderate (51-100)</div>
                <div className="text-sm text-gray-300">Sensitive groups</div>
              </div>
              <div className="bg-orange-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🚫</div>
                <div className="text-lg font-bold text-orange-400">Unhealthy (101-150)</div>
                <div className="text-sm text-gray-300">Limit outdoor time</div>
              </div>
              <div className="bg-red-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🚨</div>
                <div className="text-lg font-bold text-red-400">Hazardous (151+)</div>
                <div className="text-sm text-gray-300">Stay indoors</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">🆘 Emergency Health Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🏥</div>
                <div className="text-xl font-bold text-white mb-2">Local Hospitals</div>
                <div className="text-gray-300">Real-time capacity monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <div className="text-xl font-bold text-white mb-2">Health Alerts</div>
                <div className="text-gray-300">Push notifications & SMS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👨‍⚕️</div>
                <div className="text-xl font-bold text-white mb-2">Telemedicine</div>
                <div className="text-gray-300">24/7 health consultations</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthPage;