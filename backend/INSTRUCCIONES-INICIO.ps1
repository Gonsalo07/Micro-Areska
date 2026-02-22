# Script para iniciar servicios en orden correcto
# Ejecutar cada comando en una ventana SEPARADA de PowerShell

Write-Host "📋 INSTRUCCIONES PARA INICIAR LOS SERVICIOS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣ EUREKA SERVER (Puerto 8761)" -ForegroundColor Yellow
Write-Host "   cd .\areska-eureka-server" -ForegroundColor Gray
Write-Host "   .\mvnw spring-boot:run" -ForegroundColor Gray
Write-Host "   ⏳ Esperar mensaje: 'Started EurekaServerApplication'" -ForegroundColor Green
Write-Host ""
Write-Host "2️⃣ CONFIG SERVER (Puerto 8888)" -ForegroundColor Yellow
Write-Host "   cd .\areska-config-server" -ForegroundColor Gray
Write-Host "   .\mvnw spring-boot:run" -ForegroundColor Gray
Write-Host "   ⏳ Esperar mensaje: 'Started ConfigServerApplication'" -ForegroundColor Green
Write-Host ""
Write-Host "3️⃣ DELIVERY SERVICE (Puerto 8085)" -ForegroundColor Yellow
Write-Host "   cd .\areska-delivery-service" -ForegroundColor Gray
Write-Host "   .\mvnw spring-boot:run" -ForegroundColor Gray
Write-Host "   ⏳ Esperar mensaje: 'Started DemoApplication'" -ForegroundColor Green
Write-Host ""
Write-Host "4️⃣ GATEWAY SERVICE (Puerto 8090)" -ForegroundColor Yellow
Write-Host "   cd .\areska-gateway-service" -ForegroundColor Gray
Write-Host "   .\mvnw spring-boot:run" -ForegroundColor Gray
Write-Host "   ⏳ Esperar mensaje: 'Started GatewayApplication'" -ForegroundColor Green
Write-Host ""
Write-Host "5️⃣ OTROS SERVICIOS (Opcional para esta prueba)" -ForegroundColor Yellow
Write-Host "   - User Service (Puerto configurado en .env)" -ForegroundColor Gray
Write-Host "   - Order Service (Puerto configurado en .env)" -ForegroundColor Gray
Write-Host "   - Product Service (Puerto configurado en .env)" -ForegroundColor Gray
Write-Host "   - Payment Service (Puerto configurado en .env)" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "   - Abre UNA ventana de PowerShell por cada servicio" -ForegroundColor Red
Write-Host "   - Espera a que cada servicio inicie completamente antes del siguiente" -ForegroundColor Red
Write-Host "   - Mantén las ventanas abiertas para ver los logs" -ForegroundColor Red
Write-Host ""
