import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import RealDashboard from './pages/RealDashboard';
import AutoTrading from './pages/AutoTrading';
import Portfolio from './pages/Portfolio';
import Education from './pages/Education';
import Settings from './pages/Settings';
import TradingSetup from './pages/TradingSetup';
import AIRecommendations from './pages/AIRecommendations';
import { RealTradingProvider, useRealTradingContext } from './context/RealTradingContext';
import WelcomeModal from './components/WelcomeModal';
import ApiConnectModal from './components/ApiConnectModal';


function AppRoutes() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { isConnected } = useRealTradingContext();

  // Detectar si el usuario quiere usar trading real
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const realMode = urlParams.get('real') === 'true';
  }, []);

  return (
    <Router>
      <Navigation />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Navigate to={isConnected ? "/dashboard" : "/trading-setup"} replace />} />
          <Route path="/dashboard" element={isConnected ? <RealDashboard /> : <Navigate to="/trading-setup" replace />} />
          <Route path="/auto-trading" element={isConnected ? <AutoTrading /> : <Navigate to="/trading-setup" replace />} />
          <Route path="/portfolio" element={isConnected ? <Portfolio /> : <Navigate to="/trading-setup" replace />} />
          <Route path="/education" element={isConnected ? <Education /> : <Navigate to="/trading-setup" replace />} />
          <Route path="/settings" element={isConnected ? <Settings /> : <Navigate to="/trading-setup" replace />} />
          <Route path="/trading-setup" element={<TradingSetup />} />
          <Route path="/ai-recommendations" element={isConnected ? <AIRecommendations /> : <Navigate to="/trading-setup" replace />} />
        </Routes>
      </main>
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
    </Router>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <RealTradingProvider>
        <AppRoutes />
      </RealTradingProvider>
    </div>
  );
}

export default App;