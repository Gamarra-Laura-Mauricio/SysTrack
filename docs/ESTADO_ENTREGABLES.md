# Estado de los entregables

Este paquete es una base de trabajo versionada como 0.2. No debe presentarse como si todas las actividades de las tres unidades hubieran sido ejecutadas.

| Entregable solicitado | Estado en este paquete |
|---|---|
| Capítulo I: problema, objetivos, justificación, alcance y limitaciones | Borrador desarrollado en el informe |
| Metodología y acta del proyecto | Propuesta Scrum y acta inicial |
| Cronograma de 20 semanas | Plan propuesto; actualizar con calendario real del equipo |
| Requisitos funcionales/no funcionales | Especificación inicial y priorización |
| Arquitectura y UML | Arquitectura propuesta y fuentes PlantUML iniciales |
| Código fuente y ejecutable | Código fuente funcional; no se adjunta binario compilado |
| Pruebas unitarias/integración/aceptación/regresión | Solo prueba de humo inicial; resto pendiente de ejecutar y documentar |
| Métricas ISO/IEC 25010 | Plan de medición; resultados pendientes |
| Manual técnico y de usuario | Guías iniciales en el informe/README; validar contra la versión final |
| GitHub y contribución individual | Pendiente de que el equipo cree repositorio y realice commits propios |
| Validación organizacional | Pendiente; la organización es ficticia |
| Capacitación y aceptación de usuarios | Pendiente de pruebas con usuarios reales o participantes definidos |


## Cambios de la versión 0.2
- Rediseño de la interfaz con lenguaje visual liquid glass/glassmorphism, navegación lateral, indicadores, tarjetas translúcidas y diseño responsive.
- Nuevo rol `COORDINATOR` para el empleado responsable de programar y asignar mantenimientos.
- Administración de usuarios para el administrador general: alta de cuentas y activación/desactivación.
- Directorio del equipo técnico con estado calculado `DISPONIBLE`, `ASIGNADO` o `INACTIVO` y cantidad de trabajos pendientes.
- Asignación de cada mantenimiento a un técnico activo; los técnicos solo pueden completar sus propias asignaciones.
- Para actualizar una base de datos creada con v0.1, ejecutar una vez `database/migration_v02.sql`.


## Actualización del tercer commit — v0.3
- Navegación superior fija y responsive; se retira la barra lateral izquierda.
- Selector de tema claro/oscuro con preferencia persistente.
- Generación automática del correo por rol y primer nombre, con sufijo para nombres repetidos.
- Consulta del equipo técnico habilitada para ADMIN y COORDINATOR; gestión de cuentas continúa exclusiva de ADMIN.
- Se agregan pruebas unitarias para normalización de correos.
- No requiere migración de base de datos respecto a v0.2.
- Pendiente: ejecutar pruebas Jest e integración con MySQL en el entorno local.


## Actualización del cuarto commit — v0.4
- Tema claro rediseñado como gris humo, sin blanco puro.
- Formularios con mayor identidad Liquid Glass y transiciones.
- Emblema ST animado en Overview.
- Edición y eliminación de intervenciones pendientes desde la interfaz y API.
- Sin migración de base de datos.
- Pendiente: prueba de flujos CRUD contra MySQL local y validación manual en navegador.


## Actualización v0.5 — CRUD y programación de mantenimiento
- Se incorporaron acciones de edición y eliminación en activos, incidentes, usuarios y mantenimientos, con restricciones por rol y estado.
- Se corrigió el envío del formulario modal: se reemplazó `method=dialog` por `method=post` y se centralizó el manejador `submit` para evitar el cierre nativo del diálogo antes de procesar la petición.
- La programación de mantenimiento convierte los identificadores de activo y técnico a números y valida la respuesta del servidor.
- Se añadieron rutas PUT/DELETE para incidentes y usuarios. La eliminación de cuentas con registros relacionados se rechaza con un mensaje claro; se recomienda desactivar esas cuentas.
- La edición de activos ahora también actualiza `asset_code`.
- Pendiente: ejecutar pruebas de integración con la base MySQL local y verificar los permisos con cuentas de cada rol.
