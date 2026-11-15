const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
router.post('/login', async (req,res,next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({message:'Correo y contraseña son obligatorios.'});
    const [rows] = await db.execute('SELECT id, full_name, email, password_hash, role, active FROM users WHERE email=? LIMIT 1',[email]);
    const user = rows[0];
    if (!user || !user.active || !(await bcrypt.compare(password,user.password_hash))) return res.status(401).json({message:'Credenciales incorrectas.'});
    const token = jwt.sign({id:user.id,name:user.full_name,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN || '8h'});
    res.json({token,user:{id:user.id,name:user.full_name,email:user.email,role:user.role}});
  } catch(e){next(e)}
});
module.exports = router;
