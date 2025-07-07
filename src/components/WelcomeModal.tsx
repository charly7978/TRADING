import React, { useState } from 'react';
import { X, TrendingUp, Shield, Bot, GraduationCap } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "¡Bienvenido a TradingFácil!",
      subtitle: "Tu primera plataforma de inversión automática",
      content: "Diseñada especialmente para principiantes. Sin complicaciones, sin jerga técnica.",
      icon: TrendingUp,
      color: "from-blue-500 to-green-500"
    },
    {
      title: "100% Automático",
      subtitle: "La inteligencia artificial trabaja por ti",
      content: "Solo configura tu presupuesto y nivel de riesgo. Nosotros nos encargamos del resto.",
      icon: Bot,
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Totalmente Seguro",
      subtitle: "Tu dinero está protegido",
      content: "Usamos las mejores medidas de seguridad y brokers regulados internacionalmente.",
      icon: Shield,
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Aprende Mientras Inviertes",
      subtitle: "Educación financiera incluida",
      content: "Accede a cursos gratuitos y entiende cómo funciona tu dinero.",
      icon: GraduationCap,
      color: "from-orange-500 to-red-500"
    }
  ];

  const currentStep = steps[step - 1];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
          
          <div className={`bg-gradient-to-br ${currentStep.color} p-8 text-white text-center`}>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
            <p className="text-white/90 font-medium">{currentStep.subtitle}</p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            {currentStep.content}
          </p>

          {/* Progress indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index + 1 === step ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
            )}
            
            {step < steps.length ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                ¡Empezar!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;