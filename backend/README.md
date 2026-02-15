# Micro-Areska Backend

Este proyecto implementa el backend para la aplicación Areska, utilizando una arquitectura de microservicios construida con Java y el ecosistema de Spring.

## Arquitectura

El sistema está diseñado siguiendo un patrón de microservicios, orquestado por varias herramientas de Spring Cloud para garantizar la robustez, escalabilidad y mantenibilidad del sistema.

-   **Service Discovery (Eureka):** El servidor `areska-eureka-server` actúa como un registro central. Todos los microservicios se registran en Eureka al arrancar, lo que les permite descubrirse y comunicarse entre sí dinámicamente.
-   **Configuración Centralizada (Config Server):** El servidor `areska-config-server` proporciona configuración externa y centralizada a todos los microservicios. Las propiedades de cada servicio se gestionan en el repositorio `config-repo`, permitiendo cambios de configuración sin necesidad de reconstruir los servicios.
-   **API Gateway (Gateway Service):** El servicio `areska-gateway-service` actúa como el único punto de entrada para todas las peticiones del frontend. Enruta las peticiones al microservicio correspondiente y puede manejar la autenticación, la seguridad y el balanceo de carga.

## Microservicios

El backend se compone de los siguientes microservicios:

| Servicio                    | Puerto | Descripción                                                                |
| --------------------------- | ------ | -------------------------------------------------------------------------- |
| `areska-config-server`      | 8888   | Servidor de configuración.                                                 |
| `areska-eureka-server`      | 8761   | Registro y descubrimiento de servicios.                                    |
| `areska-gateway-service`    | 9090   | Punto de entrada y enrutador de peticiones.                                |
| `areska-user-service`       | 8081   | Gestiona usuarios, autenticación y perfiles.                               |
| `areska-product-service`    | 8082   | Gestiona el catálogo de productos.                                         |
| `areska-order-service`      | 8080   | Gestiona la creación y el seguimiento de pedidos. Utiliza RabbitMQ.        |
| `areska-payment-service`    | 8083   | Procesa los pagos de los pedidos.                                          |
| `areska-category-services`  | 8084   | Gestiona las categorías de los productos.                                  |
| `areska-delivery-service`   | 8085   | Gestiona la logística de entrega de pedidos. Utiliza RabbitMQ.             |

## Prerrequisitos

Para poder ejecutar este proyecto, necesitas tener instalado lo siguiente:
-   Java (Versión 17 o superior)
-   Maven
-   PostgreSQL
-   RabbitMQ

## Configuración de Secretos

La configuración de cada servicio se encuentra en la carpeta `config-repo`. Para proteger datos sensibles como contraseñas, el sistema utiliza variables de entorno.

**Antes de iniciar los servicios**, debes configurar las siguientes variables de entorno. Puedes hacerlo en una terminal de PowerShell:

```powershell
# Contraseñas para la conexión a la base de datos de cada servicio
$env:DB_PASSWORD_USER="tu_password_aqui"
$env:DB_PASSWORD_PRODUCT="tu_password_aqui"
$env:DB_PASSWORD_PAYMENT="tu_password_aqui"
$env:DB_PASSWORD_CATEGORY="tu_password_aqui"
$env:DB_PASSWORD_DELIVERY="tu_password_aqui"
$env:DB_PASSWORD_ORDER="tu_password_aqui"

# Credenciales para la conexión a RabbitMQ
$env:RABBITMQ_USER="guest"
$env:RABBITMQ_PASSWORD="guest"
```
**Nota:** Reemplaza `"tu_password_aqui"` con la contraseña correcta para tu base de datos PostgreSQL.

## Ejecución del Proyecto

1.  **Inicia los servicios de infraestructura:** Asegúrate de que PostgreSQL y RabbitMQ se estén ejecutando.
2.  **Inicia Eureka:** Ejecuta el script `start-eureka.ps1` para iniciar el servidor de descubrimiento.
3.  **Inicia todos los servicios:** Desde una terminal donde hayas configurado las variables de entorno, ejecuta el script `start-all-services.ps1`. Este script se encargará de iniciar el resto de los microservicios en el orden correcto.

¡Y eso es todo! El backend de Micro-Areska debería estar completamente operativo.
