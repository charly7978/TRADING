import React, { createContext, useContext, useState, useEffect } from 'react';
import { TradingCredentials, OrderRequest } from '../services/tradingAPI';
import { tradingAPI } from '../services/tradingAPI';

export interface Trade {
  id: string;
  symbol: string;
  type: 'COMPRA' | 'VENTA';
  amount: number;
  price: number;
  timestamp: Date;
  profit?: number;
  status: 'COMPLETADA' | 'PENDIENTE' | 'CANCELADA';
  aiConfidence: number;
  orderId?: string;
}

// (Usar Asset de tradingAPI)

export interface Portfolio {
  totalValue: number;
  dailyPnL: number;
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  availableCash: number;
  assets: { symbol: string; amount: number; value: number; profit: number }[];
}

// (Usar AIRecommendation de tradingAPI)

interface TradingContextType {
  // Estados básicos
  isAutoTradingActive: boolean;
  setIsAutoTradingActive: (active: boolean) => void;
  portfolio: Portfolio;
  trades: Trade[];
  assets: import('../services/tradingAPI').Asset[];
  riskLevel: 'CONSERVADOR' | 'MODERADO' | 'AGRESIVO';
  setRiskLevel: (level: 'CONSERVADOR' | 'MODERADO' | 'AGRESIVO') => void;
  monthlyBudget: number;
  setMonthlyBudget: (budget: number) => void;
  aiRecommendations: string[];
  marketStatus: 'ABIERTO' | 'CERRADO';
  
  // Nuevas funciones para trading real
  isConnected: boolean;
  connectToAPIs: (credentials: TradingCredentials) => Promise<boolean>;
  getAIRecommendations: () => Promise<import('../services/tradingAPI').AIRecommendation[]>;
  executeRecommendation: (recommendation: import('../services/tradingAPI').AIRecommendation, amount: number) => Promise<boolean>;
  refreshMarketData: () => Promise<void>;
  accountBalance: { [key: string]: number };
  
  // Estados de carga
  isLoadingRecommendations: boolean;
  isExecutingTrade: boolean;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados básicos
  const [isAutoTradingActive, setIsAutoTradingActive] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'CONSERVADOR' | 'MODERADO' | 'AGRESIVO'>('MODERADO');
  const [monthlyBudget, setMonthlyBudget] = useState(500);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [assets, setAssets] = useState<import('../services/tradingAPI').Asset[]>([]);
  
  // Estados para trading real
  const [isConnected, setIsConnected] = useState(false);
  const [accountBalance, setAccountBalance] = useState<{ [key: string]: number }>({});
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const [currentRecommendations, setCurrentRecommendations] = useState<import('../services/tradingAPI').AIRecommendation[]>([]);

