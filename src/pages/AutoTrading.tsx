import React, { useState } from 'react';
import { useRealTradingContext } from '../context/RealTradingContext';
import {
  Bot,
  TrendingUp,
  TrendingDown,
  Settings,
  Play,
  Pause,
  Shield,
  Target,
  AlertTriangle
} from 'lucide-react';

const AutoTrading = () => {
  const {
    isAutoTradingActive,
    setIsAutoTradingActive,
    riskLevel,
    setRiskLevel,
    monthlyBudget,
    setMonthlyBudget,
    assets,
    isConnected
  } = useRealTradingContext();

  const [showSettings, setShowSettings] = useState(false);

  const riskLevels = [
    {
      level: 'CONSERVADOR' as const,
      title: 'Conservador',
      description: 'Bajo riesgo, ganancias estables',
      expectedReturn: '5-8% anual',
      color: 'green',
      icon: Shield
    },
    {
      level: 'MODERADO' as const,
      title: 'Moderado',
      description: 'Riesgo equilibrado, buen potencial',
      expectedReturn: '8-15% anual',
      color: 'blue',
      icon: Target
    },
    {
      level: 'AGRESIVO' as const,
      title: 'Agresivo',
      description: 'Alto riesgo, máximo potencial',
      expectedReturn: '15-25% anual',
      color: 'red',
      icon: TrendingUp
    }
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Conexión Requerida
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas conectar tus APIs de trading para configurar el trading automático.
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
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trading Automático</h1>
          <p className="text-gray-600">Configura tu asistente de inversión inteligente</p>
        </div>

        {/* Panel de Control Principal */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                <Bot className="h-12 w-12" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Tu Asistente IA</h2>
                <p className="text-white/90 mb-4">
                  {isAutoTradingActive ? 
                    'Analizando mercados y ejecutando operaciones...' : 
                    'Listo para empezar a trabajar por ti'
                  }
                </p>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    isAutoTradingActive ? 'bg-green-500/30' : 'bg-red-500/30'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      isAutoTradingActive ? 'bg-green-300 animate-pulse' : 'bg-red-300'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {isAutoTradingActive ? 'ACTIVO' : 'PAUSADO'}
                    </span>
                  </div>
                  <span className="text-sm text-white/80">
                    Presupuesto mensual: ${monthlyBudget}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                <Settings className="h-6 w-6" />
              </button>
              
              <button
                onClick={() => setIsAutoTradingActive(!isAutoTradingActive)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isAutoTradingActive
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-gray-50'
                }`}
              >
                {isAutoTradingActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span>{isAutoTradingActive ? 'Pausar' : 'Activar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Configuración de Riesgo */}
        {showSettings && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Configuración</h3>
            
            {/* Presupuesto Mensual */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Presupuesto Mensual para Inversión
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="bg-blue-100 px-4 py-2 rounded-lg">
                  <span className="text-blue-700 font-bold">${monthlyBudget}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Cantidad máxima que el sistema puede invertir cada mes
              </p>
            </div>

            {/* Nivel de Riesgo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Nivel de Riesgo
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {riskLevels.map((risk) => {
                  const Icon = risk.icon;
                  const isSelected = riskLevel === risk.level;
                  
                  return (
                    <button
                      key={risk.level}
                      onClick={() => setRiskLevel(risk.level)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `border-${risk.color}-500 bg-${risk.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className={`h-6 w-6 ${
                          isSelected ? `text-${risk.color}-600` : 'text-gray-400'
                        }`} />
                        <h4 className={`font-bold ${
                          isSelected ? `text-${risk.color}-900` : 'text-gray-900'
                        }`}>
                          {risk.title}
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{risk.description}</p>
                      <p className={`text-sm font-medium ${
                        isSelected ? `text-${risk.color}-700` : 'text-gray-500'
                      }`}>
                        {risk.expectedReturn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Estrategias Activas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Estrategias de IA Activas</h3>
          {assets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50">
                <h4 className="font-bold text-gray-900 mb-2">Análisis Técnico Inteligente</h4>
                <p className="text-gray-600 text-sm mb-3">La IA utiliza RSI, MACD y Bandas de Bollinger para identificar oportunidades.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Estado:</span>
                  <span className="text-green-600 font-bold">Activa</span>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50">
                <h4 className="font-bold text-gray-900 mb-2">Detección de Patrones Avanzada</h4>
                <p className="text-gray-600 text-sm mb-3">Identifica patrones de precios complejos para predecir movimientos.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Estado:</span>
                  <span className="text-green-600 font-bold">Activa</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No hay datos de activos para mostrar las estrategias activas. Conecta tus APIs.
            </div>
          )}
        </div>

        {/* Oportunidades del Día */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Oportunidades Detectadas Hoy</h3>
          <div className="space-y-4">
            {assets.filter(asset => asset.recommendation === 'COMPRAR').map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{asset.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{asset.name}</h4>
                    <p className="text-gray-600 text-sm">Puntuación IA: {asset.aiScore}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg font-bold text-gray-900">
                      ${asset.price.toLocaleString()}
                    </span>
                    <div className={`flex items-center ${
                      asset.change24h > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.change24h > 0 ? 
                        <TrendingUp className="h-4 w-4" /> : 
                        <TrendingDown className="h-4 w-4" />
                      }
                      <span className="text-sm font-medium ml-1">
                        {asset.change24h > 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    {asset.recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advertencia de Seguridad */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">Importante: Invierte Responsablemente</h4>
              <p className="text-yellow-800 text-sm leading-relaxed">
                Aunque nuestro sistema usa inteligencia artificial avanzada, todas las inversiones conllevan riesgo. 
                Solo invierte dinero que puedas permitirte perder. El rendimiento pasado no garantiza resultados futuros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoTrading;