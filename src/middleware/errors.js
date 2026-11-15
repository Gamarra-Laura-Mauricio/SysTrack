function notFound(req, res) { res.status(404).json({ message: 'Recurso no encontrado.' }); }
function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'El código o dato único ya existe.' });
  res.status(500).json({ message: 'Error interno del servidor.' });
}
module.exports = { notFound, errorHandler };
