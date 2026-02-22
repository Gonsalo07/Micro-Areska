# API Documentation - Frontend Delivery

## 📚 Índice de APIs

- [Delivery Driver API](#delivery-driver-api)
- [Notifications API](#notifications-api)
- [Orders API](#orders-api)

---

## Delivery Driver API

Gestión de perfiles y estado de conductores de delivery.

### Endpoints

#### `getAll()`
Obtiene todos los conductores registrados.

```typescript
const drivers = await deliveryDriverApi.getAll()
```

#### `getById(id: number)`
Obtiene un conductor por su ID.

```typescript
const driver = await deliveryDriverApi.getById(1)
```

#### `getByFirebaseUid(firebaseUid: string)`
Obtiene un conductor por su Firebase UID.

```typescript
const driver = await deliveryDriverApi.getByFirebaseUid('firebase-uid-123')
```

#### `getAvailable()`
Obtiene todos los conductores disponibles y activos.

```typescript
const availableDrivers = await deliveryDriverApi.getAvailable()
```

#### `create(payload: DeliveryDriverRequest)`
Crea un nuevo conductor (registro).

```typescript
await deliveryDriverApi.create({
  fullName: 'Juan Pérez',
  phone: '+51987654321',
  email: 'juan@example.com',
  firebaseUid: 'firebase-uid-123',
  authProvider: 'google.com',
  vehicleType: 'Motocicleta',
  licenseNumber: 'ABC123456',
})
```

#### `update(id: number, payload: DeliveryDriverUpdateRequest)`
Actualiza el perfil de un conductor.

```typescript
await deliveryDriverApi.update(1, {
  phone: '+51999888777',
  vehicleType: 'Auto',
})
```

#### `updateAvailability(id: number, isAvailable: boolean)`
Actualiza solo el estado de disponibilidad.

```typescript
await deliveryDriverApi.updateAvailability(1, true)
```

#### `updateLocation(id: number, location: LocationUpdate)`
Actualiza la ubicación actual del conductor.

```typescript
await deliveryDriverApi.updateLocation(1, {
  currentLat: -12.0464,
  currentLng: -77.0428,
})
```

---

## Notifications API

Sistema de notificaciones para conductores de delivery.

### Endpoints

#### `getByDriverId(driverId: number)`
Obtiene todas las notificaciones de un conductor.

```typescript
const notifications = await notificationsApi.getByDriverId(1)
```

#### `getUnreadByDriverId(driverId: number)`
Obtiene solo las notificaciones no leídas.

```typescript
const unread = await notificationsApi.getUnreadByDriverId(1)
```

#### `getByOrderId(orderId: number)`
Obtiene notificaciones relacionadas con una orden específica.

```typescript
const orderNotifications = await notificationsApi.getByOrderId(123)
```

#### `markAsRead(notificationId: number)`
Marca una notificación como leída.

```typescript
await notificationsApi.markAsRead(456)
```

#### `markAllAsRead(driverId: number)`
Marca todas las notificaciones de un conductor como leídas.

```typescript
await notificationsApi.markAllAsRead(1)
```

---

## Orders API

Gestión de órdenes y entregas.

### Endpoints

#### `getAll()`
Obtiene todas las órdenes.

```typescript
const orders = await ordersApi.getAll()
```

#### `getById(id: number)`
Obtiene una orden por ID con sus items.

```typescript
const order = await ordersApi.getById(123)
```

#### `getByDeliveryDriverId(driverId: number)`
Obtiene todas las órdenes asignadas a un conductor.

```typescript
const myOrders = await ordersApi.getByDeliveryDriverId(1)
```

#### `getPendingOrders()`
Obtiene órdenes pendientes de asignación.

```typescript
const pending = await ordersApi.getPendingOrders()
```

#### `acceptDelivery(orderId: number, driverId: number)`
Acepta una asignación de entrega.

```typescript
await ordersApi.acceptDelivery(123, 1)
```

#### `markOutForDelivery(orderId: number)`
Marca la orden como "en camino".

```typescript
await ordersApi.markOutForDelivery(123)
```

#### `markArrived(orderId: number)`
Marca que el conductor ha llegado al destino.

```typescript
await ordersApi.markArrived(123)
```

#### `markDelivered(orderId: number)`
Marca la orden como entregada.

```typescript
await ordersApi.markDelivered(123)
```

#### `cancelDelivery(orderId: number)`
Cancela una entrega.

```typescript
await ordersApi.cancelDelivery(123)
```

---

## Tipos de Datos

### DeliveryDriverResponse
```typescript
interface DeliveryDriverResponse {
  id: number
  fullName: string
  phone: string | null
  email: string | null
  firebaseUid: string
  authProvider: string
  emailVerified: boolean
  photoUrl: string | null
  vehicleType: string | null
  licenseNumber: string | null
  companyName: string | null
  isAvailable: boolean
  isActive: boolean
  currentLat: number | null
  currentLng: number | null
  lastLocationUpdate: string | null
  createdAt: string
}
```

### OrderResponse
```typescript
interface OrderResponse {
  id: number
  userId: number
  deliveryDriverId: number | null
  orderDate: string
  status: string
  deliveryStatus: string
  total: number
  pickupMethod: string
  assignedAt: string | null
  acceptedAt: string | null
  outForDeliveryAt: string | null
  arrivedAt: string | null
  deliveredAt: string | null
  cancelledAt: string | null
  updatedAt: string
  items?: OrderDetailResponse[]
}
```

### DeliveryStatus Enum
```typescript
enum DeliveryStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  ARRIVED = 'ARRIVED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}
```
