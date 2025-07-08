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
  private credentials: TradingCredentials = {};
  private connected = false;

  setCredentials(credentials: TradingCredentials) {
    this.credentials = credentials;
    this.connected = true;
  }

  isApiConnected(): boolean {
    return this.connected;
  }

  async analyzeMarket(symbols: string[]): Promise<TradingSignal[]> {
    // Simulación de análisis de mercado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return symbols.map(symbol => {
      const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
      const actions: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      const basePrice = this.getSimulatedPrice(symbol);
      const targetPrice = action === 'BUY' ? basePrice * 1.05 : basePrice * 0.95;
      const stopLoss = action === 'BUY' ? basePrice * 0.98 : basePrice * 1.02;
      
      const reasonings = [
        'Análisis técnico muestra tendencia alcista',
        'RSI indica sobreventa, buena oportunidad de compra',
        'Volumen alto con momentum positivo',
        'Ruptura de resistencia clave',
        'Patrón de velas japonesas alcista',
        'Media móvil cruzando al alza',
        'Divergencia bajista en MACD',
        'Nivel de soporte fuerte detectado'
      ];
      
      return {
        symbol,
        action,
        confidence,
        targetPrice,
        stopLoss,
        reasoning: reasonings[Math.floor(Math.random() * reasonings.length)]
      };
    });
  }

  async executeOrder(order: OrderRequest): Promise<OrderResponse | null> {
    // Simulación de ejecución de orden
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular éxito/fallo (95% éxito)
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

  async getMarketData(symbols: string[]): Promise<MarketData[]> {
    // Simulación de datos de mercado
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return symbols.map(symbol => ({
      symbol,
      price: this.getSimulatedPrice(symbol),
      change24h: (Math.random() - 0.5) * 10, // -5% a +5%
      volume: Math.floor(Math.random() * 1000000) + 100000,
      type: symbol.includes('USDT') || symbol.includes('BTC') || symbol.includes('ETH') ? 'crypto' as const : 'stock' as const
    }));
  }

  async getAccountBalance(): Promise<{ [key: string]: number }> {
    // Simulación de balance de cuenta
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
    // Precios base simulados
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
    
    // Añadir variación aleatoria ±5%
    const variation = (Math.random() - 0.5) * 0.1;
    return basePrice * (1 + variation);
  }

  disconnect() {
    this.connected = false;
    this.credentials = {};
  }
}

export const tradingAPI = new TradingAPIService();