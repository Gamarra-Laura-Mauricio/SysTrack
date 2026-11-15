const router=require('express').Router(); const db=require('../config/db'); const {allowRoles}=require('../middleware/auth');
router.get('/',async(req,res,next)=>{try{const [rows]=await db.query('SELECT * FROM assets ORDER BY created_at DESC');res.json(rows)}catch(e){next(e)}});
router.post('/',allowRoles('ADMIN','TECHNICIAN'),async(req,res,next)=>{try{
 const {asset_code,name,category,brand,model,serial_number,location,assigned_to,status,notes}=req.body;
 if(!asset_code||!name||!category)return res.status(400).json({message:'Código, nombre y categoría son obligatorios.'});
 const [r]=await db.execute('INSERT INTO assets(asset_code,name,category,brand,model,serial_number,location,assigned_to,status,notes) VALUES(?,?,?,?,?,?,?,?,?,?)',[asset_code,name,category,brand||null,model||null,serial_number||null,location||null,assigned_to||null,status||'OPERATIVO',notes||null]);
 res.status(201).json({id:r.insertId,message:'Activo registrado.'});
 }catch(e){next(e)}});
router.put('/:id',allowRoles('ADMIN','TECHNICIAN'),async(req,res,next)=>{try{
 const {asset_code,name,category,brand,model,serial_number,location,assigned_to,status,notes}=req.body;
 const [r]=await db.execute('UPDATE assets SET asset_code=?,name=?,category=?,brand=?,model=?,serial_number=?,location=?,assigned_to=?,status=?,notes=? WHERE id=?',[asset_code,name,category,brand||null,model||null,serial_number||null,location||null,assigned_to||null,status,notes||null,req.params.id]);
 if(!r.affectedRows)return res.status(404).json({message:'Activo no encontrado.'});res.json({message:'Activo actualizado.'});
 }catch(e){next(e)}});
router.delete('/:id',allowRoles('ADMIN'),async(req,res,next)=>{try{const [r]=await db.execute('DELETE FROM assets WHERE id=?',[req.params.id]);if(!r.affectedRows)return res.status(404).json({message:'Activo no encontrado.'});res.json({message:'Activo eliminado.'})}catch(e){next(e)}});
module.exports=router;
