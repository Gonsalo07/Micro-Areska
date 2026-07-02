# Backend — Microservicios Areska

Backend de **Areska** basado en **Spring Cloud**: 5 microservicios de negocio, API Gateway, service discovery y mensajería asíncrona con **RabbitMQ**. La coordinación entre **Order Service** y **Delivery Service** es el núcleo del sistema.

> Documentación general del proyecto: [README raíz](../README.md)

---

## Estructura

```
backend/
├── areska-config-server/       # Configuración centralizada (:8888)
├── areska-eureka-server/         # Service discovery (:8761)
├── areska-gateway-service/       # API Gateway + Firebase Auth (:8090)
├── areska-user-service/          # Usuarios y roles (:8081)
├── areska-product-service/       # Catálogo y stock (:8082)
├── areska-payment-service/       # Pagos (:8083)
├── areska-order-service/         # Órdenes + productor RabbitMQ (:8084)
├── areska-delivery-service/      # Entregas + consumidor RabbitMQ + WebSocket GPS (:8085)
├── config-repo/                  # Properties/YAML por servicio
├── database/                     # Schema e inicialización PostgreSQL
├── docs/                         # Documentación técnica adicional
├── docker-compose.yml
├── prometheus.yml
├── .env.example
└── start-all-services.ps1
```

---

## Microservicios

| Servicio | Puerto | Eureka ID | Responsabilidad |
|----------|--------|-----------|-----------------|
| Config Server | 8888 | — | Sirve config desde `config-repo/` |
| Eureka Server | 8761 | — | Registro y descubrimiento |
| User Service | 8081 | `ARESKA-USER-SERVICE` | CRUD usuarios, sync Firebase, roles |
| Product Service | 8082 | `ARESKA-PRODUCT-SERVICE` | Productos, categorías, stock |
| Payment Service | 8083 | `ARESKA-PAYMENT-SERVICE` | Pagos vinculados a órdenes |
| Order Service | 8084 | `ARESKA-ORDER-SERVICE` | Órdenes, chat, **productor RabbitMQ** |
| Delivery Service | 8085 | `ARESKA-DELIVERY-SERVICE` | Repartidores, entregas, **consumidor RabbitMQ**, **WebSocket GPS** |
| API Gateway | 8090 | `ARESKA-GATEWAY-SERVICE` | Entrada única, JWT Firebase, rutas |

---

## Infraestructura (Docker Compose)

| Componente | Puerto | Uso |
|------------|--------|-----|
| PostgreSQL | 5433 → 5432 | Base de datos compartida `areska` |
| RabbitMQ | 5672, 15672 | Mensajería Order → Delivery |
| Zipkin | 9411 | Trazas distribuidas |
| Prometheus | 9090 | Métricas Actuator |
| Grafana | 3030 | Dashboards (`admin` / `admin123`) |
| Kafka + Zookeeper | 9092, 2181 | Provisionado; no usado en código actual |

---

## Flujo clave: Order → RabbitMQ → Delivery

Cuando se crea una orden con `pickup_method: "delivery"`:

1. **Order Service** valida usuario y productos (OpenFeign), guarda la orden en PostgreSQL.
2. Tras el **commit** de la transacción, `DeliveryProducer` publica en la cola.
3. **Delivery Service** consume el mensaje con `@RabbitListener` y crea `order_delivery_details`.
4. Se notifica a repartidores vía WebSocket (`/topic/orders/available`).

| Elemento | Valor |
|----------|-------|
| Cola | `delivery.orders.queue` |
| Productor | `areska-order-service/.../producer/DeliveryProducer.java` |
| Consumidor | `areska-delivery-service/.../consumer/DeliveryConsumer.java` |
| Config | `config-repo/areska-order-service.properties`, `areska-delivery-service.properties` |

```java
// Order Service — envío tras commit
rabbitTemplate.convertAndSend(queueName, deliveryRequestJson);

// Delivery Service — recepción
@RabbitListener(queues = "${delivery.queue.name:delivery.orders.queue}")
public void receiveDeliveryRequest(String message) { ... }
```

### Estados paralelos

| Dominio | Servicio | Ciclo de vida |
|---------|----------|---------------|
| Negocio | Order | `pending` → `confirmed` → `preparing` → `ready` → `completed` / `cancelled` |
| Logística | Delivery | `PENDING_ASSIGNMENT` → `ASSIGNED` → `ACCEPTED` → `OUT_FOR_DELIVERY` → `DELIVERED` |

---

## WebSocket (STOMP + SockJS)

