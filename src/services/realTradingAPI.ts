import CryptoJS from 'crypto-js';

// Servicio de trading real con APIs conectadas
const BINANCE_BASE_URL = 'https://api.binance.com';
const ALPACA_BASE_URL = 'https://paper-api.alpaca.markets'; // Cambiar a 'https://api.alpaca.markets' para trading real
const POLYGON_BASE_URL = 'https://api.polygon.io';

export interface TradingCredentials {
  binanceApiKey?: string;
  binanceSecretKey?: string;
  alpacaApiKey?: string;
  alpacaSecretKey?: string;
  polygonApiKey?: string;
}

export interface RealMarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap?: number;
  type: 'crypto' | 'stock';
  bid: number;
  ask: number;
  high24h: number;
  low24h: number;
}

export interface AITradingSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  targetPrice: number;
  stopLoss: number;
  reasoning: string;
  timeframe: string;
  riskScore: number;
  expectedReturn: number;
}

export interface RealOrderRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT';
  price?: number;
  stopPrice?: number;
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
}

export interface RealOrderResponse {
  orderId: string;
  clientOrderId: string;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED';
  timestamp: Date;
  executedQty: number;
  cummulativeQuoteQty: number;
  commission: number;
  commissionAsset: string;
}

class RealTradingAPIService {
  private credentials: TradingCredentials = {};
  private isConnected = false;
  private wsConnections: { [key: string]: WebSocket } = {};

  // Configurar credenciales
  setCredentials(credentials: TradingCredentials) {
    this.credentials = credentials;
    this.validateConnectionWithError();
  }

