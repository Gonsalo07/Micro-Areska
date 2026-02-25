# Areska - Guía de Inicio

## Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- [Node.js + pnpm](https://pnpm.io/installation)
- PowerShell (Windows)

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

## 2. Levantar el backend

### Opción A — Docker (recomendado)
```powershell
cd backend
docker compose up -d
```
Espera ~2 minutos. Verifica el estado con:
```powershell
docker compose ps
```

> **⚠️ El orden de arranque es manual.** Después de `docker compose up -d`, espera que cada grupo esté listo antes de que el siguiente funcione correctamente:
> 1. `postgres`, `rabbitmq`, `zookeeper`, `zipkin`
> 2. `config-server`, `kafka`
> 3. `eureka-server`
> 4. `user`, `product`, `order`, `payment`, `delivery`
> 5. `gateway-service`
> 6. `prometheus`, `grafana`
>
> Si algún servicio falla al iniciar, espera unos segundos y reinícialo con:
> ```powershell
> docker restart <nombre-contenedor>
> ```

### Opción B — Script PowerShell
```powershell
cd backend
.\start-all-services.ps1
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

| Servicio          | URL                                         |
|-------------------|---------------------------------------------|
| Frontend          | http://localhost:3000                       |
| Frontend Delivery | http://localhost:3001                       |
| API Gateway       | http://localhost:8090                       |
| Eureka            | http://localhost:8761                       |
| RabbitMQ Panel    | http://localhost:15672 (guest / guest)      |
| Zipkin            | http://localhost:9411                       |
| Prometheus        | http://localhost:9090                       |
| Grafana           | http://localhost:3030 (admin / admin123)    |

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
