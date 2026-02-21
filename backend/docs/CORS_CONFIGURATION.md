# 🌐 Configuración CORS - Múltiples Frontends

## ✅ Resumen de Cambios

Tu backend ahora puede aceptar **múltiples frontends** configurados mediante variables de entorno.

---

## 📋 Configuración Actual

### Archivo: `backend/.env`
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:8090
```

**Frontends configurados:**
- `http://localhost:3000` → Frontend principal (clientes)
- `http://localhost:3001` → Frontend delivery (conductores)
- `http://localhost:8090` → Gateway (para testing)

---

## ⚙️ Cómo Funciona

### 1. Variable de Entorno
El archivo `backend/.env` define los orígenes permitidos:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:8090
```

### 2. Spring Cloud Gateway (application.yml)
Lee la variable de entorno y aplica la configuración CORS:
```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: ${ALLOWED_ORIGINS:http://localhost:3000,http://localhost:3001,http://localhost:8090}
```

**El formato `${ALLOWED_ORIGINS:valor-por-defecto}` significa:**
- Si existe la variable `ALLOWED_ORIGINS` → usa ese valor
- Si NO existe → usa el valor por defecto después de los `:`

---

## 🚀 Agregar Más Frontends

### Desarrollo Local
Simplemente agrega más URLs separadas por comas (sin espacios):

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:8090
```

### Producción
Agrega los dominios de producción:

```env
ALLOWED_ORIGINS=https://app.areska.com,https://delivery.areska.com,https://admin.areska.com
```

### Desarrollo + Producción
Puedes mezclar ambos (útil para testing):

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://app.areska.com,https://delivery.areska.com
```

---

## 📝 Reglas Importantes

### ✅ Hacer:
- Separar URLs con comas `,` **sin espacios**
- Incluir el protocolo completo: `http://` o `https://`
- Incluir el puerto si no es el estándar: `http://localhost:3001`
- No terminar con `/`: `http://localhost:3000` ✅, `http://localhost:3000/` ❌

### ❌ NO Hacer:
```env
# Incorrecto - con espacios
ALLOWED_ORIGINS=http://localhost:3000, http://localhost:3001

# Incorrecto - sin protocolo
ALLOWED_ORIGINS=localhost:3000,localhost:3001

# Incorrecto - con barra final
ALLOWED_ORIGINS=http://localhost:3000/,http://localhost:3001/

# Incorrecto - wildcards en producción (inseguro)
ALLOWED_ORIGINS=*
```

---

## 🔍 Verificar Configuración

### Durante el Startup
Cuando inicies el gateway, verás en los logs:
```
INFO: Configured CORS with allowed origins: http://localhost:3000, http://localhost:3001, http://localhost:8090
```

### Test Manual
Usa curl para probar CORS:

```bash
# Desde frontend principal (puerto 3000)
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     http://localhost:8090/api/products

# Desde frontend delivery (puerto 3001)
curl -H "Origin: http://localhost:3001" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     http://localhost:8090/api/delivery-drivers
```

**Respuesta esperada:**
```
Access-Control-Allow-Origin: http://localhost:3000  (o 3001)
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: *
Access-Control-Allow-Credentials: true
```

---

## 🐛 Troubleshooting

### Problema 1: Error CORS en el navegador
```
Access to fetch at 'http://localhost:8090/api/...' from origin 'http://localhost:3002' 
has been blocked by CORS policy
```

**Causa**: El origen `http://localhost:3002` no está en `ALLOWED_ORIGINS`

**Solución**: Agrégalo al archivo `.env` y reinicia el gateway:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:8090
```

### Problema 2: Configuración no se aplica

**Causa**: El gateway no está leyendo el archivo `.env`

**Solución**: 
1. Verifica que el archivo `.env` esté en `backend/.env`
2. Si usas Docker, verifica que el `docker-compose.yml` cargue el archivo:
   ```yaml
   gateway:
     env_file:
       - .env
   ```
3. Reinicia el gateway

### Problema 3: Funciona en desarrollo pero no en producción

**Causa**: La variable de entorno no está configurada en producción

**Solución**: Configura la variable en tu servidor/plataforma:
```bash
# Heroku
heroku config:set ALLOWED_ORIGINS=https://app.areska.com,https://delivery.areska.com

# AWS/Docker
export ALLOWED_ORIGINS=https://app.areska.com,https://delivery.areska.com

# Kubernetes ConfigMap
apiVersion: v1
kind: ConfigMap
data:
  ALLOWED_ORIGINS: "https://app.areska.com,https://delivery.areska.com"
```

---

## 🔒 Seguridad

### Buenas Prácticas:

1. **NO usar wildcards en producción**
   ```yaml
   # ❌ NUNCA hacer esto en producción
   allowedOrigins: "*"
   ```

2. **Listar explícitamente cada origen**
   ```env
   # ✅ Correcto
   ALLOWED_ORIGINS=https://app.areska.com,https://delivery.areska.com
   ```

3. **Usar HTTPS en producción**
   ```env
   # ✅ Seguro
   ALLOWED_ORIGINS=https://app.areska.com

   # ❌ Inseguro en producción
   ALLOWED_ORIGINS=http://app.areska.com
   ```

4. **No permitir localhost en producción**
   ```env
   # ❌ NO hacer esto en producción
   ALLOWED_ORIGINS=http://localhost:3000,https://app.areska.com
   ```

---

## 📦 Ejemplo Completo

### Desarrollo (`backend/.env`)
```env
# Gateway
PORT=8090
EUREKA_URI=http://localhost:8761/eureka/
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:8090
```

### Producción (variables de entorno del servidor)
```env
# Gateway
PORT=8080
EUREKA_URI=http://eureka-service:8761/eureka/
ALLOWED_ORIGINS=https://app.areska.com,https://delivery.areska.com,https://admin.areska.com
```

---

## ✅ Checklist

Antes de desplegar, verifica:

- [ ] Variable `ALLOWED_ORIGINS` está definida
- [ ] Todos los frontends están listados
- [ ] URLs incluyen protocolo (`http://` o `https://`)
- [ ] URLs NO terminan con `/`
- [ ] Sin espacios entre URLs
- [ ] NO se usa `*` en producción
- [ ] Se usa `https://` en producción
- [ ] Gateway reiniciado después de cambios

---

## 🎯 Resumen

Tu backend ahora soporta **múltiples frontends** de manera flexible:
- ✅ Frontend principal (clientes)
- ✅ Frontend delivery (conductores)
- ✅ Fácil agregar más frontends
- ✅ Listo para producción
- ✅ Configurable por entorno

Solo necesitas agregar nuevas URLs a `ALLOWED_ORIGINS` y reiniciar el gateway. 🚀
