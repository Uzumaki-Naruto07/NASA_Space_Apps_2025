import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-900 text-white py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* NASA TEMPO */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">NASA TEMPO</h3>
            <p className="text-gray-300 text-sm">
              Tropospheric Emissions: Monitoring of Pollution
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Real-time air quality monitoring from space
            </p>
          </div>

          {/* UAE Vision 2031 */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">UAE Vision 2031</h3>
            <p className="text-gray-300 text-sm">
              Sustainable development and environmental protection
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Building a sustainable future for all
            </p>
          </div>

          {/* CleanSkies AI */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">CleanSkies AI</h3>
            <p className="text-gray-300 text-sm">
              When data meets humanity — the air becomes visible
            </p>
            <p className="text-gray-400 text-xs mt-2">
              NASA Space Apps 2025
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 CleanSkies AI. Powered by NASA TEMPO & UAE Vision 2031
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;