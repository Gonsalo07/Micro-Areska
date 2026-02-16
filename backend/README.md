# 🚀 Areska Backend - Arquitectura de Microservicios

Backend de la plataforma de e-commerce Areska desarrollado con Spring Boot y arquitectura de microservicios.

**[INSERTA AQUI IMAGEN: Diagrama de arquitectura de microservicios]**

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Microservicios](#microservicios)
- [Requisitos Previos](#requisitos-previos)
- [Configuración](#configuración)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Variables de Entorno](#variables-de-entorno)
- [API Endpoints](#api-endpoints)
- [Monitoreo](#monitoreo)

## 🏗️ Arquitectura

Este proyecto implementa una arquitectura de microservicios con los siguientes componentes:

**[INSERTA AQUI IMAGEN: Diagrama de componentes del sistema]**

### Componentes Principales

- **API Gateway**: Punto de entrada único para todas las peticiones
- **Eureka Server**: Registro y descubrimiento de servicios
- **Config Server**: Gestión centralizada de configuraciones
- **Microservicios de Dominio**: Servicios especializados para cada funcionalidad

## 🛠️ Tecnologías

- **Java 17**
- **Spring Boot 4.0.2**
- **Spring Cloud 2025.1.0**
- **PostgreSQL 15**
- **Docker & Docker Compose**
- **RabbitMQ** - Mensajería asíncrona
- **Apache Kafka** - Streaming de eventos
- **Zipkin** - Trazabilidad distribuida
- **Firebase** - Autenticación
- **Maven** - Gestión de dependencias

**[INSERTA AQUI IMAGEN: Stack tecnológico con logos]**

## 🎯 Microservicios

### 1. Config Server (Puerto 8888)
Gestión centralizada de configuraciones para todos los microservicios.

```
Ubicación: ./areska-config-server
Configuraciones: ./config-repo
```

### 2. Eureka Server (Puerto 8761)
Servicio de registro y descubrimiento automático de microservicios.

**[INSERTA AQUI IMAGEN: Captura del Dashboard de Eureka]**

### 3. API Gateway (Puerto 8090)
- Enrutamiento dinámico de solicitudes
- Balanceo de carga
- Autenticación con Firebase
- Configuración CORS
- Rate limiting

```
Ubicación: ./areska-gateway-service
```

### 4. User Service (Puerto 8081)
Gestión de usuarios y autenticación.

**Endpoints principales:**
- `GET /users` - Listar usuarios
- `GET /users/{id}` - Obtener usuario por ID
- `GET /users/firebase/{firebaseUid}` - Obtener usuario por Firebase UID
- `POST /users/firebase/sync` - Sincronizar usuario de Firebase
- `PUT /users/{id}` - Actualizar usuario

### 5. Product Service (Puerto 8082)
Gestión del catálogo de productos.

**Endpoints principales:**
- `GET /products` - Listar productos
- `GET /products/{id}` - Obtener producto
- `POST /products` - Crear producto
- `PUT /products/{id}` - Actualizar producto
- `PATCH /products/{id}/stock` - Actualizar stock

**[INSERTA AQUI IMAGEN: Captura de productos en Postman/Swagger]**

### 6. Category Service (Puerto 8084)
Gestión de categorías de productos.

### 7. Order Service (Puerto 8080)
Gestión de pedidos y transacciones.

**Endpoints principales:**
- `GET /orders` - Listar pedidos
- `GET /orders/user-by-firebase-uid/{firebaseUid}` - Pedidos por usuario
- `POST /orders` - Crear pedido
- `PUT /orders/{id}` - Actualizar estado del pedido

### 8. Payment Service (Puerto 8083)
Procesamiento de pagos.

### 9. Delivery Service (Puerto 8085)
Gestión de entregas y seguimiento.

**[INSERTA AQUI IMAGEN: Diagrama de flujo de un pedido]**

## 📦 Requisitos Previos

- **Docker Desktop**: Versión 20.10 o superior
- **Docker Compose**: Versión 2.0 o superior
- **Java 17**: (Opcional, solo para desarrollo local sin Docker)
- **Maven 3.9+**: (Opcional, solo para desarrollo local)

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del directorio `backend` con las siguientes variables:

```env
# Firebase Configuration
FIREBASE_CREDENTIALS_JSON={"type":"service_account","project_id":"tu-proyecto",...}
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-proyecto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=tu-client-id

# RabbitMQ Configuration (Opcional)
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
```

**[INSERTA AQUI IMAGEN: Ejemplo de archivo .env con datos censurados]**

### 2. Firebase Configuration

1. Ve a la [Consola de Firebase](https://console.firebase.google.com)
2. Crea o selecciona tu proyecto
3. Ve a Project Settings > Service Accounts
4. Genera una nueva clave privada
5. Copia el contenido del JSON en `FIREBASE_CREDENTIALS_JSON`

**[INSERTA AQUI IMAGEN: Captura de la consola de Firebase mostrando dónde obtener las credenciales]**

## 🚀 Instalación y Ejecución

### Opción 1: Docker Compose (Recomendado)

1. **Clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/areska.git
cd areska/backend
```

2. **Configura las variables de entorno:**
```bash
cp .env.example .env
# Edita .env con tus credenciales de Firebase
```

3. **Levanta todos los servicios:**
```bash
docker-compose up -d --build
```

4. **Verifica que los servicios estén corriendo:**
```bash
docker-compose ps
```

**[INSERTA AQUI IMAGEN: Terminal mostrando docker-compose ps con todos los servicios UP]**

5. **Monitorea los logs:**
```bash
# Todos los servicios
docker-compose logs -f

# Un servicio específico
docker-compose logs -f gateway-service
```

### Opción 2: Desarrollo Local (Sin Docker)

1. **Inicia PostgreSQL, RabbitMQ y Kafka localmente**

2. **Inicia los servicios en orden:**
```bash
# 1. Config Server
cd areska-config-server
./mvnw spring-boot:run

# 2. Eureka Server
cd areska-eureka-server
./mvnw spring-boot:run

# 3. API Gateway
cd areska-gateway-service
./mvnw spring-boot:run

# 4. Microservicios de dominio (en paralelo)
cd areska-user-service
./mvnw spring-boot:run
```

## 🌐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `CONFIG_SERVER_URL` | URL del Config Server | `http://config-server:8888` |
| `EUREKA_URI` | URL de Eureka Server | `http://eureka-server:8761/eureka/` |
| `DB_HOST_*` | Host de PostgreSQL | `postgres` |
| `DB_PORT_*` | Puerto de PostgreSQL | `5432` |
| `DB_NAME_*` | Nombre de la base de datos | `areska` |
| `DB_USERNAME_*` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD_*` | Contraseña de la base de datos | `1234` |
| `FIREBASE_CREDENTIALS_JSON` | JSON de credenciales de Firebase | Ver `.env.example` |
| `RABBITMQ_HOST` | Host de RabbitMQ | `rabbitmq` |
| `EUREKA_USE_IP` | Usar IP en lugar de hostname | `true` |

## 📡 API Endpoints

### Acceso a través del API Gateway

Todos los endpoints están disponibles a través del API Gateway en `http://localhost:8090/api/`

**Ejemplo:**
```bash
# Listar productos
curl http://localhost:8090/api/products

# Obtener producto por ID
curl http://localhost:8090/api/products/1

# Crear pedido (requiere autenticación)
curl -X POST http://localhost:8090/api/orders \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"productId":1,"quantity":2}]}'
```

**[INSERTA AQUI IMAGEN: Captura de Postman/Insomnia con ejemplos de peticiones]**

### Swagger/OpenAPI

Cada microservicio expone su documentación Swagger:

- User Service: http://localhost:8081/swagger-ui.html
- Product Service: http://localhost:8082/swagger-ui.html
- Order Service: http://localhost:8080/swagger-ui.html
- Payment Service: http://localhost:8083/swagger-ui.html

**[INSERTA AQUI IMAGEN: Captura del Swagger UI de uno de los servicios]**

## 📊 Monitoreo

### 1. Eureka Dashboard
Ver todos los servicios registrados y su estado:
```
http://localhost:8761
```

**[INSERTA AQUI IMAGEN: Dashboard de Eureka con servicios registrados]**

### 2. RabbitMQ Management
Monitorear colas y mensajes:
```
http://localhost:15672
Usuario: guest
Password: guest
```

**[INSERTA AQUI IMAGEN: Dashboard de RabbitMQ]**

### 3. Zipkin Dashboard
Trazabilidad de peticiones distribuidas:
```
http://localhost:9411
```

**[INSERTA AQUI IMAGEN: Dashboard de Zipkin mostrando trazas]**

### 4. Verificar Estado de Servicios

```bash
# Ver todos los contenedores
docker-compose ps

# Ver logs de un servicio
docker-compose logs -f gateway-service

# Reiniciar un servicio
docker-compose restart product-service

# Ver estadísticas de recursos
docker stats
```

## 🗄️ Base de Datos

### Estructura

La base de datos PostgreSQL contiene las siguientes tablas principales:

- `users` - Usuarios del sistema
- `products` - Catálogo de productos
- `categories` - Categorías de productos
- `orders` - Pedidos
- `order_details` - Detalles de pedidos
- `payments` - Pagos
- `deliveries` - Entregas

### Scripts de Inicialización

Los scripts SQL se encuentran en `./database/`:
- `01-schema.sql` - Estructura de tablas
- `02-data.sql` - Datos de prueba

**[INSERTA AQUI IMAGEN: Diagrama de la base de datos (DER)]**

## 🔒 Seguridad

### Autenticación con Firebase

El API Gateway valida tokens JWT de Firebase para endpoints protegidos.

**Endpoints públicos (sin autenticación):**
- `GET /api/products`
- `GET /api/categories`
- `OPTIONS` (para CORS)

**Endpoints protegidos:**
- Todos los endpoints de `/api/users/` (excepto sync)
- `POST`, `PUT`, `DELETE` en `/api/products`
- Todos los endpoints de `/api/orders/`
- Todos los endpoints de `/api/payments/`

**[INSERTA AQUI IMAGEN: Diagrama del flujo de autenticación]**

### Headers de Autenticación

```bash
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

## 🧪 Testing

### Probar con cURL

```bash
# Health check del gateway
curl http://localhost:8090/actuator/health

# Listar productos (público)
curl http://localhost:8090/api/products

# Crear pedido (requiere auth)
curl -X POST http://localhost:8090/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @order-payload.json
```

## 🛠️ Solución de Problemas

### Los servicios no se registran en Eureka

```bash
# Verificar logs del servicio
docker-compose logs eureka-server

# Reiniciar Eureka y esperar 30 segundos
docker-compose restart eureka-server
```

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres
```

### Reconstruir un servicio

```bash
# Reconstruir e iniciar un servicio específico
docker-compose up -d --build product-service
```

## 🔄 Actualizaciones

### Actualizar configuraciones

Las configuraciones se cargan desde `./config-repo/`. Para aplicar cambios:

```bash
# Reiniciar Config Server
docker-compose restart config-server

# Reiniciar el servicio afectado
docker-compose restart user-service
```

## 📝 Notas de Desarrollo

### Estructura del Proyecto

```
backend/
├── areska-config-server/       # Config Server
├── areska-eureka-server/       # Service Discovery
├── areska-gateway-service/     # API Gateway
├── areska-user-service/        # User Management
├── areska-product-service/     # Product Catalog
├── areska-category-services/   # Categories
├── areska-order-service/       # Orders
├── areska-payment-service/     # Payments
├── areska-delivery-service/    # Deliveries
├── config-repo/                # Configuraciones centralizadas
├── database/                   # Scripts SQL
└── docker-compose.yml          # Orquestación de servicios
```

### Puertos Utilizados

| Servicio | Puerto |
|----------|--------|
| Config Server | 8888 |
| Eureka Server | 8761 |
| Gateway | 8090 |
| User Service | 8081 |
| Product Service | 8082 |
| Order Service | 8080 |
| Payment Service | 8083 |
| Category Service | 8084 |
| Delivery Service | 8085 |
| PostgreSQL | 5432 |
| RabbitMQ | 5672, 15672 |
| Kafka | 9092 |
| Zipkin | 9411 |

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto

- **Proyecto**: Areska E-Commerce
- **GitHub**: https://github.com/areska/micro-areska

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!

**[INSERTA AQUI IMAGEN: Footer con logo de Areska]**
