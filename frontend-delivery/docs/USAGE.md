# Guía de Uso - Frontend Delivery

## 🚀 Inicio Rápido

### 1. Instalación

```bash
cd frontend-delivery
pnpm install
```

### 2. Configuración

Crea un archivo `.env.local` basado en `.env.example`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

NEXT_PUBLIC_API_BASE_URL=http://localhost:8090/api
```

### 3. Ejecutar

```bash
pnpm dev
```

Abre [http://localhost:3001](http://localhost:3001)

---

## 📱 Funcionalidades Principales

### 1. Autenticación

El sistema usa Firebase Authentication. Los conductores pueden:

- Iniciar sesión con Google
- Iniciar sesión con email/password
- Registrarse como nuevo conductor

### 2. Dashboard del Conductor

Una vez autenticado, el conductor accede a:

- **Panel principal**: Resumen de entregas activas
- **Órdenes asignadas**: Lista de entregas pendientes
- **Historial**: Entregas completadas
- **Perfil**: Información y configuración del conductor

### 3. Gestión de Entregas

#### Flujo de una entrega:

1. **Orden asignada** → El conductor recibe notificación
2. **Aceptar/Rechazar** → Decisión del conductor
3. **En camino** → Actualiza estado y ubicación
4. **Llegué** → Marca que ha llegado al destino
5. **Entregado** → Confirma la entrega exitosa

---

## 💻 Ejemplos de Uso

### Obtener perfil del conductor

```typescript
'use client'

import { useEffect } from 'react'
import { useDriverStore } from '@/stores/driver-store'
import { deliveryDriverApi } from '@/features/delivery/api/delivery-driver'
import { getAuthClient } from '@/lib/firebase/client'

export function DriverProfile() {
  const { driver, setDriver } = useDriverStore()

  useEffect(() => {
    const loadDriver = async () => {
      const auth = getAuthClient()
      const user = auth.currentUser
      
      if (user) {
        const driverData = await deliveryDriverApi.getByFirebaseUid(user.uid)
        setDriver(driverData)
      }
    }

    loadDriver()
  }, [setDriver])

  return <div>Bienvenido, {driver?.fullName}</div>
}
```

### Actualizar disponibilidad

```typescript
'use client'

import { useState } from 'react'
import { useDriverStore } from '@/stores/driver-store'
import { deliveryDriverApi } from '@/features/delivery/api/delivery-driver'

export function AvailabilityToggle() {
  const { driver, setAvailability } = useDriverStore()
  const [loading, setLoading] = useState(false)

  const toggleAvailability = async () => {
    if (!driver) return
    
    setLoading(true)
    try {
      const newStatus = !driver.isAvailable
      await deliveryDriverApi.updateAvailability(driver.id, newStatus)
      setAvailability(newStatus)
    } catch (error) {
      console.error('Error updating availability:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={toggleAvailability} disabled={loading}>
      {driver?.isAvailable ? 'Desactivar' : 'Activar'} disponibilidad
    </button>
  )
}
```

### Rastrear ubicación en tiempo real

```typescript
'use client'

import { useEffect } from 'react'
import { useWatchPosition } from '@/hooks/use-geolocation'
import { useDriverStore } from '@/stores/driver-store'
import { deliveryDriverApi } from '@/features/delivery/api/delivery-driver'

export function LocationTracker() {
  const { latitude, longitude, error } = useWatchPosition()
  const { driver } = useDriverStore()

  useEffect(() => {
    if (!driver || !latitude || !longitude) return

    // Actualizar ubicación cada 30 segundos
    const interval = setInterval(async () => {
      try {
        await deliveryDriverApi.updateLocation(driver.id, {
          currentLat: latitude,
          currentLng: longitude,
        })
      } catch (err) {
        console.error('Error updating location:', err)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [driver, latitude, longitude])

  if (error) return <div>Error: {error}</div>

  return (
    <div>
      Ubicación: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
    </div>
  )
}
```

### Gestionar una entrega

```typescript
'use client'

import { useState } from 'react'
import { ordersApi } from '@/features/delivery/api/orders'
import { useDriverStore } from '@/stores/driver-store'
import type { OrderResponse } from '@/lib/types/order'

export function DeliveryCard({ order }: { order: OrderResponse }) {
  const { driver } = useDriverStore()
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    if (!driver) return
    setLoading(true)
    try {
      await ordersApi.acceptDelivery(order.id, driver.id)
      alert('Entrega aceptada')
    } catch (error) {
      console.error('Error accepting delivery:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartDelivery = async () => {
    setLoading(true)
    try {
      await ordersApi.markOutForDelivery(order.id)
      alert('Entrega en camino')
    } catch (error) {
      console.error('Error starting delivery:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      await ordersApi.markDelivered(order.id)
      alert('Entrega completada')
    } catch (error) {
      console.error('Error completing delivery:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3>Orden #{order.id}</h3>
      <p>Estado: {order.deliveryStatus}</p>
      <p>Total: S/ {order.total}</p>
      
      {order.deliveryStatus === 'ASSIGNED' && (
        <button onClick={handleAccept} disabled={loading}>
          Aceptar entrega
        </button>
      )}
      
      {order.deliveryStatus === 'ACCEPTED' && (
        <button onClick={handleStartDelivery} disabled={loading}>
          Iniciar entrega
        </button>
      )}
      
      {order.deliveryStatus === 'OUT_FOR_DELIVERY' && (
        <button onClick={handleComplete} disabled={loading}>
          Marcar como entregado
        </button>
      )}
    </div>
  )
}
```

### Notificaciones

```typescript
'use client'

import { useEffect, useState } from 'react'
import { notificationsApi } from '@/features/delivery/api/notifications'
import { useDriverStore } from '@/stores/driver-store'
import type { DeliveryDriverNotificationResponse } from '@/lib/types/delivery'

export function Notifications() {
  const { driver } = useDriverStore()
  const [notifications, setNotifications] = useState<DeliveryDriverNotificationResponse[]>([])

  useEffect(() => {
    if (!driver) return

    const loadNotifications = async () => {
      const data = await notificationsApi.getUnreadByDriverId(driver.id)
      setNotifications(data)
    }

    loadNotifications()

    // Polling cada 30 segundos
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [driver])

  const handleMarkAsRead = async (notificationId: number) => {
    await notificationsApi.markAsRead(notificationId)
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  return (
    <div>
      <h2>Notificaciones ({notifications.length})</h2>
      {notifications.map(notification => (
        <div key={notification.id}>
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
          <button onClick={() => handleMarkAsRead(notification.id)}>
            Marcar como leída
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## 🎯 Mejores Prácticas

### 1. Gestión de Estado

- Usa `useDriverStore` para el estado del conductor
- Usa `useActiveDeliveryStore` para la entrega activa
- Persiste datos importantes localmente

### 2. Geolocalización

- Solicita permisos de ubicación al cargar la app
- Usa `useWatchPosition` solo cuando sea necesario
- Actualiza la ubicación del servidor con moderación

### 3. Manejo de Errores

```typescript
try {
  await ordersApi.markDelivered(orderId)
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('API Error:', error.message, error.status)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

### 4. Optimización

- Usa React Query para caché de datos
- Implementa polling inteligente
- Minimiza peticiones al servidor
