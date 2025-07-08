import React, { useState } from 'react';
import { useRealTradingContext } from '../context/RealTradingContext';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  DollarSign,
  User,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Settings = () => {
  const { riskLevel, setRiskLevel, monthlyBudget, setMonthlyBudget, isConnected } = useRealTradingContext();
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    trades: true,
    dailyReport: true,
    marketAlerts: false,
    educational: true
  });
  const [showApiPanel, setShowApiPanel] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Usuario',
    email: 'usuario@email.com',
    phone: '+1234567890'
  });

  const handleSaveSettings = () => {
    // Aquí se guardarían las configuraciones
    alert('Configuración guardada exitosamente');
  };

  const SettingCard = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-100">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
            <p className="text-gray-600">Personaliza tu experiencia de inversión</p>
          </div>
          
          <button
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>

        {/* Panel de gestión de APIs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-900">APIs Conectadas</h2>
            <button onClick={() => setShowApiPanel(!showApiPanel)} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-all">
              {showApiPanel ? 'Ocultar' : 'Gestionar APIs'}
            </button>
          </div>
          {showApiPanel && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">Binance</span>
                <span className={`text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{isConnected ? 'Conectada' : 'Desconectada'}</span>
                {/* Aquí puedes agregar botones para conectar/desconectar o cambiar claves */}
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">Alpaca</span>
                <span className={`text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{isConnected ? 'Conectada' : 'Desconectada'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">Polygon</span>
                <span className={`text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{isConnected ? 'Conectada' : 'Desconectada'}</span>
              </div>
              <div className="text-right">
                <a href="/trading-setup" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all">Configurar APIs</a>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Perfil del Usuario */}
          <SettingCard title="Mi Perfil" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experiencia en Inversiones
                </label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none">
                  <option>Principiante</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </select>
              </div>
            </div>
          </SettingCard>

          {/* Configuración de Trading */}
          <SettingCard title="Configuración de Trading" icon={DollarSign}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Presupuesto Mensual: ${monthlyBudget}
                </label>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$100</span>
                  <span>$5,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nivel de Riesgo
                </label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="CONSERVADOR">Conservador (5-8% anual)</option>
                  <option value="MODERADO">Moderado (8-15% anual)</option>
                  <option value="AGRESIVO">Agresivo (15-25% anual)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Máximo por Operación
                </label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none">
                  <option>5% del portafolio</option>
                  <option>10% del portafolio</option>
                  <option>15% del portafolio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Stop Loss Automático
                </label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none">
                  <option>5% de pérdida</option>
                  <option>10% de pérdida</option>
                  <option>15% de pérdida</option>
                </select>
              </div>
            </div>
          </SettingCard>

          {/* Notificaciones */}
          <SettingCard title="Notificaciones" icon={Bell}>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => {
                const labels = {
                  trades: 'Operaciones ejecutadas',
                  dailyReport: 'Reporte diario',
                  marketAlerts: 'Alertas de mercado',
                  educational: 'Contenido educativo'
                };
                
                return (
                  <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {labels[key as keyof typeof labels]}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                      className="rounded bg-gray-200 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                );
              })}
            </div>
          </SettingCard>

          {/* Seguridad */}
          <SettingCard title="Seguridad" icon={Shield}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clave API del Broker
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value="sk_live_51H..."
                    readOnly
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-12 text-gray-900 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tu clave está encriptada y segura
                </p>
              </div>

              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Autenticación de dos factores activada</span>
              </div>

              <button className="w-full bg-red-100 text-red-700 py-3 rounded-xl font-medium hover:bg-red-200 transition-colors">
                Cambiar Contraseña
              </button>
            </div>
          </SettingCard>

          {/* Preferencias de Mercado */}
          <SettingCard title="Preferencias de Mercado" icon={SettingsIcon}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Mercados Preferidos
                </label>
                <div className="space-y-2">
                  {['Criptomonedas', 'Acciones de EE.UU.', 'ETFs', 'Forex'].map((market) => (
                    <label key={market} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked={market !== 'Forex'}
                        className="rounded bg-gray-200 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{market}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Horario de Trading
                </label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none mb-3">
                  <option>24/7 (Recomendado)</option>
                  <option>Solo horario de mercado</option>
                  <option>Personalizado</option>
                </select>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona Horaria
                </label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none">
                  <option>GMT-5 (Colombia, Perú)</option>
                  <option>GMT-6 (México, Guatemala)</option>
                  <option>GMT-3 (Argentina, Chile)</option>
                  <option>GMT+1 (España)</option>
                </select>
              </div>
            </div>
          </SettingCard>

          {/* Información del Sistema */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-900">Estado del Sistema</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm text-gray-700">Conexión API</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Conectado</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm text-gray-700">IA Trading</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Activo</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm text-gray-700">Última Actualización</span>
                <span className="text-xs text-gray-600">Hace 2 min</span>
              </div>
            </div>
          </div>

          {/* Advertencia Legal */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-2">Aviso Legal Importante</h4>
                <p className="text-yellow-800 text-sm leading-relaxed">
                  TradingFácil es una plataforma educativa y de asistencia en inversiones. Todas las inversiones 
                  conllevan riesgo de pérdida. Solo invierte dinero que puedas permitirte perder. 
                  Los resultados pasados no garantizan rendimientos futuros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;