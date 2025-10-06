import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface NASALoadingScreenProps {
  onComplete?: () => void;
}

const NASALoadingScreen = ({ onComplete }: NASALoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Initializing NASA TEMPO...',
    'Connecting to satellite data...',
    'Loading air quality sensors...',
    'Calibrating pollution detection...',
    'Synchronizing with ground stations...',
    'Ready for launch!'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          onComplete?.();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [onComplete, steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center z-50"
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto px-4">
        {/* NASA Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 200 }}
          className="flex items-center justify-center space-x-4 mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center nasa-glow">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <div className="text-white">
            <h1 className="text-4xl font-bold">NASA</h1>
            <p className="text-lg text-blue-300">TEMPO Mission</p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="space-y-4">
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          <div className="text-white text-sm">
            {progress.toFixed(0)}% Complete
          </div>
        </div>

        {/* Current step */}
        <motion.div
          key={currentStep}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-blue-300 text-lg font-medium"
        >
          {steps[currentStep]}
        </motion.div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Mission patch */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: "spring", stiffness: 200 }}
          className="mt-8"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-cyan-400 rounded-full flex items-center justify-center nasa-glow">
            <span className="text-white text-2xl">🌍</span>
          </div>
          <p className="text-blue-300 text-sm mt-2">CleanSkies AI</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NASALoadingScreen;
