# Manual de usuario — SysTrack v0.2

## Acceso
Abrir `http://localhost:3000` e ingresar las credenciales entregadas. La cuenta demo inicial es `admin@systrack.local` / `Admin123!`; cambiarla antes de cualquier uso real.

## Perfiles del sistema
- **Administrador general:** crea cuentas, administra accesos y consulta el equipo técnico.
- **Coordinador de mantenimiento:** programa intervenciones y asigna técnicos activos.
- **Técnico:** consulta sus mantenimientos y registra la finalización de los que tiene asignados.
- **Solicitante:** registra incidentes.

## Usuarios y accesos (administrador)
Ingresar a Usuarios y accesos, seleccionar Crear usuario y completar nombre, correo, contraseña inicial y perfil. Desde el directorio se puede activar o desactivar una cuenta. No es posible desactivar la propia cuenta desde la sesión actual.

## Equipo técnico (administrador)
La sección Equipo técnico muestra las cuentas con rol técnico, el número de mantenimientos pendientes y su disponibilidad calculada:
- **Disponible:** no tiene mantenimientos pendientes.
- **Asignado:** tiene al menos un mantenimiento pendiente.
- **Inactivo:** su cuenta está desactivada.

Para incorporar un técnico, seleccionar Añadir técnico. El sistema crea una cuenta con rol `TECHNICIAN`.

## Activos
Entrar a Activos TI y seleccionar Añadir activo. Completar código, nombre y categoría, además de los datos disponibles. El código debe ser único.

## Incidentes
Entrar a Incidentes y seleccionar Reportar incidente. Registrar título, descripción, categoría, impacto, urgencia y activo asociado si corresponde. El sistema calcula una prioridad inicial. El personal autorizado puede avanzar el estado y registrar la solución.

## Mantenimientos
El administrador o coordinador ingresa a Mantenimientos y selecciona Programar intervención. Debe elegir el activo, tipo preventivo/correctivo, fecha, descripción y técnico activo responsable. El técnico asignado podrá completar la intervención y describir el trabajo realizado. El estado de disponibilidad se actualiza a partir de los mantenimientos pendientes.

## Cierre de sesión
Seleccionar el icono de salida en la parte inferior del menú lateral. No compartir credenciales.

## Consideraciones
La interfaz es un prototipo académico. Antes de usarlo con datos reales, completar pruebas, revisar permisos y aplicar medidas de seguridad de producción.
