const jwt = require('jsonwebtoken');
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Autenticación requerida.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ message: 'Token inválido o vencido.' }); }
}
function allowRoles(...roles) {
  return (req, res, next) => roles.includes(req.user?.role)
    ? next() : res.status(403).json({ message: 'No tienes permisos para esta operación.' });
}
module.exports = { authenticate, allowRoles };
