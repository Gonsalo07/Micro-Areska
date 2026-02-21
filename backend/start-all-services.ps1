$envFile = Join-Path $PSScriptRoot ".env"
 $envVars = @{}
if (Test-Path $envFile) {
    Write-Host "Cargando variables de entorno desde .env..." -ForegroundColor Yellow
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            if (-not [string]::IsNullOrWhiteSpace($name)) {
                $envVars[$name] = $value
                [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
            }
        }
    }
    Write-Host "   [OK] Variables cargadas" -ForegroundColor Green
    Write-Host "Variables de entorno cargadas:" -ForegroundColor Cyan
    $envVars.GetEnumerator() | ForEach-Object { Write-Host ("  $($_.Key) = $($_.Value)") -ForegroundColor White }
} else {
    Write-Host "[WARN] No se encontro archivo .env en $PSScriptRoot" -ForegroundColor Red
    Write-Host "   Asegurate de configurar las variables de entorno manualmente o crear el archivo .env" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Microservicios Areska" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Verificando RabbitMQ..." -ForegroundColor Yellow
try {
    $rabbitmqStatus = rabbitmqctl status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] RabbitMQ esta corriendo" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] RabbitMQ no parece estar corriendo localmente (rabbitmqctl fallo)." -ForegroundColor Yellow
        Write-Host "     Si usas Docker o un servicio remoto, ignora este mensaje." -ForegroundColor Gray
    }
} catch {
    Write-Host "   [WARN] No se pudo verificar RabbitMQ (comando no encontrado o error)." -ForegroundColor Yellow
}


Write-Host ""

Write-Host "2. Iniciando Config Server (puerto 8888)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-config-server'; Write-Host 'Config Server - Puerto 8888' -ForegroundColor Cyan; ./mvnw spring-boot:run"
Start-Sleep -Seconds 15
Write-Host "   [OK] Config Server iniciado" -ForegroundColor Green
Write-Host ""
Write-Host "   Esperando 20 segundos para que Config Server este listo..." -ForegroundColor Gray
Start-Sleep -Seconds 20

Write-Host "3. Iniciando Eureka Server (puerto 8761)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-eureka-server'; Write-Host 'Eureka Server - Puerto 8761' -ForegroundColor Cyan; ./mvnw spring-boot:run"
Start-Sleep -Seconds 10
Write-Host "   [OK] Eureka Server iniciado" -ForegroundColor Green
Write-Host "   Abre http://localhost:8761 para ver el dashboard" -ForegroundColor Gray
Write-Host ""

Write-Host "   Esperando 30 segundos para que Eureka este listo..." -ForegroundColor Gray
Start-Sleep -Seconds 30

Write-Host "4. Iniciando servicios base..." -ForegroundColor Yellow

Write-Host "   - User Service (puerto 8081)..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-user-service'; Write-Host 'User Service - Puerto 8081' -ForegroundColor Cyan; ./mvnw spring-boot:run"
Start-Sleep -Seconds 3

Write-Host "   - Product Service (puerto 8082)..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-product-service'; Write-Host 'Product Service - Puerto 8082' -ForegroundColor Cyan; ./mvnw spring-boot:run"
Start-Sleep -Seconds 3

Write-Host "   [OK] Servicios base iniciados" -ForegroundColor Green
Write-Host ""

Write-Host "   Esperando 20 segundos para que los servicios base esten listos..." -ForegroundColor Gray
Start-Sleep -Seconds 20

Write-Host "5. Iniciando Order Service (puerto 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-order-service'; Write-Host 'Order Service - Puerto 8080' -ForegroundColor Cyan; ./mvnw spring-boot:run"
Start-Sleep -Seconds 5
Write-Host "   [OK] Order Service iniciado" -ForegroundColor Green
Write-Host ""

Write-Host "   Esperando 15 segundos para que Order Service este listo..." -ForegroundColor Gray
Start-Sleep -Seconds 15

Write-Host "6. Iniciando Payment Service (puerto 8083)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-payment-service'; Write-Host 'Payment Service - Puerto 8083' -ForegroundColor Cyan; ./mvnw spring-boot:run"
Start-Sleep -Seconds 5
Write-Host "   [OK] Payment Service iniciado" -ForegroundColor Green
Write-Host ""

Write-Host "7. Iniciando Delivery Service (puerto 8085)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-delivery-service'; Write-Host 'Delivery Service - Puerto 8085' -ForegroundColor Cyan; ./mvnw spring-boot:run"
Start-Sleep -Seconds 5
Write-Host "   [OK] Delivery Service iniciado" -ForegroundColor Green
Write-Host ""

Write-Host "8. Iniciando API Gateway (puerto 8090)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\areska-gateway-service'; Write-Host 'API Gateway - Puerto 8090' -ForegroundColor Cyan; ./mvnw spring-boot:run"
Start-Sleep -Seconds 5
Write-Host "   [OK] API Gateway iniciado" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Todos los servicios estan iniciando" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verifica el estado en:" -ForegroundColor Yellow
Write-Host "  - Eureka Dashboard: http://localhost:8761" -ForegroundColor White
Write-Host "  - RabbitMQ Management: http://localhost:15672" -ForegroundColor White
Write-Host ""
Write-Host "Swagger UI de cada servicio:" -ForegroundColor Yellow
Write-Host "  - User: http://localhost:8081/swagger-ui.html" -ForegroundColor White
Write-Host "  - Product: http://localhost:8082/swagger-ui.html (incluye Categories)" -ForegroundColor White
Write-Host "  - Order: http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "  - Payment: http://localhost:8083/swagger-ui.html" -ForegroundColor White
Write-Host "  - Delivery: http://localhost:8085/swagger-ui.html" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
