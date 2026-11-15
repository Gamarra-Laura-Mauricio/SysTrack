# Commit 03 — Experiencia adaptable y gestión de identidades

## Cambios incluidos
- Se reemplaza la barra lateral fija por una barra superior horizontal tipo command bar, que permanece visible al desplazarse.
- Se incorpora alternancia entre tema oscuro y claro, con persistencia mediante `localStorage`.
- Se genera el correo de cada cuenta a partir del rol y el primer nombre: `admin`, `coord`, `tec` o `usr` + nombre + `@gmail.com`.
- Se resuelven colisiones agregando un sufijo numérico (`tecmauricio2@gmail.com`).
- El servidor genera el correo; el valor mostrado en el formulario es una vista previa y no se confía en el cliente.
- Se habilita la consulta del equipo técnico para ADMIN y COORDINATOR; la creación y activación/desactivación de usuarios sigue reservada al ADMIN.
- Se agregan pruebas unitarias de la normalización del identificador de correo.

## Base de datos
No requiere migración. Mantiene el esquema de v0.2.

## Validaciones ejecutadas
- `node --check public/app.js`
- `node --check src/routes/users.routes.js`
- `node --check src/server.js`
- Prueba de sintaxis de servicios y tests.

## Nota de alcance
La dirección generada es un identificador de acceso en SysTrack. No se crea ni verifica un buzón real de Gmail. El administrador debe entregar la contraseña inicial por un canal seguro.
