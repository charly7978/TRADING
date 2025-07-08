import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import { ModeSwitcher } from './components/ModeSwitcher';
// import AIChat from './components/AIChat';
import RealDashboard from './pages/RealDashboard';
import AutoTrading from './pages/AutoTrading';
import Portfolio from './pages/Portfolio';
import Education from './pages/Education';
import Settings from './pages/Settings';
import TradingSetup from './pages/TradingSetup';
import AIRecommendations from './pages/AIRecommendations';
import { useRealTradingContext } from './context/RealTradingContext';
import { useTradingContext } from './context/TradingContext';
import { useMode } from './context/ModeContext';

import WelcomeModal from './components/WelcomeModal';
// import ApiConnectModal from './components/ApiConnectModal';



function AppRoutes() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { mode } = useMode();
  let isConnected = false;
  if (mode === 'real') {
    const { isConnected: isRealConnected } = useRealTradingContext();
    isConnected = isRealConnected;
  } else {
    const { isConnected: isDemoConnected } = useTradingContext();
    isConnected = isDemoConnected;
  }

  // Detectar si el usuario quiere usar trading real
  useEffect(() => {
    // const urlParams = new URLSearchParams(window.location.search);
    // const realMode = urlParams.get('real') === 'true';
  }, []);

  return (
    <Router>
      <Navigation />
      <ModeSwitcher />
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



import { TradingProvider } from './context/TradingContext';
import { RealTradingProvider } from './context/RealTradingContext';
import { ModeProvider } from './context/ModeContext';

function ProviderSwitcher({ children }: { children: React.ReactNode }) {
  const { mode } = useMode();
  if (mode === 'real') {
    return <RealTradingProvider>{children}</RealTradingProvider>;
  }
  return <TradingProvider>{children}</TradingProvider>;
}


function App() {
  return (
    <ModeProvider>
      <ProviderSwitcher>
        <AppRoutes />
      </ProviderSwitcher>
    </ModeProvider>
  );
}

export default App;