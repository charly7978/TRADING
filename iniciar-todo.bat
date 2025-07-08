@echo off
REM Script para Windows: inicia proxy y frontend juntos
start cmd /k "node proxy-server.cjs"
TIMEOUT /T 2 >nul
start cmd /k "npm run dev"
