@echo off
echo 🔄 Limpando cache e reiniciando servidor...

REM Matar processos Node.js existentes
taskkill /F /IM node.exe 2>nul

REM Limpar cache do Expo
npx expo r --clear

REM Aguardar um momento
timeout /t 2 /nobreak >nul

REM Iniciar servidor web
echo 🚀 Iniciando servidor na porta 8083...
npx expo start --web --port 8083

pause
