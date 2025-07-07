# TradingFácil - Plataforma de Trading Automatizado con IA

Una plataforma completa de trading automatizado que utiliza inteligencia artificial para analizar mercados y ejecutar operaciones reales en criptomonedas y acciones.

## 🚀 Características Principales

### 🤖 Inteligencia Artificial Avanzada
- **Análisis técnico automatizado**: RSI, MACD, Bandas de Bollinger
- **Predicción de precios**: Modelos de machine learning entrenados
- **Análisis de sentimiento**: Procesamiento de noticias y redes sociales
- **Recomendaciones personalizadas**: Sugerencias basadas en perfil de riesgo

### 📊 Trading Real
- **APIs integradas**: Binance (crypto) y Alpaca (acciones)
- **Ejecución automática**: Órdenes de mercado y límite
- **Gestión de riesgo**: Stop loss y take profit automáticos
- **Monitoreo en tiempo real**: Datos de mercado actualizados

### 💼 Gestión de Portfolio
- **Balance en tiempo real**: Múltiples monedas y activos
- **Análisis de rendimiento**: Gráficos y métricas detalladas
- **Historial completo**: Todas las operaciones registradas
- **Reportes exportables**: CSV y PDF

### 🛡️ Seguridad
- **Encriptación AES-256**: Claves API protegidas
- **Conexiones seguras**: HTTPS y WSS únicamente
- **Permisos limitados**: Solo trading, sin retiros
- **Auditoría completa**: Logs de todas las operaciones

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Recharts** para gráficos
- **Lucide React** para iconos
- **React Router** para navegación

### Backend/APIs
- **Binance API** - Trading de criptomonedas
- **Alpaca API** - Trading de acciones de EE.UU.
- **Polygon API** - Datos de mercado en tiempo real
- **Axios** para peticiones HTTP

### Inteligencia Artificial
- **Análisis técnico**: Indicadores matemáticos
- **Machine Learning**: Modelos predictivos
- **Procesamiento de señales**: Filtros y algoritmos
- **Análisis de sentimiento**: NLP básico

## 📋 Requisitos Previos

### Cuentas de Trading (Opcionales)
1. **Binance** - Para trading de criptomonedas
   - Crear cuenta en [binance.com](https://binance.com)
   - Generar API Key con permisos de "Spot Trading"
   - **Importante**: Deshabilitar retiros por seguridad

2. **Alpaca** - Para trading de acciones
   - Crear cuenta en [alpaca.markets](https://alpaca.markets)
   - Comenzar con Paper Trading (simulado)
   - Generar API Keys desde el dashboard

3. **Polygon** - Para datos de mercado (Opcional)
   - Obtener API key gratuita en [polygon.io](https://polygon.io)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/trading-facil.git
cd trading-facil
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
# APIs de Trading (configurar desde la app)
VITE_BINANCE_API_URL=https://api.binance.com
VITE_ALPACA_API_URL=https://paper-api.alpaca.markets
VITE_POLYGON_API_URL=https://api.polygon.io

# Configuración de la app
VITE_APP_NAME=TradingFácil
VITE_APP_VERSION=1.0.0
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Construir para producción
```bash
npm run build
```

## 📱 Uso de la Aplicación

### Primer Uso
1. **Abrir la aplicación** en el navegador
2. **Completar el tutorial** de bienvenida
3. **Conectar APIs** desde el menú de configuración
4. **Configurar perfil de riesgo** y presupuesto
5. **Activar trading automático**

### Conectar APIs de Trading
1. Ir a **"Conectar APIs"** en la navegación
2. Seguir las **instrucciones paso a paso**
3. Ingresar las **claves API** obtenidas
4. **Verificar conexión** automáticamente
5. Comenzar a recibir **recomendaciones de IA**

### Recibir Recomendaciones
1. Ir a **"IA Recomendaciones"**
2. La IA analizará **mercados en tiempo real**
3. Revisar **sugerencias personalizadas**
4. **Ejecutar operaciones** con un clic
5. Monitorear **resultados en tiempo real**

### Configurar Trading Automático
1. Ir a **"Trading Automático"**
2. Establecer **presupuesto mensual**
3. Seleccionar **nivel de riesgo**
4. Activar **estrategias de IA**
5. **Monitorear** operaciones automáticas

## 🔧 Configuración Avanzada

### Niveles de Riesgo
- **Conservador**: 5-8% retorno anual esperado
- **Moderado**: 8-15% retorno anual esperado
- **Agresivo**: 15-25% retorno anual esperado

### Estrategias de IA
- **Análisis Técnico**: RSI, MACD, Bollinger Bands
- **Momentum Trading**: Detección de tendencias
- **Breakout Detection**: Rupturas de resistencia/soporte
- **Mean Reversion**: Reversión a la media

### Gestión de Riesgo
- **Stop Loss**: Pérdida máxima por operación
- **Take Profit**: Ganancia objetivo automática
- **Position Sizing**: Tamaño de posición calculado
- **Diversificación**: Múltiples activos y estrategias

## 📊 Métricas y Análisis

### Dashboard Principal
- **Balance total** en tiempo real
- **Ganancias/pérdidas** diarias
- **Rendimiento** histórico
- **Operaciones recientes**

### Portfolio
- **Distribución de activos**
- **Rendimiento por activo**
- **Historial completo**
- **Métricas de riesgo**

### Análisis de IA
- **Confianza** en recomendaciones
- **Precisión histórica**
- **Factores de decisión**
- **Backtesting** de estrategias

## 🛡️ Seguridad y Mejores Prácticas

### Seguridad de APIs
- **Nunca compartir** claves secretas
- **Usar solo permisos** de trading
- **Deshabilitar retiros** en las APIs
- **Monitorear actividad** regularmente

### Gestión de Riesgo
- **Comenzar con poco dinero**
- **Usar cuentas de prueba** inicialmente
- **Diversificar inversiones**
- **Establecer límites** claros

### Recomendaciones
- **Educarse continuamente** sobre trading
- **No invertir más** de lo que puedes perder
- **Revisar operaciones** regularmente
- **Mantener expectativas** realistas

## 🔄 Actualizaciones y Mantenimiento

### Actualizaciones Automáticas
- **Datos de mercado**: Cada 30 segundos
- **Recomendaciones de IA**: Cada 5 minutos
- **Balance de cuenta**: Cada minuto
- **Análisis técnico**: Cada hora

### Mantenimiento
- **Logs de operaciones**: Limpieza automática
- **Cache de datos**: Optimización continua
- **Conexiones API**: Reconexión automática
- **Backup de configuración**: Diario

## 📞 Soporte y Contacto

### Documentación
- **Wiki completa**: En el repositorio
- **Videos tutoriales**: Canal de YouTube
- **FAQ**: Preguntas frecuentes
- **Blog**: Actualizaciones y consejos

### Comunidad
- **Discord**: Chat en tiempo real
- **Telegram**: Notificaciones importantes
- **Reddit**: Discusiones y feedback
- **GitHub**: Issues y contribuciones

## ⚖️ Disclaimer Legal

**IMPORTANTE**: Esta aplicación es para fines educativos y de asistencia en inversiones. 

- **No es asesoría financiera** profesional
- **Todas las inversiones** conllevan riesgo
- **Resultados pasados** no garantizan rendimientos futuros
- **Solo invierte** dinero que puedas permitirte perder
- **Consulta profesionales** para decisiones importantes

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**¡Comienza tu viaje en el trading automatizado con IA hoy mismo!** 🚀

Para más información, visita nuestra [documentación completa](https://github.com/tu-usuario/trading-facil/wiki) o únete a nuestra [comunidad](https://discord.gg/trading-facil).