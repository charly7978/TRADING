import { useState, useEffect } from 'react';
import { realTradingAPI } from '../services/realTradingAPI';
import { useActiveTradingContext } from '../context/useActiveTradingContext';
import WalletConnect from '../components/WalletConnect';
import {
  Key,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader,
  ExternalLink
} from 'lucide-react';

const TradingSetup = () => {
  const { connectToAPIs, isConnected } = useActiveTradingContext();
  
  // Inicializar credenciales desde localStorage si existen
  const [credentials, setCredentials] = useState(() => {
    const stored = localStorage.getItem('tradingCredentials');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          binanceApiKey: '',
          binanceSecretKey: '',
          alpacaApiKey: '',
          alpacaSecretKey: '',
          polygonApiKey: ''
        };
      }
    }
    return {
      binanceApiKey: '',
      binanceSecretKey: '',
      alpacaApiKey: '',
      alpacaSecretKey: '',
      polygonApiKey: ''
    };
  });

  const [showSecrets, setShowSecrets] = useState({
    binanceSecret: false,
    alpacaSecret: false
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [success, setSuccess] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string>('');
  // Estado para modo simulación
  const [paperMode, setPaperMode] = useState(() => {
    const stored = localStorage.getItem('paperTradingEnabled');
    return stored === 'true';
  });
  // Sincronizar modo simulación con servicio y localStorage
  useEffect(() => {
    realTradingAPI.setPaperTradingEnabled(paperMode);
    localStorage.setItem('paperTradingEnabled', paperMode ? 'true' : 'false');
  }, [paperMode]);

  // Automatización máxima: conectar siempre que haya credenciales válidas, tanto al montar como al cambiar

  useEffect(() => {
    setConnectionError('');
    setSuccess(false);
    const hasBinance = credentials.binanceApiKey && credentials.binanceSecretKey;
    const hasAlpaca = credentials.alpacaApiKey && credentials.alpacaSecretKey;
    // Si hay claves, conectar automáticamente
    if (hasBinance || hasAlpaca) {
      handleConnect();
    }
    // Si está en modo simulado y no hay claves, permitir conectar demo
    if (paperMode && !hasBinance && !hasAlpaca) {
      handleConnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials.binanceApiKey, credentials.binanceSecretKey, credentials.alpacaApiKey, credentials.alpacaSecretKey, paperMode]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError('');
    setSuccess(false);
    try {
      const result = await connectToAPIs(credentials);
      // Demo: result === true | Real: { success, error? }
      if (result === true || (typeof result === 'object' && result.success)) {
        setSuccess(true);
        localStorage.setItem('tradingCredentials', JSON.stringify(credentials));
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1200);
      } else if (typeof result === 'object' && result.error) {
        if (result.error.toLowerCase().includes('network') || result.error.toLowerCase().includes('fetch')) {
          setConnectionError('No se pudo conectar al servidor local. Asegúrate de haber ejecutado el archivo "iniciar-todo.bat" y que el proxy esté activo.');
        } else if (result.error.toLowerCase().includes('api key') || result.error.toLowerCase().includes('clave')) {
          setConnectionError('Tus claves API parecen incorrectas o no tienen permisos suficientes. Revisa que sean correctas y tengan permisos de trading.');
        } else {
          setConnectionError('Error conectando con las APIs: ' + result.error);
        }
      } else {
        setConnectionError('Error conectando con las APIs. Verifica tus claves y conexión a internet.');
      }
    } catch (e) {
      setConnectionError('Error inesperado de conexión. Revisa tu internet y que el proxy esté activo.');
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
          {paperMode && (
            <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <h2 className="text-xl font-bold text-yellow-700 mb-2">¡Bienvenido al modo Simulado!</h2>
              <p className="text-gray-700 mb-2">La inteligencia artificial está lista para guiarte. Recibirás recomendaciones, alertas y podrás practicar inversiones sin riesgo.</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Prueba el dashboard y explora las recomendaciones de IA.</li>
                <li>Simula compras y ventas, revisa tu portafolio y aprende sin miedo a perder dinero.</li>
                <li>La IA te dará consejos y feedback en tiempo real.</li>
              </ul>
            </div>
          )}
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
          {/* Selector explícito de modo: Simulado vs Real */}
          <div className="flex flex-col items-center justify-center mb-8 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-xl">
            <span className="text-lg font-bold text-yellow-800 mb-4">ELIGE EL MODO DE OPERACIÓN</span>
            <div className="flex gap-6 mb-2">
              <button
                type="button"
                className={`flex flex-col items-center px-6 py-3 rounded-xl border-2 font-bold text-lg shadow-md transition-all duration-200 focus:outline-none ${paperMode ? 'bg-green-500 border-green-700 text-white scale-105' : 'bg-white border-gray-300 text-green-700 hover:bg-green-100'}`}
                onClick={() => setPaperMode(true)}
                aria-pressed={paperMode}
              >
                Simulado
                <span className="text-xs font-normal mt-1">Paper Trading</span>
              </button>
              <button
                type="button"
                className={`flex flex-col items-center px-6 py-3 rounded-xl border-2 font-bold text-lg shadow-md transition-all duration-200 focus:outline-none ${!paperMode ? 'bg-blue-600 border-blue-800 text-white scale-105' : 'bg-white border-gray-300 text-blue-700 hover:bg-blue-100'}`}
                onClick={() => setPaperMode(false)}
                aria-pressed={!paperMode}
              >
                Real
                <span className="text-xs font-normal mt-1">Inversión Real</span>
              </button>
            </div>
            <span className="mt-2 text-xs text-gray-700 text-center">
              {paperMode
                ? 'Estás en modo simulado: puedes practicar sin riesgo, todas las operaciones son ficticias.'
                : 'Estás en modo real: tus operaciones serán ejecutadas con dinero real en tu cuenta.'}
            </span>
          </div>
          <div className="text-center mb-8">
            <Key className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Conecta tus APIs de Trading</h1>
            <p className="text-gray-600">Configura tus cuentas de trading real para comenzar a operar</p>
          </div>

          {/* Ayuda Bybit */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">Bybit (Criptomonedas, alternativa fácil)</h3>
              <button
                type="button"
                onClick={() => window.open('https://www.bybit.com/app/user/api-management', '_blank')}
                className="flex items-center space-x-1 text-blue-600 text-sm hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Crear API Key</span>
              </button>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-purple-800">
                <strong>Recomendado para principiantes:</strong> Bybit permite crear una cuenta y API Key en minutos, sin verificación KYC obligatoria para operar con criptomonedas.<br/>
                <b>Paso 1:</b> Regístrate en Bybit.<br/>
                <b>Paso 2:</b> Ve a "API Management" y crea una nueva API Key.<br/>
                <b>Paso 3:</b> Elige "Trade" y <b>NO</b> habilites retiros.<br/>
                <b>Paso 4:</b> Copia tu API Key y Secret Key aquí abajo.
              </p>
            </div>
            <input
              type="text"
              value={credentials.bybitApiKey || ''}
              onChange={e => setCredentials((prev: typeof credentials) => ({ ...prev, bybitApiKey: e.target.value }))}
              placeholder="Bybit API Key"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
              autoComplete="off"
            />
            <input
              type="password"
              value={credentials.bybitSecretKey || ''}
              onChange={e => setCredentials((prev: typeof credentials) => ({ ...prev, bybitSecretKey: e.target.value }))}
              placeholder="Bybit Secret Key"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              autoComplete="off"
            />
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
          {connectionError && !paperMode && (
            <div className="flex flex-col items-center justify-center mb-6">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <span className="text-yellow-700 font-medium text-center">{connectionError}</span>
              <ul className="text-xs text-gray-500 mt-2 list-disc list-inside text-left">
                <li>1. Verifica que ejecutaste <b>iniciar-todo.bat</b> (esto abre dos ventanas: proxy y frontend).</li>
                <li>2. Si cambiaste tus claves API, revisa que sean correctas y tengan permisos de trading.</li>
                <li>3. Si el error persiste, revisa tu conexión a internet y vuelve a intentarlo.</li>
                <li>4. Si usas Binance, asegúrate de que la API Key tenga permisos de "Spot Trading" y <b>NO</b> de retiro.</li>
                <li>5. Si usas Alpaca, comienza con "Paper Trading" para evitar bloqueos.</li>
                <li>6. Si usas Bybit, sigue los pasos de la sección morada para obtener tu API Key.</li>
              </ul>
            </div>
          )}
          {connectionError && paperMode && (
            <div className="flex flex-col items-center justify-center mb-6">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <span className="text-yellow-700 font-medium text-center">Modo simulado: puedes practicar aunque no haya conexión real.</span>
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
                onChange={e => setCredentials((prev: typeof credentials) => ({ ...prev, binanceApiKey: e.target.value }))}
                placeholder="API Key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
                autoComplete="off"
              />
              <div className="relative">
                <input
                  type={showSecrets.binanceSecret ? 'text' : 'password'}
                  value={credentials.binanceSecretKey}
                  onChange={e => setCredentials((prev: typeof credentials) => ({ ...prev, binanceSecretKey: e.target.value }))}
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
                onChange={e => setCredentials((prev: typeof credentials) => ({ ...prev, alpacaApiKey: e.target.value }))}
                placeholder="API Key ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
                autoComplete="off"
              />
              <div className="relative">
                <input
                  type={showSecrets.alpacaSecret ? 'text' : 'password'}
                  value={credentials.alpacaSecretKey}
                  onChange={e => setCredentials((prev: typeof credentials) => ({ ...prev, alpacaSecretKey: e.target.value }))}
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
                onChange={e => setCredentials((prev: typeof credentials) => ({ ...prev, polygonApiKey: e.target.value }))}
                placeholder="API Key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            Solo necesitas una API de Binance, Bybit o Alpaca para comenzar. Tus claves se guardan de forma segura y nunca se comparten.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSetup;