# Areska - Guía de Inicio

<img width="1920" height="1280" alt="readme" src="https://github.com/user-attachments/assets/24aead36-1524-42c6-bb46-6826dc62444b" />

## Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- [Node.js + pnpm](https://pnpm.io/installation)
- PowerShell (Windows)
- Java 17+ y Maven (solo para Opción B y C)

---

# 🔧 BACKEND

## 1. Configurar el entorno

### 1.1 Crear el archivo `.env`
Dentro de la carpeta `backend/`, copia el archivo de ejemplo:
```powershell
Copy-Item backend\.env.example backend\.env
```
Abre `backend/.env` y ajusta las contraseñas si es necesario. Por defecto funciona tal como está.

### 1.2 Configurar Firebase
Descarga las credenciales de Firebase:
> Firebase Console → Configuración del proyecto → Cuentas de servicio → **Generar nueva clave privada**

Copia el archivo descargado aquí con ese nombre exacto:
```
backend/areska-gateway-service/firebase-service-account.json
```

---

## 2. Levantar el backend

### Opción A — Docker (recomendado)

Un solo comando levanta toda la infraestructura y microservicios en el orden correcto:

```powershell
cd backend
docker compose up -d
```

**Orden de arranque automático (via healthchecks):**

| # | Servicio | Puerto | Depende de |
|---|----------|--------|------------|
| 1 | postgres | 5432 | — |
| 1 | rabbitmq | 5672 / 15672 | — |
| 1 | zipkin | 9411 | — |
| 1 | zookeeper | 2181 | — |
| 2 | kafka | 9092 | zookeeper |
| 3 | config-server | 8888 | — |
| 4 | eureka-server | 8761 | config-server |
| 5 | user-service | 8081 | config-server, eureka-server, postgres |
| 5 | product-service | 8082 | config-server, eureka-server, postgres |
| 5 | payment-service | 8083 | config-server, eureka-server, postgres |
| 6 | order-service | 8084 | config-server, eureka-server, postgres, rabbitmq |
| 6 | delivery-service | 8085 | config-server, eureka-server, postgres, rabbitmq |
| 7 | gateway-service | 8090 | config-server, eureka-server, user, product, order |
| 8 | prometheus | 9090 | todos los servicios |
| 9 | grafana | 3030 | prometheus |

Espera ~3-4 minutos a que todos los servicios estén listos. Verifica el estado con:
```powershell
docker compose ps
```
Para seguir los logs en tiempo real de un servicio específico:
```powershell
docker compose logs -f <nombre-contenedor>
```

---

### Opción B — Script PowerShell

> Requiere: postgres y rabbitmq corriendo (Docker o nativos). El script levanta los servicios Spring Boot con Maven.

```powershell
cd backend
.\start-all-services.ps1
```

**Orden que ejecuta el script:**

| # | Servicio | Puerto | Espera tras iniciar |
|---|----------|--------|---------------------|
| 1 | Config Server | 8888 | 35 s |
| 2 | Eureka Server | 8761 | 30 s |
| 3 | User Service | 8081 | 3 s |
| 3 | Product Service | 8082 | 20 s |
| 4 | Order Service | 8084 | 15 s |
| 5 | Payment Service | 8083 | 5 s |
| 6 | Delivery Service | 8085 | 5 s |
| 7 | API Gateway | 8090 | — |

> Cada servicio abre su propia ventana de PowerShell.

---

### Opción C — Manual (terminal por terminal)

> Requiere: postgres y rabbitmq corriendo (Docker o nativos).
> Abre una terminal separada para cada servicio.

**Paso 1 — Config Server** (espera hasta ver `Started` en los logs):
```powershell
cd backend/areska-config-server
./mvnw spring-boot:run
```

**Paso 2 — Eureka Server** (espera hasta ver el dashboard en http://localhost:8761):
```powershell
cd backend/areska-eureka-server
./mvnw spring-boot:run
```

**Paso 3 — Servicios base** (levantar en paralelo, en terminales separadas):
```powershell
# Terminal A
cd backend/areska-user-service
./mvnw spring-boot:run

# Terminal B
cd backend/areska-product-service
./mvnw spring-boot:run

# Terminal C
cd backend/areska-payment-service
./mvnw spring-boot:run
```

**Paso 4 — Servicios con RabbitMQ** (espera que el Paso 3 esté listo):
```powershell
# Terminal D
cd backend/areska-order-service
./mvnw spring-boot:run

# Terminal E
cd backend/areska-delivery-service
./mvnw spring-boot:run
```

**Paso 5 — API Gateway** (último, espera que todos los servicios anteriores estén registrados en Eureka):
```powershell
cd backend/areska-gateway-service
./mvnw spring-boot:run
```

---

# 🖥️ FRONTEND

## 3. Levantar los frontends

En dos terminales separadas:

**Frontend principal** (puerto 3000):
```powershell
cd frontend
pnpm install
pnpm dev
```

**Frontend delivery** (puerto 3001):
```powershell
cd frontend-delivery
pnpm install
pnpm dev
```

---

## 4. URLs de acceso

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Frontend | http://localhost:3000 | — |
| Frontend Delivery | http://localhost:3001 | — |
| API Gateway | http://localhost:8090 | — |
| Eureka Dashboard | http://localhost:8761 | — |
| RabbitMQ Panel | http://localhost:15672 | guest / guest |
| Zipkin | http://localhost:9411 | — |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3030 | admin / admin123 |

**Swagger UI por servicio:**

| Servicio | URL |
|----------|-----|
| User Service | http://localhost:8081/swagger-ui.html |
| Product Service | http://localhost:8082/swagger-ui.html |
| Payment Service | http://localhost:8083/swagger-ui.html |
| Order Service | http://localhost:8084/swagger-ui.html |
| Delivery Service | http://localhost:8085/swagger-ui.html |

---

## 5. Detener todo

```powershell
cd backend
docker compose down
```

Borrar también los datos de la base de datos:
```powershell
docker compose down -v
```
