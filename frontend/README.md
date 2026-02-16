# 🛍️ Areska Frontend - E-Commerce Platform

Aplicación web de e-commerce construida con Next.js 15, TypeScript y Firebase Authentication.

**[INSERTA AQUI IMAGEN: Captura de portada de la aplicación]**

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcn/ui&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)

</div>

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes Principales](#componentes-principales)
- [Autenticación](#autenticación)
- [Gestión de Estado](#gestión-de-estado)
- [API Integration](#api-integration)
- [Estilos](#estilos)
- [Deployment](#deployment)

## ✨ Características

- 🛒 Carrito de compras con persistencia local
- 🔐 Autenticación con Firebase (Google, Email/Password)
- 📱 Diseño responsive y mobile-first
- 🎨 UI moderna con Tailwind CSS y shadcn/ui
- 🚀 Renderizado optimizado con Next.js 15
- 🔍 Búsqueda y filtrado de productos
- 📦 Gestión de pedidos
- 👤 Perfiles de usuario
- ⚡ Turbopack para desarrollo ultra-rápido

**[INSERTA AQUI IMAGEN: Captura de las principales características en acción]**

## 🛠️ Tecnologías

- **Next.js 15.1.6** - Framework de React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - JavaScript tipado
- **Tailwind CSS** - Framework de utilidades CSS
- **shadcn/ui** - Componentes de UI reutilizables
- **Firebase** - Autenticación y servicios backend
- **Zustand** - Gestión de estado ligera
- **pnpm** - Gestor de paquetes rápido
- **ESLint** & **Prettier** - Linting y formateo de código

**[INSERTA AQUI IMAGEN: Stack tecnológico con logos]**

## 📦 Requisitos Previos

- **Node.js**: Versión 20.x o superior
- **pnpm**: Versión 9.x o superior
- **Backend de Areska**: API funcionando en `http://localhost:8090`
- **Firebase Project**: Proyecto configurado en Firebase Console

### Instalación de pnpm

```bash
npm install -g pnpm
```

## 🚀 Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/areska.git
cd areska/frontend
```

2. **Instala las dependencias:**
```bash
pnpm install
```

**[INSERTA AQUI IMAGEN: Terminal mostrando pnpm install]**

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del directorio `frontend`:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8090/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**[INSERTA AQUI IMAGEN: Ejemplo de archivo .env.local con datos censurados]**

### 2. Configuración de Firebase

1. Ve a la [Consola de Firebase](https://console.firebase.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Authentication** > **Sign-in method**:
   - Correo/contraseña ✅
   - Google ✅
4. Ve a **Project Settings** > **General**
5. En "Your apps", selecciona la app web (</> ícono)
6. Copia las credenciales al archivo `.env.local`

**[INSERTA AQUI IMAGEN: Captura de Firebase Console mostrando la configuración de Authentication]**

**[INSERTA AQUI IMAGEN: Captura de Firebase Console mostrando donde obtener las credenciales]**

### 3. Configuración del Backend

Asegúrate de que el backend de Areska esté ejecutándose en `http://localhost:8090`.

Ver [Backend README](../backend/README.md) para instrucciones de configuración.

## 🎯 Ejecución

### Desarrollo

Inicia el servidor de desarrollo con Turbopack:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

**[INSERTA AQUI IMAGEN: Terminal mostrando pnpm dev corriendo]**

### Producción

1. **Construye la aplicación:**
```bash
pnpm build
```

2. **Inicia el servidor de producción:**
```bash
pnpm start
```

### Linting y Formateo

```bash
# Ejecutar ESLint
pnpm lint

# Formatear código con Prettier
pnpm format

# Verificar formateo
pnpm format:check
```

## 📁 Estructura del Proyecto

```
frontend/
├── app/                        # App Router de Next.js
│   ├── (auth)/                 # Rutas de autenticación
│   │   ├── login/              # Página de login
│   │   └── register/           # Página de registro
│   ├── (public)/               # Rutas públicas
│   │   ├── page.tsx            # Página de inicio
│   │   ├── products/           # Catálogo de productos
│   │   ├── cart/               # Carrito de compras
│   │   ├── my-purchases/       # Historial de pedidos
│   │   └── profile/            # Perfil de usuario
│   ├── error/                  # Páginas de error
│   ├── layout.tsx              # Layout principal
│   └── globals.css             # Estilos globales
├── components/                 # Componentes React
│   ├── shared/                 # Componentes compartidos
│   │   ├── Header.tsx          # Cabecera de la app
│   │   ├── Footer.tsx          # Pie de página
│   │   └── Navbar.tsx          # Barra de navegación
│   └── ui/                     # Componentes de shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
├── features/                   # Módulos por funcionalidad
│   ├── auth/                   # Autenticación
│   ├── public/                 # Funcionalidades públicas
│   └── error/                  # Manejo de errores
├── hooks/                      # Custom React Hooks
│   ├── use-form.ts
│   ├── use-mobile.ts
│   └── use-copy-to-clipboard.ts
├── lib/                        # Utilidades y configuración
│   ├── api/                    # Servicios de API
│   │   ├── auth.ts             # Autenticación
│   │   ├── products.ts         # Productos
│   │   ├── orders.ts           # Pedidos
│   │   └── users.ts            # Usuarios
│   ├── firebase/               # Configuración de Firebase
│   │   ├── config.ts           # Inicialización
│   │   └── auth.ts             # Helpers de autenticación
│   ├── config.ts               # Configuración general
│   └── utils.ts                # Utilidades generales
├── stores/                     # Gestión de estado con Zustand
│   ├── auth-store.ts           # Estado de autenticación
│   └── cart-store.ts           # Estado del carrito
├── public/                     # Archivos estáticos
│   ├── icons/                  # Iconos
│   └── images/                 # Imágenes
├── next.config.ts              # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias del proyecto
```

**[INSERTA AQUI IMAGEN: Diagrama visual de la estructura de carpetas]**

## 🧩 Componentes Principales

### Layout Principal

El layout principal (`app/layout.tsx`) envuelve toda la aplicación y proporciona:
- Metadata SEO
- Fuentes personalizadas
- Providers globales
- Estructura HTML base

### Header y Navbar

- **Header**: Barra superior con logo, navegación y carrito
- **Navbar**: Enlaces de navegación responsive con menú hamburguesa

**[INSERTA AQUI IMAGEN: Captura del Header/Navbar en desktop y mobile]**

### Páginas Principales

#### 1. Página de Inicio
```
Ruta: /
Componente: app/(public)/page.tsx
```

Muestra productos destacados, categorías y promociones.

**[INSERTA AQUI IMAGEN: Captura de la página de inicio]**

#### 2. Catálogo de Productos
```
Ruta: /products
Componente: app/(public)/products/page.tsx
```

Lista todos los productos con opciones de filtrado y búsqueda.

**[INSERTA AQUI IMAGEN: Captura del catálogo de productos]**

#### 3. Detalle de Producto
```
Ruta: /products/[id]
Componente: app/(public)/products/[id]/page.tsx
```

Muestra información detallada del producto con botón de agregar al carrito.

**[INSERTA AQUI IMAGEN: Captura de la página de detalle de producto]**

#### 4. Carrito de Compras
```
Ruta: /cart
Componente: app/(public)/cart/page.tsx
```

Permite gestionar productos antes de realizar el pedido.

**[INSERTA AQUI IMAGEN: Captura del carrito de compras]**

#### 5. Mis Compras
```
Ruta: /my-purchases
Componente: app/(public)/my-purchases/page.tsx
Autenticación: Requerida
```

Historial y seguimiento de pedidos del usuario.

**[INSERTA AQUI IMAGEN: Captura de la página de mis compras]**

#### 6. Login/Registro
```
Ruta: /login, /register
Componentes: app/(auth)/login/, app/(auth)/register/
```

Autenticación con Firebase (Google y Email/Password).

**[INSERTA AQUI IMAGEN: Captura de las páginas de login y registro]**

## 🔐 Autenticación

### Firebase Authentication

La autenticación se maneja con Firebase y soporta:

- ✉️ Correo electrónico y contraseña
- 🔍 Google Sign-In
- 🔒 Tokens JWT para API requests

### Configuración

```typescript
// lib/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ...
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Uso en Componentes

```typescript
import { useAuthStore } from '@/stores/auth-store';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

// En el componente
const { setUser } = useAuthStore();

const handleLogin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  setUser(userCredential.user);
};
```

**[INSERTA AQUI IMAGEN: Diagrama del flujo de autenticación]**

## 📊 Gestión de Estado

### Zustand Stores

#### Auth Store (`stores/auth-store.ts`)

Gestiona el estado de autenticación del usuario:

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearAuth: () => void;
}
```

#### Cart Store (`stores/cart-store.ts`)

Gestiona el carrito de compras con persistencia local:

```typescript
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}
```

**[INSERTA AQUI IMAGEN: Diagrama de la gestión de estado]**

## 🌐 API Integration

### Servicios API

Todos los servicios de API están en `lib/api/`:

#### Products API
```typescript
// lib/api/products.ts
export const productsApi = {
  getAll: () => fetch(`${API_URL}/products`),
  getById: (id: number) => fetch(`${API_URL}/products/${id}`),
  create: (product: Product, token: string) => 
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    }),
};
```

#### Orders API
```typescript
// lib/api/orders.ts
export const ordersApi = {
  create: (order: CreateOrderDto, token: string) => 
    fetch(`${API_URL}/orders`, { /* ... */ }),
  getByFirebaseUid: (firebaseUid: string, token: string) => 
    fetch(`${API_URL}/orders/user-by-firebase-uid/${firebaseUid}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),
};
```

### Ejemplo de Uso

```typescript
'use client';

import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api/products';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await productsApi.getAll();
      const data = await response.json();
      setProducts(data);
    };
    
    fetchProducts();
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**[INSERTA AQUI IMAGEN: Diagrama de la arquitectura de API]**

## 🎨 Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS para estilos con configuración personalizada:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-primary-color',
        secondary: '#your-secondary-color',
      },
    },
  },
};
```

### shadcn/ui Components

Componentes de UI pre-construidos y personalizables:

```bash
# Agregar un nuevo componente
pnpm dlx shadcn@latest add button
```

Componentes disponibles: `button`, `card`, `dialog`, `input`, `select`, `toast`, etc.

**[INSERTA AQUI IMAGEN: Catálogo de componentes de UI utilizados]**

### Estilos Globales

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... */
  }
}
```

