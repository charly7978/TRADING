import React from 'react';
import { useTradingContext } from '../context/TradingContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Pie } from 'recharts';

const Portfolio = () => {
  const { portfolio, trades } = useTradingContext();

  // Datos de rendimiento histórico
  const performanceHistory = [
    { month: 'Ene', value: 1000 },
    { month: 'Feb', value: 1050 },
    { month: 'Mar', value: 1120 },
    { month: 'Abr', value: 1080 },
    { month: 'May', value: 1180 },
    { month: 'Jun', value: 1220 },
    { month: 'Jul', value: 1250 }
  ];

  // Datos para el gráfico de pastel
  const allocationData = portfolio.assets.map(asset => ({
    name: asset.symbol,
    value: asset.value,
    percentage: ((asset.value / portfolio.totalValue) * 100).toFixed(1)
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    positive, 
    subtitle 
  }: {
    title: string;
    value: string;
    change?: string;
    icon: any;
    positive?: boolean;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
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
        </div>
        <div className={`p-3 rounded-xl ${positive ? 'bg-green-100' : positive === false ? 'bg-red-100' : 'bg-blue-100'}`}>
          <Icon className={`h-6 w-6 ${positive ? 'text-green-600' : positive === false ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Portafolio</h1>
            <p className="text-gray-600">Resumen completo de tus inversiones</p>
          </div>
          
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Exportar Reporte</span>
          </button>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Valor Total"
            value={`$${portfolio.totalValue.toLocaleString()}`}
            change={`+$${portfolio.dailyPnL.toFixed(2)} hoy`}
            icon={DollarSign}
            positive={portfolio.dailyPnL > 0}
          />
          <StatCard
            title="Ganancias Totales"
            value={`$${portfolio.totalPnL.toFixed(2)}`}
            change={`${((portfolio.totalPnL / (portfolio.totalValue - portfolio.totalPnL)) * 100).toFixed(1)}%`}
            icon={TrendingUp}
            positive={portfolio.totalPnL > 0}
          />
          <StatCard
            title="Dinero Disponible"
            value={`$${portfolio.availableCash.toFixed(2)}`}
            subtitle="Para nuevas inversiones"
            icon={PieChart}
            positive={true}
          />
          <StatCard
            title="Tasa de Éxito"
            value={`${portfolio.winRate}%`}
            subtitle={`${portfolio.totalTrades} operaciones`}
            icon={Target}
            positive={portfolio.winRate > 70}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Rendimiento histórico */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Evolución de tu Dinero</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
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

          {/* Distribución de activos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Distribución de Inversiones</h3>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {allocationData.map((item, index) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm text-gray-900 font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mis inversiones actuales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Mis Inversiones Actuales</h3>
          <div className="space-y-4">
            {portfolio.assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{asset.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{asset.symbol}</p>
                    <p className="text-sm text-gray-500">{asset.amount} unidades</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${asset.value.toLocaleString()}</p>
                  <div className={`flex items-center text-sm ${asset.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {asset.profit > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {asset.profit > 0 ? '+' : ''}${asset.profit.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de operaciones */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Historial de Operaciones</h3>
          <div className="space-y-4">
            {trades.map((trade) => (
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
                    </div>
                    <p className="text-sm text-gray-500">
                      {trade.timestamp.toLocaleDateString()} - Confianza: {trade.aiConfidence}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${(trade.amount * trade.price).toLocaleString()}
                  </p>
                  {trade.profit && (
                    <p className={`text-sm ${trade.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.profit > 0 ? '+' : ''}${trade.profit.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen mensual */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Resumen de Este Mes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-white/80 text-sm">Ganancia</p>
                  <p className="text-xl font-bold">+$250.45</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Operaciones</p>
                  <p className="text-xl font-bold">24</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Éxito</p>
                  <p className="text-xl font-bold">78.5%</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Rendimiento</p>
                  <p className="text-xl font-bold">+25%</p>
                </div>
              </div>
            </div>
            <Calendar className="h-12 w-12 text-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;