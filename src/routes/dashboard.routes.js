const router = require('express').Router(); const db = require('../config/db');
router.get('/', async (req,res,next)=>{ try {
 const [[a]] = await db.query("SELECT COUNT(*) total, SUM(status='OPERATIVO') operational, SUM(status='MANTENIMIENTO') maintenance FROM assets");
 const [[i]] = await db.query("SELECT COUNT(*) total, SUM(status IN ('REGISTRADO','ASIGNADO','EN_PROCESO')) open_count, SUM(status='RESUELTO') resolved FROM incidents");
 const [[m]] = await db.query("SELECT COUNT(*) total, SUM(status='PENDIENTE') pending, SUM(status='COMPLETADO') completed FROM maintenances");
 res.json({assets:a,incidents:i,maintenances:m});
 }catch(e){next(e)} }); module.exports=router;
