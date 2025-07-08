import React, { useState, useEffect } from 'react';
import { Wallet, ExternalLink, CheckCircle, AlertTriangle, Download } from 'lucide-react';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
  connectedAddress?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect, connectedAddress }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Detectar si MetaMask está instalado
    const checkMetaMask = () => {
      const hasMetaMask = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
      setIsMetaMaskInstalled(hasMetaMask);
      
      if (hasMetaMask) {
        // Verificar si ya está conectado
        window.ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts.length > 0) {
              setIsConnected(true);
              onConnect(accounts[0]);
            }
          })
          .catch(console.error);
      }
    };

    checkMetaMask();
  }, [onConnect]);

  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      // Abrir página de instalación de MetaMask
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Solicitar conexión
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setIsConnected(true);
        onConnect(accounts[0]);
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError('Conexión rechazada por el usuario');
      } else if (err.code === -32002) {
        setError('MetaMask ya está procesando una solicitud');
      } else {
        setError('Error conectando wallet: ' + err.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    onDisconnect();
  };

  const copyAddress = () => {
    if (connectedAddress) {
      navigator.clipboard.writeText(connectedAddress);
      // Mostrar feedback visual
      const button = document.getElementById('copy-address-btn');
      if (button) {
        button.textContent = '¡Copiado!';
        setTimeout(() => {
          button.textContent = 'Copiar';
        }, 2000);
      }
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && connectedAddress) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Wallet Conectada</p>
              <p className="text-xs text-green-700 font-mono">
                {shortenAddress(connectedAddress)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="copy-address-btn"
              onClick={copyAddress}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
            >
              Copiar
            </button>
            <button
              onClick={disconnectWallet}
              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
            >
              Desconectar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      {!isMetaMaskInstalled ? (
        <div className="text-center">
          <Download className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-medium text-blue-900 mb-2">MetaMask no detectado</h3>
          <p className="text-sm text-blue-700 mb-4">
            Necesitas instalar MetaMask para conectar tu wallet
          </p>
          <button
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Instalar MetaMask</span>
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Wallet className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-medium text-blue-900 mb-2">Conectar Wallet</h3>
          <p className="text-sm text-blue-700 mb-4">
            Conecta tu wallet para acceder a todas las funciones
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto disabled:bg-gray-400"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4" />
                <span>Conectar MetaMask</span>
              </>
            )}
          </button>
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm mt-3 justify-center">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 