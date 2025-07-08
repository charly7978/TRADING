import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Bot, 
  Wallet, 
  GraduationCap, 
  Settings,
  TrendingUp,
  Shield,
  DollarSign,
  Brain,
  Key,
  Play,
  Pause
} from 'lucide-react';
import { useActiveTradingContext } from '../context/useActiveTradingContext';

const Navigation = () => {
  const location = useLocation();
  const { isConnected, isAutoTradingActive, setIsAutoTradingActive } = useActiveTradingContext();

  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: Home },
    { path: '/ai-recommendations', label: 'IA Recomendaciones', icon: Brain },
    { path: '/auto-trading', label: 'Trading Automático', icon: Bot },
    { path: '/portfolio', label: 'Mi Dinero', icon: Wallet },
    { path: '/education', label: 'Aprende', icon: GraduationCap },
    { path: '/settings', label: 'Configuración', icon: Settings }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TradingFácil</h1>
              <p className="text-xs text-gray-500">Tu asistente de inversión</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-3">
            {!isConnected && (
              <Link
                to="/trading-setup"
                className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors"
              >
                <Key className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-700 font-medium">Conectar APIs</span>
              </Link>
            )}
            
            {isConnected && (
              <button
                onClick={() => setIsAutoTradingActive(!isAutoTradingActive)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${isAutoTradingActive ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {isAutoTradingActive ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                <span className="text-sm font-medium">{isAutoTradingActive ? 'Auto-Trading Activo' : 'Auto-Trading Pausado'}</span>
              </button>
            )}

            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              isConnected ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Shield className={`h-4 w-4 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm font-medium ${
                isConnected ? 'text-green-700' : 'text-red-700'
              }`}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">$1,250</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;