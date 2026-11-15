# SysTrack — AndesTech Solutions S.R.L.

Plataforma web académica para gestión de infraestructura tecnológica, mesa de ayuda, activos y mantenimiento. Esta versión 0.4 incorpora un tema claro gris humo de baja luminosidad, formularios con mayor profundidad Liquid Glass, animación del emblema ST y operaciones completas para editar y eliminar intervenciones de mantenimiento pendientes.

## Requisitos
- Node.js 18 o superior
- MySQL 8.x (o compatible)

## Instalación nueva
1. Descomprime el proyecto y abre una terminal en `SysTrack/`.
2. Instala dependencias: `npm install`.
3. Ejecuta `database/schema.sql` desde MySQL Workbench o consola.
4. Copia `.env.example` como `.env` y configura MySQL. Genera un secreto JWT aleatorio (por ejemplo, `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`) y colócalo en `JWT_SECRET`.
5. Crea el usuario demo: `npm run seed`.
6. Inicia con `npm start` o `npm run dev`.
7. Abre `http://localhost:3000`.

## Actualización desde SysTrack v0.2
No requiere cambios de esquema. Conserva tu `.env`, reemplaza los archivos por esta versión y reinicia el servidor con `npm start`.

## Actualización desde SysTrack v0.1
Si ya importaste la base de datos anterior, **no vuelvas a importar el esquema completo**. Ejecuta una sola vez `database/migration_v02.sql` sobre `systrack_db` para habilitar el nuevo rol `COORDINATOR`. Después reemplaza los archivos del proyecto por esta versión, conserva tu `.env`, ejecuta `npm install` si corresponde y reinicia el servidor.

**Acceso demo:** `admin@systrack.local` / `Admin123!`. Cambia la contraseña antes de cualquier uso fuera del entorno local. Nunca subas `.env` a GitHub.

## Roles y responsabilidades
| Rol | Responsabilidad | Permisos principales |
|---|---|---|
| `ADMIN` | Administrador general | Crear usuarios, administrar accesos, consultar equipo técnico y operar módulos |
| `COORDINATOR` | Coordinador de mantenimiento | Consultar mantenimientos, asignar técnicos y programar intervenciones |
| `TECHNICIAN` | Técnico | Consultar sus asignaciones y completar sus propios mantenimientos |
| `REQUESTER` | Solicitante | Registrar incidentes y consultar información disponible según los endpoints |

El estado del técnico se calcula automáticamente: `INACTIVO` si su cuenta está desactivada, `ASIGNADO` si tiene uno o más mantenimientos pendientes y `DISPONIBLE` si no tiene pendientes. No se almacena como un estado manual que pueda quedar desactualizado.

## Funcionalidades
- Navegación superior horizontal tipo command bar, persistente durante el desplazamiento.
- Selector de tema claro/oscuro con preferencia guardada en el navegador.
- Correo automático por rol: `admin`, `coord`, `tec` o `usr` + primer nombre + `@gmail.com`; se agrega sufijo numérico si ya existe.
- Autenticación JWT y contraseñas con bcrypt.
- Directorio de usuarios: creación de administradores, coordinadores, técnicos y solicitantes; activación/desactivación de cuentas.
- Vista de equipo técnico con disponibilidad calculada y cantidad de trabajos pendientes.
- Gestión de activos, incidentes y mantenimientos.
- Asignación obligatoria de un técnico activo al programar una intervención.
- Un técnico solo puede completar los mantenimientos que tiene asignados.
- Dashboard de indicadores básicos.
- Interfaz responsive renovada con capas translúcidas, blur, brillos, gradientes y microinteracciones.

## API principal
- `POST /api/auth/login`
- `GET /api/users` (ADMIN y COORDINATOR); `POST /api/users` (solo ADMIN)
- `PATCH /api/users/:id/active` (solo `ADMIN`)
- `GET /api/maintenances/technicians` (ADMIN y COORDINATOR)
- `GET|POST /api/maintenances` (consulta autenticada; programación ADMIN y COORDINATOR)
- `PATCH /api/maintenances/:id/complete`
- `GET /api/dashboard`
- `GET|POST /api/assets`
- `GET|POST /api/incidents`
- `GET /api/health`

Las rutas protegidas requieren `Authorization: Bearer <token>`.

## Estructura
- `src/config`: conexión MySQL.
- `src/middleware`: autenticación y autorización.
- `src/routes`: endpoints REST.
- `public`: interfaz web.
- `database`: esquema, migración y datos demo.
- `docs`: manuales, requisitos y UML.
- `tests`: pruebas iniciales.

## Consideraciones
- Los correos generados son identificadores de acceso dentro de SysTrack; el sistema no crea buzones reales en Gmail ni verifica que existan.
- Prototipo académico; no desplegado en una organización real.
- Ejecutar pruebas de integración y aceptación con MySQL local antes de la demostración.
- Para producción se requiere HTTPS, CORS restrictivo, rate limiting, auditoría, copias de seguridad, recuperación de contraseña y revisión OWASP.
- La interfaz usa HTML/CSS/JavaScript servido por Express; no utiliza React/Vite.


## Actualización v0.4 — Refinamiento visual y mantenimiento
- El tema claro utiliza una escala de grises humo/piedra; evita fondos blancos puros y mantiene superficies translúcidas.
- Los formularios de registro y edición incorporan capas, brillos sutiles, foco visible y transición de entrada.
- El emblema ST del Overview incorpora movimiento flotante, halo y órbita animada (respeta `prefers-reduced-motion`).
- El coordinador y el administrador pueden editar o eliminar mantenimientos pendientes. Las intervenciones completadas o canceladas quedan protegidas contra modificaciones/eliminación.
- Se corrige el tratamiento de fechas MySQL en la tabla y en el formulario de edición.

### Aplicación
No requiere migración de base de datos respecto a v0.3. Reemplaza los archivos del proyecto, conserva `.env`, ejecuta `npm install` y `npm start`.
