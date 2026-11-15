# Manual técnico — SysTrack

## Arquitectura
Aplicación Node.js/Express con archivos web estáticos, API REST, middleware JWT/RBAC y persistencia MySQL. Módulos: activos, incidentes, mantenimiento y dashboard.

## Instalación
1. Node.js 18+ y MySQL 8+.
2. `npm install`.
3. Ejecutar `database/schema.sql`.
4. Copiar `.env.example` a `.env`; configurar host, puerto, usuario, contraseña, base de datos y secreto JWT.
5. `npm run seed`.
6. `npm start`.

## Configuración
No subir `.env` al repositorio. Utilizar un secreto aleatorio robusto. La contraseña demo es temporal y debe cambiarse.

## Mantenimiento
Respaldar MySQL antes de actualizar. Aplicar cambios de esquema de forma versionada. Ejecutar `npm test` antes de integrar cambios. Revisar logs del proceso y disponibilidad de MySQL.

## Endurecimiento previo a producción
Configurar HTTPS, CORS con origen permitido explícito, rate limiting, política de contraseñas, rotación de secretos, estrategia de revocación/renovación de JWT, auditoría completa, backups cifrados, monitoreo y pruebas OWASP. Revisar retención y acceso a datos personales conforme a Ley N.º 29733.
