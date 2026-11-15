# Commit 04 — Refinamiento Liquid Glass y mantenimiento

## Cambios incluidos
- El tema claro cambia de blancos luminosos a una escala gris humo/piedra, con superficies translúcidas y contraste moderado.
- Se refuerza el lenguaje Liquid Glass en los formularios de incidentes, activos, usuarios y mantenimientos: fondos en capas, reflejos, bordes translúcidos, estados de foco y animación de entrada.
- El símbolo ST del Overview tiene movimiento flotante, halo y órbita sutil; se respeta la preferencia de movimiento reducido del sistema.
- Se incorpora edición de intervenciones pendientes para ADMIN y COORDINATOR.
- Se incorpora eliminación de intervenciones pendientes para ADMIN y COORDINATOR, con confirmación.
- El backend valida los datos, el activo, el técnico activo y el estado de la intervención antes de actualizar o eliminar.
- Se protegen las intervenciones completadas/canceladas contra edición y eliminación.
- Se corrige la conversión de fechas para valores DATE devueltos por MySQL como objeto Date.

## Base de datos
No requiere migración. Conserva el esquema de v0.3.

## Validaciones ejecutadas
- `node --check public/app.js`
- `node --check src/routes/maintenance.routes.js`
- `node --check src/server.js`
- `node --check` para los demás módulos JavaScript.
- Verificación de estructura y sintaxis del paquete ZIP.

## Pendiente de validación local
La creación, edición y eliminación deben probarse contra la instancia MySQL local del equipo. La ejecución de Jest y la prueba integral de navegador no se realizaron en este entorno.
