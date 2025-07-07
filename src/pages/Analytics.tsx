import React, { useState } from 'react';
import { useTradingContext } from '../context/TradingContext';
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  Activity,
  BarChart3,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Analytics = () => {
  const { aiPredictions, assets } = useTradingContext();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');

  // Mock AI performance data
  const aiPerformanceData = [
    { date: '2024-07-01', accuracy: 85, trades: 12, profit: 1200 },
    { date: '2024-07-02', accuracy: 89, trades: 15, profit: 1800 },
    { date: '2024-07-03', accuracy: 76, trades: 8, profit: 600 },
    { date: '2024-07-04', accuracy: 92, trades: 18, profit: 2400 },
    { date: '2024-07-05', accuracy: 88, trades: 14, profit: 1950 },
    { date: '2024-07-06', accuracy: 91, trades: 16, profit: 2100 },
    { date: '2024-07-07', accuracy: 87, trades: 13, profit: 1650 }
  ];

  // Strategy performance radar data
  const strategyData = [
    { strategy: 'LSTM', performance: 92, risk: 65, speed: 88, accuracy: 89 },
    { strategy: 'RSI', performance: 78, risk: 45, speed: 95, accuracy: 76 },
    { strategy: 'Breakout', performance: 65, risk: 80, speed: 70, accuracy: 68 },
    { strategy: 'DQN', performance: 95, risk: 70, speed: 75, accuracy: 92 }
  ];

  const radarData = [
    { subject: 'Accuracy', A: 92, B: 78, C: 65, D: 95, fullMark: 100 },
    { subject: 'Speed', A: 88, B: 95, C: 70, D: 75, fullMark: 100 },
    { subject: 'Risk Management', A: 85, B: 90, C: 60, D: 80, fullMark: 100 },
    { subject: 'Profitability', A: 90, B: 75, C: 55, D: 88, fullMark: 100 },
    { subject: 'Consistency', A: 87, B: 82, C: 70, D: 85, fullMark: 100 }
  ];

  const marketSentiment = [
    { asset: 'BTC', sentiment: 'Bullish', score: 8.5, volume: 'High', trend: 'Up' },
    { asset: 'ETH', sentiment: 'Neutral', score: 6.2, volume: 'Medium', trend: 'Sideways' },
    { asset: 'AAPL', sentiment: 'Bullish', score: 7.8, volume: 'High', trend: 'Up' },
    { asset: 'TSLA', sentiment: 'Bearish', score: 4.1, volume: 'Low', trend: 'Down' }
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-6">AI Accuracy Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aiPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
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
                  dataKey="accuracy" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-6">Daily Trades & Profit</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aiPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #8b5cf6',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="trades" fill="#06b6d4" />
                <Bar dataKey="profit" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Performance & Market Sentiment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-6">Strategy Performance Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis 
                  angle={45} 
                  domain={[0, 100]} 
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                />
                <Radar 
                  name="LSTM" 
                  dataKey="A" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.2} 
                  strokeWidth={2}
                />
                <Radar 
                  name="DQN" 
                  dataKey="D" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.2} 
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-6">Market Sentiment Analysis</h3>
            <div className="space-y-4">
              {marketSentiment.map((item) => {
                const sentimentColor = item.sentiment === 'Bullish' ? 'text-green-400' : 
                                     item.sentiment === 'Bearish' ? 'text-red-400' : 'text-yellow-400';
                const sentimentBg = item.sentiment === 'Bullish' ? 'bg-green-500/20' : 
                                   item.sentiment === 'Bearish' ? 'bg-red-500/20' : 'bg-yellow-500/20';
                
                return (
                  <div key={item.asset} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{item.asset.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.asset}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${sentimentBg} ${sentimentColor}`}>
                            {item.sentiment}
                          </span>
                          <span className="text-xs text-gray-400">{item.volume} Volume</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {item.sentiment === 'Bullish' ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        }
                        <span className="text-white font-medium">{item.score}/10</span>
                      </div>
                      <p className="text-sm text-gray-400">Sentiment Score</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Current AI Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiPredictions.map((prediction) => {
              const asset = assets.find(a => a.symbol === prediction.symbol);
              const isPositive = prediction.prediction > 0;
              
              return (
                <div key={prediction.symbol} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{prediction.symbol.slice(0, 2)}</span>
                      </div>
                      <span className="font-medium text-white">{prediction.symbol}</span>
                    </div>
                    <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Prediction</span>
                      <span className={`font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{prediction.prediction.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Confidence</span>
                      <span className="text-white font-medium">{prediction.confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;