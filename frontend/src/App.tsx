import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './hooks/useTheme';
import { Suspense } from 'react';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/ui/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ForecastPage from './pages/ForecastPage';
import ValidationPage from './pages/ValidationPage';
import HealthPage from './pages/HealthPage';
import PolicyPage from './pages/PolicyPage';
import DataPage from './pages/DataPage';
import VisionPage from './pages/VisionPage';
import GamePage from './pages/GamePage';
import AboutPage from './pages/AboutPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
            <Navbar />
            <Suspense fallback={<LoadingScreen />}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/forecast" element={<ForecastPage />} />
                  <Route path="/validation" element={<ValidationPage />} />
                  <Route path="/health" element={<HealthPage />} />
                  <Route path="/policy" element={<PolicyPage />} />
                  <Route path="/data" element={<DataPage />} />
                  <Route path="/game" element={<GamePage />} />
                  <Route path="/vision" element={<VisionPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </ErrorBoundary>
            </Suspense>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
