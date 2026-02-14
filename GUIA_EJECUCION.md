# Guía de Ejecución - Microservicios Areska

## 📋 Prerrequisitos

1. **PostgreSQL** - Base de datos `areska_db` debe estar creada y corriendo
2. **RabbitMQ** - Debe estar instalado y corriendo en `localhost:5672`
3. **Java 17** - Instalado y configurado
4. **Maven** - Instalado (o usar los wrappers `mvnw` incluidos)

---

## 🚀 Paso a Paso

### **PASO 1: Verificar RabbitMQ**

Abre una terminal y verifica que RabbitMQ esté corriendo:

```bash
# Windows (PowerShell)
rabbitmqctl status

# O verifica en el navegador:
# http://localhost:15672 (usuario: guest, password: guest)
```

Si no está corriendo, inícialo:
```bash
# Windows
rabbitmq-server

# O como servicio
net start RabbitMQ
```

---

### **PASO 2: Iniciar Eureka Server** ⭐ (PRIMERO)

Eureka debe iniciarse **ANTES** que cualquier otro servicio.

**Terminal 1:**
```bash
cd areska-eureka-server
mvnw spring-boot:run
# O si tienes Maven global:
mvn spring-boot:run
```

**Espera a ver:**
```
Started AreskaEurekaServerApplication in X.XXX seconds
```

**Verifica:** Abre http://localhost:8761 en tu navegador. Deberías ver el dashboard de Eureka.

---

### **PASO 3: Iniciar Servicios Base** (Sin dependencias entre sí)

Estos servicios pueden iniciarse en cualquier orden, pero **después** de Eureka.

#### **Terminal 2: User Service** (Puerto 8081)
```bash
cd areska-user-service
mvnw spring-boot:run
```

#### **Terminal 3: Product Service** (Puerto 8082)
```bash
cd areska-product-service
mvnw spring-boot:run
```

#### **Terminal 4: Category Service** (Puerto 8084)
```bash
cd areska-category-services
mvnw spring-boot:run
```

**Espera a ver en cada terminal:**
```
Started Areska[ServiceName]Application in X.XXX seconds
```

**Verifica en Eureka:** http://localhost:8761 - Deberías ver 3 servicios registrados:
- `ARESKA-USER-SERVICE`
- `ARESKA-PRODUCT-SERVICE`
- `ARESKA-CATEGORY-SERVICES`

---

### **PASO 4: Iniciar Order Service** (Puerto 8080)

Este servicio depende de User y Product services.

**Terminal 5:**
```bash
cd areska-order-service
mvnw spring-boot:run
```

**Espera a ver:**
```
Started AreskaOrderServiceApplication in X.XXX seconds
```

**Verifica en Eureka:** Deberías ver `ARESKA-ORDER-SERVICE` registrado.

---

### **PASO 5: Iniciar Payment Service** (Puerto 8083)

Este servicio depende de Order service.

**Terminal 6:**
```bash
cd areska-payment-service
mvnw spring-boot:run
```

**Espera a ver:**
```
Started AreskaPaymentServiceApplication in X.XXX seconds
```

**Verifica en Eureka:** Deberías ver `ARESKA-PAYMENT-SERVICE` registrado.

---

### **PASO 6: Iniciar Delivery Service** (Puerto 8085)

Este servicio consume mensajes de RabbitMQ.

**Terminal 7:**
```bash
cd areska-delivery-service
mvnw spring-boot:run
```

**Espera a ver:**
```
Started AreskaDeliveryServiceApplication in X.XXX seconds
```

**Verifica en Eureka:** Deberías ver `ARESKA-DELIVERY-SERVICE` registrado.

---

## ✅ Verificación Final

### 1. **Eureka Dashboard**
Abre http://localhost:8761 y verifica que todos los servicios estén registrados:
- ✅ ARESKA-USER-SERVICE
- ✅ ARESKA-PRODUCT-SERVICE
- ✅ ARESKA-CATEGORY-SERVICES
- ✅ ARESKA-ORDER-SERVICE
- ✅ ARESKA-PAYMENT-SERVICE
- ✅ ARESKA-DELIVERY-SERVICE

### 2. **Swagger/OpenAPI**
Cada servicio tiene documentación Swagger disponible:

- **User Service:** http://localhost:8081/swagger-ui.html
- **Product Service:** http://localhost:8082/swagger-ui.html
- **Category Service:** http://localhost:8084/swagger-ui.html
- **Order Service:** http://localhost:8080/swagger-ui.html
- **Payment Service:** http://localhost:8083/swagger-ui.html
- **Delivery Service:** http://localhost:8085/swagger-ui.html

### 3. **RabbitMQ Management**
Abre http://localhost:15672 (usuario: `guest`, password: `guest`)
- Ve a la pestaña **Queues**
- Deberías ver la cola `delivery.orders.queue` creada

---

## 🔄 Orden de Inicio Resumido

```
1. RabbitMQ (verificar que esté corriendo)
2. Eureka Server (puerto 8761)
3. User Service (8081)
4. Product Service (8082)
5. Category Service (8084)
6. Order Service (8080) - depende de User y Product
7. Payment Service (8083) - depende de Order
8. Delivery Service (8085) - consume RabbitMQ
```

---

## 🧪 Prueba Rápida

### Crear un usuario:
```bash
curl -X POST http://localhost:8081/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com"
  }'
```

### Crear un producto:
```bash
curl -X POST http://localhost:8082/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Producto Test",
    "price": 100.00,
    "stock": 50
  }'
```

### Crear una orden con delivery:
```bash
curl -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "pickupMethod": "delivery",
    "deliveryAddress": "Calle 123, Ciudad",
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'
```

**Verifica en Delivery Service:** La orden debería aparecer automáticamente en http://localhost:8085/deliveries

---

## ⚠️ Troubleshooting

### Si un servicio no se registra en Eureka:
1. Verifica que Eureka esté corriendo primero
2. Revisa los logs del servicio para errores de conexión
3. Verifica que el `application.properties` tenga la URL correcta de Eureka

### Si RabbitMQ no conecta:
1. Verifica que RabbitMQ esté corriendo: `rabbitmqctl status`
2. Verifica las credenciales en `application.properties`
3. Revisa el puerto (por defecto 5672)

### Si hay errores de base de datos:
1. Verifica que PostgreSQL esté corriendo
2. Verifica que la base de datos `areska_db` exista
3. Revisa usuario y contraseña en `application.properties`

---

## 📝 Notas Importantes

- **RabbitMQ:** Si el delivery-service está apagado, los mensajes se guardan en la cola y se procesan cuando se inicia
- **Eureka:** Todos los servicios deben poder conectarse a Eureka en `localhost:8761`
- **Puertos:** Asegúrate de que ningún otro servicio esté usando estos puertos
- **Base de datos:** Todos los servicios comparten la misma base de datos `areska_db` pero con diferentes tablas
