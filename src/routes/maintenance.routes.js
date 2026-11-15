const router = require('express').Router();
const db = require('../config/db');
const { allowRoles } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT m.*, a.asset_code, a.name asset_name FROM maintenances m JOIN assets a ON a.id=m.asset_id ORDER BY m.scheduled_date DESC');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', allowRoles('ADMIN', 'TECHNICIAN'), async (req, res, next) => {
  try {
    const { asset_id, type, description, scheduled_date, technician_id } = req.body;
    if (!asset_id || !type || !description || !scheduled_date) return res.status(400).json({ message: 'Completa activo, tipo, descripción y fecha.' });
    const [r] = await db.execute("INSERT INTO maintenances(asset_id,type,description,scheduled_date,technician_id,status) VALUES(?,?,?,?,?,'PENDIENTE')", [asset_id, type, description, scheduled_date, technician_id || req.user.id]);
    res.status(201).json({ id: r.insertId, message: 'Mantenimiento programado.' });
  } catch (e) { next(e); }
});

router.patch('/:id/complete', allowRoles('ADMIN', 'TECHNICIAN'), async (req, res, next) => {
  try {
    const { work_performed, observations } = req.body;
    const [r] = await db.execute("UPDATE maintenances SET status='COMPLETADO', completed_at=NOW(), work_performed=?, observations=? WHERE id=?", [work_performed || '', observations || null, req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
    res.json({ message: 'Mantenimiento completado.' });
  } catch (e) { next(e); }
});
module.exports = router;
