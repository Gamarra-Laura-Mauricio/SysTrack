# Especificación inicial de requisitos — SysTrack

## Propósito y alcance
SysTrack centraliza inventario, incidentes, mantenimientos e indicadores para AndesTech Solutions S.R.L. (organización ficticia). Este documento es una línea base inicial; validar requisitos con usuarios antes de congelarlos.

## Actores
- Administrador: administra activos, planifica mantenimiento, consulta indicadores y administra accesos.
- Técnico: consulta activos, atiende incidentes y registra intervenciones.
- Solicitante: consulta activos permitidos y reporta incidentes.

## Requisitos funcionales
| ID | Requisito | Prioridad | Criterio de aceptación |
|---|---|---|---|
| RF-01 | Autenticar usuarios | Must | Credenciales válidas entregan token; inválidas devuelven 401 |
| RF-02 | Aplicar autorización por rol | Must | Operaciones no permitidas devuelven 403 |
| RF-03 | Registrar activos | Must | Código, nombre y categoría obligatorios; código único |
| RF-04 | Consultar inventario | Must | Lista datos básicos de activos registrados |
| RF-05 | Actualizar datos y estado de activos | Must | Cambios persisten en MySQL |
| RF-06 | Registrar incidentes | Must | Guarda título, descripción, impacto, urgencia y activo opcional |
| RF-07 | Calcular prioridad | Should | Impacto/urgencia determinan prioridad documentada |
| RF-08 | Actualizar estado y solución de incidente | Must | Solo técnico/administrador modifica el estado |
| RF-09 | Programar mantenimiento | Must | Activo, tipo, descripción y fecha son obligatorios |
| RF-10 | Completar mantenimiento | Must | Guarda trabajo realizado y fecha de cierre |
| RF-11 | Mostrar indicadores | Should | Conteos corresponden a registros de base de datos |
| RF-12 | Mantener historial de intervenciones | Must | Consulta cronológica por activo (pendiente de completar en el prototipo) |

## Requisitos no funcionales
| ID | Característica | Requisito verificable |
|---|---|---|
| RNF-01 | Seguridad | Password hash, JWT, middleware y autorización por rol |
| RNF-02 | Privacidad | No usar datos personales reales en demo; minimizar datos |
| RNF-03 | Rendimiento | Objetivo de respuesta <2 s para consultas ordinarias en entorno de prueba definido; medir |
| RNF-04 | Usabilidad | Interfaz en español y formularios con validación |
| RNF-05 | Mantenibilidad | Separar rutas, servicios, middleware y persistencia |
| RNF-06 | Compatibilidad | Navegador moderno y equipos de laboratorio |
| RNF-07 | Fiabilidad | Backups y procedimiento de restauración documentado |
| RNF-08 | Accesibilidad | Contraste, etiquetas y navegación adaptable; validar con revisión manual |

## Reglas de negocio
1. El código de activo es único.
2. Un incidente requiere título y descripción.
3. Prioridad crítica: impacto alto + urgencia alta; alta: al menos un factor alto; media: sin factor alto y al menos un factor medio; baja: ambos bajos.
4. Un mantenimiento requiere un activo y fecha programada.
5. Solo ADMIN y TECHNICIAN modifican activos y operaciones técnicas; solo ADMIN elimina activos.
6. Los estados deben pertenecer a los catálogos definidos en base de datos.

## Trazabilidad
Problema de inventario -> RF-03 a RF-05 -> módulo Activos -> pruebas TC-03 y TC-04.
Problema de mantenimiento -> RF-09 y RF-10 -> módulo Mantenimiento -> TC-06.
Problema de incidentes -> RF-06 a RF-08 -> módulo Incidentes -> TC-05.
Falta de control -> RF-11 -> Dashboard -> TC-07.
