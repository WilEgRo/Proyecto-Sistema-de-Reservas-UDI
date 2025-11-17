import { useState, useEffect} from "react";
import api from "../services/api";

const PanelDocente = () => {
  const [tab, setTab] = useState<'MIS_RESERVAS' | 'NUEVA'>('NUEVA');
  const [resources, setResources] = useState<any[]>([]);
  const [myReservations, setMyReservations] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    recurso: '',
    fechaInicio: '', // 'YYYY-MM-DDTHH:mm'
    fechaFin: '',
    proposito: ''
  });

  useEffect(() => {
    loadResources();
    loadMyReservations();
  }, []);

  const loadResources = async () => {
    const res = await api.get('/resources');
    // Solo mostramos recursos disponibles
    setResources(res.data.filter((r: any) => r.estado === 'DISPONIBLE'));
  };

  const loadMyReservations = async () => {
    const res = await api.get('/reservations');
    setMyReservations(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reservations', form);
      alert("Solicitud enviada (Pendiente de aprobación)");
      setForm({ recurso: '', fechaInicio: '', fechaFin: '', proposito: '' });
      loadMyReservations();
      setTab('MIS_RESERVAS');
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al reservar");
    }
  };

  return (
    <div style={{padding: 20}}>
       <div style={{marginBottom: 20}}>
         <button onClick={()=>setTab('NUEVA')} style={{marginRight:10}}>Nueva Reserva</button>
         <button onClick={()=>setTab('MIS_RESERVAS')}>Mis Reservas</button>
       </div>

       {tab === 'NUEVA' && (
         <div style={{maxWidth: 500}}>
           <h3>Solicitar Recurso</h3>
           <form onSubmit={handleSubmit}>
             <div style={{marginBottom: 10}}>
               <label>Recurso:</label>
               <select value={form.recurso} onChange={e=>setForm({...form, recurso: e.target.value})} required style={{width:'100%', padding: 8}}>
                 <option value="">Seleccione...</option>
                 {resources.map(r => <option key={r._id} value={r._id}>{r.nombre} ({r.tipo})</option>)}
               </select>
             </div>
             <div style={{marginBottom: 10}}>
               <label>Inicio (Fecha y Hora):</label>
               <input type="datetime-local" value={form.fechaInicio} onChange={e=>setForm({...form, fechaInicio: e.target.value})} required style={{width:'100%', padding: 8}} />
             </div>
             <div style={{marginBottom: 10}}>
               <label>Fin (Fecha y Hora):</label>
               <input type="datetime-local" value={form.fechaFin} onChange={e=>setForm({...form, fechaFin: e.target.value})} required style={{width:'100%', padding: 8}} />
             </div>
             <div style={{marginBottom: 10}}>
               <label>Propósito:</label>
               <textarea value={form.proposito} onChange={e=>setForm({...form, proposito: e.target.value})} required style={{width:'100%', padding: 8}} />
             </div>
             <button type="submit" style={{padding: 10, width:'100%', background:'#007bff', color:'white', border:'none'}}>Enviar Solicitud</button>
           </form>
         </div>
       )}

       {tab === 'MIS_RESERVAS' && (
         <table border={1} style={{width:'100%', borderCollapse:'collapse'}}>
           <thead><tr><th>Recurso</th><th>Inicio</th><th>Fin</th><th>Estado</th></tr></thead>
           <tbody>
             {myReservations.map(r => (
               <tr key={r._id}>
                 <td>{r.recurso?.nombre}</td>
                 <td>{new Date(r.fechaInicio).toLocaleString()}</td>
                 <td>{new Date(r.fechaFin).toLocaleString()}</td>
                 <td><strong>{r.estado}</strong></td>
               </tr>
             ))}
           </tbody>
         </table>
       )}
    </div>
  );
};



export default PanelDocente;