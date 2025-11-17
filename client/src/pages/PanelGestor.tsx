import { useState, useEffect} from 'react';
import api from '../services/api';

// Interfaces adaptadas
interface Resource { _id: string; nombre: string; tipo: 'SALA' | 'EQUIPO'; estado: string; incidencias: string[]; }
interface Reservation { _id: string; solicitante: { username: string }; recurso: { nombre: string }; fechaInicio: string; fechaFin: string; estado: string; proposito: string; }

const PanelGestor = () => {
  const [tab, setTab] = useState<'RECURSOS' | 'SOLICITUDES'>('SOLICITUDES');
  const [resources, setResources] = useState<Resource[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // Formulario Recursos
  const [resForm, setResForm] = useState({ nombre: '', tipo: 'SALA', capacidad: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [resRec, resRes] = await Promise.all([
        api.get('/resources'),
        api.get('/reservations') // Trae todas
      ]);
      setResources(resRec.data);
      setReservations(resRes.data);
    } catch (e) { console.error(e); }
  };

  // --- Crear Recurso ---
  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/resources', resForm);
      alert("Recurso creado");
      loadData();
    } catch (e) { alert("Error al crear"); }
  };

  // --- Aprobar/Rechazar Reserva ---
  const handleStatus = async (id: string, estado: 'APROBADA' | 'RECHAZADA') => {
    try {
      await api.patch(`/reservations/${id}`, { estado });
      loadData();
    } catch (e) { alert("Error al actualizar"); }
  };

  // --- Reportar Incidencia ---
  const handleIncidence = async (id: string) => {
    const nota = prompt("Describa el daño o incidencia:");
    if (!nota) return;
    try {
      await api.patch(`/resources/${id}`, { estado: 'FUERA_DE_SERVICIO', nuevaIncidencia: nota });
      loadData();
    } catch (e) { alert("Error al reportar"); }
  };

  return (
    <div style={{padding: '20px'}}>
      <div style={{marginBottom: '20px'}}>
        <button onClick={()=>setTab('SOLICITUDES')} style={{marginRight:10}}>Solicitudes Pendientes</button>
        <button onClick={()=>setTab('RECURSOS')}>Inventario de Recursos</button>
      </div>

      {tab === 'SOLICITUDES' && (
        <div>
          <h3>Reservas Pendientes</h3>
          <table border={1} style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead><tr><th>Docente</th><th>Recurso</th><th>Horario</th><th>Propósito</th><th>Acciones</th></tr></thead>
            <tbody>
              {reservations.filter(r => r.estado === 'PENDIENTE').map(r => (
                <tr key={r._id}>
                  <td>{r.solicitante?.username}</td>
                  <td>{r.recurso?.nombre}</td>
                  <td>{new Date(r.fechaInicio).toLocaleString()} - {new Date(r.fechaFin).toLocaleTimeString()}</td>
                  <td>{r.proposito}</td>
                  <td>
                    <button onClick={()=>handleStatus(r._id, 'APROBADA')} style={{color:'green'}}>Aprobar</button>
                    <button onClick={()=>handleStatus(r._id, 'RECHAZADA')} style={{color:'red', marginLeft:5}}>Rechazar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'RECURSOS' && (
        <div style={{display:'flex', gap: 20}}>
          <div style={{flex:1}}>
             <h3>Crear Recurso</h3>
             <form onSubmit={handleCreateResource}>
               <input placeholder="Nombre (ej. Sala 1)" value={resForm.nombre} onChange={e=>setResForm({...resForm, nombre: e.target.value})} required style={{display:'block', marginBottom:10, width:'100%'}} />
               <select value={resForm.tipo} onChange={e=>setResForm({...resForm, tipo: e.target.value as any})} style={{display:'block', marginBottom:10, width:'100%'}}>
                 <option value="SALA">Sala</option>
                 <option value="EQUIPO">Equipo</option>
               </select>
               <button type="submit">Guardar</button>
             </form>
          </div>
          <div style={{flex:2}}>
             <h3>Lista de Recursos</h3>
             <ul>
               {resources.map(r => (
                 <li key={r._id} style={{marginBottom: 10, padding: 10, border: '1px solid #ccc'}}>
                   <strong>{r.nombre}</strong> ({r.tipo}) - 
                   <span style={{color: r.estado==='DISPONIBLE'?'green':'red'}}> {r.estado}</span>
                   {r.estado === 'DISPONIBLE' && (
                     <button onClick={()=>handleIncidence(r._id)} style={{marginLeft:10, fontSize:'0.8rem'}}>Reportar Daño</button>
                   )}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelGestor;