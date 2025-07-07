import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import RealDashboard from './pages/RealDashboard';
import AutoTrading from './pages/AutoTrading';
import Portfolio from './pages/Portfolio';
import Education from './pages/Education';
import Settings from './pages/Settings';
import TradingSetup from './pages/TradingSetup';
import AIRecommendations from './pages/AIRecommendations';
import { TradingProvider } from './context/TradingContext';
import { RealTradingProvider } from './context/RealTradingContext';
import WelcomeModal from './components/WelcomeModal';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [useRealTrading, setUseRealTrading] = useState(false);

  // Detectar si el usuario quiere usar trading real
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const realMode = urlParams.get('real') === 'true';
    setUseRealTrading(realMode);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {useRealTrading ? (
        <RealTradingProvider>
          <Router>
            <Navigation />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<RealDashboard />} />
                <Route path="/auto-trading" element={<AutoTrading />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/education" element={<Education />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/trading-setup" element={<TradingSetup />} />
                <Route path="/ai-recommendations" element={<AIRecommendations />} />
              </Routes>
            </main>
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
          </Router>
        </RealTradingProvider>
      ) : (
        <TradingProvider>
          <Router>
            <Navigation />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/auto-trading" element={<AutoTrading />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/education" element={<Education />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/trading-setup" element={<TradingSetup />} />
                <Route path="/ai-recommendations" element={<AIRecommendations />} />
              </Routes>
            </main>
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
          </Router>
        </TradingProvider>
      )}
    </div>
  );
}

export default App;