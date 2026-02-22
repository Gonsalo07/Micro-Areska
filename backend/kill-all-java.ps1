# Script para detener todos los procesos Java
Write-Host "🛑 Deteniendo todos los procesos Java..." -ForegroundColor Yellow

Get-Process -Name java -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "   Deteniendo proceso Java PID: $($_.Id)" -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force
}

Start-Sleep -Seconds 2

$remaining = Get-Process -Name java -ErrorAction SilentlyContinue
if ($remaining) {
    Write-Host "❌ Algunos procesos Java no se detuvieron. Intentando nuevamente..." -ForegroundColor Red
    $remaining | Stop-Process -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "✅ Todos los procesos Java han sido detenidos" -ForegroundColor Green
}
