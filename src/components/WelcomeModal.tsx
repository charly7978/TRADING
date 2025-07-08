import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Shield, Bot, GraduationCap, Key, CheckCircle, Eye, EyeOff, Loader, ExternalLink, Clipboard, Wallet } from 'lucide-react';
import { useActiveTradingContext } from '../context/useActiveTradingContext';

interface WelcomeModalProps {
  onClose: () => void;
}

const apiGuides = [
  {
    name: 'Binance',
    color: 'yellow',
    url: 'https://www.binance.com/en/my/settings/api-management',
    steps: [
      'Inicia sesión en Binance',
      'Ve a Perfil → Gestión de API',
      'Crea una nueva API Key',
      'Habilita "Spot Trading" y desactiva retiros',
      'Copia la API Key y Secret Key aquí'
    ]
  },
  {
    name: 'Alpaca',
    color: 'green',
    url: 'https://alpaca.markets/',
    steps: [
      'Crea una cuenta en Alpaca',
      'Ve a Paper Trading → API Keys',
      'Genera nuevas claves',
      'Copia la API Key y Secret Key aquí'
    ]
  }
];

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const { isConnected, connectToAPIs } = useActiveTradingContext();
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
    binanceApiKey: '',
    binanceSecretKey: '',
    alpacaApiKey: '',
    alpacaSecretKey: ''
  });
  const [showSecrets, setShowSecrets] = useState({
    binanceSecret: false,
    alpacaSecret: false
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [success, setSuccess] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  // Integración básica con MetaMask
  const handleConnectWallet = async () => {
    setIsWalletConnecting(true);
    setConnectionError('');
    try {
      if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setConnectionError('No se detectó MetaMask. Instala la extensión para continuar.');
      }
    } catch (e) {
      setConnectionError('Error al conectar la wallet. Intenta de nuevo.');
    } finally {
      setIsWalletConnecting(false);
    }
  };

  // Detección y pegado automático desde portapapeles
  const handlePaste = async (field: keyof typeof credentials) => {
    try {
      const text = await navigator.clipboard.readText();
      setCredentials(prev => ({ ...prev, [field]: text }));
    } catch {}
  };

  // Validación simple de formato de clave
  const isValidKey = (key: string) => key.length > 10;

  // Conexión automática al completar campos
  useEffect(() => {
    setConnectionError('');
    setSuccess(false);
    if (
      (isValidKey(credentials.binanceApiKey) && isValidKey(credentials.binanceSecretKey)) ||
      (isValidKey(credentials.alpacaApiKey) && isValidKey(credentials.alpacaSecretKey))
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
          onClose();
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

  // Wizard de bienvenida y conexión
  if (isConnected || success || walletAddress) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
            <div className="bg-gradient-to-br from-green-500 to-blue-500 p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">¡Todo listo!</h2>
              <p className="text-white/90 font-medium">Wallet conectada: {walletAddress ? walletAddress.slice(0, 8) + '...' : 'APIs conectadas'}</p>
            </div>
          </div>
          <div className="p-6 text-center">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              ¡Empezar!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
          <div className="bg-gradient-to-br from-blue-500 to-green-500 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Conecta tu cuenta de inversión</h2>
            <p className="text-white/90 font-medium">Elige la forma más fácil para ti. ¡Automatiza tus inversiones en segundos!</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Opción 1: Wallet Web3 */}
          <button
            onClick={handleConnectWallet}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            disabled={isWalletConnecting}
          >
            <Wallet className="h-5 w-5" />
            <span>{isWalletConnecting ? 'Conectando Wallet...' : 'Conectar Wallet (MetaMask, Web3)'}</span>
          </button>
          <div className="text-center text-gray-400 text-xs">Recomendado para máxima facilidad y seguridad</div>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-xs">o</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Opción 2: API Key (Binance) */}
          {apiGuides.map((api) => (
            <div key={api.name} className="mb-4">
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${api.color}-100 mr-3`}>
                  <span className={`text-${api.color}-600 font-bold text-lg`}>{api.name[0]}</span>
                </div>
                <h3 className="font-bold text-gray-900">{api.name}</h3>
                <a
                  href={api.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center text-xs text-blue-600 hover:underline"
                >
                  Ir a {api.name} <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <ol className="list-decimal list-inside text-gray-600 text-sm mb-2">
                {api.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              {/* Campos de claves */}
              <div className="grid grid-cols-1 gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={credentials[`${api.name.toLowerCase()}ApiKey`]}
                    onChange={e => setCredentials(prev => ({ ...prev, [`${api.name.toLowerCase()}ApiKey`]: e.target.value }))}
                    placeholder="API Key"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => handlePaste(`${api.name.toLowerCase()}ApiKey` as any)}
                    className="absolute right-3 top-2 text-gray-400 hover:text-blue-600"
                    title="Pegar del portapapeles"
                  >
                    <Clipboard className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showSecrets[`${api.name.toLowerCase()}Secret`] ? 'text' : 'password'}
                    value={credentials[`${api.name.toLowerCase()}SecretKey`]}
                    onChange={e => setCredentials(prev => ({ ...prev, [`${api.name.toLowerCase()}SecretKey`]: e.target.value }))}
                    placeholder="Secret Key"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecrets(prev => ({ ...prev, [`${api.name.toLowerCase()}Secret`]: !prev[`${api.name.toLowerCase()}Secret`] }))}
                    className="absolute right-8 top-2 text-gray-400 hover:text-blue-600"
                    title="Mostrar/ocultar"
                  >
                    {showSecrets[`${api.name.toLowerCase()}Secret`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaste(`${api.name.toLowerCase()}SecretKey` as any)}
                    className="absolute right-3 top-2 text-gray-400 hover:text-blue-600"
                    title="Pegar del portapapeles"
                  >
                    <Clipboard className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Feedback visual */}
          {isWalletConnecting && (
            <div className="flex items-center justify-center mb-2">
              <Loader className="h-6 w-6 text-purple-600 animate-spin mr-2" />
              <span className="text-purple-700 font-medium">Conectando Wallet...</span>
            </div>
          )}
          {isConnecting && (
            <div className="flex items-center justify-center mb-2">
              <Loader className="h-6 w-6 text-blue-600 animate-spin mr-2" />
              <span className="text-blue-700 font-medium">Conectando API...</span>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-green-700 font-medium">¡Conexión exitosa!</span>
            </div>
          )}
          {connectionError && (
            <div className="flex items-center justify-center mb-2">
              <span className="text-red-700 font-medium">{connectionError}</span>
            </div>
          )}

          <div className="text-center text-gray-500 text-xs mt-4">
            Puedes elegir la opción que prefieras. Tus datos están seguros y nunca se comparten.
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;