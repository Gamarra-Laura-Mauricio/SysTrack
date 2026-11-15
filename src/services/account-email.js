const ROLE_PREFIX = {
  ADMIN: 'admin',
  COORDINATOR: 'coord',
  TECHNICIAN: 'tec',
  REQUESTER: 'usr'
};

function accountEmailBase(fullName, role) {
  const prefix = ROLE_PREFIX[role];
  if (!prefix) throw new Error('Rol no válido para generar correo.');
  const firstName = String(fullName || '')
    .trim()
    .split(/\s+/)[0]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') || 'usuario';
  return `${prefix}${firstName}`;
}

module.exports = { accountEmailBase };
