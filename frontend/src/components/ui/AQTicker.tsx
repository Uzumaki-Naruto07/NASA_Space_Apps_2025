import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface AQUpdate {
  id: number;
  type: 'tempo' | 'pollution' | 'weather' | 'clean';
  icon: string;
  message: string;
  timestamp: string;
}

const AQTicker = () => {
  const { t } = useTranslation();
  const [currentUpdate, setCurrentUpdate] = useState(0);

  const updates: AQUpdate[] = [
    {
      id: 1,
      type: 'tempo',
      icon: '🛰️',
      message: `${t('dashboard.lastUpdate')}: 12:14 UTC`,
      timestamp: '2 min ago'
    },
    {
      id: 2,
      type: 'pollution',
      icon: '🌫️',
      message: `${t('dashboard.mostPolluted')}: New Delhi, AQI 178`,
      timestamp: '5 min ago'
    },
    {
      id: 3,
      type: 'clean',
      icon: '🌬️',
      message: `${t('dashboard.cleanestAir')}: Vancouver, AQI 21`,
      timestamp: '3 min ago'
    },
    {
      id: 4,
      type: 'weather',
      icon: '🌦️',
      message: `${t('dashboard.weatherImpact')}: Rain decreased PM2.5 by 18%`,
      timestamp: '1 min ago'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUpdate((prev) => (prev + 1) % updates.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [updates.length]);

  return (
    <div className="w-full bg-surface/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-space-accent">
              Live Air Quality Updates
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUpdate}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <span className="text-lg">{updates[currentUpdate].icon}</span>
              <span className="text-sm">{updates[currentUpdate].message}</span>
              <span className="text-xs text-muted-foreground">
                {updates[currentUpdate].timestamp}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AQTicker;
