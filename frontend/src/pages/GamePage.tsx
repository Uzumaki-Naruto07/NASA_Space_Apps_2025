import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Building, Beaker, Shield, Play, Trophy, Users } from 'lucide-react';

// Import the three game components
import AQIManagementGame from '../components/games/AQIManagementGame';
import PFASLabGame from '../components/games/PFASLabGame';
import FieldOpsGame from '../components/games/FieldOpsGame';

const GamePage = () => {
  const { t } = useTranslation();
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);

  // Show achievement notification on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 4000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const floors = [
    {
      id: 'aqi-lab',
      title: 'AQI Management Lab',
      description: 'Control city-wide air quality through strategic policy deployment',
      icon: Building,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-900 to-cyan-900',
      game: AQIManagementGame,
      features: ['Policy Deployment', 'Budget Management', '3D City Visualization', 'TEMPO Scanning']
    },
    {
      id: 'pfas-lab',
      title: 'PFAS Research Lab',
      description: 'Use analytical chemistry to identify and remediate forever chemicals',
      icon: Beaker,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-900 to-pink-900',
      game: PFASLabGame,
      features: ['LC-MS/MS Analysis', 'Chemical Identification', '3D Laboratory', 'Solution Deployment']
    },
    {
      id: 'field-ops',
      title: 'Clean Air Field Ops',
      description: 'Navigate hazardous zones and complete environmental missions',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-900 to-red-900',
      game: FieldOpsGame,
      features: ['3D Navigation', 'Mission Objectives', 'Hazard Avoidance', 'Real-time Scanning']
    }
  ];

  const leaderboard = [
    { rank: 1, username: 'CleanAirRunner', city: 'Vancouver', score: 2847, aqi: 21 },
    { rank: 2, username: 'EcoWarrior', city: 'Seattle', score: 2653, aqi: 28 },
    { rank: 3, username: 'GreenGuardian', city: 'Portland', score: 2491, aqi: 32 },
    { rank: 4, username: 'AirQualityHero', city: 'San Francisco', score: 2234, aqi: 35 },
    { rank: 5, username: 'PollutionFighter', city: 'Toronto', score: 2156, aqi: 38 },
  ];

  const renderGame = () => {
    if (!selectedFloor) return null;
    
    const floor = floors.find(f => f.id === selectedFloor);
    if (!floor) return null;
    
    const GameComponent = floor.game;
    return <GameComponent />;
  };

  if (selectedFloor) {
    return renderGame();
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Achievement Notification */}
      {showAchievement && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed top-20 right-6 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-2xl border-2 border-yellow-300"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-3xl"
            >
              🏆
            </motion.div>
            <div>
              <div className="font-bold text-white text-lg">Achievement Unlocked!</div>
              <div className="text-yellow-100 text-sm">Welcome to NASA TEMPO Gaming!</div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-cyan-500/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-green-500/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-10 w-6 h-6 bg-yellow-500/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 right-10 w-10 h-10 bg-red-500/20 rounded-full animate-ping delay-300"></div>
        
        {/* Additional Gaming Elements */}
        <div className="absolute top-20 left-1/2 w-4 h-4 bg-yellow-400/30 rounded-full animate-ping delay-200"></div>
        <div className="absolute bottom-40 left-1/3 w-6 h-6 bg-pink-400/30 rounded-full animate-bounce delay-800"></div>
        <div className="absolute top-2/3 right-1/4 w-8 h-8 bg-indigo-400/30 rounded-full animate-pulse delay-400"></div>
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-emerald-400/30 rounded-full animate-ping delay-600"></div>
        
        {/* Gaming Icons Floating */}
        <motion.div
          className="absolute top-16 right-1/3 text-2xl"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎮
        </motion.div>
        <motion.div
          className="absolute bottom-16 left-1/4 text-3xl"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🚀
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-16 text-xl"
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 15, -15, 0]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          ⭐
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="text-8xl mb-4 animate-bounce">🚀</div>
          </motion.div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6 animate-pulse">
            🎮 NASA TEMPO Gaming Experience
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-cyan-200 text-xl mb-8 font-medium"
          >
            Master air quality management through three immersive gaming experiences
          </motion.p>
          
          {/* Gaming Stats Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-cyan-500/30 shadow-2xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 animate-pulse">1,847</div>
                <div className="text-sm text-cyan-300">Best Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 animate-pulse">23</div>
                <div className="text-sm text-cyan-300">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 animate-pulse">156</div>
                <div className="text-sm text-cyan-300">Clean Air Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 animate-pulse">3</div>
                <div className="text-sm text-cyan-300">Floors Unlocked</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floor Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <motion.h2 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            🎯 Choose Your Mission
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {floors.map((floor, index) => (
              <motion.div
                key={floor.id}
                initial={{ y: 50, opacity: 0, rotateY: -15 }}
                animate={{ y: 0, opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.9 + index * 0.2, type: "spring", stiffness: 100 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedFloor(floor.id)}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${floor.bgColor} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                
                <div className={`relative bg-gradient-to-br ${floor.bgColor} rounded-2xl p-8 text-white shadow-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300`}>
                  {/* Floating Particles */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-ping"></div>
                  <div className="absolute top-8 right-8 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-500"></div>
                  
                  <div className="text-center mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="inline-block"
                    >
                      <floor.icon className="w-20 h-20 mx-auto mb-4 text-white drop-shadow-lg" />
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">{floor.title}</h3>
                    <p className="text-white/90 text-base leading-relaxed">{floor.description}</p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {floor.features.map((feature, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 + idx * 0.1 }}
                        className="flex items-center text-sm bg-white/10 rounded-lg p-2 backdrop-blur-sm"
                      >
                        <span className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mr-3 animate-pulse"></span>
                        <span className="font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    className={`bg-gradient-to-r ${floor.color} text-white px-8 py-4 rounded-xl font-bold text-center shadow-lg group-hover:shadow-2xl transition-all duration-300 border-2 border-white/30 group-hover:border-white/50`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-6 h-6 inline mr-3 animate-pulse" />
                    <span className="text-lg">Enter {floor.title}</span>
                    <div className="text-xs mt-1 opacity-80">Click to Launch</div>
                  </motion.div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 bg-white/20 rounded-full h-1">
                    <motion.div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.5 + index * 0.2, duration: 1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-cyan-500/30 shadow-2xl">
            <motion.h2 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8, type: "spring" }}
              className="text-3xl font-bold mb-8 flex items-center gap-3 text-center justify-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                🏆 Global Leaderboard
              </span>
            </motion.h2>
            <div className="space-y-4">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 50, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 2 + index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`relative flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-300 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400 shadow-lg' :
                    index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400 shadow-md' :
                    index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400 shadow-md' :
                    'bg-gradient-to-r from-slate-100 to-slate-200 border-slate-300'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="flex items-center space-x-6">
                    <motion.div 
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white animate-pulse' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                        'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {index === 0 && '👑'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && player.rank}
                    </motion.div>
                    <div>
                      <div className="font-bold text-xl text-slate-800">{player.username}</div>
                      <div className="text-sm text-slate-600 flex items-center gap-2">
                        <span>📍</span>
                        {player.city}
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Section */}
                  <div className="text-right">
                    <motion.div 
                      className="font-bold text-2xl text-slate-800"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2.5 + index * 0.1, type: "spring" }}
                    >
                      {player.score.toLocaleString()}
                    </motion.div>
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <span>🌬️</span>
                      AQI: {player.aqi}
                    </div>
                  </div>
                  
                  {/* Floating Elements for Top 3 */}
                  {index < 3 && (
                    <>
                      <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute bottom-2 left-2 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/dashboard"
              className="group relative px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-cyan-400/50 hover:border-cyan-300/80"
            >
              <span className="flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌍
                </motion.span>
                Return to Dashboard
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
              <div className="text-cyan-200 text-sm mb-2">🎮 Ready to Play?</div>
              <div className="text-white font-bold">Select a mission above to begin your adventure!</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default GamePage;