  // Portfolio calculado dinámicamente
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalValue: 0,
    dailyPnL: 0,
    totalPnL: 0,
    winRate: 0,
    totalTrades: 0,
    availableCash: 0,
    assets: []
  });

  const [aiRecommendations] = useState([
    "El mercado muestra tendencia alcista. Recomiendo aumentar posición en tecnológicas.",
    "Bitcoin está en zona de soporte fuerte. Buena oportunidad de compra.",
    "Volatilidad baja detectada. Momento ideal para estrategias conservadoras."
  ]);

  const [marketStatus] = useState<'ABIERTO' | 'CERRADO'>('ABIERTO');

  // Conectar a APIs de trading
  const connectToAPIs = async (credentials: TradingCredentials): Promise<boolean> => {
    try {
      tradingAPI.setCredentials(credentials);
      const connected = tradingAPI.isApiConnected();
      setIsConnected(connected);
      
      if (connected) {
        await refreshAccountBalance();
        await refreshMarketData();
      }
      
      return connected;
    } catch (error) {
      console.error('Error conectando a APIs:', error);
      setIsConnected(false);
      return false;
    }
  };

  // Obtener recomendaciones de IA
  const getAIRecommendations = async (): Promise<import('../services/tradingAPI').AIRecommendation[]> => {
    if (!isConnected) {
      throw new Error('No hay conexión con las APIs de trading');
    }

    setIsLoadingRecommendations(true);
    
    try {
      // Símbolos principales para analizar
      const symbols = ['BTCUSDT', 'ETHUSDT', 'AAPL', 'TSLA', 'GOOGL', 'MSFT'];
      
      // Obtener señales de trading de la IA
      const signals = await tradingAPI.analyzeMarket(symbols);
      
      // Convertir señales a recomendaciones
      // signals ya es AIRecommendation[] en demo
      const recommendations: import('../services/tradingAPI').AIRecommendation[] = signals;

      // Filtrar solo recomendaciones de compra/venta con alta confianza
      const filteredRecommendations = recommendations.filter(
        rec => rec.action !== 'MANTENER' && rec.confidence > 60
      );

      setCurrentRecommendations(filteredRecommendations);
      return filteredRecommendations;
      
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error);
      return [];
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Ejecutar recomendación de trading
  const executeRecommendation = async (recommendation: import('../services/tradingAPI').AIRecommendation, amount: number): Promise<boolean> => {
    if (!isConnected) {
      throw new Error('No hay conexión con las APIs de trading');
    }

    setIsExecutingTrade(true);

    try {
      // Calcular cantidad basada en el monto
      const quantity = amount / recommendation.targetPrice;

      // Crear orden
      const order: OrderRequest = {
        symbol: recommendation.symbol,
        side: recommendation.action === 'COMPRAR' ? 'BUY' : 'SELL',
        quantity: quantity,
        type: 'MARKET' // Usar orden de mercado para ejecución inmediata
      };

      // Ejecutar orden
      const result = await tradingAPI.executeOrder(order);

      if (result) {
        // Crear registro de trade
        const newTrade: Trade = {
          id: result.orderId,
          symbol: recommendation.symbol,
          type: recommendation.action === 'COMPRAR' ? 'COMPRA' : 'VENTA',
          amount: result.quantity,
          price: result.price,
          timestamp: result.timestamp,
          status: result.status === 'FILLED' ? 'COMPLETADA' : 'PENDIENTE',
          aiConfidence: recommendation.confidence,
          orderId: result.orderId
        };

        // Actualizar lista de trades
        setTrades(prevTrades => [newTrade, ...prevTrades]);

        // Actualizar balance
        await refreshAccountBalance();

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error ejecutando recomendación:', error);
      return false;
    } finally {
      setIsExecutingTrade(false);
    }
  };

  // Actualizar datos de mercado
  const refreshMarketData = async (): Promise<void> => {
    if (!isConnected) return;

    try {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'AAPL', 'TSLA', 'GOOGL', 'MSFT'];
      const marketData = await tradingAPI.getMarketData(symbols);
      
      const updatedAssets: import('../services/tradingAPI').Asset[] = marketData.map(data => ({
        symbol: data.symbol,
        name: getAssetName(data.symbol),
        price: data.price,
        change24h: data.change24h,
        volume: data.volume,
        type: data.type,
        recommendation: getRecommendationForAsset(data.symbol),
        aiScore: Math.floor(Math.random() * 40) + 60 // Simulado por ahora
      }));

      setAssets(updatedAssets);
    } catch (error) {
      console.error('Error actualizando datos de mercado:', error);
    }
  };

  // Actualizar balance de cuenta
  const refreshAccountBalance = async (): Promise<void> => {
    if (!isConnected) return;

    try {
      const balance = await tradingAPI.getAccountBalance();
      setAccountBalance(balance);
      
      // Actualizar portfolio
      const totalValue = Object.values(balance).reduce((sum: number, value: number) => sum + value, 0);
      setPortfolio(prev => ({
        ...prev,
        totalValue: totalValue as number,
        availableCash: balance.USD || balance.USDT || 0
      }));
    } catch (error) {
      console.error('Error actualizando balance:', error);
    }
  };

  // Funciones auxiliares
  const getAssetName = (symbol: string): string => {
    const names: { [key: string]: string } = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'AAPL': 'Apple Inc.',
      'TSLA': 'Tesla Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corp.'
    };
    return names[symbol] || symbol;
  };

  const getRecommendationForAsset = (symbol: string): 'COMPRAR' | 'VENDER' | 'MANTENER' => {
    const rec = currentRecommendations.find(r => r.symbol === symbol);
    return rec?.action || 'MANTENER';
  };

  // Actualización automática cada 30 segundos si está conectado
  useEffect(() => {
    if (isConnected && isAutoTradingActive) {
      const interval = setInterval(() => {
        refreshMarketData();
        refreshAccountBalance();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isConnected, isAutoTradingActive]);

  return (
    <TradingContext.Provider
      value={{
        // Estados básicos
        isAutoTradingActive,
        setIsAutoTradingActive,
        portfolio,
        trades,
        assets,
        riskLevel,
        setRiskLevel,
        monthlyBudget,
        setMonthlyBudget,
        aiRecommendations,
        marketStatus,
        
        // Funciones de trading real
        isConnected,
        connectToAPIs,
        getAIRecommendations,
        executeRecommendation,
        refreshMarketData,
        accountBalance,
        
        // Estados de carga
        isLoadingRecommendations,
        isExecutingTrade
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};