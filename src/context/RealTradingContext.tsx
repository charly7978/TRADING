import React, { createContext, useContext, useState, useEffect } from 'react';
import { realTradingAPI, TradingCredentials, AITradingSignal, RealOrderRequest, RealOrderResponse } from '../services/realTradingAPI';

export interface RealTrade {
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
  commission: number;
  commissionAsset: string;
}

export interface RealAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  type: 'crypto' | 'stock';
  recommendation: 'COMPRAR' | 'VENDER' | 'MANTENER';
  aiScore: number;
  bid: number;
  ask: number;
  high24h: number;
  low24h: number;
}

export interface RealPortfolio {
  totalValue: number;
  dailyPnL: number;
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  availableCash: number;
  assets: { symbol: string; amount: number; value: number; profit: number }[];
  performance: { date: string; value: number }[];
}

export interface RealAIRecommendation {
  symbol: string;
  action: 'COMPRAR' | 'VENDER' | 'MANTENER';
  confidence: number;
  reasoning: string;
  targetPrice: number;
  stopLoss: number;
  potentialReturn: number;
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO';
  riskScore: number;
  timeframe: string;
}

interface RealTradingContextType {
  // Estados básicos
  isAutoTradingActive: boolean;
  setIsAutoTradingActive: (active: boolean) => void;
  portfolio: RealPortfolio;
  trades: RealTrade[];
  assets: RealAsset[];
  riskLevel: 'CONSERVADOR' | 'MODERADO' | 'AGRESIVO';
  setRiskLevel: (level: 'CONSERVADOR' | 'MODERADO' | 'AGRESIVO') => void;
  monthlyBudget: number;
  setMonthlyBudget: (budget: number) => void;
  marketStatus: 'ABIERTO' | 'CERRADO';
  
  // Funciones de trading real
  isConnected: boolean;
  connectToAPIs: (credentials: TradingCredentials) => Promise<boolean>;
  getAIRecommendations: () => Promise<RealAIRecommendation[]>;
  executeRecommendation: (recommendation: RealAIRecommendation, amount: number) => Promise<boolean>;
  refreshMarketData: () => Promise<void>;
  accountBalance: { [key: string]: number };
  
  // Estados de carga
  isLoadingRecommendations: boolean;
  isExecutingTrade: boolean;
  
  // Funciones avanzadas
  getActiveOrders: () => Promise<RealOrderResponse[]>;
  cancelOrder: (orderId: string, symbol: string) => Promise<boolean>;
  getTradeHistory: () => Promise<RealTrade[]>;
  
  // Análisis y métricas
  portfolioMetrics: {
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
    beta: number;
  };
}

const RealTradingContext = createContext<RealTradingContextType | undefined>(undefined);

export const useRealTradingContext = () => {
  const context = useContext(RealTradingContext);
  if (!context) {
    throw new Error('useRealTradingContext must be used within a RealTradingProvider');
  }
  return context;
};

