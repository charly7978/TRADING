import React, { useState } from 'react';
import { useRealTradingContext, RealAIRecommendation } from '../context/RealTradingContext';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  Zap,
  AlertTriangle,
  Loader
} from 'lucide-react';
import { ResponsiveContainer } from 'recharts';

const Trading = () => {
  const { assets, trades, isConnected, isLoadingRecommendations, currentRecommendations } = useRealTradingContext();
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [timeframe, setTimeframe] = useState('1H');

  // Eliminar strategies simuladas
  // const strategies = [
  //   { name: 'LSTM Momentum', active: true, performance: '+12.5%', confidence: 89 },
  //   { name: 'RSI Divergence', active: true, performance: '+8.3%', confidence: 76 },
  //   { name: 'Breakout Detection', active: false, performance: '+5.1%', confidence: 68 },
  //   { name: 'DQN Reinforcement', active: true, performance: '+15.2%', confidence: 92 }
  // ];

  // Función para obtener la recomendación de IA para el activo seleccionado
  const getAIRecommendationForSelectedAsset = () => {
    if (!selectedAsset) return null;
    return currentRecommendations.find((rec: RealAIRecommendation) => rec.symbol === selectedAsset.symbol);
  };

  const selectedAssetRecommendation = getAIRecommendationForSelectedAsset();

  if (!isConnected) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Conexión Requerida
          </h2>
          <p className="text-gray-400 mb-6">
            Necesitas conectar tus APIs de trading para usar el terminal de trading en vivo.
          </p>
          <button
            onClick={() => window.location.href = '/trading-setup'}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Conectar APIs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Live Trading Terminal</h1>
            <p className="text-gray-400 mt-1">Real-time market data and AI-powered trading execution</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-lg">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Live Data</span>
            </div>
          </div>
        </div>

        {/* Asset Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {assets.length > 0 ? assets.map((asset) => {
            const isSelected = selectedAsset?.symbol === asset.symbol;
            const isPositive = asset.change24h > 0;
            
            return (
              <div
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-purple-600/30 border-purple-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{asset.symbol}</span>
                  <span className={`text-xs px-2 py-1 rounded ${asset.type === 'crypto' ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'}`}>
                    {asset.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-lg font-bold text-white">${asset.price.toLocaleString()}</p>
                <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                </div>
              </div>
            );
          }) : (
            <div className="col-span-4 text-center py-12 text-gray-400">
              No hay activos disponibles. Asegúrate de que tus APIs estén conectadas.
            </div>
          )}
        </div>

        {/* Main Trading Interface */}
        {selectedAsset ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Price Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{selectedAsset?.name} Price Chart</h3>
              <div className="flex items-center space-x-2">
                {['5M', '15M', '1H', '4H', '1D'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                      timeframe === tf
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={400}>
                {/* Aquí deberías integrar datos reales de precios históricos si están disponibles */}
                <div className="text-gray-400 text-center py-12">(Integrar gráfico de precios real aquí)</div>
            </ResponsiveContainer>
          </div>

          {/* Order Panel */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-6">AI Trading Control</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Current Price</span>
                    <span className="text-white font-bold">${selectedAsset?.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">24h Change</span>
                    <span className={selectedAsset?.change24h > 0 ? 'text-green-400' : 'text-red-400'}>
                      {selectedAsset?.change24h > 0 ? '+' : ''}{selectedAsset?.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Volume</span>
                    <span className="text-white">${(selectedAsset?.volume / 1000000).toFixed(1)}M</span>
                  </div>
                </div>

                {isLoadingRecommendations ? (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                    <Loader className="h-6 w-6 text-blue-400 animate-spin mx-auto mb-2" />
                    <p className="text-blue-400 font-medium">Analizando para IA...</p>
              </div>
                ) : selectedAssetRecommendation ? (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">Recomendación de IA</span>
                    </div>
                    <p className="text-white font-bold">{selectedAssetRecommendation.action}</p>
                    <p className="text-sm text-gray-300">Confianza: {selectedAssetRecommendation.confidence}%</p>
                    <p className="text-sm text-gray-300">Razón: {selectedAssetRecommendation.reasoning}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 font-medium">Recomendación de IA</span>
                </div>
                    <p className="text-gray-300 font-bold">No hay recomendación</p>
                    <p className="text-sm text-gray-400">La IA no ha encontrado una oportunidad clara para {selectedAsset?.symbol}.</p>
              </div>
                )}

              <button
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                    selectedAssetRecommendation && selectedAssetRecommendation.action !== 'MANTENER'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                  disabled={!selectedAssetRecommendation || selectedAssetRecommendation.action === 'MANTENER'}
              >
                  Ejecutar Operación de IA
              </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-400">
            Selecciona un activo para ver los detalles de trading.
        </div>
        )}

        {/* Trading Strategies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Strategies */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Estrategias de Trading de IA</h3>
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            
            <div className="space-y-4 text-gray-400 text-center py-12">
              (Las estrategias de IA se gestionan internamente y no son configurables manualmente aquí.)
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-6">Operaciones Recientes de IA</h3>
            
            {trades.length > 0 ? (
            <div className="space-y-4">
              {trades.slice(0, 5).map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className={`p-2 rounded-full ${trade.type === 'COMPRA' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {trade.type === 'COMPRA' ? <TrendingUp className="h-4 w-4 text-green-400" /> : <TrendingDown className="h-4 w-4 text-red-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{trade.symbol} {trade.type}</p>
                      {/* Eliminar trade.strategy que no existe en RealTrade */}
                      {/* <p className="text-sm text-gray-400">{trade.strategy}</p> */}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">${trade.amount.toLocaleString()}</p>
                    <p className={`text-sm ${trade.profit && trade.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.profit ? (trade.profit > 0 ? '+' : '') + trade.profit.toFixed(2) : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="text-gray-400 text-center py-12">
                No hay operaciones recientes para mostrar. Las operaciones se mostrarán aquí una vez ejecutadas por la IA.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;