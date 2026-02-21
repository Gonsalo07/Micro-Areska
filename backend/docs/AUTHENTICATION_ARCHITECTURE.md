# 🔐 Sistema de Autenticación - Arquitectura Multi-Usuario

## 📋 Resumen

El sistema maneja **dos tipos de usuarios**:
1. **Users** (Clientes) → frontend principal
2. **Delivery Drivers** (Conductores) → frontend-delivery

Ambos usan **Firebase Authentication** pero se almacenan en **tablas separadas**.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Authentication                   │
│              (Único sistema de autenticación)                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Token JWT válido
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    Gateway Service                           │
│  - Verifica token Firebase                                   │
│  - Agrega headers: X-Firebase-UiD, X-Firebase-Email          │
│  - NO distingue entre User y Delivery Driver                 │
└─────────────┬───────────────────────────────┬───────────────┘
              │                               │
              ↓                               ↓
┌─────────────────────────┐   ┌─────────────────────────────┐
│   User Service          │   │   Delivery Service          │
│                         │   │                             │
│  - Busca en tabla       │   │  - Busca en tabla           │
│    `users`              │   │    `delivery_drivers`       │
│  - Por firebaseUid      │   │  - Por firebaseUid          │
└─────────────────────────┘   └─────────────────────────────┘
```

---

## 🔍 Flujo de Autenticación

### Para Users (Clientes):

```
1. Login en frontend principal
   ↓
2. Firebase Authentication crea token JWT
   ↓
3. Frontend guarda token
   ↓
4. Requests a backend incluyen: Authorization: Bearer <token>
   ↓
5. Gateway verifica token y agrega X-Firebase-UiD header
   ↓
6. User Service busca en tabla `users` por firebaseUid
   ↓
7. Si existe → Retorna perfil del usuario
   Si NO existe → Error 404
```

### Para Delivery Drivers:

```
1. Login en frontend-delivery
   ↓
2. Firebase Authentication crea token JWT (mismo sistema)
   ↓
3. Frontend-delivery guarda token
   ↓
4. Requests incluyen: Authorization: Bearer <token>
   ↓
5. Gateway verifica token y agrega X-Firebase-UiD header
   ↓
6. Delivery Service busca en tabla `delivery_drivers` por firebaseUid
   ↓
7. Si existe → Retorna perfil del conductor
   Si NO existe → Error 404
```

---

## 🔒 Seguridad Natural por Separación de Datos

### ✅ Aislamiento Automático:

1. **Un User no puede acceder a endpoints de Delivery**
   - Su `firebaseUid` no existe en `delivery_drivers`
   - Resultado: 404 Not Found

2. **Un Delivery Driver no puede acceder a endpoints de Users**
   - Su `firebaseUid` no existe en `users`
   - Resultado: 404 Not Found

### Ejemplo Práctico:

```java
// User "juan@gmail.com" intenta acceder a /api/delivery-drivers/firebase/abc123
// Su firebaseUid = "abc123"