Rutas expuestas por el Gateway (`config-repo/areska-gateway-service.yml`):

| Gateway | Servicio | Endpoint | Uso |
|---------|----------|----------|-----|
| `/api/ws/**` | Order Service | `/ws` | Chat y estado de orden |
| `/api/delivery-ws/**` | Delivery Service | `/delivery-ws` | GPS, tracking, notificaciones |

### Delivery Service — topics principales

| Destino | Dirección | Propósito |
|---------|-----------|-----------|
| `/app/delivery/location` | Repartidor → servidor | Recibe coordenadas GPS |
| `/topic/order/{orderId}/location` | Servidor → cliente | Mapa en tiempo real |
| `/topic/order/{orderId}/tracking` | Servidor → cliente | Hitos de entrega |
| `/topic/orders/available` | Servidor → repartidores | Nueva orden disponible |
| `/topic/orders/taken/{deliveryId}` | Servidor → repartidores | Orden ya aceptada |

Archivos clave:
- `areska-delivery-service/.../controller/DeliveryTrackingController.java`
- `areska-delivery-service/.../service/DeliveryTrackingService.java`
- `areska-delivery-service/.../config/WebSocketConfig.java`
- `areska-order-service/.../config/WebSocketConfig.java`

---

## API Gateway

Punto de entrada: `http://localhost:8090/api`

| Ruta | Servicio destino |
|------|------------------|
| `/api/users/**` | User Service |
| `/api/products/**`, `/api/categories/**` | Product Service |
| `/api/orders/**`, `/api/chat-messages/**`, `/api/ws/**` | Order Service |
| `/api/payments/**` | Payment Service |
| `/api/order-deliveries/**`, `/api/delivery-drivers/**`, `/api/delivery-ws/**` | Delivery Service |

- Autenticación: **Firebase JWT** validado en `AuthenticationFilter`.
- Headers inyectados: `X-Firebase-UiD`, `X-Firebase-Email`.
- CORS: `http://localhost:3000`, `3001`, `8090`.

---

## Comunicación entre servicios

| Patrón | Ejemplo |
|--------|---------|
| REST vía Gateway | Frontends → microservicios |
| OpenFeign + Eureka | Order → User, Product; Payment → Order |
| RabbitMQ | Order → Delivery (asíncrono) |
| WebSocket STOMP | Tracking GPS, notificaciones, chat |
| PostgreSQL compartida | Tablas por dominio en BD `areska` |
| Zipkin | Trazas en todos los servicios |

---

## Configuración

### 1. Variables de entorno

```powershell
Copy-Item .env.example .env
```

Edita contraseñas y hosts según tu entorno. En Docker, los servicios usan nombres de contenedor (`postgres`, `rabbitmq`).

### 2. Firebase (Gateway)

Coloca la clave de servicio en:
```
areska-gateway-service/firebase-service-account.json
```

Firebase Console → Configuración → Cuentas de servicio → Generar nueva clave privada.

### 3. Config centralizada

Los servicios leen propiedades desde `config-repo/` vía Config Server. Ejemplos:
- `areska-gateway-service.yml` — rutas del gateway
- `areska-order-service.properties` — cola RabbitMQ
- `areska-delivery-service.properties` — cola RabbitMQ, datasource

---

## Inicio rápido

### Docker (recomendado)

```powershell
cd backend
docker compose up -d
```

Verificar estado (~3–4 min):
```powershell
docker compose ps
docker compose logs -f order-service
```

### Script PowerShell (desarrollo local)

Requiere PostgreSQL y RabbitMQ activos:

```powershell
.\start-all-services.ps1
```

Orden: Config Server → Eureka → User/Product/Payment → Order/Delivery → Gateway.

### Servicio individual

```powershell
cd areska-order-service
./mvnw spring-boot:run
```

---

## URLs útiles

| Recurso | URL |
|---------|-----|
| API Gateway | http://localhost:8090 |
| Eureka | http://localhost:8761 |
| RabbitMQ UI | http://localhost:15672 (guest/guest) |
| Zipkin | http://localhost:9411 |
| Swagger Order | http://localhost:8084/swagger-ui.html |
| Swagger Delivery | http://localhost:8085/swagger-ui.html |

---

## Detener

```powershell
docker compose down          # conserva datos
docker compose down -v       # elimina volúmenes (BD)
```

---

## Stack

Java 17 · Spring Boot · Spring Cloud (Gateway, Config, Eureka) · Spring Data JPA · OpenFeign · Spring AMQP · WebSocket STOMP · PostgreSQL · Firebase Admin SDK · Zipkin · Prometheus · Docker
