import { useRealTradingContext } from '../context/RealTradingContext';
import { useTradingContext } from '../context/TradingContext';
import AIChat from '../components/AIChat';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Bot,
  Shield,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const Dashboard = () => {
  // Detectar modo demo/real
  const paperMode = localStorage.getItem('paperTradingEnabled') === 'true';

  // Siempre llamar ambos hooks para cumplir reglas de hooks
  let realCtx: ReturnType<typeof useRealTradingContext> | null = null;
  let demoCtx: ReturnType<typeof useTradingContext> | null = null;
  try {
    realCtx = useRealTradingContext();
  } catch (e) {
    realCtx = null;
  }
  try {
    demoCtx = useTradingContext();
  } catch (e) {
    demoCtx = null;
  }

  // Seleccionar contexto según modo
  const ctx = paperMode ? demoCtx : realCtx;

  // Fallback global: si el contexto está caído, mostrar error y opción de volver a configuración
  if (!ctx) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-50">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-yellow-200 text-center">
          <AIChat />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error de contexto
          </h2>
          <p className="text-gray-600 mb-6">
            El contexto de trading se ha perdido o no se pudo inicializar.<br />
            Esto puede ocurrir si recargaste la página o hubo un error interno.<br />
            Por favor, vuelve a elegir el modo de operación o reconecta tus APIs.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('paperTradingEnabled');
              window.location.href = '/trading-setup';
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Volver a configuración
          </button>
        </div>
      </div>
    );
  }

  // Extraer datos del contexto correcto
  const { 
    portfolio, 
    isAutoTradingActive, 
    setIsAutoTradingActive, 
    trades,
    marketStatus,
    aiRecommendations,
  } = ctx;

  // Usar datos del portfolio (real o demo)
  // Soporte para performance solo en RealPortfolio
  const performanceData = (portfolio as any)?.performance && Array.isArray((portfolio as any).performance) && (portfolio as any).performance.length > 0
    ? (portfolio as any).performance
    : [];

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    positive,
    subtitle,
  }: {
    title: string;
    value: string;
    change?: string;
    icon: React.ElementType;
    positive?: boolean;
    subtitle?: string;
  }) => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
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
            {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${positive ? 'bg-green-100' : positive === false ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Icon className={`h-6 w-6 ${positive ? 'text-green-600' : positive === false ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Estado del asistente */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className={`rounded-full px-4 py-2 ${isAutoTradingActive ? 'bg-green-500/30' : 'bg-red-500/30'}`}> 
              <span className="font-semibold text-lg">
                {isAutoTradingActive ? 'Auto-Trading Activo' : 'Auto-Trading Pausado'}
              </span>
            </div>
            <button
              className={`ml-2 px-4 py-2 rounded-full font-semibold ${isAutoTradingActive ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}`}
              onClick={() => setIsAutoTradingActive && setIsAutoTradingActive(!isAutoTradingActive)}
            >
              {isAutoTradingActive ? 'Pausar' : 'Activar'}
            </button>
          </div>
          <p className="text-white/90 text-lg">
            {isAutoTradingActive ? 'Tu asistente está trabajando' : 'Tu asistente está pausado'}
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Mi Dinero Total"
            value={`$${portfolio?.totalValue?.toLocaleString?.() ?? '0'}`}
            change={portfolio?.dailyPnL !== undefined ? `+$${portfolio.dailyPnL.toFixed(2)} hoy` : ''}
            icon={DollarSign}
            positive={portfolio?.dailyPnL > 0}
          />
          <StatCard
            title="Ganancias Totales"
            value={`$${portfolio?.totalPnL?.toFixed?.(2) ?? '0.00'}`}
            change={portfolio && portfolio.totalValue && portfolio.totalPnL !== undefined && (portfolio.totalValue - portfolio.totalPnL) !== 0 ? `${((portfolio.totalPnL / (portfolio.totalValue - portfolio.totalPnL)) * 100).toFixed(1)}%` : ''}
            icon={TrendingUp}
            positive={portfolio?.totalPnL > 0}
          />
          <StatCard
            title="Operaciones Exitosas"
            value={`${portfolio?.winRate ?? 0}%`}
            subtitle={`${portfolio?.totalTrades ?? 0} operaciones totales`}
            icon={Target}
            positive={portfolio?.winRate > 70}
          />
          <StatCard
            title="Estado del Mercado"
            value={marketStatus}
            subtitle="Mercados internacionales"
            icon={marketStatus === 'ABIERTO' ? CheckCircle : Clock}
            positive={marketStatus === 'ABIERTO'}
          />
        </div>

        {/* Gráfico de rendimiento y recomendaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de rendimiento */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Tu Progreso Esta Semana</h3>
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">{performanceData.length > 1 ? ((performanceData[performanceData.length-1].value - performanceData[0].value) / performanceData[0].value * 100).toFixed(1) + '%' : '--'}</span>
              </div>
            </div>
            {performanceData.length > 1 ? (
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
            ) : (
              <div className="text-center text-gray-400 py-12">No hay datos disponibles para mostrar el gráfico.</div>
            )}
          </div>

          {/* Recomendaciones de IA */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bot className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Consejos de Hoy</h3>
            </div>
            <div className="space-y-4">
              {aiRecommendations.map((recommendation: string, index: number) => (
                <div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 text-sm leading-relaxed">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Últimas operaciones */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Últimas Operaciones</h3>
          <div className="space-y-4">
            {trades.slice(0, 5).map((trade: any) => (
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
                      Confianza IA: {trade.aiConfidence}%
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

        {/* Mensaje de seguridad */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="font-medium text-green-900">Tu dinero está protegido</h4>
              <p className="text-green-700 text-sm">
                Usamos brokers regulados y las mejores medidas de seguridad del mercado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;