import { useState, useEffect } from 'react';
import { useRealTradingContext } from '../context/RealTradingContext';
import { useTradingContext } from '../context/TradingContext';
import {
  Brain,
  Shield,
  CheckCircle,
  AlertTriangle,
  Loader,
  RefreshCw,
  Play
} from 'lucide-react';

const AIRecommendations = () => {

  // Estado local para modo simulado, sincronizado solo al montar
  const [paperMode] = useState(() => localStorage.getItem('paperTradingEnabled') === 'true');

  // Siempre llamar ambos hooks para cumplir reglas de hooks
  // Siempre llamar hooks fuera de try/catch para cumplir reglas de React
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

  // Si ambos contextos fallan, mostrar error global
  if (!realCtx && !demoCtx) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-50">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-yellow-200 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error crítico de contexto
          </h2>
          <p className="text-gray-600 mb-6">
            No se pudo inicializar el contexto de trading.<br />
            Por favor, recarga la página o revisa la configuración de la app.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }
  const ctx = paperMode ? demoCtx : realCtx;
  const isConnected = ctx?.isConnected ?? false;
  const getAIRecommendations = ctx?.getAIRecommendations;
  const executeRecommendation = ctx?.executeRecommendation;
  const isLoadingRecommendations = ctx?.isLoadingRecommendations ?? false;
  const isExecutingTrade = ctx?.isExecutingTrade ?? false;
  const accountBalance = ctx?.accountBalance ?? {};

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);


  // Cargar recomendaciones al montar o si cambia modo demo/conexión
  useEffect(() => {
    if (paperMode || isConnected) {
      loadRecommendations();
    }
  }, [paperMode, isConnected]);

  const loadRecommendations = async () => {
    if (!getAIRecommendations) return;
    try {
      const recs = await getAIRecommendations();
      setRecommendations(recs);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error cargando recomendaciones:', error);
    }
  };

  const handleExecuteRecommendation = async () => {
    if (!selectedRecommendation || !executeRecommendation) return;

    try {
      const success = await executeRecommendation(selectedRecommendation, investmentAmount);
      if (success) {
        setShowExecuteModal(false);
        setSelectedRecommendation(null);
        // Mostrar mensaje de éxito
        alert('¡Operación ejecutada exitosamente!');
        // Recargar recomendaciones
        loadRecommendations();
      } else {
        alert('Error ejecutando la operación. Inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error ejecutando la operación: ' + error);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'BAJO': return 'text-green-600 bg-green-100';
      case 'MEDIO': return 'text-yellow-600 bg-yellow-100';
      case 'ALTO': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'COMPRAR': return 'text-green-600 bg-green-100';
      case 'VENDER': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };



  // Fallback global: si el contexto está caído y NO es modo simulado, muestra error y opción de volver a configuración
  if (!ctx && !paperMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-50">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-yellow-200 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
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

  // Si está en modo demo y el contexto está caído, mostrar advertencia pero permitir explorar solo modo demo (UI idéntica, sin datos)
  if (paperMode && !ctx) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-50">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-yellow-200 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error de contexto demo
          </h2>
          <p className="text-gray-600 mb-6">
            El contexto de trading simulado no está disponible.<br />
            Puedes recargar la página o volver a la configuración para reactivar el modo demo.
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

  // Si no está conectado y no es modo demo, muestra pantalla de conexión
  if (!isConnected && !paperMode) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Conexión Requerida
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas conectar tus APIs de trading para ver recomendaciones de IA
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Recomendaciones de IA
            </h1>
            <p className="text-gray-600">
              Análisis inteligente del mercado con sugerencias de inversión personalizadas
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {lastUpdate && (
              <div className="text-sm text-gray-500">
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            
            <button
              onClick={loadRecommendations}
              disabled={isLoadingRecommendations}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingRecommendations ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Balance disponible */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">Balance Disponible</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(accountBalance).map(([currency, amount]) => (
                  <div key={currency}>
                    <p className="text-white/80 text-sm">{currency}</p>
                    <p className="text-xl font-bold">
                      {typeof amount === 'number' ? amount.toLocaleString() : String(amount ?? '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Shield className="h-12 w-12 text-white/60" />
          </div>
        </div>

        {/* Estado de carga */}
        {isLoadingRecommendations && (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <Loader className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Analizando Mercados...
            </h3>
            <p className="text-gray-600">
              Nuestra IA está procesando datos en tiempo real para generar las mejores recomendaciones
            </p>
          </div>
        )}

        {/* Recomendaciones */}
        {!isLoadingRecommendations && recommendations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {rec.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{rec.symbol}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getActionColor(rec.action)}`}>
                          {rec.action}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(rec.riskLevel)}`}>
                          {rec.riskLevel} RIESGO
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600">
                        {rec.confidence}% confianza
                      </span>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${rec.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Mensaje de IA personalizado */}
                <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <span className="block text-yellow-800 font-semibold mb-1">IA:</span>
                  <span className="text-gray-700 text-sm">
                    {rec.action === 'COMPRAR' && rec.riskLevel === 'BAJO' && (
                      <>Esta es una oportunidad sólida. El mercado muestra señales de fortaleza y bajo riesgo. Considera invertir una parte de tu capital, pero nunca pongas todos tus huevos en la misma canasta.</>
                    )}
                    {rec.action === 'COMPRAR' && rec.riskLevel === 'MEDIO' && (
                      <>La oportunidad es interesante, pero hay cierta volatilidad. Si decides invertir, hazlo con una cantidad moderada y mantén un stop loss disciplinado.</>
                    )}
                    {rec.action === 'COMPRAR' && rec.riskLevel === 'ALTO' && (
                      <>El potencial de ganancia es alto, pero también el riesgo. Solo invierte si aceptas la posibilidad de pérdidas y diversifica tu portafolio.</>
                    )}
                    {rec.action === 'VENDER' && (
                      <>Detecto señales de debilidad en este activo. Considera reducir exposición o tomar ganancias si ya tienes posiciones abiertas.</>
                    )}
                    {rec.action === 'MANTENER' && (
                      <>No hay señales claras para operar en este momento. La paciencia es una virtud en los mercados.</>
                    )}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Precio objetivo:</span>
                    <span className="font-medium text-gray-900">
                      ${rec.targetPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Stop loss:</span>
                    <span className="font-medium text-gray-900">
                      ${rec.stopLoss.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Retorno potencial:</span>
                    <span className="font-medium text-green-600">
                      +{rec.potentialReturn.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Análisis de IA:</h4>
                  <p className="text-gray-600 text-sm">{rec.reasoning}</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedRecommendation(rec);
                    setShowExecuteModal(true);
                  }}
                  className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                    rec.action === 'COMPRAR'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <Play className="h-4 w-4" />
                  <span>Ejecutar {rec.action}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Sin recomendaciones */}
        {!isLoadingRecommendations && recommendations.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No hay recomendaciones disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              La IA no encontró oportunidades de trading con alta confianza en este momento.
              Inténtalo de nuevo más tarde.
            </p>
            <button
              onClick={loadRecommendations}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Buscar Oportunidades
            </button>
          </div>
        )}

        {/* Modal de ejecución */}
        {showExecuteModal && selectedRecommendation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">
                      {selectedRecommendation.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedRecommendation.action} {selectedRecommendation.symbol}
                    </h3>
                    <p className="text-gray-600">Confirmar operación</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto a invertir (USD)
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      min="10"
                      max="10000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Cantidad estimada:</span>
                      <span className="font-medium">
                        {(investmentAmount / selectedRecommendation.targetPrice).toFixed(6)} {selectedRecommendation.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Precio objetivo:</span>
                      <span className="font-medium">${selectedRecommendation.targetPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ganancia potencial:</span>
                      <span className="font-medium text-green-600">
                        ${(investmentAmount * (selectedRecommendation.potentialReturn / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowExecuteModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    onClick={handleExecuteRecommendation}
                    disabled={isExecutingTrade}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 ${
                      selectedRecommendation.action === 'COMPRAR'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    } disabled:bg-gray-400`}
                  >
                    {isExecutingTrade ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Ejecutando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Confirmar {selectedRecommendation.action}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;