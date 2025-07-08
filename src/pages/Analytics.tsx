import React, { useState } from 'react';
import { useRealTradingContext } from '../context/RealTradingContext';
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  Activity,
  BarChart3,
  TrendingDown
} from 'lucide-react';

const Analytics = () => {
  const { portfolio } = useRealTradingContext();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');

  const performanceData = portfolio.performance && portfolio.performance.length > 0 ? portfolio.performance : [];
  const predictionAssets = portfolio.assets && portfolio.assets.length > 0 ? portfolio.assets : [];

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">AI Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Deep insights into AI performance and market analysis</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {['24H', '7D', '30D', '90D'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* AI Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">AI Accuracy</p>
                <p className="text-2xl font-bold text-white mt-1">89.2%</p>
                <div className="flex items-center mt-2 text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+3.2% vs last week</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <Brain className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Predictions Made</p>
                <p className="text-2xl font-bold text-white mt-1">2,847</p>
                <div className="flex items-center mt-2 text-blue-400">
                  <Activity className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">This month</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-white mt-1">91.7%</p>
                <div className="flex items-center mt-2 text-purple-400">
                  <Target className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Excellent</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Processing Speed</p>
                <p className="text-2xl font-bold text-white mt-1">0.3s</p>
                <div className="flex items-center mt-2 text-orange-400">
                  <Zap className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Real-time</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-orange-500/20">
                <Zap className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Performance Chart */}
        {performanceData.length > 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Aquí podrías agregar gráficos reales si tienes datos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center col-span-2">
              <span className="text-gray-500">(Integrar gráficos reales aquí con datos de performance)</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">No hay datos de IA disponibles para mostrar análisis.</div>
        )}

        {/* Strategy Performance & Market Sentiment */}
        <div className="text-center text-gray-400 py-12">No hay datos de performance o sentimiento disponibles.</div>

        {/* AI Predictions */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Predicciones Actuales de IA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictionAssets.length > 0 ? predictionAssets.map((asset) => {
              const isPositive = asset.profit > 0;
              return (
                <div key={asset.symbol} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{asset.symbol.slice(0, 2)}</span>
                      </div>
                      <span className="font-medium text-white">{asset.symbol}</span>
                    </div>
                    <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Ganancia</span>
                      <span className={`font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}${asset.profit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Valor</span>
                      <span className="text-white font-medium">${asset.value.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            }) : <div className="text-gray-400 col-span-4 text-center">No hay predicciones disponibles.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;