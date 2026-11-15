require('dotenv').config();
const express=require('express'); const helmet=require('helmet'); const cors=require('cors');
const db=require('./config/db'); const {authenticate}=require('./middleware/auth'); const {notFound,errorHandler}=require('./middleware/errors');
const app=express();
app.use(helmet({contentSecurityPolicy:false})); app.use(cors({origin:process.env.CORS_ORIGIN||true})); app.use(express.json({limit:'1mb'}));
app.get('/api/health',async(req,res)=>{try{await db.query('SELECT 1');res.json({status:'ok',database:'connected'})}catch{res.status(503).json({status:'error',database:'unavailable'})}});
app.use('/api/auth',require('./routes/auth.routes'));
app.use('/api',authenticate);
app.use('/api/dashboard',require('./routes/dashboard.routes'));
app.use('/api/assets',require('./routes/assets.routes'));
app.use('/api/incidents',require('./routes/incidents.routes'));
app.use('/api/maintenances',require('./routes/maintenance.routes'));
app.use(express.static(require('path').join(__dirname,'../public')));
app.use('/api',notFound); app.use(errorHandler);
const port=Number(process.env.PORT||3000);
if(require.main===module){app.listen(port,()=>console.log(`SysTrack disponible en http://localhost:${port}`));}
module.exports=app;
