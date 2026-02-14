# Script para iniciar todos los servicios de Areska
# Uso: .\start-all-services.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Microservicios Areska" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar RabbitMQ
Write-Host "1. Verificando RabbitMQ..." -ForegroundColor Yellow
try {
    $rabbitmqStatus = rabbitmqctl status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ RabbitMQ está corriendo" -ForegroundColor Green
    } else {
        Write-Host "   ✗ RabbitMQ no está corriendo. Por favor inícialo primero." -ForegroundColor Red
        Write-Host "   Ejecuta: rabbitmq-server" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "   ⚠ No se pudo verificar RabbitMQ. Asegúrate de que esté corriendo." -ForegroundColor Yellow
}

Write-Host ""

# Iniciar Eureka Server
Write-Host "2. Iniciando Eureka Server (puerto 8761)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-eureka-server'; Write-Host 'Eureka Server - Puerto 8761' -ForegroundColor Cyan; mvnw spring-boot:run"
Start-Sleep -Seconds 10
Write-Host "   ✓ Eureka Server iniciado" -ForegroundColor Green
Write-Host "   Abre http://localhost:8761 para ver el dashboard" -ForegroundColor Gray
Write-Host ""

# Esperar un poco para que Eureka esté listo
Write-Host "   Esperando 15 segundos para que Eureka esté listo..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# Iniciar servicios base
Write-Host "3. Iniciando servicios base..." -ForegroundColor Yellow

Write-Host "   - User Service (puerto 8081)..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-user-service'; Write-Host 'User Service - Puerto 8081' -ForegroundColor Cyan; mvnw spring-boot:run"
Start-Sleep -Seconds 3

Write-Host "   - Product Service (puerto 8082)..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-product-service'; Write-Host 'Product Service - Puerto 8082' -ForegroundColor Cyan; mvnw spring-boot:run"
Start-Sleep -Seconds 3

Write-Host "   - Category Service (puerto 8084)..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-category-services'; Write-Host 'Category Service - Puerto 8084' -ForegroundColor Cyan; mvnw spring-boot:run"
Start-Sleep -Seconds 3

Write-Host "   ✓ Servicios base iniciados" -ForegroundColor Green
Write-Host ""

# Esperar un poco para que los servicios base estén listos
Write-Host "   Esperando 20 segundos para que los servicios base estén listos..." -ForegroundColor Gray
Start-Sleep -Seconds 20

# Iniciar Order Service
Write-Host "4. Iniciando Order Service (puerto 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-order-service'; Write-Host 'Order Service - Puerto 8080' -ForegroundColor Cyan; mvnw spring-boot:run"
Start-Sleep -Seconds 5
Write-Host "   ✓ Order Service iniciado" -ForegroundColor Green
Write-Host ""

# Esperar un poco para que Order Service esté listo
Write-Host "   Esperando 15 segundos para que Order Service esté listo..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# Iniciar Payment Service
Write-Host "5. Iniciando Payment Service (puerto 8083)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-payment-service'; Write-Host 'Payment Service - Puerto 8083' -ForegroundColor Cyan; mvnw spring-boot:run"
Start-Sleep -Seconds 5
Write-Host "   ✓ Payment Service iniciado" -ForegroundColor Green
Write-Host ""

# Iniciar Delivery Service
Write-Host "6. Iniciando Delivery Service (puerto 8085)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-delivery-service'; Write-Host 'Delivery Service - Puerto 8085' -ForegroundColor Cyan; mvnw spring-boot:run"
Start-Sleep -Seconds 5
Write-Host "   ✓ Delivery Service iniciado" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Todos los servicios están iniciando" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verifica el estado en:" -ForegroundColor Yellow
Write-Host "  - Eureka Dashboard: http://localhost:8761" -ForegroundColor White
Write-Host "  - RabbitMQ Management: http://localhost:15672" -ForegroundColor White
Write-Host ""
Write-Host "Swagger UI de cada servicio:" -ForegroundColor Yellow
Write-Host "  - User: http://localhost:8081/swagger-ui.html" -ForegroundColor White
Write-Host "  - Product: http://localhost:8082/swagger-ui.html" -ForegroundColor White
Write-Host "  - Category: http://localhost:8084/swagger-ui.html" -ForegroundColor White
Write-Host "  - Order: http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "  - Payment: http://localhost:8083/swagger-ui.html" -ForegroundColor White
Write-Host "  - Delivery: http://localhost:8085/swagger-ui.html" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
