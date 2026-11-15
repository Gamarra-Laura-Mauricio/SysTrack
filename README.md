# SysTrack — AndesTech Solutions S.R.L.

Prototipo funcional inicial para gestión de infraestructura tecnológica. Incluye autenticación JWT, roles, inventario de activos, registro y seguimiento de incidentes, mantenimientos e indicadores básicos.

## Requisitos
- Node.js 18 o superior
- MySQL 8.x (o compatible)
- Git (para el trabajo colaborativo)

## Instalación local
1. Descomprime el proyecto y abre una terminal en `SysTrack/`.
2. Instala dependencias: `npm install`.
3. Crea la base de datos ejecutando `database/schema.sql` desde MySQL Workbench o consola.
4. Copia `.env.example` como `.env` y configura las credenciales MySQL y `JWT_SECRET`.
5. Crea el usuario de demostración: `npm run seed`.
6. Inicia: `npm start` (o `npm run dev`).
7. Abre `http://localhost:3000`.

**Acceso de demostración:** `admin@systrack.local` / `Admin123!`. Cambia esta contraseña y el secreto JWT antes de cualquier uso fuera del entorno local.

## Funcionalidades implementadas
- Login con JWT y contraseñas con bcrypt.
- Roles `ADMIN`, `TECHNICIAN`, `REQUESTER` aplicados en endpoints de escritura.
- CRUD parcial de activos (listar, crear, actualizar y eliminar).
- Registro de incidentes con prioridad derivada de impacto y urgencia; actualización de estados.
- Programación y cierre de mantenimientos.
- Panel con conteos agregados.

## Estructura
- `src/config`: conexión a MySQL.
- `src/middleware`: autenticación, autorización y errores.
- `src/routes`: endpoints REST.
- `public`: interfaz web.
- `database`: esquema y datos demo.
- `docs`: documentación y modelos UML.
- `tests`: prueba de humo inicial.

## API principal
- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET|POST /api/assets`
- `PUT|DELETE /api/assets/:id`
- `GET|POST /api/incidents`
- `PATCH /api/incidents/:id/status`
- `GET|POST /api/maintenances`
- `PATCH /api/maintenances/:id/complete`
- `GET /api/health`

Las rutas, salvo login y health, requieren `Authorization: Bearer <token>`.

## Consideraciones y pendientes
- El prototipo no ha sido desplegado en una organización real; no contiene datos reales.
- La prueba automatizada incluida es una prueba de humo. Completar pruebas unitarias, integración, aceptación y regresión antes de declarar calidad validada.
- Revisar política CORS, HTTPS, rate limiting, auditoría completa, recuperación de contraseña, protección CSRF si se cambia el mecanismo de autenticación, y gestión de secretos antes de producción.
- El frontend utiliza HTML/CSS/JavaScript servido por Express para mantener una instalación sencilla; React/Vite puede incorporarse como evolución si el equipo confirma ese stack con el docente.
- No hay integración con agentes de monitoreo ni descubrimiento automático de hardware.
