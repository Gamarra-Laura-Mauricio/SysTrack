# SysTrack — AndesTech Solutions S.R.L.

Plataforma web académica para gestión de infraestructura tecnológica, mesa de ayuda, activos y mantenimiento. Esta versión 0.2 incorpora una interfaz visual renovada de estilo glassmorphism/liquid glass, administración de usuarios y disponibilidad del equipo técnico.

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
- `GET|POST /api/users` (solo `ADMIN`)
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
- Prototipo académico; no desplegado en una organización real.
- Ejecutar pruebas de integración y aceptación con MySQL local antes de la demostración.
- Para producción se requiere HTTPS, CORS restrictivo, rate limiting, auditoría, copias de seguridad, recuperación de contraseña y revisión OWASP.
- La interfaz usa HTML/CSS/JavaScript servido por Express; no utiliza React/Vite.
