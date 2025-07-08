import React, { useState } from 'react';
import { useRealTradingContext } from '../context/RealTradingContext';
import { ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';

const API_LINKS = {
  binance: 'https://www.binance.com/en/my/settings/api-management',
  alpaca: 'https://app.alpaca.markets/paper/dashboard/overview',
};

const ApiConnectModal: React.FC = () => {
  const { connectToAPIs } = useRealTradingContext();
  const [tab, setTab] = useState<'binance' | 'alpaca'>('binance');
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleConnect = async () => {
    setStatus('loading');
    setErrorMsg('');
    const credentials =
      tab === 'binance'
        ? { binanceApiKey: apiKey, binanceSecretKey: secretKey }
        : { alpacaApiKey: apiKey, alpacaSecretKey: secretKey };
    const result = await connectToAPIs(credentials);
    if (result.success) {
      setStatus('success');
      setTimeout(() => window.location.reload(), 1000); // Refrescar para forzar re-render global
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Error desconocido');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Conectar cuenta de trading</h2>
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-xl ${tab === 'binance' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => { setTab('binance'); setApiKey(''); setSecretKey(''); setStatus('idle'); setErrorMsg(''); }}
            disabled={status === 'loading'}
          >
            Binance
          </button>
          <button
            className={`flex-1 py-2 rounded-r-xl ${tab === 'alpaca' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => { setTab('alpaca'); setApiKey(''); setSecretKey(''); setStatus('idle'); setErrorMsg(''); }}
            disabled={status === 'loading'}
          >
            Alpaca
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            disabled={status === 'loading'}
          />
          <input
            type="password"
            placeholder="Secret Key"
            value={secretKey}
            onChange={e => setSecretKey(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            disabled={status === 'loading'}
          />
          <div className="flex space-x-2">
            <button
              className="text-xs bg-gray-200 px-2 py-1 rounded"
              onClick={async () => setApiKey(await navigator.clipboard.readText())}
              disabled={status === 'loading'}
            >
              Pegar API Key
            </button>
            <button
              className="text-xs bg-gray-200 px-2 py-1 rounded"
              onClick={async () => setSecretKey(await navigator.clipboard.readText())}
              disabled={status === 'loading'}
            >
              Pegar Secret Key
            </button>
          </div>
          <a
            href={API_LINKS[tab]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 text-sm hover:underline"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            {tab === 'binance' ? 'Crear API Key en Binance' : 'Crear API Key en Alpaca'}
          </a>
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-2 disabled:bg-gray-400"
            onClick={handleConnect}
            disabled={status === 'loading' || !apiKey || !secretKey}
          >
            {status === 'loading' ? 'Conectando...' : 'Conectar'}
          </button>
          {status === 'success' && (
            <div className="flex items-center text-green-600 mt-2">
              <CheckCircle className="h-5 w-5 mr-2" /> ¡Conectado correctamente!
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center text-red-600 mt-2">
              <AlertTriangle className="h-5 w-5 mr-2" /> {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiConnectModal; 