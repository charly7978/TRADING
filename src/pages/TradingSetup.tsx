import React, { useState } from 'react';
import { useTradingContext } from '../context/TradingContext';
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
  const { connectToAPIs, isConnected } = useTradingContext();
  
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
  const [step, setStep] = useState(1);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError('');

    try {
      const success = await connectToAPIs(credentials);
      if (success) {
        setStep(3); // Ir a confirmación de éxito
      } else {
        setConnectionError('Error conectando con las APIs. Verifica tus credenciales.');
      }
    } catch (error) {
      setConnectionError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleSecretVisibility = (field: 'binanceSecret' | 'alpacaSecret') => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (isConnected && step === 3) {
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conecta tu Cuenta de Trading
          </h1>
          <p className="text-gray-600 text-lg">
            Configura tus APIs para comenzar el trading automático real
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Paso 1: Obtén tus Claves API
              </h2>
              <p className="text-gray-600">
                Necesitas crear claves API en las plataformas de trading para conectar tu cuenta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Binance */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-bold text-lg">B</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Binance</h3>
                    <p className="text-sm text-gray-500">Para criptomonedas</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-gray-600">1. Ve a Binance.com</p>
                  <p className="text-sm text-gray-600">2. Perfil → Seguridad API</p>
                  <p className="text-sm text-gray-600">3. Crear API Key</p>
                  <p className="text-sm text-gray-600">4. Habilitar "Spot Trading"</p>
                </div>

                <a
                  href="https://www.binance.com/en/my/settings/api-management"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <span>Ir a Binance</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>

              {/* Alpaca */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold text-lg">A</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Alpaca</h3>
                    <p className="text-sm text-gray-500">Para acciones de EE.UU.</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-gray-600">1. Ve a Alpaca.markets</p>
                  <p className="text-sm text-gray-600">2. Crear cuenta</p>
                  <p className="text-sm text-gray-600">3. Paper Trading → API Keys</p>
                  <p className="text-sm text-gray-600">4. Generar nuevas claves</p>
                </div>

                <a
                  href="https://alpaca.markets/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <span>Ir a Alpaca</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-blue-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Seguridad</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Tus claves se almacenan de forma segura y encriptada</li>
                    <li>• Solo se usan para trading, nunca para retiros</li>
                    <li>• Puedes revocar el acceso en cualquier momento</li>
                    <li>• Recomendamos empezar con cuentas de prueba (paper trading)</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <span>Continuar</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Paso 2: Configura tus Claves API
              </h2>
              <p className="text-gray-600">
                Ingresa las claves API que obtuviste de las plataformas de trading.
              </p>
            </div>

            {connectionError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800">{connectionError}</span>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Binance API */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-yellow-600 font-bold">B</span>
                  </div>
                  Binance API (Opcional)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={credentials.binanceApiKey}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        binanceApiKey: e.target.value
                      }))}
                      placeholder="Ingresa tu Binance API Key"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Key
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.binanceSecret ? "text" : "password"}
                        value={credentials.binanceSecretKey}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          binanceSecretKey: e.target.value
                        }))}
                        placeholder="Ingresa tu Binance Secret Key"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                </div>
              </div>

              {/* Alpaca API */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">A</span>
                  </div>
                  Alpaca API (Opcional)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key ID
                    </label>
                    <input
                      type="text"
                      value={credentials.alpacaApiKey}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        alpacaApiKey: e.target.value
                      }))}
                      placeholder="Ingresa tu Alpaca API Key ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Key
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.alpacaSecret ? "text" : "password"}
                        value={credentials.alpacaSecretKey}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          alpacaSecretKey: e.target.value
                        }))}
                        placeholder="Ingresa tu Alpaca Secret Key"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                </div>
              </div>

              {/* Polygon API */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">P</span>
                  </div>
                  Polygon API (Opcional - Para datos de mercado)
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={credentials.polygonApiKey}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      polygonApiKey: e.target.value
                    }))}
                    placeholder="Ingresa tu Polygon API Key (opcional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Obtén una clave gratuita en <a href="https://polygon.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">polygon.io</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors"
              >
                Volver
              </button>
              
              <button
                onClick={handleConnect}
                disabled={isConnecting || (!credentials.binanceApiKey && !credentials.alpacaApiKey)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isConnecting ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Key className="h-5 w-5 mr-2" />
                    Conectar APIs
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Necesitas al menos una API (Binance o Alpaca) para continuar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingSetup;