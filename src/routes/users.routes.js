const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { allowRoles } = require('../middleware/auth');

router.use(allowRoles('ADMIN'));

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.full_name, u.email, u.role, u.active, u.created_at,
        CASE WHEN u.role <> 'TECHNICIAN' THEN NULL
          WHEN u.active = 0 THEN 'INACTIVO'
          WHEN EXISTS (SELECT 1 FROM maintenances m WHERE m.technician_id=u.id AND m.status='PENDIENTE') THEN 'ASIGNADO'
          ELSE 'DISPONIBLE' END AS availability,
        (SELECT COUNT(*) FROM maintenances m WHERE m.technician_id=u.id AND m.status='PENDIENTE') AS pending_jobs
      FROM users u ORDER BY FIELD(u.role,'ADMIN','COORDINATOR','TECHNICIAN','REQUESTER'), u.full_name`);
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { full_name, email, password, role } = req.body || {};
    const allowed = ['ADMIN', 'COORDINATOR', 'TECHNICIAN', 'REQUESTER'];
    if (!full_name?.trim() || !email?.trim() || !password || !allowed.includes(role))
      return res.status(400).json({ message: 'Completa nombre, correo, contraseña y rol válido.' });
    if (password.length < 8) return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute('INSERT INTO users(full_name,email,password_hash,role,active) VALUES(?,?,?,?,1)', [full_name.trim(), email.trim().toLowerCase(), hash, role]);
    res.status(201).json({ id: result.insertId, message: 'Usuario creado correctamente.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Ya existe una cuenta con ese correo.' });
    next(e);
  }
});

router.patch('/:id/active', async (req, res, next) => {
  try {
    const active = req.body?.active;
    if (typeof active !== 'boolean') return res.status(400).json({ message: 'Indica si la cuenta debe estar activa.' });
    if (Number(req.params.id) === Number(req.user.id) && !active) return res.status(400).json({ message: 'No puedes desactivar tu propia cuenta.' });
    const [result] = await db.execute('UPDATE users SET active=? WHERE id=?', [active, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Usuario no encontrado.' });
    res.json({ message: active ? 'Cuenta activada.' : 'Cuenta desactivada.' });
  } catch (e) { next(e); }
});
module.exports = router;