export const RealTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados básicos
  const [isAutoTradingActive, setIsAutoTradingActive] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'CONSERVADOR' | 'MODERADO' | 'AGRESIVO'>('MODERADO');
  const [monthlyBudget, setMonthlyBudget] = useState(500);
  const [trades, setTrades] = useState<RealTrade[]>([]);
  const [assets, setAssets] = useState<RealAsset[]>([]);
  
  // Estados para trading real
  const [isConnected, setIsConnected] = useState(false);
  const [accountBalance, setAccountBalance] = useState<{ [key: string]: number }>({});
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const [currentRecommendations, setCurrentRecommendations] = useState<RealAIRecommendation[]>([]);

  // Portfolio y métricas
  const [portfolio, setPortfolio] = useState<RealPortfolio>({
    totalValue: 0,
    dailyPnL: 0,
    totalPnL: 0,
    winRate: 0,
    totalTrades: 0,
    availableCash: 0,
    assets: [],
    performance: []
  });

  const [portfolioMetrics, setPortfolioMetrics] = useState({
    sharpeRatio: 0,
    maxDrawdown: 0,
    volatility: 0,
    beta: 0
  });

  const [marketStatus] = useState<'ABIERTO' | 'CERRADO'>('ABIERTO');

  // Conectar a APIs de trading reales
  const connectToAPIs = async (credentials: TradingCredentials): Promise<boolean> => {
    try {
      realTradingAPI.setCredentials(credentials);
      
      // Esperar un momento para que se valide la conexión
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const connected = realTradingAPI.isApiConnected();
      setIsConnected(connected);
      
      if (connected) {
        await refreshAccountBalance();
        await refreshMarketData();
        await loadTradeHistory();
        
        // Configurar listeners para datos en tiempo real
        setupRealTimeDataListeners();
      }
      
      return connected;
    } catch (error) {
      console.error('❌ Error conectando a APIs:', error);
      setIsConnected(false);
      return false;
    }
  };

  // Configurar listeners para datos en tiempo real
  const setupRealTimeDataListeners = () => {
    window.addEventListener('marketDataUpdate', (event: any) => {
      const { symbol, price, change24h, volume, type } = event.detail;
      
      setAssets(prevAssets => 
        prevAssets.map(asset => 
          asset.symbol === symbol 
            ? { ...asset, price, change24h, volume }
            : asset
        )
      );
    });
  };

  // Obtener recomendaciones de IA reales
  const getAIRecommendations = async (): Promise<RealAIRecommendation[]> => {
    if (!isConnected) {
      throw new Error('No hay conexión con las APIs de trading');
    }

    setIsLoadingRecommendations(true);
    
    try {
      // Símbolos principales para analizar
      const symbols = ['BTC', 'ETH', 'AAPL', 'TSLA', 'GOOGL', 'MSFT', 'NVDA', 'AMZN'];
      
      // Obtener señales de trading de la IA real
      const signals = await realTradingAPI.performAdvancedMarketAnalysis(symbols);
      
      // Convertir señales a recomendaciones
      const recommendations: RealAIRecommendation[] = signals.map(signal => {
        const riskLevel = signal.confidence > 80 ? 'BAJO' : 
                         signal.confidence > 60 ? 'MEDIO' : 'ALTO';

        return {
          symbol: signal.symbol,
          action: signal.action === 'BUY' ? 'COMPRAR' : 
                 signal.action === 'SELL' ? 'VENDER' : 'MANTENER',
          confidence: signal.confidence,
          reasoning: signal.reasoning,
          targetPrice: signal.targetPrice,
          stopLoss: signal.stopLoss,
          potentialReturn: signal.expectedReturn,
          riskLevel,
          riskScore: signal.riskScore,
          timeframe: signal.timeframe
        };
      });

      // Filtrar solo recomendaciones de alta calidad
      const filteredRecommendations = recommendations.filter(
        rec => rec.action !== 'MANTENER' && rec.confidence > 65
      );

      // Ordenar por confianza
      filteredRecommendations.sort((a, b) => b.confidence - a.confidence);

      setCurrentRecommendations(filteredRecommendations);
      return filteredRecommendations;
      
    } catch (error) {
      console.error('❌ Error obteniendo recomendaciones:', error);
      return [];
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Ejecutar recomendación de trading real
  const executeRecommendation = async (recommendation: RealAIRecommendation, amount: number): Promise<boolean> => {
    if (!isConnected) {
      throw new Error('No hay conexión con las APIs de trading');
    }

    setIsExecutingTrade(true);

    try {
      // Calcular cantidad basada en el monto
      const quantity = amount / recommendation.targetPrice;

      // Crear orden real
      const order: RealOrderRequest = {
        symbol: recommendation.symbol,
        side: recommendation.action === 'COMPRAR' ? 'BUY' : 'SELL',
        quantity: quantity,
        type: 'MARKET' // Usar orden de mercado para ejecución inmediata
      };

      // Ejecutar orden real
      const result = await realTradingAPI.executeRealOrder(order);

      if (result) {
        // Crear registro de trade real
        const newTrade: RealTrade = {
          id: result.orderId,
          symbol: recommendation.symbol,
          type: recommendation.action === 'COMPRAR' ? 'COMPRA' : 'VENTA',
          amount: result.executedQty,
          price: result.price,
          timestamp: result.timestamp,
          status: result.status === 'FILLED' ? 'COMPLETADA' : 'PENDIENTE',
          aiConfidence: recommendation.confidence,
          orderId: result.orderId,
          commission: result.commission,
          commissionAsset: result.commissionAsset
        };

        // Actualizar lista de trades
        setTrades(prevTrades => [newTrade, ...prevTrades]);

        // Actualizar balance y portfolio
        await refreshAccountBalance();
        await updatePortfolioMetrics();

        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Error ejecutando recomendación:', error);
      return false;
    } finally {
      setIsExecutingTrade(false);
    }
  };

  // Actualizar datos de mercado reales
  const refreshMarketData = async (): Promise<void> => {
    if (!isConnected) return;

    try {
      const symbols = ['BTC', 'ETH', 'AAPL', 'TSLA', 'GOOGL', 'MSFT', 'NVDA', 'AMZN'];
      const marketData = await realTradingAPI.getRealMarketData(symbols);
      
      const updatedAssets: RealAsset[] = marketData.map(data => ({
        symbol: data.symbol,
        name: getAssetName(data.symbol),
        price: data.price,
        change24h: data.change24h,
        volume: data.volume,
        type: data.type,
        recommendation: getRecommendationForAsset(data.symbol),
        aiScore: Math.floor(Math.random() * 40) + 60, // Será reemplazado por análisis real
        bid: data.bid,
        ask: data.ask,
        high24h: data.high24h,
        low24h: data.low24h
      }));

      setAssets(updatedAssets);
    } catch (error) {
      console.error('❌ Error actualizando datos de mercado:', error);
    }
  };

  // Actualizar balance de cuenta real
  const refreshAccountBalance = async (): Promise<void> => {
    if (!isConnected) return;

    try {
      const balance = await realTradingAPI.getRealAccountBalance();
      setAccountBalance(balance);
      
      // Actualizar portfolio con datos reales
      const totalValue = Object.entries(balance).reduce((sum, [asset, value]) => {
        if (asset === 'USD' || asset === 'USDT' || asset === 'PORTFOLIO_VALUE') {
          return sum + value;
        }
        return sum;
      }, 0);

      setPortfolio(prev => ({
        ...prev,
        totalValue,
        availableCash: balance.USD || balance.USDT || 0
      }));
    } catch (error) {
      console.error('❌ Error actualizando balance:', error);
    }
  };

  // Cargar historial de trades
  const loadTradeHistory = async (): Promise<void> => {
    try {
      // En una implementación real, esto cargaría el historial desde la API
      // Por ahora, mantenemos los trades en el estado local
      console.log('📊 Cargando historial de trades...');
    } catch (error) {
      console.error('❌ Error cargando historial:', error);
    }
  };

  // Obtener órdenes activas
  const getActiveOrders = async (): Promise<RealOrderResponse[]> => {
    if (!isConnected) return [];
    
    try {
      return await realTradingAPI.getActiveOrders();
    } catch (error) {
      console.error('❌ Error obteniendo órdenes activas:', error);
      return [];
    }
  };

  // Cancelar orden
  const cancelOrder = async (orderId: string, symbol: string): Promise<boolean> => {
    if (!isConnected) return false;
    
    try {
      const success = await realTradingAPI.cancelOrder(orderId, symbol);
      if (success) {
        // Actualizar estado local
        setTrades(prevTrades => 
          prevTrades.map(trade => 
            trade.orderId === orderId 
              ? { ...trade, status: 'CANCELADA' }
              : trade
          )
        );
      }
      return success;
    } catch (error) {
      console.error('❌ Error cancelando orden:', error);
      return false;
    }
  };

  // Obtener historial de trades
  const getTradeHistory = async (): Promise<RealTrade[]> => {
    return trades;
  };

  // Actualizar métricas del portfolio
  const updatePortfolioMetrics = async (): Promise<void> => {
    try {
      // Calcular métricas básicas
      const completedTrades = trades.filter(t => t.status === 'COMPLETADA');
      const profitableTrades = completedTrades.filter(t => (t.profit || 0) > 0);
      
      const winRate = completedTrades.length > 0 ? 
        (profitableTrades.length / completedTrades.length) * 100 : 0;
      
      const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
      
      // Calcular volatilidad (simplificado)
      const returns = completedTrades.map(t => (t.profit || 0) / (t.amount * t.price));
      const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
      const volatility = Math.sqrt(variance) * 100;
      
      // Actualizar portfolio
      setPortfolio(prev => ({
        ...prev,
        winRate,
        totalPnL,
        totalTrades: completedTrades.length,
        dailyPnL: calculateDailyPnL(completedTrades)
      }));
      
      // Actualizar métricas avanzadas
      setPortfolioMetrics({
        sharpeRatio: calculateSharpeRatio(returns),
        maxDrawdown: calculateMaxDrawdown(completedTrades),
        volatility,
        beta: 1.0 // Simplificado
      });
      
    } catch (error) {
      console.error('❌ Error actualizando métricas:', error);
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
      'MSFT': 'Microsoft Corp.',
      'NVDA': 'NVIDIA Corp.',
      'AMZN': 'Amazon.com Inc.'
    };
    return names[symbol] || symbol;
  };

  const getRecommendationForAsset = (symbol: string): 'COMPRAR' | 'VENDER' | 'MANTENER' => {
    const rec = currentRecommendations.find(r => r.symbol === symbol);
    return rec?.action || 'MANTENER';
  };

  const calculateDailyPnL = (trades: RealTrade[]): number => {
    const today = new Date().toDateString();
    const todayTrades = trades.filter(t => t.timestamp.toDateString() === today);
    return todayTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  };

  const calculateSharpeRatio = (returns: number[]): number => {
    if (returns.length === 0) return 0;
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    return stdDev > 0 ? avgReturn / stdDev : 0;
  };

  const calculateMaxDrawdown = (trades: RealTrade[]): number => {
    let maxDrawdown = 0;
    let peak = 0;
    let runningTotal = 0;
    
    trades.forEach(trade => {
      runningTotal += (trade.profit || 0);
      if (runningTotal > peak) {
        peak = runningTotal;
      }
      const drawdown = (peak - runningTotal) / peak * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });
    
    return maxDrawdown;
  };

  // Actualización automática cada 30 segundos si está conectado
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        refreshMarketData();
        refreshAccountBalance();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // Trading automático
  useEffect(() => {
    if (isConnected && isAutoTradingActive) {
      const interval = setInterval(async () => {
        try {
          const recommendations = await getAIRecommendations();
          
          // Ejecutar automáticamente las mejores recomendaciones
          const bestRecommendations = recommendations
            .filter(rec => rec.confidence > 80 && rec.riskLevel !== 'ALTO')
            .slice(0, 2); // Máximo 2 operaciones automáticas
          
          for (const rec of bestRecommendations) {
            const maxAmount = Math.min(monthlyBudget * 0.1, accountBalance.USD || 0); // Máximo 10% del presupuesto
            if (maxAmount > 50) { // Mínimo $50 por operación
              await executeRecommendation(rec, maxAmount);
              await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos entre operaciones
            }
          }
        } catch (error) {
          console.error('❌ Error en trading automático:', error);
        }
      }, 300000); // Cada 5 minutos

      return () => clearInterval(interval);
    }
  }, [isConnected, isAutoTradingActive, monthlyBudget, accountBalance]);

  return (
    <RealTradingContext.Provider
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
        isExecutingTrade,
        
        // Funciones avanzadas
        getActiveOrders,
        cancelOrder,
        getTradeHistory,
        
        // Métricas
        portfolioMetrics
      }}
    >
      {children}
    </RealTradingContext.Provider>
  );
};