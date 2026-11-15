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