  // Validar conexión con APIs reales y devolver error exacto
  async validateConnectionWithError(): Promise<{ success: boolean; error?: string }> {
    try {
      let binanceConnected = false;
      let alpacaConnected = false;
      let lastError = '';

      // Verificar Binance
      if (this.credentials.binanceApiKey && this.credentials.binanceSecretKey) {
        try {
          const response = await fetch('http://localhost:4000/api/binance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apiKey: this.credentials.binanceApiKey,
              secretKey: this.credentials.binanceSecretKey,
              endpoint: '/api/v3/account',
              params: {}
            })
          });
          if (response.ok) {
            binanceConnected = true;
          } else {
            const err = await response.json();
            lastError = err.msg || 'Error de conexión con Binance';
          }
        } catch (error: any) {
          lastError = error?.message || 'Error de red con Binance';
        }
      }

      // Verificar Alpaca
      if (this.credentials.alpacaApiKey && this.credentials.alpacaSecretKey) {
        try {
          const response = await fetch('http://localhost:4000/api/alpaca', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apiKey: this.credentials.alpacaApiKey,
              secretKey: this.credentials.alpacaSecretKey,
              endpoint: '/v2/account'
            })
          });
          if (response.ok) {
            alpacaConnected = true;
          } else {
            const err = await response.json();
            lastError = err.message || 'Error de conexión con Alpaca';
          }
        } catch (error: any) {
          lastError = error?.message || 'Error de red con Alpaca';
        }
      }

      this.isConnected = binanceConnected || alpacaConnected;
      if (this.isConnected) {
        this.initializeWebSocketConnections();
        return { success: true };
      } else {
        return { success: false, error: lastError || 'No se pudo conectar a ninguna API' };
      }
    } catch (error: any) {
      this.isConnected = false;
      return { success: false, error: error?.message || 'Error general de conexión' };
    }
  }

  // Inicializar conexiones WebSocket para datos en tiempo real
  private initializeWebSocketConnections() {
    // WebSocket de Binance para precios en tiempo real
    if (this.credentials.binanceApiKey) {
      const binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      
      binanceWs.onopen = () => {
        console.log('🔗 WebSocket Binance conectado');
      };

      binanceWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.processBinanceTickerData(data);
        } catch (error) {
          console.error('Error procesando datos de Binance:', error);
        }
      };

      binanceWs.onerror = (error) => {
        console.error('Error WebSocket Binance:', error);
      };

      this.wsConnections['binance'] = binanceWs;
    }

    // WebSocket de Alpaca para datos de acciones
    if (this.credentials.alpacaApiKey) {
      const alpacaWs = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');
      
      alpacaWs.onopen = () => {
        console.log('🔗 WebSocket Alpaca conectado');
        // Autenticar
        alpacaWs.send(JSON.stringify({
          action: 'auth',
          key: this.credentials.alpacaApiKey,
          secret: this.credentials.alpacaSecretKey
        }));
      };

      alpacaWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.processAlpacaTickerData(data);
        } catch (error) {
          console.error('Error procesando datos de Alpaca:', error);
        }
      };

      this.wsConnections['alpaca'] = alpacaWs;
    }
  }

  // Procesar datos de ticker de Binance
  private processBinanceTickerData(data: any[]) {
    // Procesar datos de precios en tiempo real
    data.forEach(ticker => {
      if (ticker.s && ticker.c) {
        // Emitir evento personalizado con datos actualizados
        window.dispatchEvent(new CustomEvent('marketDataUpdate', {
          detail: {
            symbol: ticker.s,
            price: parseFloat(ticker.c),
            change24h: parseFloat(ticker.P),
            volume: parseFloat(ticker.v),
            type: 'crypto'
          }
        }));
      }
    });
  }

  // Procesar datos de ticker de Alpaca
  private processAlpacaTickerData(data: any) {
    if (data.T === 't' && data.S) { // Trade data
      window.dispatchEvent(new CustomEvent('marketDataUpdate', {
        detail: {
          symbol: data.S,
          price: data.p,
          volume: data.s,
          type: 'stock'
        }
      }));
    }
  }

  // Obtener datos de mercado en tiempo real
  async getRealMarketData(symbols: string[]): Promise<RealMarketData[]> {
    const marketData: RealMarketData[] = [];

    try {
      // Datos de criptomonedas desde Binance (público, no requiere API key)
      const cryptoSymbols = symbols.filter(s => ['BTC', 'ETH', 'BNB', 'ADA', 'DOT', 'LINK', 'LTC', 'BCH'].includes(s));
      if (cryptoSymbols.length > 0) {
        for (const symbol of cryptoSymbols) {
          try {
            const response = await fetch('http://localhost:4000/api/binance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ apiKey: this.credentials.binanceApiKey, secretKey: this.credentials.binanceSecretKey, endpoint: '/api/v3/ticker/24hr', params: { symbol: symbol } })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const tickerData = await response.json();
            
            const orderBookResponse = await fetch('http://localhost:4000/api/binance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ apiKey: this.credentials.binanceApiKey, secretKey: this.credentials.binanceSecretKey, endpoint: '/api/v3/depth', params: { symbol: symbol } })
            });
            if (!orderBookResponse.ok) throw new Error(`HTTP ${orderBookResponse.status}`);
            
            const orderBookData = await orderBookResponse.json();

            if (tickerData.lastPrice && orderBookData.bids && orderBookData.asks) {
              marketData.push({
                symbol: symbol,
                price: parseFloat(tickerData.lastPrice),
                change24h: parseFloat(tickerData.priceChangePercent),
                volume: parseFloat(tickerData.volume),
                type: 'crypto',
                bid: parseFloat(orderBookData.bids[0][0]),
                ask: parseFloat(orderBookData.asks[0][0]),
                high24h: parseFloat(tickerData.highPrice),
                low24h: parseFloat(tickerData.lowPrice)
              });
            }
          } catch (error) {
            console.error(`Error obteniendo datos de ${symbol}:`, error);
          }
        }
      }

      // Datos de acciones usando API pública de Yahoo Finance como fallback
      const stockSymbols = symbols.filter(s => ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'NVDA', 'AMZN', 'META', 'NFLX'].includes(s));
      if (stockSymbols.length > 0) {
        for (const symbol of stockSymbols) {
          try {
            // Usar Polygon si está disponible
            if (this.credentials.polygonApiKey) {
              const response = await fetch('http://localhost:4000/api/polygon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: this.credentials.polygonApiKey, endpoint: `/v2/aggs/ticker/${symbol}/prev`, params: {} })
              });
              if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                  const result = data.results[0];
                  marketData.push({
                    symbol: symbol,
                    price: result.c,
                    change24h: ((result.c - result.o) / result.o) * 100,
                    volume: result.v,
                    type: 'stock',
                    bid: result.c * 0.999,
                    ask: result.c * 1.001,
                    high24h: result.h,
                    low24h: result.l
                  });
                  continue; // Saltar al siguiente símbolo
                } else {
                  throw new Error(`No hay datos reales disponibles para ${symbol}`);
                }
              } else {
                const err = await response.json();
                throw new Error(err.message || `Error de conexión con Polygon para ${symbol}`);
              }
            } else {
              throw new Error(`No hay API Key de Polygon configurada para ${symbol}`);
            }
          } catch (error) {
            console.error(`Error obteniendo datos de ${symbol}:`, error);
            // Lanzar error explícito si no hay datos reales
            throw new Error(`No hay datos reales disponibles para ${symbol}: ${error instanceof Error ? error.message : error}`);
          }
        }
      }

      return marketData;
    } catch (error) {
      console.error('Error obteniendo datos de mercado:', error);
      return [];
    }
  }

  // Análisis avanzado de mercado con IA real
  async performAdvancedMarketAnalysis(symbols: string[]): Promise<AITradingSignal[]> {
    try {
      const signals: AITradingSignal[] = [];
      
      for (const symbol of symbols) {
        // Obtener datos históricos
        const historicalData = await this.getHistoricalData(symbol, '1h', 100);
        const marketData = await this.getRealMarketData([symbol]);
        
        if (historicalData.length > 50 && marketData.length > 0) {
          const currentData = marketData[0];
          
          // Calcular indicadores técnicos avanzados
          const indicators = this.calculateAdvancedIndicators(historicalData);
          
          // Análisis de volumen
          const volumeAnalysis = this.analyzeVolume(historicalData);
          
          // Análisis de patrones de velas
          const candlePatterns = this.detectCandlePatterns(historicalData);
          
          // Análisis de soporte y resistencia
          const supportResistance = this.findSupportResistanceLevels(historicalData);
          
          // Generar señal usando IA
          const signal = this.generateAdvancedTradingSignal(
            currentData,
            indicators,
            volumeAnalysis,
            candlePatterns,
            supportResistance
          );
          
          signals.push(signal);
        }
      }
      
      return signals.filter(signal => signal.confidence > 60);
    } catch (error) {
      console.error('Error en análisis avanzado:', error);
      return [];
    }
  }

  // Obtener datos históricos detallados
  private async getHistoricalData(symbol: string, interval: string, limit: number): Promise<any[]> {
    try {
      if (symbol.includes('USDT') || symbol.includes('BTC') || symbol.includes('ETH')) {
        // Datos de Binance
        const response = await fetch('http://localhost:4000/api/binance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: this.credentials.binanceApiKey, secretKey: this.credentials.binanceSecretKey, endpoint: '/api/v3/klines', params: { symbol: symbol, interval: interval, limit: limit } })
        });
        const data = await response.json();
        
        return data.map((candle: any) => ({
          timestamp: candle[0],
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
          volume: parseFloat(candle[5])
        }));
      } else {
        // Datos de Polygon para acciones
        if (this.credentials.polygonApiKey) {
          const endDate = new Date().toISOString().split('T')[0];
          const startDate = new Date(Date.now() - limit * 60 * 60 * 1000).toISOString().split('T')[0];
          
          const response = await fetch('http://localhost:4000/api/binance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: this.credentials.polygonApiKey, secretKey: this.credentials.polygonSecretKey, endpoint: '/api/v3/klines', params: { symbol: symbol, interval: '1h', limit: limit } })
          });
          const data = await response.json();
          
          return data.map((bar: any) => ({
            timestamp: bar.t,
            open: bar.o,
            high: bar.h,
            low: bar.l,
            close: bar.c,
            volume: bar.v
          }));
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error obteniendo datos históricos:', error);
      return [];
    }
  }

  // Calcular indicadores técnicos avanzados
  private calculateAdvancedIndicators(data: any[]) {
    const closes = data.map(d => d.close);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const volumes = data.map(d => d.volume);

    return {
      rsi: this.calculateRSI(closes, 14),
      macd: this.calculateMACD(closes),
      bollinger: this.calculateBollingerBands(closes, 20, 2),
      stochastic: this.calculateStochastic(highs, lows, closes, 14),
      williams: this.calculateWilliamsR(highs, lows, closes, 14),
      atr: this.calculateATR(highs, lows, closes, 14),
      obv: this.calculateOBV(closes, volumes),
      vwap: this.calculateVWAP(highs, lows, closes, volumes),
      ema20: this.calculateEMA(closes, 20),
      ema50: this.calculateEMA(closes, 50),
      sma200: this.calculateSMA(closes, 200)
    };
  }

  // RSI mejorado
  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  // MACD completo
  private calculateMACD(prices: number[]) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    
    // Calcular señal (EMA de 9 períodos del MACD)
    const macdHistory = [];
    for (let i = 26; i < prices.length; i++) {
      const ema12_i = this.calculateEMA(prices.slice(0, i + 1), 12);
      const ema26_i = this.calculateEMA(prices.slice(0, i + 1), 26);
      macdHistory.push(ema12_i - ema26_i);
    }
    
    const signal = this.calculateEMA(macdHistory, 9);
    const histogram = macdLine - signal;

    return { macd: macdLine, signal, histogram };
  }

  // Bandas de Bollinger
  private calculateBollingerBands(prices: number[], period: number = 20, multiplier: number = 2) {
    const sma = this.calculateSMA(prices, period);
    const variance = prices.slice(-period).reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: sma + (stdDev * multiplier),
      middle: sma,
      lower: sma - (stdDev * multiplier),
      bandwidth: (stdDev * multiplier * 2) / sma * 100
    };
  }

  // Estocástico
  private calculateStochastic(highs: number[], lows: number[], closes: number[], period: number = 14) {
    const recentHighs = highs.slice(-period);
    const recentLows = lows.slice(-period);
    const currentClose = closes[closes.length - 1];
    
    const highestHigh = Math.max(...recentHighs);
    const lowestLow = Math.min(...recentLows);
    
    const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    
    return { k, d: k }; // Simplificado, en producción calcular %D como SMA de %K
  }

  // Williams %R
  private calculateWilliamsR(highs: number[], lows: number[], closes: number[], period: number = 14) {
    const recentHighs = highs.slice(-period);
    const recentLows = lows.slice(-period);
    const currentClose = closes[closes.length - 1];
    
    const highestHigh = Math.max(...recentHighs);
    const lowestLow = Math.min(...recentLows);
    
    return ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
  }

  // ATR (Average True Range)
  private calculateATR(highs: number[], lows: number[], closes: number[], period: number = 14) {
    const trueRanges = [];
    
    for (let i = 1; i < highs.length; i++) {
      const tr1 = highs[i] - lows[i];
      const tr2 = Math.abs(highs[i] - closes[i - 1]);
      const tr3 = Math.abs(lows[i] - closes[i - 1]);
      trueRanges.push(Math.max(tr1, tr2, tr3));
    }
    
    return this.calculateSMA(trueRanges, period);
  }

  // OBV (On Balance Volume)
  private calculateOBV(closes: number[], volumes: number[]) {
    let obv = 0;
    
    for (let i = 1; i < closes.length; i++) {
      if (closes[i] > closes[i - 1]) {
        obv += volumes[i];
      } else if (closes[i] < closes[i - 1]) {
        obv -= volumes[i];
      }
    }
    
    return obv;
  }

  // VWAP (Volume Weighted Average Price)
  private calculateVWAP(highs: number[], lows: number[], closes: number[], volumes: number[]) {
    let totalVolume = 0;
    let totalVolumePrice = 0;
    
    for (let i = 0; i < closes.length; i++) {
      const typicalPrice = (highs[i] + lows[i] + closes[i]) / 3;
      totalVolumePrice += typicalPrice * volumes[i];
      totalVolume += volumes[i];
    }
    
    return totalVolumePrice / totalVolume;
  }

  // EMA (Exponential Moving Average)
  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  // SMA (Simple Moving Average)
  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices.reduce((a, b) => a + b, 0) / prices.length;
    return prices.slice(-period).reduce((a, b) => a + b, 0) / period;
  }

  // Análisis de volumen
  private analyzeVolume(data: any[]) {
    const volumes = data.map(d => d.volume);
    const avgVolume = this.calculateSMA(volumes, 20);
    const currentVolume = volumes[volumes.length - 1];
    
    return {
      currentVolume,
      avgVolume,
      volumeRatio: currentVolume / avgVolume,
      isHighVolume: currentVolume > avgVolume * 1.5,
      volumeTrend: this.calculateVolumetrend(volumes)
    };
  }

  private calculateVolumetrend(volumes: number[]) {
    const recent = volumes.slice(-5);
    const previous = volumes.slice(-10, -5);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    
    return (recentAvg - previousAvg) / previousAvg;
  }

  // Detección de patrones de velas
  private detectCandlePatterns(data: any[]) {
    const patterns: any[] = [];
    const recent = data.slice(-5);
    
    // Doji
    if (this.isDoji(recent[recent.length - 1])) {
      patterns.push({ name: 'Doji', strength: 0.6, bullish: null });
    }
    
    // Hammer
    if (this.isHammer(recent[recent.length - 1])) {
      patterns.push({ name: 'Hammer', strength: 0.7, bullish: true });
    }
    
    // Shooting Star
    if (this.isShootingStar(recent[recent.length - 1])) {
      patterns.push({ name: 'Shooting Star', strength: 0.7, bullish: false });
    }
    
    // Engulfing Pattern
    if (recent.length >= 2) {
      const engulfing = this.isEngulfingPattern(recent[recent.length - 2], recent[recent.length - 1]);
      if (engulfing) {
        patterns.push({ name: 'Engulfing', strength: 0.8, bullish: engulfing.bullish });
      }
    }
    
    return patterns;
  }

  private isDoji(candle: any): boolean {
    const bodySize = Math.abs(candle.close - candle.open);
    const totalRange = candle.high - candle.low;
    return bodySize / totalRange < 0.1;
  }

  private isHammer(candle: any): boolean {
    const bodySize = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    
    return lowerShadow > bodySize * 2 && upperShadow < bodySize * 0.5;
  }

  private isShootingStar(candle: any): boolean {
    const bodySize = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    
    return upperShadow > bodySize * 2 && lowerShadow < bodySize * 0.5;
  }

  private isEngulfingPattern(prev: any, current: any) {
    const prevBullish = prev.close > prev.open;
    const currentBullish = current.close > current.open;
    
    if (prevBullish !== currentBullish) {
      if (currentBullish && current.open < prev.close && current.close > prev.open) {
        return { bullish: true };
      } else if (!currentBullish && current.open > prev.close && current.close < prev.open) {
        return { bullish: false };
      }
    }
    
    return null;
  }

  // Encontrar niveles de soporte y resistencia
  private findSupportResistanceLevels(data: any[]) {
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    
    // Encontrar máximos y mínimos locales
    const resistance = this.findLocalMaxima(highs);
    const support = this.findLocalMinima(lows);
    
    return {
      resistance: resistance.slice(-3), // Últimos 3 niveles de resistencia
      support: support.slice(-3), // Últimos 3 niveles de soporte
      currentPrice: data[data.length - 1].close
    };
  }

  private findLocalMaxima(prices: number[]): number[] {
    const maxima = [];
    for (let i = 2; i < prices.length - 2; i++) {
      if (prices[i] > prices[i-1] && prices[i] > prices[i-2] && 
          prices[i] > prices[i+1] && prices[i] > prices[i+2]) {
        maxima.push(prices[i]);
      }
    }
    return maxima;
  }

  private findLocalMinima(prices: number[]): number[] {
    const minima = [];
    for (let i = 2; i < prices.length - 2; i++) {
      if (prices[i] < prices[i-1] && prices[i] < prices[i-2] && 
          prices[i] < prices[i+1] && prices[i] < prices[i+2]) {
        minima.push(prices[i]);
      }
    }
    return minima;
  }

  // Generar señal de trading avanzada
  private generateAdvancedTradingSignal(
    marketData: RealMarketData,
    indicators: any,
    volumeAnalysis: any,
    patterns: any[],
    supportResistance: any
  ): AITradingSignal {
    let score = 0;
    let reasoning: string[] = [];
    let confidence = 50;

    // Análisis de RSI
    if (indicators.rsi < 30) {
      score += 2;
      reasoning.push('RSI indica sobreventa extrema');
    } else if (indicators.rsi < 40) {
      score += 1;
      reasoning.push('RSI sugiere posible sobreventa');
    } else if (indicators.rsi > 70) {
      score -= 2;
      reasoning.push('RSI indica sobrecompra extrema');
    } else if (indicators.rsi > 60) {
      score -= 1;
      reasoning.push('RSI sugiere posible sobrecompra');
    }

    // Análisis de MACD
    if (indicators.macd.macd > indicators.macd.signal && indicators.macd.histogram > 0) {
      score += 1.5;
      reasoning.push('MACD muestra momentum alcista fuerte');
    } else if (indicators.macd.macd < indicators.macd.signal && indicators.macd.histogram < 0) {
      score -= 1.5;
      reasoning.push('MACD muestra momentum bajista fuerte');
    }

    // Análisis de Bandas de Bollinger
    if (marketData.price < indicators.bollinger.lower) {
      score += 1;
      reasoning.push('Precio por debajo de banda inferior de Bollinger');
    } else if (marketData.price > indicators.bollinger.upper) {
      score -= 1;
      reasoning.push('Precio por encima de banda superior de Bollinger');
    }

    // Análisis de medias móviles
    if (marketData.price > indicators.ema20 && indicators.ema20 > indicators.ema50) {
      score += 1;
      reasoning.push('Tendencia alcista confirmada por EMAs');
    } else if (marketData.price < indicators.ema20 && indicators.ema20 < indicators.ema50) {
      score -= 1;
      reasoning.push('Tendencia bajista confirmada por EMAs');
    }

    // Análisis de volumen
    if (volumeAnalysis.isHighVolume && volumeAnalysis.volumeTrend > 0.2) {
      score += 0.5;
      reasoning.push('Alto volumen con tendencia creciente');
    }

    // Análisis de patrones de velas
    patterns.forEach(pattern => {
      if (pattern.bullish === true) {
        score += pattern.strength;
        reasoning.push(`Patrón alcista detectado: ${pattern.name}`);
      } else if (pattern.bullish === false) {
        score -= pattern.strength;
        reasoning.push(`Patrón bajista detectado: ${pattern.name}`);
      }
    });

    // Análisis de soporte y resistencia
    const nearSupport = supportResistance.support.some((level: number) => 
      Math.abs(marketData.price - level) / marketData.price < 0.02
    );
    const nearResistance = supportResistance.resistance.some((level: number) => 
      Math.abs(marketData.price - level) / marketData.price < 0.02
    );

    if (nearSupport) {
      score += 0.5;
      reasoning.push('Precio cerca de nivel de soporte');
    }
    if (nearResistance) {
      score -= 0.5;
      reasoning.push('Precio cerca de nivel de resistencia');
    }

    // Calcular confianza basada en la convergencia de indicadores
    const indicatorCount = reasoning.length;
    confidence = Math.min(95, 50 + (Math.abs(score) * 10) + (indicatorCount * 2));

    // Determinar acción
    let action: 'BUY' | 'SELL' | 'HOLD';
    let targetPrice: number;
    let stopLoss: number;

    if (score >= 2.5) {
      action = 'BUY';
      targetPrice = marketData.price * (1 + (0.03 + (score * 0.01)));
      stopLoss = marketData.price * (1 - (0.02 + (indicators.atr / marketData.price)));
    } else if (score <= -2.5) {
      action = 'SELL';
      targetPrice = marketData.price * (1 - (0.03 + (Math.abs(score) * 0.01)));
      stopLoss = marketData.price * (1 + (0.02 + (indicators.atr / marketData.price)));
    } else {
      action = 'HOLD';
      targetPrice = marketData.price;
      stopLoss = marketData.price;
      confidence = Math.min(confidence, 60);
    }

    const expectedReturn = action === 'BUY' ? 
      ((targetPrice - marketData.price) / marketData.price) * 100 :
      action === 'SELL' ?
      ((marketData.price - targetPrice) / marketData.price) * 100 : 0;

    return {
      symbol: marketData.symbol,
      action,
      confidence,
      targetPrice,
      stopLoss,
      reasoning: reasoning.join(', '),
      timeframe: '1H',
      riskScore: Math.abs(score),
      expectedReturn
    };
  }

  // Ejecutar orden real
  async executeRealOrder(order: RealOrderRequest): Promise<RealOrderResponse | null> {
    try {
      if (order.symbol.includes('USDT') || order.symbol.includes('BTC') || order.symbol.includes('ETH')) {
        return await this.executeBinanceOrder(order);
      } else {
        return await this.executeAlpacaOrder(order);
      }
    } catch (error) {
      console.error('❌ Error ejecutando orden real:', error);
      return null;
    }
  }

  // Ejecutar orden en Binance
  private async executeBinanceOrder(order: RealOrderRequest): Promise<RealOrderResponse> {
    const timestamp = Date.now();
    const symbol = order.symbol.includes('USDT') ? order.symbol : `${order.symbol}USDT`;
    
    const params: any = {
      symbol,
      side: order.side,
      type: order.type,
      quantity: order.quantity.toFixed(8),
      timestamp
    };

    if (order.type === 'LIMIT' && order.price) {
      params.price = order.price.toFixed(8);
      params.timeInForce = order.timeInForce || 'GTC';
    }

    if (order.type === 'STOP_LOSS' && order.stopPrice) {
      params.stopPrice = order.stopPrice.toFixed(8);
    }

    // Crear query string para firma
    const queryString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    // Generar firma HMAC SHA256
    const signature = this.createBinanceSignature(queryString, this.credentials.binanceSecretKey!);
    
    const response = await fetch('http://localhost:4000/api/binance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: this.credentials.binanceApiKey,
        secretKey: this.credentials.binanceSecretKey,
        endpoint: '/api/v3/order',
        params: {
          ...params,
          signature
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Binance API Error: ${error.msg}`);
    }

    const data = await response.json();

    return {
      orderId: data.orderId.toString(),
      clientOrderId: data.clientOrderId,
      symbol: data.symbol,
      side: data.side,
      quantity: parseFloat(data.origQty),
      price: parseFloat(data.price || data.fills?.[0]?.price || '0'),
      status: data.status,
      timestamp: new Date(data.transactTime),
      executedQty: parseFloat(data.executedQty),
      cummulativeQuoteQty: parseFloat(data.cummulativeQuoteQty),
      commission: data.fills?.reduce((sum: number, fill: any) => sum + parseFloat(fill.commission), 0) || 0,
      commissionAsset: data.fills?.[0]?.commissionAsset || 'USDT'
    };
  }

  // Ejecutar orden en Alpaca
  private async executeAlpacaOrder(order: RealOrderRequest): Promise<RealOrderResponse> {
    const orderData: any = {
      symbol: order.symbol,
      qty: order.quantity,
      side: order.side.toLowerCase(),
      type: order.type.toLowerCase(),
      time_in_force: order.timeInForce?.toLowerCase() || 'day'
    };

    if (order.type === 'LIMIT' && order.price) {
      orderData.limit_price = order.price;
    }

    if (order.type === 'STOP_LOSS' && order.stopPrice) {
      orderData.stop_price = order.stopPrice;
    }

    const response = await fetch('http://localhost:4000/api/alpaca', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: this.credentials.alpacaApiKey,
        secretKey: this.credentials.alpacaSecretKey,
        endpoint: '/v2/orders',
        params: orderData
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Alpaca API Error: ${error.message}`);
    }

    const data = await response.json();

    return {
      orderId: data.id,
      clientOrderId: data.client_order_id || data.id,
      symbol: data.symbol,
      side: data.side.toUpperCase(),
      quantity: parseFloat(data.qty),
      price: parseFloat(data.filled_avg_price || data.limit_price || '0'),
      status: data.status.toUpperCase(),
      timestamp: new Date(data.created_at),
      executedQty: parseFloat(data.filled_qty || '0'),
      cummulativeQuoteQty: parseFloat(data.filled_avg_price || '0') * parseFloat(data.filled_qty || '0'),
      commission: 0, // Alpaca no cobra comisiones
      commissionAsset: 'USD'
    };
  }

  // Crear firma HMAC SHA256 para Binance
  private createBinanceSignature(queryString: string, secretKey: string): string {
    return CryptoJS.HmacSHA256(queryString, secretKey).toString();
  }

  // Obtener balance real de la cuenta
  async getRealAccountBalance(): Promise<{ [key: string]: number }> {
    const balances: { [key: string]: number } = {};

    try {
      // Balance de Binance
      if (this.credentials.binanceApiKey && this.credentials.binanceSecretKey) {
        const response = await fetch('http://localhost:4000/api/binance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: this.credentials.binanceApiKey,
            secretKey: this.credentials.binanceSecretKey,
            endpoint: '/api/v3/account',
            params: {}
          })
        });

        if (response.ok) {
          const data = await response.json();
          data.balances.forEach((balance: any) => {
            const free = parseFloat(balance.free);
            const locked = parseFloat(balance.locked);
            if (free > 0 || locked > 0) {
              balances[balance.asset] = free + locked;
            }
          });
        }
      }

      // Balance de Alpaca
      if (this.credentials.alpacaApiKey && this.credentials.alpacaSecretKey) {
        const response = await fetch('http://localhost:4000/api/alpaca', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: this.credentials.alpacaApiKey,
            secretKey: this.credentials.alpacaSecretKey,
            endpoint: '/v2/account'
          })
        });

        if (response.ok) {
          const data = await response.json();
          balances['USD'] = parseFloat(data.cash);
          balances['PORTFOLIO_VALUE'] = parseFloat(data.portfolio_value);
          balances['BUYING_POWER'] = parseFloat(data.buying_power);
        }
      }

      return balances;
    } catch (error) {
      console.error('❌ Error obteniendo balance real:', error);
      return {};
    }
  }

  // Obtener órdenes activas
  async getActiveOrders(): Promise<RealOrderResponse[]> {
    const orders: RealOrderResponse[] = [];

    try {
      // Órdenes de Binance
      if (this.credentials.binanceApiKey && this.credentials.binanceSecretKey) {
        const response = await fetch('http://localhost:4000/api/binance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: this.credentials.binanceApiKey,
            secretKey: this.credentials.binanceSecretKey,
            endpoint: '/api/v3/openOrders',
            params: {}
          })
        });

        if (response.ok) {
          const data = await response.json();
          data.forEach((order: any) => {
            orders.push({
              orderId: order.orderId.toString(),
              clientOrderId: order.clientOrderId,
              symbol: order.symbol,
              side: order.side,
              quantity: parseFloat(order.origQty),
              price: parseFloat(order.price),
              status: order.status,
              timestamp: new Date(order.time),
              executedQty: parseFloat(order.executedQty),
              cummulativeQuoteQty: parseFloat(order.cummulativeQuoteQty),
              commission: 0,
              commissionAsset: 'USDT'
            });
          });
        }
      }

      // Órdenes de Alpaca
      if (this.credentials.alpacaApiKey && this.credentials.alpacaSecretKey) {
        const response = await fetch('http://localhost:4000/api/alpaca', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: this.credentials.alpacaApiKey,
            secretKey: this.credentials.alpacaSecretKey,
            endpoint: '/v2/orders',
            params: {
              status: 'open'
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          data.forEach((order: any) => {
            orders.push({
              orderId: order.id,
              clientOrderId: order.client_order_id || order.id,
              symbol: order.symbol,
              side: order.side.toUpperCase(),
              quantity: parseFloat(order.qty),
              price: parseFloat(order.limit_price || order.stop_price || '0'),
              status: order.status.toUpperCase(),
              timestamp: new Date(order.created_at),
              executedQty: parseFloat(order.filled_qty || '0'),
              cummulativeQuoteQty: 0,
              commission: 0,
              commissionAsset: 'USD'
            });
          });
        }
      }

      return orders;
    } catch (error) {
      console.error('❌ Error obteniendo órdenes activas:', error);
      return [];
    }
  }

  // Cancelar orden
  async cancelOrder(orderId: string, symbol: string): Promise<boolean> {
    try {
      if (symbol.includes('USDT') || symbol.includes('BTC') || symbol.includes('ETH')) {
        // Cancelar en Binance
        const response = await fetch('http://localhost:4000/api/binance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: this.credentials.binanceApiKey,
            secretKey: this.credentials.binanceSecretKey,
            endpoint: '/api/v3/order',
            params: {
              symbol,
              orderId,
              timestamp: Date.now()
            }
          })
        });

        return response.ok;
      } else {
        // Cancelar en Alpaca
        const response = await fetch('http://localhost:4000/api/alpaca', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: this.credentials.alpacaApiKey,
            secretKey: this.credentials.alpacaSecretKey,
            endpoint: `/v2/orders/${orderId}`
          })
        });

        return response.ok;
      }
    } catch (error) {
      console.error('❌ Error cancelando orden:', error);
      return false;
    }
  }

  // Verificar estado de conexión
  isApiConnected(): boolean {
    return this.isConnected;
  }

  // Cerrar conexiones WebSocket
  disconnect() {
    Object.values(this.wsConnections).forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    this.wsConnections = {};
    this.isConnected = false;
  }
}

export const realTradingAPI = new RealTradingAPIService();