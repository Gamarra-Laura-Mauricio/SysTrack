const $ = s => document.querySelector(s);
let token = localStorage.getItem('systrack_token');
let user = JSON.parse(localStorage.getItem('systrack_user') || 'null');
let assets = [], technicians = [], usersCache = [];
const roleNames = { ADMIN:'Administrador general', COORDINATOR:'Coordinador de mantenimiento', TECHNICIAN:'Técnico', REQUESTER:'Solicitante' };
async function api(path, opts={}) {
  const r = await fetch('/api'+path, { ...opts, headers:{'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{ }), ...(opts.headers||{})} });
  const data = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(data.message || 'No se pudo completar la operación.');
  return data;
}
function notify(msg){ $('#notice').textContent=msg; $('#notice').classList.remove('hidden'); clearTimeout(notify.timer); notify.timer=setTimeout(()=>$('#notice').classList.add('hidden'),3200); }
function isAdmin(){return user?.role==='ADMIN'}
function canViewTeam(){return ['ADMIN','COORDINATOR'].includes(user?.role)}
function canSchedule(){return ['ADMIN','COORDINATOR'].includes(user?.role)}
function showApp(){
  if(!token||!user){$('#login').classList.remove('hidden');$('#app').classList.add('hidden');return;}
  $('#login').classList.add('hidden');$('#app').classList.remove('hidden');
  $('#userName').textContent=user.name; $('#userInfo').textContent=roleNames[user.role]||user.role;
  $('#topAvatar').textContent=(user.name||'U').trim().charAt(0).toUpperCase();
  document.querySelectorAll('.admin-only').forEach(el=>el.classList.toggle('hidden',!isAdmin()));
  document.querySelectorAll('.team-access').forEach(el=>el.classList.toggle('hidden',!canViewTeam()));
  document.querySelectorAll('.manager-only').forEach(el=>el.classList.toggle('hidden',!canSchedule()));
  $('#todayLabel').textContent=new Intl.DateTimeFormat('es-PE',{weekday:'short',day:'2-digit',month:'short'}).format(new Date()).toUpperCase();
  navigate('dashboard');
}
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();$('#loginError').textContent='';try{const f=new FormData(e.target);const d=await api('/auth/login',{method:'POST',body:JSON.stringify({email:f.get('email'),password:f.get('password')})});token=d.token;user=d.user;localStorage.setItem('systrack_token',token);localStorage.setItem('systrack_user',JSON.stringify(user));showApp();}catch(err){$('#loginError').textContent=err.message;}});
$('#logout').onclick=()=>{token=null;user=null;localStorage.removeItem('systrack_token');localStorage.removeItem('systrack_user');showApp();};
const pageMeta={dashboard:['Centro de operaciones','OVERVIEW'],assets:['Activos tecnológicos','ASSET DIRECTORY'],incidents:['Gestión de incidentes','SERVICE DESK'],maintenance:['Mantenimientos','ASSET CARE'],team:['Equipo técnico','PEOPLE / TECH TEAM'],users:['Usuarios y accesos','ACCESS CONTROL']};
function navigate(view){if(view==='users'&&!isAdmin())return;if(view==='team'&&!canViewTeam())return;document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));const target=$(`#${view}View`);if(!target)return;target.classList.remove('hidden');document.querySelectorAll('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));$('#pageTitle').textContent=pageMeta[view][0];$('#breadcrumbCurrent').textContent=pageMeta[view][1];({dashboard:loadDashboard,assets:loadAssets,incidents:loadIncidents,maintenance:loadMaintenance,team:loadTeam,users:loadUsers})[view]?.();}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateValue=s=>!s?'':(s instanceof Date?s.toISOString().slice(0,10):String(s).slice(0,10));
const date=s=>{const value=dateValue(s);return value?new Date(value+'T00:00:00').toLocaleDateString('es-PE',{day:'2-digit',month:'short',year:'numeric'}):'—';};
const status=s=>`<span class="status-pill status-${esc(s)}">${esc(String(s||'').replaceAll('_',' '))}</span>`;
async function loadDashboard(){try{const d=await api('/dashboard');$('#statAssets').textContent=d.assets.total||0;$('#statOperational').textContent=d.assets.operational||0;$('#statOpen').textContent=d.incidents.open_count||0;$('#statPending').textContent=d.maintenances.pending||0;}catch(e){notify(e.message);}}
async function loadAssets(){try{assets=await api('/assets');$('#assetsTable').innerHTML=assets.map(a=>`<tr><td><b>${esc(a.asset_code)}</b></td><td><b>${esc(a.name)}</b><br><small>${esc([a.brand,a.model].filter(Boolean).join(' '))}</small></td><td>${esc(a.category)}</td><td>${esc(a.location||'—')}</td><td>${esc(a.assigned_to||'—')}</td><td>${status(a.status)}</td><td class="row-actions"><button type="button" class="mini-button" onclick="editAsset(${a.id})">Editar</button>${isAdmin()?`<button type="button" class="mini-button danger-mini" onclick="deleteAsset(${a.id})">Eliminar</button>`:''}</td></tr>`).join('')||'<tr><td colspan="7">No hay activos registrados.</td></tr>';}catch(e){notify(e.message);}}
async function loadIncidents(){try{const rows=await api('/incidents');$('#incidentsTable').innerHTML=rows.map(i=>`<tr><td><b>${esc(i.title)}</b><br><small>${esc(i.description)}</small></td><td>${esc(i.asset_code||'Sin asociar')}</td><td>${status(i.priority)}</td><td>${status(i.status)}</td><td>${date(i.created_at)}</td><td class="row-actions">${['REGISTRADO','ASIGNADO','EN_PROCESO'].includes(i.status)?`<button type="button" class="mini-button" onclick="advanceIncident(${i.id},'${i.status}')">Avanzar ↗</button>`:''}${['ADMIN','TECHNICIAN'].includes(user.role)?`<button type="button" class="mini-button" onclick="editIncident(${i.id})">Editar</button>`:''}${user.role==='ADMIN'?`<button type="button" class="mini-button danger-mini" onclick="deleteIncident(${i.id})">Eliminar</button>`:''}</td></tr>`).join('')||'<tr><td colspan="6">No hay incidentes registrados.</td></tr>';}catch(e){notify(e.message);}}
window.advanceIncident=async(id,state)=>{const next={REGISTRADO:'ASIGNADO',ASIGNADO:'EN_PROCESO',EN_PROCESO:'RESUELTO'}[state];let resolution='';if(next==='RESUELTO')resolution=prompt('Describe la solución aplicada:')||'Atención registrada';try{await api(`/incidents/${id}/status`,{method:'PATCH',body:JSON.stringify({status:next,resolution})});notify('Estado actualizado.');loadIncidents();}catch(e){notify(e.message);}};
async function loadMaintenance(){try{const rows=await api('/maintenances');$('#maintenanceTable').innerHTML=rows.map(m=>{const manager=canSchedule()&&m.status==='PENDIENTE';const canComplete=m.status==='PENDIENTE'&&(['ADMIN','COORDINATOR'].includes(user.role)||(user.role==='TECHNICIAN'));return `<tr><td><b>${esc(m.asset_code)}</b><br><small>${esc(m.asset_name)}</small></td><td>${esc(m.type)}</td><td>${esc(m.description)}</td><td>${date(m.scheduled_date)}</td><td>${esc(m.technician_name||'—')}</td><td>${status(m.status)}</td><td class="row-actions">${manager?`<button class="mini-button" onclick="editMaintenance(${m.id})">Editar</button><button class="mini-button danger-mini" onclick="deleteMaintenance(${m.id})">Eliminar</button>`:''}${canComplete?`<button class="mini-button" onclick="completeMaintenance(${m.id})">Completar ↗</button>`:''}${!manager&&!canComplete?'—':''}</td></tr>`}).join('')||'<tr><td colspan="7">No hay intervenciones programadas.</td></tr>';}catch(e){notify(e.message);}}
window.completeMaintenance=async id=>{const work_performed=prompt('Describe el trabajo realizado:');if(work_performed===null)return;try{await api(`/maintenances/${id}/complete`,{method:'PATCH',body:JSON.stringify({work_performed})});notify('Mantenimiento completado.');loadMaintenance();}catch(e){notify(e.message);}};
async function loadTeam(){try{usersCache=await api('/users');const techs=usersCache.filter(u=>u.role==='TECHNICIAN');const available=techs.filter(t=>t.availability==='DISPONIBLE').length;const assigned=techs.filter(t=>t.availability==='ASIGNADO').length;const inactive=techs.filter(t=>!t.active).length;$('#teamSummary').innerHTML=`<div class="team-summary-card"><span>TÉCNICOS REGISTRADOS</span><b>${techs.length}</b></div><div class="team-summary-card"><span>DISPONIBLES</span><b>${available}</b></div><div class="team-summary-card"><span>CON ASIGNACIÓN ACTIVA</span><b>${assigned}</b></div>`;$('#teamGrid').innerHTML=techs.map(t=>`<article class="tech-card"><div class="tech-card-top"><div class="tech-avatar">${esc(t.full_name.charAt(0).toUpperCase())}</div><div><b>${esc(t.full_name)}</b><small>${esc(t.email)}</small></div></div><div>${status(t.active?t.availability:'INACTIVO')}</div><div class="tech-card-foot"><span>Trabajos pendientes</span><b>${t.pending_jobs||0}</b></div></article>`).join('')||'<div class="content-card">Aún no hay técnicos registrados. Añade integrantes para comenzar a asignar mantenimientos.</div>';}catch(e){notify(e.message);}}
async function loadUsers(){try{usersCache=await api('/users');$('#usersTable').innerHTML=usersCache.map(u=>`<tr><td><b>${esc(u.full_name)}</b><br><small>ID #${u.id}</small></td><td>${esc(u.email)}</td><td><span class="role-pill">${esc(roleNames[u.role]||u.role)}</span></td><td>${status(u.active?'ACTIVO':'INACTIVO')}</td><td>${date(u.created_at)}</td><td>${Number(u.id)===Number(user.id)?'<small>Tu cuenta</small>':`<button type="button" class="mini-button" onclick="editUser(${u.id})">Editar</button><button type="button" class="mini-button" onclick="toggleUser(${u.id},${u.active?0:1})">${u.active?'Desactivar':'Activar'}</button><button type="button" class="mini-button danger-mini" onclick="deleteUser(${u.id})">Eliminar</button>`}</td></tr>`).join('')||'<tr><td colspan="6">No hay usuarios registrados.</td></tr>';}catch(e){notify(e.message);}}
window.toggleUser=async(id,active)=>{if(!confirm(active?'¿Activar esta cuenta?':'¿Desactivar esta cuenta?'))return;try{await api(`/users/${id}/active`,{method:'PATCH',body:JSON.stringify({active:!!active})});notify('Estado de cuenta actualizado.');loadUsers();}catch(e){notify(e.message);}};
const modal=$('#modal');
function field(name,label,type='text',opts=null,wide=false,required=true,placeholder=''){return `<label class="${wide?'wide':''}">${label}${opts?`<select name="${name}" ${required?'required':''}>${opts.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join('')}</select>`:`<input name="${name}" type="${type}" placeholder="${esc(placeholder)}" ${required?'required':''}>`}</label>`;}
function openModal(title,html,onSave){
  $('#modalTitle').textContent=title;$('#modalFields').innerHTML=html;
  $('#modalForm').onsubmit=async e=>{e.preventDefault();const submit=$('#saveModal');submit.disabled=true;const obj=Object.fromEntries(new FormData(e.currentTarget).entries());try{const result=await onSave(obj);modal.close();notify(result?.email?`Cuenta creada: ${result.email}`:'Cambios guardados correctamente.');await loadCurrent();}catch(err){notify(err.message);}finally{submit.disabled=false;}};
  if(!modal.open)modal.showModal();modal.classList.remove('modal-reopen');void modal.offsetWidth;modal.classList.add('modal-reopen');
}
function loadCurrent(){const v=['dashboard','assets','incidents','maintenance','team','users'].find(x=>!$(`#${x}View`).classList.contains('hidden'))||'dashboard';({dashboard:loadDashboard,assets:loadAssets,incidents:loadIncidents,maintenance:loadMaintenance,team:loadTeam,users:loadUsers})[v]?.();}
function assetForm(a={}){return field('asset_code','Código del activo','text',null,false,true,'ACT-003')+field('name','Nombre del equipo')+field('category','Categoría')+field('brand','Marca','text',null,false,false)+field('model','Modelo','text',null,false,false)+field('serial_number','Número de serie','text',null,false,false)+field('location','Ubicación','text',null,false,false)+field('assigned_to','Responsable','text',null,false,false)+field('status','Estado','text',[['OPERATIVO','Operativo'],['MANTENIMIENTO','En mantenimiento'],['INACTIVO','Inactivo'],['BAJA','Baja']]);}
function fillModal(data){for(const [k,v] of Object.entries(data)){const el=$('#modalFields').querySelector(`[name="${k}"]`);if(el)el.value=v??'';}}
$('#newAsset').onclick=()=>openModal('Añadir activo',assetForm(),o=>api('/assets',{method:'POST',body:JSON.stringify(o)}));
window.editAsset=id=>{const a=assets.find(x=>Number(x.id)===Number(id));if(!a)return;openModal('Editar activo',assetForm(a),o=>api(`/assets/${id}`,{method:'PUT',body:JSON.stringify(o)}));fillModal(a);};
window.deleteAsset=async id=>{if(!confirm('¿Eliminar este activo?'))return;try{await api(`/assets/${id}`,{method:'DELETE'});notify('Activo eliminado.');await loadAssets();}catch(e){notify(e.message);}};
function incidentForm(){return field('title','Título del incidente','text',null,true)+field('description','Descripción','text',null,true)+field('category','Categoría','text',[['HARDWARE','Hardware'],['SOFTWARE','Software'],['RED','Red'],['OTRO','Otro']])+field('impact','Impacto','text',[['BAJO','Bajo'],['MEDIO','Medio'],['ALTO','Alto']])+field('urgency','Urgencia','text',[['BAJA','Baja'],['MEDIA','Media'],['ALTA','Alta']])+`<label class="wide">Activo asociado<select name="asset_id"><option value="">Sin asociar</option>${assets.map(a=>`<option value="${a.id}">${esc(a.asset_code)} — ${esc(a.name)}</option>`).join('')}</select></label>`;}
$('#newIncident').onclick=async()=>{await loadAssets();openModal('Reportar incidente',incidentForm(),o=>api('/incidents',{method:'POST',body:JSON.stringify(o)}));};
window.editIncident=async id=>{try{await loadAssets();const rows=await api('/incidents');const i=rows.find(x=>Number(x.id)===Number(id));if(!i)return;openModal('Editar incidente',incidentForm(),o=>api(`/incidents/${id}`,{method:'PUT',body:JSON.stringify(o)}));fillModal(i);}catch(e){notify(e.message);}};
window.deleteIncident=async id=>{if(!confirm('¿Eliminar este incidente?'))return;try{await api(`/incidents/${id}`,{method:'DELETE'});notify('Incidente eliminado.');await loadIncidents();}catch(e){notify(e.message);}};
async function openMaintenanceForm(id=null){
  try{
    const [assetsRes, usersRes] = await Promise.all([
      api('/assets'),
      api('/users')
    ]);

    assets = Array.isArray(assetsRes) ? assetsRes : (assetsRes.assets || []);
    const allUsers = Array.isArray(usersRes) ? usersRes : (usersRes.users || []);
    technicians = allUsers.filter(u => u.role === 'TECHNICIAN' && u.active);

    if(!assets.length){
      alert('Primero registra al menos un activo tecnológico en el módulo Activos TI.');
      return;
    }
    if(!technicians.length){
      alert('Primero registra al menos un técnico activo en Equipo técnico o Usuarios.');
      return;
    }

    let current=null;
    if(id){
      const rows=await api('/maintenances');
      current=rows.find(x=>Number(x.id)===Number(id));
      if(!current){notify('No se encontró la intervención.');return;}
    }

    const assetOpts=assets.map(a=>[a.id,`${a.asset_code} — ${a.name}`]);
    const techOpts=technicians.map(t=>[t.id,`${t.full_name} · ${t.availability==='ASIGNADO'?'Con carga':'Disponible'}`]);
    const html=field('asset_id','Activo','text',assetOpts,true)
      +field('type','Tipo de mantenimiento','text',[['PREVENTIVO','Preventivo'],['CORRECTIVO','Correctivo']])
      +field('scheduled_date','Fecha programada','date')
      +field('technician_id','Asignar técnico','text',techOpts,true)
      +field('description','Descripción del trabajo','text',null,true);

    openModal(
      id?'Editar intervención':'Programar intervención',
      html,
      o=>api(id?`/maintenances/${id}`:'/maintenances',{
        method:id?'PUT':'POST',
        body:JSON.stringify({...o,asset_id:Number(o.asset_id),technician_id:Number(o.technician_id)})
      })
    );

    if(current){
      fillModal({
        asset_id:current.asset_id,
        type:current.type,
        scheduled_date:dateValue(current.scheduled_date),
        technician_id:current.technician_id,
        description:current.description
      });
    }
  }catch(e){
    console.error('Error al abrir formulario de mantenimiento:', e);
    notify(e.message);
  }
}
$('#newMaintenance').onclick=()=>openMaintenanceForm();
window.editMaintenance=id=>openMaintenanceForm(id);
window.deleteMaintenance=async id=>{if(!confirm('¿Eliminar esta intervención pendiente? Esta acción no se puede deshacer.'))return;try{await api(`/maintenances/${id}`,{method:'DELETE'});notify('Intervención eliminada.');await loadMaintenance();await loadDashboard();}catch(e){notify(e.message);}};
function emailPreviewMarkup(fixedRole=''){
  const roleField=fixedRole?`<input type="hidden" name="role" value="${fixedRole}">`:`<label class="wide">Perfil de acceso<select name="role" id="accountRole"><option value="ADMIN">Administrador general</option><option value="COORDINATOR">Coordinador de mantenimiento</option><option value="TECHNICIAN">Técnico</option><option value="REQUESTER">Solicitante</option></select></label>`;
  return field('full_name','Nombre completo','text',null,true,true,'Ej. Mauricio Gamarra')+roleField+`<label class="wide generated-email-field">Correo generado automáticamente<input id="generatedEmail" type="text" value="tecmauricio@gmail.com" readonly><small>Se construye con el rol y el primer nombre. Si ya existe, se añade un número.</small></label>`+field('password','Contraseña inicial','password',null,true,true,'Mínimo 8 caracteres');
}
function makeEmailPreview(name,role){const prefixes={ADMIN:'admin',COORDINATOR:'coord',TECHNICIAN:'tec',REQUESTER:'usr'};const first=(name||'usuario').trim().split(/\s+/)[0].normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')||'usuario';return `${prefixes[role]||'usr'}${first}@gmail.com`;}
function bindEmailPreview(fixedRole=''){const name=$('#modalFields').querySelector('[name="full_name"]');const role=$('#modalFields').querySelector('[name="role"]');const update=()=>{$('#generatedEmail').value=makeEmailPreview(name.value,role.value);};name.addEventListener('input',update);role?.addEventListener('change',update);update();}
$('#newUser').onclick=()=>{openModal('Crear cuenta de usuario',emailPreviewMarkup(),o=>api('/users',{method:'POST',body:JSON.stringify(o)}));bindEmailPreview();};
$('#newTechnician').onclick=()=>{openModal('Incorporar técnico',emailPreviewMarkup('TECHNICIAN'),o=>api('/users',{method:'POST',body:JSON.stringify(o)}));bindEmailPreview('TECHNICIAN');};
$('#closeModal').onclick=$('#cancelModal').onclick=()=>modal.close();
showApp();


window.editUser=id=>{const u=usersCache.find(x=>Number(x.id)===Number(id));if(!u)return;const html=field('full_name','Nombre completo','text',null,true)+field('role','Perfil','text',[['ADMIN','Administrador'],['COORDINATOR','Coordinador'],['TECHNICIAN','Técnico'],['REQUESTER','Solicitante']])+field('password','Nueva contraseña (opcional)','password',null,true,false,'Dejar vacío para conservarla');openModal('Editar usuario',html,o=>api(`/users/${id}`,{method:'PUT',body:JSON.stringify(o)}));fillModal({full_name:u.full_name,role:u.role});};
window.deleteUser=async id=>{if(!confirm('¿Eliminar definitivamente esta cuenta?'))return;try{await api(`/users/${id}`,{method:'DELETE'});notify('Usuario eliminado.');await loadUsers();}catch(e){notify(e.message);}};

// Preferencia visual persistente: tema oscuro / claro.
const savedTheme=localStorage.getItem('systrack_theme')||'dark';
document.documentElement.dataset.theme=savedTheme;
function refreshThemeButton(){const light=document.documentElement.dataset.theme==='light';$('#themeIcon').textContent=light?'☾':'☼';$('#themeToggle').title=light?'Cambiar a tema oscuro':'Cambiar a tema claro';}
$('#themeToggle').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;localStorage.setItem('systrack_theme',next);refreshThemeButton();});
refreshThemeButton();