// En Delivery Service:
deliveryDriverRepository.findByFirebaseUid("abc123")
// → Optional.empty() porque NO existe en delivery_drivers
// → Retorna: 404 Not Found
```

---

## 🛣️ Endpoints Abiertos (Sin Autenticación)

Configurados en `RouterValidator.java`:

```java
// Endpoints públicos:
GET  /api/products/**           // Ver productos
GET  /api/categories/**         // Ver categorías
POST /api/users/firebase/sync   // Registro sincronización users
POST /api/delivery-drivers/firebase/sync  // Registro sincronización drivers
```

**Todos los demás endpoints requieren autenticación**.

---

## 📊 Tablas de Base de Datos

### Tabla `users`:
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firebase_uid VARCHAR(255) UNIQUE,  -- Identificador único de Firebase
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(150),
    role VARCHAR(20),  -- USER, ADMIN
    ...
);
```

### Tabla `delivery_drivers`:
```sql
CREATE TABLE delivery_drivers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firebase_uid VARCHAR(255) UNIQUE,  -- Identificador único de Firebase
    full_name VARCHAR(150),
    email VARCHAR(150),
    vehicle_type VARCHAR(50),
    license_number VARCHAR(100),
    is_available BOOLEAN,
    ...
);
```

**Clave**: Ambas tablas tienen `firebase_uid` pero son **completamente independientes**.

---

## 🎯 Mejores Prácticas

### 1. **Separación de Frontends**

✅ **Correcto**:
- Frontend principal (puerto 3000) → Users
- Frontend delivery (puerto 3001) → Delivery Drivers

❌ **Incorrecto**:
- Mezclar ambos en un solo frontend

### 2. **Endpoints Específicos**

✅ **Correcto**:
```typescript
// Frontend principal
const user = await fetch('/api/users/firebase/abc123')

// Frontend delivery
const driver = await fetch('/api/delivery-drivers/firebase/abc123')
```

❌ **Incorrecto**:
```typescript
// Frontend delivery intentando acceder a users
const user = await fetch('/api/users/firebase/abc123')  
// → 404 porque ese firebaseUid no existe en users
```

### 3. **Sincronización Inicial**

Cada servicio debe sincronizar su propio usuario:

```typescript
// Frontend principal (lib/firebase/auth.ts)
async function syncUserToBackend(user) {
  await usersApi.syncWithFirebase({
    firebaseUid: user.uid,
    firstName: ...,
    lastName: ...,
  })
}

// Frontend delivery (lib/firebase/auth.ts)
async function syncDriverToBackend(user) {
  await deliveryDriverApi.syncWithFirebase({
    firebaseUid: user.uid,
    fullName: ...,
  })
}
```

---

## ⚠️ Posibles Problemas y Soluciones

### Problema 1: "Usuario no encontrado" al hacer login

**Causa**: El `firebaseUid` no existe en la tabla correspondiente.

**Solución**: Asegúrate de que el endpoint `/firebase/sync` sea llamado durante el registro/login.

### Problema 2: Conductor puede ver productos pero no órdenes

**Causa**: Los endpoints de productos son públicos, pero órdenes requieren autenticación y el firebaseUid debe existir en la BD.

**Solución**: Esto es el comportamiento esperado. El conductor debe estar registrado en `delivery_drivers`.

### Problema 3: Token válido pero error 404

**Causa**: 
- Token Firebase es válido ✅
- Pero el usuario no está sincronizado en la BD ❌

**Solución**: Verificar que el proceso de sincronización funcione correctamente.

---

## 🧪 Testing

### Test 1: User NO puede acceder a Delivery endpoints

```bash
# Login como user
curl -X POST http://localhost:8090/api/users/firebase/sync \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"user123","firstName":"John","lastName":"Doe",...}'

# Intentar acceder a delivery endpoints con token de user
curl http://localhost:8090/api/delivery-drivers/firebase/user123 \
  -H "Authorization: Bearer <user-token>"

# Resultado esperado: 404 Not Found
```

### Test 2: Delivery Driver NO puede acceder a User endpoints

```bash
# Login como delivery driver
curl -X POST http://localhost:8090/api/delivery-drivers/firebase/sync \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"driver123","fullName":"Juan Lopez",...}'

# Intentar acceder a user endpoints con token de driver
curl http://localhost:8090/api/users/firebase/driver123 \
  -H "Authorization: Bearer <driver-token>"

# Resultado esperado: 404 Not Found
```

---

## 📝 Resumen

| Aspecto | Users | Delivery Drivers |
|---------|-------|------------------|
| **Autenticación** | Firebase Auth | Firebase Auth (mismo) |
| **Frontend** | Puerto 3000 | Puerto 3001 |
| **Tabla BD** | `users` | `delivery_drivers` |
| **Endpoint Sync** | `/api/users/firebase/sync` | `/api/delivery-drivers/firebase/sync` |
| **Busca por** | `firebaseUid` en `users` | `firebaseUid` en `delivery_drivers` |
| **Aislamiento** | Automático por BD | Automático por BD |

## ✅ Conclusión

El sistema **NO interfiere** entre sí porque:
1. Cada servicio busca en su propia tabla
2. Los `firebaseUid` están aislados por tabla
3. No hay forma de que un user acceda a datos de delivery (y viceversa)
4. El Gateway solo valida que el token sea válido, no el tipo de usuario

**Es un diseño seguro y escalable** ✅
