const router = require('express').Router();
const db = require('../config/db');
const { allowRoles } = require('../middleware/auth');


router.get('/technicians', allowRoles('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const [rows] = await db.query(`SELECT u.id,u.full_name,u.email,
      CASE WHEN EXISTS (SELECT 1 FROM maintenances m WHERE m.technician_id=u.id AND m.status='PENDIENTE') THEN 'ASIGNADO' ELSE 'DISPONIBLE' END AS availability,
      (SELECT COUNT(*) FROM maintenances m WHERE m.technician_id=u.id AND m.status='PENDIENTE') AS pending_jobs
      FROM users u WHERE u.role='TECHNICIAN' AND u.active=1 ORDER BY u.full_name`);
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const ownOnly = req.user.role === 'TECHNICIAN' ? ' AND m.technician_id=?' : '';
    const params = req.user.role === 'TECHNICIAN' ? [req.user.id] : [];
    const [rows] = await db.query(`SELECT m.*, a.asset_code, a.name asset_name, u.full_name technician_name
      FROM maintenances m JOIN assets a ON a.id=m.asset_id JOIN users u ON u.id=m.technician_id
      WHERE 1=1 ${ownOnly} ORDER BY m.scheduled_date DESC`, params);
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', allowRoles('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const { asset_id, type, description, scheduled_date, technician_id } = req.body || {};
    if (!asset_id || !['PREVENTIVO','CORRECTIVO'].includes(type) || !description?.trim() || !scheduled_date || !technician_id)
      return res.status(400).json({ message: 'Completa activo, tipo, descripción, fecha y técnico asignado.' });
    const [tech] = await db.execute("SELECT id FROM users WHERE id=? AND role='TECHNICIAN' AND active=1", [technician_id]);
    if (!tech.length) return res.status(400).json({ message: 'Selecciona un técnico activo.' });
    const [asset] = await db.execute('SELECT id FROM assets WHERE id=?', [asset_id]);
    if (!asset.length) return res.status(404).json({ message: 'Activo no encontrado.' });
    const [result] = await db.execute("INSERT INTO maintenances(asset_id,type,description,scheduled_date,technician_id,status) VALUES(?,?,?,?,?,'PENDIENTE')", [asset_id, type, description.trim(), scheduled_date, technician_id]);
    res.status(201).json({ id: result.insertId, message: 'Mantenimiento programado y técnico asignado.' });
  } catch (e) { next(e); }
});


router.put('/:id', allowRoles('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const { asset_id, type, description, scheduled_date, technician_id } = req.body || {};
    if (!asset_id || !['PREVENTIVO', 'CORRECTIVO'].includes(type) || !description?.trim() || !scheduled_date || !technician_id) {
      return res.status(400).json({ message: 'Completa activo, tipo, descripción, fecha y técnico asignado.' });
    }
    const [current] = await db.execute('SELECT id, status FROM maintenances WHERE id=?', [req.params.id]);
    if (!current.length) return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
    if (current[0].status !== 'PENDIENTE') return res.status(409).json({ message: 'Solo se pueden editar intervenciones pendientes.' });
    const [tech] = await db.execute("SELECT id FROM users WHERE id=? AND role='TECHNICIAN' AND active=1", [technician_id]);
    if (!tech.length) return res.status(400).json({ message: 'Selecciona un técnico activo.' });
    const [asset] = await db.execute('SELECT id FROM assets WHERE id=?', [asset_id]);
    if (!asset.length) return res.status(404).json({ message: 'Activo no encontrado.' });
    await db.execute('UPDATE maintenances SET asset_id=?, type=?, description=?, scheduled_date=?, technician_id=? WHERE id=?',
      [asset_id, type, description.trim(), scheduled_date, technician_id, req.params.id]);
    res.json({ message: 'Intervención actualizada correctamente.' });
  } catch (e) { next(e); }
});

router.delete('/:id', allowRoles('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT id, status FROM maintenances WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
    if (rows[0].status !== 'PENDIENTE') return res.status(409).json({ message: 'Solo se pueden eliminar intervenciones pendientes.' });
    await db.execute('DELETE FROM maintenances WHERE id=?', [req.params.id]);
    res.json({ message: 'Intervención eliminada correctamente.' });
  } catch (e) { next(e); }
});

router.patch('/:id/complete', allowRoles('ADMIN', 'COORDINATOR', 'TECHNICIAN'), async (req, res, next) => {
  try {
    const { work_performed, observations } = req.body || {};
    const [rows] = await db.execute('SELECT technician_id,status FROM maintenances WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
    if (req.user.role === 'TECHNICIAN' && Number(rows[0].technician_id) !== Number(req.user.id)) return res.status(403).json({ message: 'Solo puedes cerrar tus mantenimientos asignados.' });
    if (rows[0].status !== 'PENDIENTE') return res.status(409).json({ message: 'Este mantenimiento ya no está pendiente.' });
    const [r] = await db.execute("UPDATE maintenances SET status='COMPLETADO', completed_at=NOW(), work_performed=?, observations=? WHERE id=?", [work_performed || '', observations || null, req.params.id]);
    res.json({ message: 'Mantenimiento completado.' });
  } catch (e) { next(e); }
});
module.exports = router;
