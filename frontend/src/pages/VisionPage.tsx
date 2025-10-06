import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const VisionPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-space-accent to-sky-blue bg-clip-text text-transparent mb-4">
            {t('vision.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bridging UAE Vision 2031 with NASA's TEMPO mission for a cleaner, smarter future
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* UAE Vision 2031 */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-lg p-8"
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🇦🇪</div>
              <h2 className="text-2xl font-bold mb-4">UAE Vision 2031</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-space-accent text-xl">🌱</span>
                <div>
                  <h3 className="font-semibold">Clean Air Initiative</h3>
                  <p className="text-sm text-muted-foreground">AI-driven environmental monitoring and sustainable development</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-space-accent text-xl">🤖</span>
                <div>
                  <h3 className="font-semibold">AI Governance</h3>
                  <p className="text-sm text-muted-foreground">Smart city infrastructure with real-time air quality management</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-space-accent text-xl">🌍</span>
                <div>
                  <h3 className="font-semibold">Sustainability</h3>
                  <p className="text-sm text-muted-foreground">Carbon neutrality and green energy transition</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-space-accent/10 to-sky-blue/10 rounded-lg">
              <blockquote className="text-lg font-medium italic">
                "{t('vision.quote1')}"
              </blockquote>
              <cite className="text-sm text-muted-foreground mt-2 block">
                — {t('vision.author1')}
              </cite>
            </div>
          </motion.div>

          {/* NASA TEMPO */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-lg p-8"
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🛰️</div>
              <h2 className="text-2xl font-bold mb-4">NASA TEMPO Mission</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-space-accent text-xl">📡</span>
                <div>
                  <h3 className="font-semibold">Real-time Monitoring</h3>
                  <p className="text-sm text-muted-foreground">Hourly air quality measurements across North America</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-space-accent text-xl">🔬</span>
                <div>
                  <h3 className="font-semibold">Scientific Research</h3>
                  <p className="text-sm text-muted-foreground">Advanced atmospheric chemistry and pollution tracking</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-space-accent text-xl">🌐</span>
                <div>
                  <h3 className="font-semibold">Global Impact</h3>
                  <p className="text-sm text-muted-foreground">Open data for worldwide environmental research</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-sky-blue/10 to-space-accent/10 rounded-lg">
              <blockquote className="text-lg font-medium italic">
                "{t('vision.quote2')}"
              </blockquote>
              <cite className="text-sm text-muted-foreground mt-2 block">
                — {t('vision.author2')}
              </cite>
            </div>
          </motion.div>
        </div>

        {/* Middle Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="flex justify-center my-12"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 bg-gradient-to-r from-space-accent to-sky-blue rounded-full flex items-center justify-center"
            >
              <span className="text-2xl">🌍</span>
            </motion.div>
            <div className="absolute -top-2 -right-2 text-2xl">🇦🇪</div>
            <div className="absolute -bottom-2 -left-2 text-2xl">🇺🇸</div>
          </div>
        </motion.div>

        {/* Partnership Goals */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-6">Partnership Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Precision Monitoring', desc: 'Sub-kilometer air quality resolution' },
              { icon: '⚡', title: 'Real-time Alerts', desc: 'Instant health and policy notifications' },
              { icon: '🔮', title: 'Predictive Analytics', desc: 'AI-powered future air quality forecasting' },
            ].map((goal, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="glass-effect rounded-lg p-6"
              >
                <div className="text-3xl mb-3">{goal.icon}</div>
                <h4 className="font-semibold mb-2">{goal.title}</h4>
                <p className="text-sm text-muted-foreground">{goal.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisionPage;
