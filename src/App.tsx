import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import RealDashboard from './pages/RealDashboard';
import AutoTrading from './pages/AutoTrading';
import Portfolio from './pages/Portfolio';
import Education from './pages/Education';
import Settings from './pages/Settings';
import TradingSetup from './pages/TradingSetup';
import AIRecommendations from './pages/AIRecommendations';
import WelcomeModal from './components/WelcomeModal';
import { RealTradingProvider, useRealTradingContext } from './context/RealTradingContext';

function AppRoutes() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { isConnected } = useRealTradingContext();

  useEffect(() => {
    // Lógica de efecto si es necesario
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
    <RealTradingProvider>
      <AppRoutes />
    </RealTradingProvider>
  );
}

export default App;
import { useState } from 'react';
import { useRealTradingContext } from '../context/RealTradingContext';

const TradingSetup = () => {
  const { connectToAPIs, isConnected } = useRealTradingContext();
  const [credentials, setCredentials] = useState({
    binanceApiKey: '',
    binanceSecretKey: '',
    alpacaApiKey: '',
    alpacaSecretKey: '',
    polygonApiKey: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError('');
    setSuccess(false);
    try {
      const result = await connectToAPIs(credentials);
      if (result && result.success) {
        setSuccess(true);
        localStorage.setItem('tradingCredentials', JSON.stringify(credentials));
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1200);
      } else if (result && result.error) {
        setConnectionError(result.error);
      } else {
        setConnectionError('Error conectando con las APIs. Verifica tus claves y conexión a internet.');
      }
    } catch (e) {
      setConnectionError('Error inesperado de conexión. Revisa tu internet y que el proxy esté activo.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected && success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">¡Conexión exitosa!</h2>
          <p className="mb-4">Tus APIs están conectadas y listas para operar en modo real.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Conecta tus APIs de trading real</h2>
        {/* Aquí puedes agregar los campos de formulario para las credenciales reales */}
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? 'Conectando...' : 'Conectar'}
        </button>
        {connectionError && <div className="text-red-600 mt-2">{connectionError}</div>}
      </div>
    </div>
  );
};

export default TradingSetup;