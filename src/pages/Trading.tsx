import React, { useState } from 'react';
import { useTradingContext } from '../context/TradingContext';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Volume2,
  DollarSign,
  Brain,
  Zap,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Trading = () => {
  const { assets, trades, isTrading } = useTradingContext();
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [timeframe, setTimeframe] = useState('1H');

  // Mock real-time price data
  const priceData = [
    { time: '10:00', price: 35200, volume: 1200 },
    { time: '10:15', price: 35250, volume: 1500 },
    { time: '10:30', price: 35180, volume: 1100 },
    { time: '10:45', price: 35320, volume: 1800 },
    { time: '11:00', price: 35247, volume: 1600 },
  ];

  const strategies = [
    { name: 'LSTM Momentum', active: true, performance: '+12.5%', confidence: 89 },
    { name: 'RSI Divergence', active: true, performance: '+8.3%', confidence: 76 },
    { name: 'Breakout Detection', active: false, performance: '+5.1%', confidence: 68 },
    { name: 'DQN Reinforcement', active: true, performance: '+15.2%', confidence: 92 }
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
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
          {assets.map((asset) => {
            const isSelected = selectedAsset.symbol === asset.symbol;
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
          })}
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Price Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{selectedAsset.name} Price Chart</h3>
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
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #8b5cf6',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order Panel */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-6">AI Trading Control</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Current Price</span>
                  <span className="text-white font-bold">${selectedAsset.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">24h Change</span>
                  <span className={selectedAsset.change24h > 0 ? 'text-green-400' : 'text-red-400'}>
                    {selectedAsset.change24h > 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Volume</span>
                  <span className="text-white">${(selectedAsset.volume / 1000000).toFixed(1)}M</span>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium">AI Recommendation</span>
                </div>
                <p className="text-white font-bold">STRONG BUY</p>
                <p className="text-sm text-gray-300">Confidence: 89%</p>
                <p className="text-sm text-gray-300">Strategy: LSTM Momentum</p>
              </div>

              <button
                disabled={!isTrading}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  isTrading
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isTrading ? 'Execute AI Trade' : 'Start Bot to Trade'}
              </button>
            </div>
          </div>
        </div>

        {/* Trading Strategies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Strategies */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">AI Trading Strategies</h3>
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            
            <div className="space-y-4">
              {strategies.map((strategy, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${strategy.active ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                    <div>
                      <p className="font-medium text-white">{strategy.name}</p>
                      <p className="text-sm text-gray-400">Performance: {strategy.performance}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-purple-400">{strategy.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-6">Recent AI Trades</h3>
            
            <div className="space-y-4">
              {trades.slice(0, 5).map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${trade.type === 'BUY' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {trade.type === 'BUY' ? <TrendingUp className="h-4 w-4 text-green-400" /> : <TrendingDown className="h-4 w-4 text-red-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{trade.symbol} {trade.type}</p>
                      <p className="text-sm text-gray-400">{trade.strategy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">${trade.amount.toLocaleString()}</p>
                    <p className={`text-sm ${trade.profit && trade.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.profit ? (trade.profit > 0 ? '+' : '') + trade.profit.toLocaleString() : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;