import React, { useEffect } from 'react';
import { useRealTradingContext } from '../context/RealTradingContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Bot,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RealDashboard = () => {
  const { 
    portfolio, 
    isAutoTradingActive, 
    setIsAutoTradingActive, 
    trades,
    marketStatus,
    isConnected,
    accountBalance,
    portfolioMetrics,
    refreshMarketData,
    getAIRecommendations
  } = useRealTradingContext();

  // Datos de rendimiento para el gráfico
  const performanceData = portfolio.performance.length > 0 ? portfolio.performance : [
    { day: 'Lun', value: portfolio.totalValue * 0.95 },
    { day: 'Mar', value: portfolio.totalValue * 0.97 },
    { day: 'Mié', value: portfolio.totalValue * 1.02 },
    { day: 'Jue', value: portfolio.totalValue * 0.99 },
    { day: 'Vie', value: portfolio.totalValue * 1.05 },
    { day: 'Sáb', value: portfolio.totalValue * 1.03 },
    { day: 'Dom', value: portfolio.totalValue }
  ];

  useEffect(() => {
    if (isConnected) {
      refreshMarketData();
    }
  }, [isConnected]);

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    positive, 
    subtitle,
    isLoading = false
  }: {
    title: string;
    value: string;
    change?: string;
    icon: any;
    positive?: boolean;
    subtitle?: string;
    isLoading?: boolean;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
              {change && (
                <div className={`flex items-center text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
                  {positive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  <span className="font-medium">{change}</span>
                </div>
              )}
              {subtitle && (
                <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
              )}
            </>
          )}
        </div>
        <div className={`p-3 rounded-xl ${positive ? 'bg-green-100' : positive === false ? 'bg-red-100' : 'bg-blue-100'}`}>
          <Icon className={`h-6 w-6 ${positive ? 'text-green-600' : positive === false ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
      </div>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Conexión Requerida
          </h2>
          <p className="text-gray-600 mb-6">
            Para acceder al dashboard de trading real, necesitas conectar tus APIs de trading primero.
          </p>
          <button
            onClick={() => window.location.href = '/trading-setup'}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Conectar APIs de Trading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con saludo personalizado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Trading Real 🚀
          </h1>
          <p className="text-gray-600">
            Monitoreo en tiempo real de tu portfolio y operaciones automáticas
          </p>
        </div>

        {/* Estado de conexión y trading */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Bot className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Sistema de Trading IA</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    isConnected ? 'bg-green-500/30' : 'bg-red-500/30'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-green-300 animate-pulse' : 'bg-red-300'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {isConnected ? 'APIs Conectadas' : 'Desconectado'}
                    </span>
                  </div>
                  
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    isAutoTradingActive ? 'bg-green-500/30' : 'bg-yellow-500/30'
                  }`}>
                    <Activity className="h-3 w-3" />
                    <span className="text-sm font-medium">
                      {isAutoTradingActive ? 'Trading Activo' : 'Trading Pausado'}
                    </span>
                  </div>
                  
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    marketStatus === 'ABIERTO' ? 'bg-blue-500/30' : 'bg-gray-500/30'
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span className="text-sm font-medium">
                      Mercado {marketStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAutoTradingActive(!isAutoTradingActive)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isAutoTradingActive
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-gray-50'
                }`}
              >
                {isAutoTradingActive ? (
                  <>
                    <Zap className="h-5 w-5" />
                    <span>Pausar IA</span>
                  </>
                ) : (
                  <>
                    <Bot className="h-5 w-5" />
                    <span>Activar IA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Valor Total del Portfolio"
            value={`$${portfolio.totalValue.toLocaleString()}`}
            change={`${portfolio.dailyPnL >= 0 ? '+' : ''}$${portfolio.dailyPnL.toFixed(2)} hoy`}
            icon={DollarSign}
            positive={portfolio.dailyPnL > 0}
            isLoading={!isConnected}
          />
          
          <StatCard
            title="Ganancias/Pérdidas Totales"
            value={`$${portfolio.totalPnL.toFixed(2)}`}
            change={`${((portfolio.totalPnL / (portfolio.totalValue - portfolio.totalPnL)) * 100).toFixed(1)}% ROI`}
            icon={TrendingUp}
            positive={portfolio.totalPnL > 0}
            isLoading={!isConnected}
          />
          
          <StatCard
            title="Tasa de Éxito"
            value={`${portfolio.winRate.toFixed(1)}%`}
            subtitle={`${portfolio.totalTrades} operaciones completadas`}
            icon={Target}
            positive={portfolio.winRate > 70}
            isLoading={!isConnected}
          />
          
          <StatCard
            title="Ratio de Sharpe"
            value={portfolioMetrics.sharpeRatio.toFixed(2)}
            subtitle={`Volatilidad: ${portfolioMetrics.volatility.toFixed(1)}%`}
            icon={Shield}
            positive={portfolioMetrics.sharpeRatio > 1}
            isLoading={!isConnected}
          />
        </div>

        {/* Balance de cuentas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Balance de Cuentas Conectadas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(accountBalance).map(([currency, amount]) => (
              <div key={currency} className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm font-medium">{currency}</p>
                <p className="text-lg font-bold text-gray-900">
                  {typeof amount === 'number' ? amount.toLocaleString() : amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de rendimiento y operaciones recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de rendimiento */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Rendimiento del Portfolio</h3>
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {portfolio.totalPnL >= 0 ? '+' : ''}{((portfolio.totalPnL / (portfolio.totalValue - portfolio.totalPnL)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Métricas avanzadas */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Métricas de Riesgo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Ratio de Sharpe</p>
                  <p className="text-sm text-gray-600">Rendimiento ajustado por riesgo</p>
                </div>
                <span className={`text-lg font-bold ${
                  portfolioMetrics.sharpeRatio > 1 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {portfolioMetrics.sharpeRatio.toFixed(2)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Máximo Drawdown</p>
                  <p className="text-sm text-gray-600">Pérdida máxima desde el pico</p>
                </div>
                <span className="text-lg font-bold text-red-600">
                  -{portfolioMetrics.maxDrawdown.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Volatilidad</p>
                  <p className="text-sm text-gray-600">Desviación estándar de retornos</p>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {portfolioMetrics.volatility.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Beta</p>
                  <p className="text-sm text-gray-600">Correlación con el mercado</p>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {portfolioMetrics.beta.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Últimas operaciones */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Operaciones Recientes</h3>
          {trades.length > 0 ? (
            <div className="space-y-4">
              {trades.slice(0, 5).map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      trade.type === 'COMPRA' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {trade.type === 'COMPRA' ? 
                        <TrendingUp className="h-4 w-4 text-green-600" /> : 
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{trade.symbol}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          trade.type === 'COMPRA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {trade.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          trade.status === 'COMPLETADA' ? 'bg-blue-100 text-blue-700' : 
                          trade.status === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {trade.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {trade.amount} @ ${trade.price.toLocaleString()} • IA: {trade.aiConfidence}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${(trade.amount * trade.price).toLocaleString()}
                    </p>
                    {trade.profit !== undefined && (
                      <p className={`text-sm ${trade.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trade.profit > 0 ? '+' : ''}${trade.profit.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay operaciones registradas aún</p>
              <p className="text-sm text-gray-400">Las operaciones aparecerán aquí cuando se ejecuten</p>
            </div>
          )}
        </div>

        {/* Mensaje de seguridad */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="font-medium text-green-900">Trading Real Activo</h4>
              <p className="text-green-700 text-sm">
                Estás operando con dinero real. Todas las operaciones son ejecutadas en los mercados reales 
                a través de APIs seguras y reguladas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealDashboard;