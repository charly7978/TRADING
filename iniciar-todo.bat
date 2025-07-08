@echo off
REM Script para Windows: inicia proxy y frontend juntos
cd /d %~dp0
start "PROXY" cmd /k "node proxy-server.cjs"
TIMEOUT /T 2 >nul
start "FRONTEND" cmd /k "npm run dev"

echo.
echo =============================================
echo  La aplicación TradingFácil se está iniciando.
echo  NO cierres estas ventanas mientras la uses.
echo  Si ves errores en alguna ventana, copia el mensaje y consulta soporte.
echo =============================================
pause >nul

