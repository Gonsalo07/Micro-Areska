# Frontend — Tienda y panel admin Areska

Aplicación **Next.js 15** para clientes y administradores de **Areska**: catálogo, carrito, checkout, seguimiento de pedidos con **mapa en tiempo real** y panel de administración.

> Documentación general: [README raíz](../README.md) · Backend: [backend/README.md](../backend/README.md) · App repartidor: [frontend-delivery/README.md](../frontend-delivery/README.md)

---

## Rol en el sistema

```
Cliente (este frontend :3000)
    │
    ├── REST  → API Gateway :8090/api
    │           (órdenes, productos, pagos, usuarios)
    │
    └── WebSocket STOMP → /api/delivery-ws
                          (mapa GPS + estados de entrega)
```

Cuando un pedido tiene envío a domicilio, el cliente puede seguir al repartidor en un **mapa en vivo** suscrito a `/topic/order/{orderId}/location`.

---

## Funcionalidades

### Tienda pública
- Catálogo de productos y detalle
- Carrito y checkout (incluye flujo Yape)
- Mis compras y seguimiento de pedido
- Chat con soporte durante la entrega
- Ajustes de cuenta, apariencia y notificaciones
- Páginas informativas (envíos, devoluciones, términos, etc.)

### Panel admin (`/admin`)
- Gestión de productos y categorías
- Gestión de usuarios
- Gestión de pedidos y actualización de estados
- Ajustes del panel

### Seguimiento en tiempo real
- Mapa con posición del repartidor (Google Maps)
- Timeline de estados de entrega
- Chat en vivo con el repartidor

---

## Stack tecnológico

| Área | Tecnología |
|------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, Radix UI |
| Estado | Zustand, TanStack Query |
| Formularios | React Hook Form + Zod |
| Auth | Firebase Authentication |
| Mapas | Google Maps API, Leaflet (selector de dirección) |
| Tiempo real | STOMP + SockJS (`@stomp/stompjs`) |
| API | Cliente REST propio con token Firebase |

---

## Estructura del proyecto

```
frontend/
├── app/
│   ├── (public)/              # Tienda: home, productos, carrito, pago, mis-compras
│   ├── (auth)/                # Login, registro, recuperar contraseña
│   ├── admin/                 # Panel administrativo
│   └── error/                 # Páginas de error (401, 403, 404, 500, 503)
├── components/
│   ├── ui/                    # Componentes base (shadcn-style)
│   └── tracking/              # Mapa de seguimiento y chat del cliente
├── features/
│   ├── public/                # Lógica de tienda (API, páginas, schemas)
│   ├── admin/                 # Lógica del panel admin
│   └── auth/                  # Autenticación y guards
├── hooks/
│   ├── use-websocket-tracking.ts   # Suscripción GPS del repartidor
│   └── use-delivery-tracking.ts    # Estados de entrega vía WebSocket
├── lib/
│   ├── api/client.ts          # Cliente HTTP al Gateway
│   ├── config.ts              # URL base de la API
│   ├── firebase/              # Cliente Firebase
│   └── google-maps.ts         # Carga del SDK de Maps
└── .env.example
```

---

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Home |
| `/productos` | Catálogo |
| `/productos/[id]` | Detalle de producto |
| `/carrito` | Carrito |
| `/pago` | Checkout |
| `/mis-compras` | Historial de compras |
| `/mis-compras/seguimiento/[orderId]` | **Seguimiento en vivo + mapa** |
| `/admin` | Dashboard admin |
| `/admin/productos` | CRUD productos |
| `/admin/pedidos` | Gestión de pedidos |
| `/admin/usuarios` | Gestión de usuarios |

---

## WebSocket — seguimiento del mapa

El cliente se conecta al Delivery Service a través del Gateway:

| Conexión | Endpoint | Topic suscrito | Uso |
|----------|----------|----------------|-----|
| Ubicación GPS | `{API}/delivery-ws` | `/topic/order/{orderId}/location` | Marcador del repartidor en el mapa |
| Estados entrega | `{API}/delivery-ws` | `/topic/order/{orderId}/tracking` | Hitos logísticos |
| Estado final | `{API}/delivery-ws` | `/topic/order/{orderId}/status` | Completado / cancelado |
| Chat | `{API}/ws` | `/topic/chat/{orderId}` | Mensajes con repartidor/soporte |

**Archivos clave:**
- `hooks/use-websocket-tracking.ts` — recibe lat/lng y actualiza el mapa
- `hooks/use-delivery-tracking.ts` — timeline de estados
- `components/tracking/delivery-map.tsx` — render del mapa (Google Maps)
- `components/tracking/customer-chat.tsx` — chat en seguimiento

---

## Configuración

### 1. Variables de entorno

```powershell
Copy-Item .env.example .env.local
```

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | Credenciales Firebase (mismo proyecto que el backend) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | API key para mapa de seguimiento |
| `NEXT_PUBLIC_API_BASE_URL` | Gateway API (default: `http://localhost:8090/api`) |
| `PORT` | Puerto dev (default: `3000`) |

### 2. Backend en ejecución

El frontend requiere el API Gateway activo en `:8090`. Ver [backend/README.md](../backend/README.md).

---

## Inicio rápido

```powershell
cd frontend
pnpm install
pnpm dev
```

Abre http://localhost:3000

### Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Desarrollo con Turbopack (puerto 3000) |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm check:lint` | ESLint |
| `pnpm format` | Prettier |

---

## Flujo de un pedido con delivery

1. Cliente agrega productos al carrito y completa checkout con dirección de entrega.
2. `POST /api/orders` crea la orden; el backend publica en RabbitMQ (ver backend).
3. Cliente navega a `/mis-compras/seguimiento/[orderId]`.
4. El hook `useWebSocketTracking` se suscribe a la ubicación del repartidor.
5. Cuando el repartidor está en ruta, el mapa muestra su posición actualizada en tiempo real.

---

## Integración con API Gateway

Todas las peticiones REST pasan por `lib/api/client.ts`, que adjunta el **Firebase ID token** en el header `Authorization: Bearer <token>`.

Ejemplos de módulos API:
- `features/public/api/orders.ts`
- `features/public/api/chat.ts`
- `features/admin/api/products.ts`
