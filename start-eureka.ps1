# Script para iniciar solo Eureka Server
Write-Host "Iniciando Eureka Server..." -ForegroundColor Cyan
cd areska-eureka-server
.\mvnw spring-boot:run
