import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import Earth3D from '../components/3d/Earth3D';
import AQTicker from '../components/ui/AQTicker';

const LandingPage = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'gradient-space' 
          : 'gradient-sky'
      }`} />

      {/* 3D Earth Background */}
      <div className="absolute inset-0 z-0">
        <Earth3D />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* AQ Ticker */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-16"
        >
          <AQTicker />
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Title */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-space-accent to-sky-blue bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                {t('landing.title')}
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
              >
                {t('landing.subtitle')}
              </motion.p>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-lg text-muted-foreground/80"
              >
                {t('landing.poweredBy')}
              </motion.p>
              
              {/* NASA Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center space-x-4 mt-6"
              >
                <div className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-blue-600 px-4 py-2 rounded-full">
                  <span className="text-white font-bold text-sm">NASA</span>
                  <span className="text-white text-xs">TEMPO</span>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2 rounded-full">
                  <span className="text-white font-bold text-sm">UAE</span>
                  <span className="text-white text-xs">Vision 2031</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to="/dashboard"
                  className="group relative px-8 py-4 bg-gradient-to-r from-space-accent to-sky-blue text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="text-2xl">🌍</span>
                    <span>{t('landing.enterDashboard')}</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-blue to-space-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to="/game"
                  className="group relative px-8 py-4 bg-gradient-to-r from-sky-blue to-space-accent text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="text-2xl">🎮</span>
                    <span>{t('landing.playGame')}</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-space-accent to-sky-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to="/vision"
                  className="group relative px-8 py-4 border-2 border-space-accent text-space-accent rounded-full font-semibold text-lg hover:bg-space-accent hover:text-white transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="text-2xl">🌐</span>
                    <span>{t('landing.exploreVision')}</span>
                  </span>
                  <div className="absolute inset-0 bg-space-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
            </motion.div>

            {/* AQ Cards */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16"
            >
              {[
                { 
                  icon: '🌫️', 
                  label: t('dashboard.mostPolluted'), 
                  value: 'New Delhi, AQI 178',
                  color: 'text-red-400',
                  bgColor: 'bg-red-500/10',
                  borderColor: 'border-red-500/20'
                },
                { 
                  icon: '🌬️', 
                  label: t('dashboard.cleanestAir'), 
                  value: 'Vancouver, AQI 21',
                  color: 'text-green-400',
                  bgColor: 'bg-green-500/10',
                  borderColor: 'border-green-500/20'
                },
                { 
                  icon: '🛰️', 
                  label: t('dashboard.lastUpdate'), 
                  value: '12:14 UTC',
                  color: 'text-blue-400',
                  bgColor: 'bg-blue-500/10',
                  borderColor: 'border-blue-500/20'
                },
                { 
                  icon: '🌦️', 
                  label: t('dashboard.weatherImpact'), 
                  value: 'Rain decreased PM2.5 by 18%',
                  color: 'text-yellow-400',
                  bgColor: 'bg-yellow-500/10',
                  borderColor: 'border-yellow-500/20'
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 2 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className={`glass-effect rounded-lg p-4 text-center transition-all duration-300 border ${card.borderColor} ${card.bgColor} hover:shadow-xl hover:shadow-blue-500/20`}
                >
                  <motion.div 
                    className="text-3xl mb-3"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  >
                    {card.icon}
                  </motion.div>
                  <div className="text-sm text-muted-foreground mb-2 font-medium">{card.label}</div>
                  <div className={`font-bold text-lg ${card.color}`}>{card.value}</div>
                  
                  {/* Animated border */}
                  <motion.div
                    className={`absolute inset-0 rounded-lg border-2 ${card.borderColor} opacity-0`}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
