require('dotenv').config(); const bcrypt=require('bcryptjs'); const db=require('../src/config/db');
(async()=>{try{const hash=await bcrypt.hash('Admin123!',12);await db.execute("INSERT INTO users(full_name,email,password_hash,role) VALUES(?,?,?,'ADMIN') ON DUPLICATE KEY UPDATE full_name=VALUES(full_name)",["Administrador SysTrack","admin@systrack.local",hash]);
const [u]=await db.execute("SELECT id FROM users WHERE email='admin@systrack.local'");
await db.execute("INSERT IGNORE INTO assets(asset_code,name,category,brand,model,location,assigned_to,status) VALUES ('ACT-001','Laptop de operaciones','LAPTOP','Lenovo','ThinkPad','Oficina','Área de operaciones','OPERATIVO'),('ACT-002','Impresora administrativa','IMPRESORA','HP','LaserJet','Administración','Administración','OPERATIVO')");
console.log('Usuario demo creado. Correo: admin@systrack.local | Contraseña: Admin123!');}catch(e){console.error(e);process.exitCode=1}finally{await db.end()}})();
