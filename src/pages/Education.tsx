import React from 'react';
import {
  GraduationCap,
  Play,
  BookOpen,
  TrendingUp,
  Shield,
  DollarSign,
  Brain,
  Target,
  Clock,
  Star
} from 'lucide-react';

const Education = () => {
  const courses = [
    {
      id: 1,
      title: "Fundamentos de Inversión",
      description: "Aprende los conceptos básicos para empezar a invertir",
      duration: "30 min",
      level: "Principiante",
      progress: 100,
      icon: BookOpen,
      color: "green",
      lessons: [
        "¿Qué es invertir?",
        "Tipos de inversiones",
        "Riesgo vs Rendimiento",
        "Diversificación básica"
      ]
    },
    {
      id: 2,
      title: "Cómo Funciona el Trading Automático",
      description: "Entiende cómo la IA toma decisiones de inversión",
      duration: "25 min",
      level: "Principiante",
      progress: 60,
      icon: Brain,
      color: "blue",
      lessons: [
        "¿Qué es la inteligencia artificial?",
        "Análisis técnico automatizado",
        "Gestión de riesgo por IA",
        "Ventajas del trading automático"
      ]
    },
    {
      id: 3,
      title: "Gestión de Riesgo",
      description: "Aprende a proteger tu dinero mientras inviertes",
      duration: "20 min",
      level: "Intermedio",
      progress: 0,
      icon: Shield,
      color: "red",
      lessons: [
        "Tipos de riesgo en inversiones",
        "Stop loss y take profit",
        "Diversificación avanzada",
        "Psicología del inversor"
      ]
    },
    {
      id: 4,
      title: "Análisis de Mercados",
      description: "Comprende cómo leer e interpretar los mercados",
      duration: "35 min",
      level: "Intermedio",
      progress: 0,
      icon: TrendingUp,
      color: "purple",
      lessons: [
        "Análisis técnico básico",
        "Indicadores principales",
        "Tendencias del mercado",
        "Factores económicos"
      ]
    }
  ];

  const tips = [
    {
      title: "Empieza con poco dinero",
      description: "Nunca inviertas más de lo que puedes permitirte perder",
      icon: DollarSign
    },
    {
      title: "La paciencia es clave",
      description: "Las mejores inversiones requieren tiempo para crecer",
      icon: Clock
    },
    {
      title: "Diversifica siempre",
      description: "No pongas todos los huevos en la misma canasta",
      icon: Target
    },
    {
      title: "Aprende continuamente",
      description: "El mercado cambia, mantente actualizado",
      icon: GraduationCap
    }
  ];

  const glossary = [
    {
      term: "Bull Market",
      definition: "Mercado alcista - cuando los precios suben de forma sostenida"
    },
    {
      term: "Bear Market", 
      definition: "Mercado bajista - cuando los precios bajan de forma sostenida"
    },
    {
      term: "Volatilidad",
      definition: "Medida de cuánto varían los precios en un período de tiempo"
    },
    {
      term: "ROI",
      definition: "Return on Investment - el retorno o ganancia de una inversión"
    },
    {
      term: "Stop Loss",
      definition: "Orden automática para vender cuando el precio baja a cierto nivel"
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Aprendizaje</h1>
          <p className="text-gray-600">Aprende a invertir de forma inteligente y segura</p>
        </div>

        {/* Cursos principales */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cursos Recomendados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const Icon = course.icon;
              
              return (
                <div key={course.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${course.color}-100`}>
                      <Icon className={`h-6 w-6 text-${course.color}-600`} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{course.duration}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full bg-${course.color}-100 text-${course.color}-700`}>
                      {course.level}
                    </span>
                    <span className="text-sm text-gray-500">{course.progress}% completado</span>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className={`bg-${course.color}-500 h-2 rounded-full transition-all`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  
                  <button className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-colors bg-${course.color}-600 text-white hover:bg-${course.color}-700`}>
                    <Play className="h-4 w-4" />
                    <span>{course.progress > 0 ? 'Continuar' : 'Empezar'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consejos rápidos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Consejos de Oro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              
              return (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Glosario */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Glosario de Términos</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              {glossary.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{item.term}</h4>
                    <p className="text-gray-600 text-sm">{item.definition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progreso del usuario */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Tu Progreso de Aprendizaje</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-white/80 text-sm">Cursos Completados</p>
                  <p className="text-2xl font-bold">1/4</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Tiempo Estudiado</p>
                  <p className="text-2xl font-bold">30 min</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Nivel Actual</p>
                  <p className="text-2xl font-bold">Principiante</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Puntos</p>
                  <p className="text-2xl font-bold">150</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-300" />
              <GraduationCap className="h-12 w-12 text-white/60" />
            </div>
          </div>
        </div>

        {/* Próximamente */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Próximamente</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl opacity-75">
              <h4 className="font-bold text-gray-700 mb-2">Webinars en Vivo</h4>
              <p className="text-gray-500 text-sm">Sesiones en directo con expertos</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl opacity-75">
              <h4 className="font-bold text-gray-700 mb-2">Paper Trading</h4>
              <p className="text-gray-500 text-sm">Practica con dinero virtual</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl opacity-75">
              <h4 className="font-bold text-gray-700 mb-2">Comunidad</h4>
              <p className="text-gray-500 text-sm">Conecta con otros inversores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;