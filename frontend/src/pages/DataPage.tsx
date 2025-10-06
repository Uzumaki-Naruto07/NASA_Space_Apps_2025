import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const DataPage = () => {
  const { t } = useTranslation();

  const dataSources = [
    {
      name: 'NASA TEMPO L2',
      version: 'V03',
      lastUpdate: '2 min ago',
      license: 'Public Domain',
      status: 'Active'
    },
    {
      name: 'MERRA-2 Weather',
      version: '2.5.1',
      lastUpdate: '15 min ago',
      license: 'Public Domain',
      status: 'Active'
    },
    {
      name: 'IMERG Precipitation',
      version: 'V06',
      lastUpdate: '30 min ago',
      license: 'Public Domain',
      status: 'Active'
    },
    {
      name: 'OpenAQ Ground',
      version: 'Latest',
      lastUpdate: '5 min ago',
      license: 'CC BY 4.0',
      status: 'Active'
    },
    {
      name: 'AirNow EPA',
      version: '2024.1',
      lastUpdate: '1 hour ago',
      license: 'Public Domain',
      status: 'Active'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-space-accent to-sky-blue bg-clip-text text-transparent mb-4">
            {t('data.title')}
          </h1>
          <p className="text-muted-foreground">
            Comprehensive data sources and real-time updates
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-lg p-6"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Dataset</th>
                  <th className="text-left py-3 px-4">Version</th>
                  <th className="text-left py-3 px-4">{t('data.lastUpdate')}</th>
                  <th className="text-left py-3 px-4">License</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map((source, index) => (
                  <motion.tr
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-border hover:bg-surface/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{source.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{source.version}</td>
                    <td className="py-3 px-4 text-muted-foreground">{source.lastUpdate}</td>
                    <td className="py-3 px-4 text-muted-foreground">{source.license}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {source.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-space-accent hover:text-space-accent/80 text-sm">
                          {t('data.viewPortal')}
                        </button>
                        <button className="text-space-accent hover:text-space-accent/80 text-sm">
                          {t('data.downloadSample')}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataPage;
