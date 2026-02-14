# Areska Microservices Architecture

Sistema de microservicios desarrollado con Spring Boot, Eureka, RabbitMQ y PostgreSQL.

## 🏗️ Arquitectura

```
┌─────────────────┐
│  Eureka Server  │ (Puerto 8761)
│   (Registry)     │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┬──────────┬──────────┐
    │         │          │          │          │          │
┌───▼───┐ ┌──▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐
│ User  │ │Product│  │Category│  │ Order │  │Payment│  │Delivery│
│ 8081  │ │ 8082  │  │  8084  │  │ 8080  │  │ 8083  │  │  8085  │
└───────┘ └───────┘  └────────┘  └───┬───┘  └───┬───┘  └───┬───┘
                                      │          │          │
                                      │          │          │
                              ┌───────▼──────────▼──────────▼───────┐
                              │         RabbitMQ                    │
                              │    (delivery.orders.queue)          │
                              └─────────────────────────────────────┘
```

## 📦 Servicios

| Servicio | Puerto | Descripción | Dependencias |
|----------|--------|-------------|--------------|
| **Eureka Server** | 8761 | Service Registry | Ninguna |
| **User Service** | 8081 | Gestión de usuarios | Ninguna |
| **Product Service** | 8082 | Gestión de productos | Ninguna |
| **Category Service** | 8084 | Gestión de categorías | Ninguna |
| **Order Service** | 8080 | Gestión de órdenes | User, Product |
| **Payment Service** | 8083 | Gestión de pagos | Order |
| **Delivery Service** | 8085 | Gestión de entregas | RabbitMQ |

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Windows)

```powershell
.\start-all-services.ps1
```

### Opción 2: Manual

Ver la guía completa: [GUIA_EJECUCION.md](./GUIA_EJECUCION.md)

**Orden de inicio:**
1. RabbitMQ (verificar que esté corriendo)
2. Eureka Server
3. User, Product, Category Services
4. Order Service
5. Payment Service
6. Delivery Service

## 📋 Prerrequisitos

- Java 17
- Maven 3.6+ (o usar mvnw incluido)
- PostgreSQL (base de datos `areska_db`)
- RabbitMQ Server

## 🔧 Configuración

### Base de Datos
Todos los servicios usan la misma base de datos PostgreSQL:
- **URL:** `jdbc:postgresql://localhost:5432/areska_db`
- **Usuario:** `postgres`
- **Contraseña:** `postgres`

### RabbitMQ
- **Host:** `localhost`
- **Puerto:** `5672`
- **Usuario:** `guest`
- **Contraseña:** `guest`
- **Management UI:** http://localhost:15672

### Eureka
- **URL:** http://localhost:8761

## 📚 Documentación API

Cada servicio expone documentación Swagger/OpenAPI:
- User: http://localhost:8081/swagger-ui.html
- Product: http://localhost:8082/swagger-ui.html
- Category: http://localhost:8084/swagger-ui.html
- Order: http://localhost:8080/swagger-ui.html
- Payment: http://localhost:8083/swagger-ui.html
- Delivery: http://localhost:8085/swagger-ui.html

## 🔄 Flujo de Comunicación

### Creación de Orden con Delivery

1. **Cliente** → `Order Service`: Crea orden con `pickupMethod: "delivery"`
2. **Order Service** → `User Service` (Feign): Valida usuario
3. **Order Service** → `Product Service` (Feign): Valida y actualiza stock
4. **Order Service** → `RabbitMQ`: Envía mensaje a cola `delivery.orders.queue`
5. **Delivery Service** (Consumer): Recibe mensaje y crea registro de delivery

### Si Delivery Service está apagado:
- Los mensajes se guardan en la cola RabbitMQ (durable)
- Al iniciar Delivery Service, procesa automáticamente los mensajes pendientes

## 🛠️ Comandos Útiles

### Iniciar un servicio individual
```bash
cd areska-[service-name]
./mvnw spring-boot:run
```

### Verificar RabbitMQ
```bash
rabbitmqctl status
```

### Verificar colas en RabbitMQ
```bash
rabbitmqctl list_queues
```

## 📝 Notas

- Todos los servicios se auto-registran en Eureka al iniciar
- La comunicación entre servicios usa Feign Client
- RabbitMQ garantiza que los mensajes de delivery no se pierdan
- La base de datos se crea automáticamente con `ddl-auto=update`

## 🐛 Troubleshooting

Ver sección de troubleshooting en [GUIA_EJECUCION.md](./GUIA_EJECUCION.md)
