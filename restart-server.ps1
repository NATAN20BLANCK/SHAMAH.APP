# Reiniciar Shamah Web com cache limpo
Write-Host "🔄 Parando processos existentes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

Write-Host "🧹 Limpando cache..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

Write-Host "🚀 Iniciando servidor na porta 8083..." -ForegroundColor Green
npx expo start --web --port 8083 --clear