## 🚀 Deployment

### Vercel (Recomendado)

1. **Conecta tu repositorio a Vercel**
2. **Configura las variables de entorno**
3. **Deploy automático en cada push**

```bash
# Instalar Vercel CLI
pnpm install -g vercel

# Deploy
vercel
```

**[INSERTA AQUI IMAGEN: Dashboard de Vercel con el proyecto deployado]**

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
# Build y run
docker build -t areska-frontend .
docker run -p 3000:3000 areska-frontend
```

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo con Turbopack |
| `pnpm build` | Construye la aplicación para producción |
| `pnpm start` | Inicia el servidor de producción |
| `pnpm lint` | Ejecuta ESLint |
| `pnpm format` | Formatea código con Prettier |
| `pnpm format:check` | Verifica formato sin modificar |

## 🛠️ Solución de Problemas

### Error: CORS Policy

Si ves errores de CORS, verifica:
1. Backend configurado con CORS para `http://localhost:3000`
2. `NEXT_PUBLIC_API_URL` apunta al backend correcto

### Error: Firebase Configuration

```
Firebase: Error (auth/configuration-not-found)
```

Solución: Verifica que todas las variables `NEXT_PUBLIC_FIREBASE_*` estén configuradas en `.env.local`

### Error: Module Not Found

```bash
# Limpia node_modules y reinstala
rm -rf node_modules .next
pnpm install
```

### Puerto 3000 Ocupado

```bash
# Usa otro puerto
PORT=3001 pnpm dev
```

## 📝 Buenas Prácticas

### Componentes

- Usa componentes funcionales con hooks
- Extrae lógica compleja a custom hooks
- Prefiere composición sobre herencia
- Nombra componentes con PascalCase

### TypeScript

- Define tipos explícitos para props
- Usa interfaces para objetos complejos
- Evita `any`, usa `unknown` si es necesario
- Aprovecha type inference cuando sea obvio

### API Calls

- Maneja errores correctamente con try/catch
- Muestra loading states
- Implementa retry logic para fallos de red
- Usa tokens de autenticación para endpoints protegidos

## 🤝 Contribución

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

⭐ ¡Gracias por usar Areska! Si este proyecto te fue útil, considera darle una estrella en GitHub.

**[INSERTA AQUI IMAGEN: Footer con logo de Areska y redes sociales]**
