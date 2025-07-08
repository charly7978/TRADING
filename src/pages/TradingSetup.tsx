import React, { useState, useEffect } from 'react';
import { useRealTradingContext } from '../context/RealTradingContext';
import WalletConnect from '../components/WalletConnect';
import {
  Key,
  Shield,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowRight,
  Loader,
  ExternalLink
} from 'lucide-react';

const TradingSetup = () => {
  const { connectToAPIs, isConnected } = useRealTradingContext();
  
  const [credentials, setCredentials] = useState({
    binanceApiKey: '',
    binanceSecretKey: '',
    alpacaApiKey: '',
    alpacaSecretKey: '',
    polygonApiKey: ''
  });

  const [showSecrets, setShowSecrets] = useState({
    binanceSecret: false,
    alpacaSecret: false
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [success, setSuccess] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string>('');

  // Intentar conectar automáticamente cuando se llenan los campos necesarios
  useEffect(() => {
    setConnectionError('');
    setSuccess(false);
    if (
      (credentials.binanceApiKey && credentials.binanceSecretKey) ||
      (credentials.alpacaApiKey && credentials.alpacaSecretKey)
    ) {
      handleConnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials.binanceApiKey, credentials.binanceSecretKey, credentials.alpacaApiKey, credentials.alpacaSecretKey]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError('');
    setSuccess(false);
    try {
      const ok = await connectToAPIs(credentials);
      if (ok) {
        setSuccess(true);
        localStorage.setItem('tradingCredentials', JSON.stringify(credentials));
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1200);
      } else {
        setConnectionError('Error conectando con las APIs. Verifica tus claves.');
      }
    } catch (e) {
      setConnectionError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleSecretVisibility = (field: 'binanceSecret' | 'alpacaSecret') => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (isConnected && success) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Conexión Exitosa!
              </h1>
              
              <p className="text-gray-600 mb-8">
                Tu cuenta está conectada y lista para trading automático. 
                Ahora puedes recibir recomendaciones de IA y ejecutar operaciones reales.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-green-900 mb-4">APIs Conectadas:</h3>
                <div className="space-y-2">
                  {credentials.binanceApiKey && (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Binance (Criptomonedas)</span>
                    </div>
                  )}
                  {credentials.alpacaApiKey && (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Alpaca (Acciones de EE.UU.)</span>
                    </div>
                  )}
                  {credentials.polygonApiKey && (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Polygon (Datos de mercado)</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
              >
                Ir al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-200">
          <div className="text-center mb-8">
            <Key className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Conecta tus APIs de Trading</h1>
            <p className="text-gray-600">Configura tus cuentas de trading real para comenzar a operar</p>
          </div>

          {/* Wallet Connect */}
          <div className="mb-8">
            <WalletConnect
              onConnect={(address) => setConnectedWallet(address)}
              onDisconnect={() => setConnectedWallet('')}
              connectedAddress={connectedWallet}
            />
          </div>

          {/* Feedback visual */}
          {isConnecting && (
            <div className="flex items-center justify-center mb-6">
              <Loader className="h-6 w-6 text-blue-600 animate-spin mr-2" />
              <span className="text-blue-700 font-medium">Conectando...</span>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-green-700 font-medium">¡Conexión exitosa!</span>
            </div>
          )}
          {connectionError && (
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <span className="text-yellow-700 font-medium">{connectionError}</span>
            </div>
          )}

          {/* Formulario de claves */}
          <div className="space-y-6">
            {/* Binance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Binance (Criptomonedas)</h3>
                <button
                  type="button"
                  onClick={() => window.open('https://www.binance.com/en/my/settings/api-management', '_blank')}
                  className="flex items-center space-x-1 text-blue-600 text-sm hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Crear API Key</span>
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Solo habilita permisos de "Spot Trading". Deshabilita retiros por seguridad.
                </p>
              </div>
              <input
                type="text"
                value={credentials.binanceApiKey}
                onChange={e => setCredentials(prev => ({ ...prev, binanceApiKey: e.target.value }))}
                placeholder="API Key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
                autoComplete="off"
              />
              <div className="relative">
                <input
                  type={showSecrets.binanceSecret ? 'text' : 'password'}
                  value={credentials.binanceSecretKey}
                  onChange={e => setCredentials(prev => ({ ...prev, binanceSecretKey: e.target.value }))}
                  placeholder="Secret Key"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => toggleSecretVisibility('binanceSecret')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.binanceSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {/* Alpaca */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Alpaca (Acciones de EE.UU.)</h3>
                <button
                  type="button"
                  onClick={() => window.open('https://app.alpaca.markets/paper/dashboard/overview', '_blank')}
                  className="flex items-center space-x-1 text-blue-600 text-sm hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Crear Cuenta</span>
                </button>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-green-800">
                  <strong>Recomendado:</strong> Comienza con Paper Trading (simulado) para practicar sin riesgo.
                </p>
              </div>
              <input
                type="text"
                value={credentials.alpacaApiKey}
                onChange={e => setCredentials(prev => ({ ...prev, alpacaApiKey: e.target.value }))}
                placeholder="API Key ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
                autoComplete="off"
              />
              <div className="relative">
                <input
                  type={showSecrets.alpacaSecret ? 'text' : 'password'}
                  value={credentials.alpacaSecretKey}
                  onChange={e => setCredentials(prev => ({ ...prev, alpacaSecretKey: e.target.value }))}
                  placeholder="Secret Key"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => toggleSecretVisibility('alpacaSecret')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.alpacaSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {/* Polygon */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Polygon (Datos de mercado, opcional)</h3>
                <button
                  type="button"
                  onClick={() => window.open('https://polygon.io/dashboard/api-keys', '_blank')}
                  className="flex items-center space-x-1 text-blue-600 text-sm hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Obtener API Key</span>
                </button>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-yellow-800">
                  <strong>Opcional:</strong> Mejora la calidad de datos de mercado. Tienes 5 llamadas gratuitas por minuto.
                </p>
              </div>
              <input
                type="text"
                value={credentials.polygonApiKey}
                onChange={e => setCredentials(prev => ({ ...prev, polygonApiKey: e.target.value }))}
                placeholder="API Key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            Solo necesitas una API de Binance o Alpaca para comenzar. Tus claves se guardan de forma segura y nunca se comparten.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSetup;