// Tipos para compatibilidad con TradingContext y UI demo
export interface AIRecommendation {
  symbol: string;
  action: 'COMPRAR' | 'VENDER' | 'MANTENER';
  confidence: number;
  reasoning: string;
  targetPrice: number;
  stopLoss: number;
  potentialReturn: number;
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO';
}

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  type: 'crypto' | 'stock';
  recommendation: 'COMPRAR' | 'VENDER' | 'MANTENER';
  aiScore: number;
}
// Servicio de trading simulado para demostración
export interface TradingCredentials {
  apiKey?: string;
  secretKey?: string;
  sandbox?: boolean;
}

export interface TradingSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  targetPrice: number;
  stopLoss: number;
  reasoning: string;
}

export interface OrderRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  type: 'MARKET' | 'LIMIT';
  price?: number;
}

export interface OrderResponse {
  orderId: string;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  status: 'NEW' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELED';
  timestamp: Date;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  type: 'crypto' | 'stock';
}

class TradingAPIService {
  // Compatibilidad con TradingContext: recomendaciones IA demo

  // Demo: recomendaciones IA para compatibilidad con TradingContext/UI
  async analyzeMarket(symbols: string[]): Promise<AIRecommendation[]> {
    return symbols.map((symbol, i) => ({
      symbol,
      action: i % 3 === 0 ? 'COMPRAR' : i % 3 === 1 ? 'VENDER' : 'MANTENER',
      confidence: 60 + Math.random() * 40,
      reasoning: 'Simulación IA demo',
      targetPrice: 100 + Math.random() * 100,
      stopLoss: 80 + Math.random() * 50,
      potentialReturn: Math.random() * 10,
      riskLevel: ['BAJO', 'MEDIO', 'ALTO'][i % 3] as 'BAJO' | 'MEDIO' | 'ALTO',
    }));
  }

  // Compatibilidad con TradingContext: activos demo

  // Demo: activos para compatibilidad con TradingContext/UI
  async getMarketData(symbols: string[]): Promise<Asset[]> {
    return symbols.map((symbol, i) => ({
      symbol,
      name: symbol,
      price: 100 + Math.random() * 100,
      change24h: -5 + Math.random() * 10,
      volume: 1000 + Math.random() * 10000,
      type: i % 2 === 0 ? 'crypto' : 'stock',
      recommendation: ['COMPRAR', 'VENDER', 'MANTENER'][i % 3] as 'COMPRAR' | 'VENDER' | 'MANTENER',
      aiScore: Math.random() * 100,
    }));
  }
  // private credentials: TradingCredentials = {}; // (not used in demo)
  private connected = false;


  setCredentials(_: TradingCredentials) {
    // No-op in demo mode; just mark as connected
    this.connected = true;
  }

  isApiConnected(): boolean {
    return this.connected;
  }


  // Demo: ejecución de orden simulada
  async executeOrder(order: OrderRequest): Promise<OrderResponse | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (Math.random() < 0.95) {
      return {
        orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        symbol: order.symbol,
        side: order.side,
        quantity: order.quantity,
        price: order.price || this.getSimulatedPrice(order.symbol),
        status: 'FILLED',
        timestamp: new Date()
      };
    }
    return null;
  }


  // Demo: balance de cuenta simulado
  async getAccountBalance(): Promise<{ [key: string]: number }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      USD: 10000 + Math.random() * 5000,
      USDT: 5000 + Math.random() * 2000,
      BTC: Math.random() * 0.5,
      ETH: Math.random() * 10,
      AAPL: Math.floor(Math.random() * 50),
      TSLA: Math.floor(Math.random() * 20)
    };
  }


  private getSimulatedPrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'BTCUSDT': 45000,
      'BTC': 45000,
      'ETHUSDT': 3000,
      'ETH': 3000,
      'AAPL': 180,
      'TSLA': 250,
      'GOOGL': 140,
      'MSFT': 380
    };
    const basePrice = basePrices[symbol] || basePrices[symbol.replace('USDT', '')] || 100;
    const variation = (Math.random() - 0.5) * 0.1;
    return basePrice * (1 + variation);
  }


  disconnect() {
    this.connected = false;
    // No credentials to clear in demo mode
  }
}

export const tradingAPI = new TradingAPIService();