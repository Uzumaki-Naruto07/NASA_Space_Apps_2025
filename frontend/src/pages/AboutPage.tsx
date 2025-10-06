import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-8">
            🚀 About CleanSkies AI
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
            Bridging NASA's TEMPO mission with UAE Vision 2031 for global air quality monitoring
          </p>
          
          {/* NASA Competition Badge */}
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-full text-white font-bold text-xl shadow-2xl mb-8">
            🏆 NASA Space Apps Challenge 2025 - Winner
          </div>
        </motion.div>

        {/* Project Story */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 mb-12"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-white">🌟 Project Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">🚀 NASA Space Apps Challenge 2025</h3>
                <p className="text-gray-300">
                  CleanSkies AI emerged from the NASA Space Apps Challenge 2025, combining cutting-edge satellite technology 
                  with artificial intelligence to create a comprehensive air quality monitoring and forecasting system.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">🎯 Our Mission</h3>
                <p className="text-gray-300">
                  To make air quality data accessible, understandable, and actionable for everyone - from 
                  policymakers to concerned citizens. By integrating NASA's TEMPO satellite data with ground measurements 
                  and weather information, we provide real-time insights and predictive analytics.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">🤝 UAE Vision 2031 Synergy</h3>
              <p className="text-gray-300 mb-6">
                This project represents the perfect synergy between UAE's Vision 2031 goals for sustainable development 
                and NASA's commitment to Earth observation and environmental monitoring.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">🇦🇪</div>
                  <div className="text-sm font-semibold text-white">UAE Vision 2031</div>
                  <div className="text-xs text-gray-400">Sustainable Development</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🇺🇸</div>
                  <div className="text-sm font-semibold text-white">NASA Mission</div>
                  <div className="text-xs text-gray-400">Earth Observation</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Me - Project Creator */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 mb-12"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-white">👨‍💻 About the Creator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-6 shadow-lg">
                  <span className="text-4xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Full-Stack Developer & Data Scientist</h3>
                  <p className="text-cyan-400 font-semibold text-lg">NASA Space Apps Challenge 2025</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6">
                  <p className="text-gray-300 text-lg">
                    I'm the sole developer behind CleanSkies AI, having built this comprehensive air quality monitoring system from the ground up. 
                    This project represents my passion for combining cutting-edge technology with environmental science to create meaningful impact.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-2xl p-6">
                  <p className="text-gray-300 text-lg">
                    From data collection and AI model development to frontend design and user experience, I've handled every aspect of this project. 
                    My goal is to make air quality data accessible and actionable for everyone, from policymakers to concerned citizens.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-white mb-6">🛠️ What I Built</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Complete data pipeline from NASA TEMPO satellite to user interface</span>
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">AI/ML forecasting models with 24-72h predictions</span>
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Interactive React dashboard with real-time data visualization</span>
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Comprehensive validation system with statistical analysis</span>
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Health protection features with personalized recommendations</span>
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                  <span className="text-gray-300">Policy impact analysis with sensitivity heatmaps</span>
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Educational gaming interface for public engagement</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-6">
                <p className="text-lg font-semibold text-cyan-400 mb-3">🎯 Mission Statement</p>
                <p className="text-gray-300">
                  "To democratize air quality data and make environmental science accessible to everyone, 
                  while contributing to NASA's mission of Earth observation and UAE's Vision 2031 sustainability goals."
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Skills & Expertise */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 mb-12"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-white">🛠️ Technical Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 text-center hover:shadow-xl transition-all"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-3xl">💻</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Frontend Development</h3>
              <div className="space-y-2">
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">React & TypeScript</div>
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">Tailwind CSS</div>
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">Framer Motion</div>
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">Three.js</div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-8 text-center hover:shadow-xl transition-all"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI/ML & Data Science</h3>
              <div className="space-y-2">
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">Python & Scikit-learn</div>
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">XGBoost & LSTM</div>
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">Statistical Analysis</div>
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">Machine Learning</div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 text-center hover:shadow-xl transition-all"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Environmental Science</h3>
              <div className="space-y-2">
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">Satellite Data Processing</div>
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">Air Quality Analysis</div>
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">Climate Science</div>
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">NASA TEMPO Data</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Acknowledgments */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-white">🙏 Acknowledgments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">📊 Data Sources</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🚀</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">NASA Earthdata</div>
                      <div className="text-sm text-gray-300">TEMPO L2 Products</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🌍</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">OpenAQ</div>
                      <div className="text-sm text-gray-300">Ground Station Data</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🏭</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">AirNow</div>
                      <div className="text-sm text-gray-300">EPA Air Quality Data</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🌤️</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">MERRA-2</div>
                      <div className="text-sm text-gray-300">Weather Data</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">🛠️ Technologies</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⚛️</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">React + TypeScript</div>
                      <div className="text-sm text-gray-300">Frontend Framework</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🎮</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Three.js</div>
                      <div className="text-sm text-gray-300">3D Visualization</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🐍</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Python + ML</div>
                      <div className="text-sm text-gray-300">Machine Learning</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🔗</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">NASA Earthdata API</div>
                      <div className="text-sm text-gray-300">Data Integration</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-8">
              <p className="text-xl text-white font-semibold mb-4">
                Built with ❤️ for NASA Space Apps Challenge 2025
              </p>
              <p className="text-lg text-gray-300 italic">
                "Understanding the air we breathe — for all."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
