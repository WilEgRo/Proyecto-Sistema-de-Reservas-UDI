import React, { useState, useEffect, type CSSProperties } from 'react';
import api from '../services/api';

// --- Definición de Tipos ---
// Tipo para el rol
type UserRole = 'ADMIN' | 'GESTOR' | 'DOCENTE';

// Interfaz para el usuario (como lo recibimos del backend)
interface User {
  _id: string;
  username: string;
  role: UserRole;
  role2: UserRole;
  active: boolean; // Nuevo campo
}

// --- Componente ---
const PanelAdmin = () => {
// --- Estados ---
const [users, setUsers] = useState<User[]>([]);
const [formData, setFormData] = useState({
  username: '',
  password: '',
  role: 'DOCENTE' as UserRole, // Rol por defecto en el formulario
  role2: 'DOCENTE' as UserRole,
});
const [loading, setLoading] = useState(true);

// --- Efecto para cargar usuarios al montar ---
useEffect(() => {
  fetchUsers();
}, []);

// --- Función para Cargar Usuarios ---
const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await api.get<User[]>('/users');
    setUsers(response.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

// --- Manejador para Crear Usuario ---
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Llamada a la API para crear usuario
    const response = await api.post<User>('/users', formData);
    
    // Añadir el nuevo usuario a la lista local (sin recargar)
    setUsers([...users, response.data]);
    
    // Limpiar formulario
    setFormData({ username: '', password: '', role: 'DOCENTE', role2: 'DOCENTE' });
  } catch (err: any) {
    console.error(err);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// --- Cambiar Rol y Estado (Active) ---
const handleUpdateUser = async (id: string, updates: Partial<User>) => {
  try {
    await api.patch(`/users/${id}`, updates);
    setUsers(users.map(u => u._id === id ? { ...u, ...updates } : u));
  } catch (err) { alert("Error al actualizar"); }
};

// --- Renderizado ---
if (loading) {
  return <div>Cargando usuarios...</div>;
  }

return (
    <div style={styles.container}>
      {/* Formulario Crear (Lado Izquierdo) */}
      <div style={styles.formContainer}>
        <h3 style={styles.heading}>Crear Usuario</h3>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre de Usuario:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Rol:</label>
            <select style={styles.select} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
              <option value="DOCENTE">Docente</option>
              <option value="GESTOR">Gestor de Recursos</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Segundo Rol:</label>
            <select style={styles.select} value={formData.role2} onChange={e => setFormData({...formData, role2: e.target.value as UserRole})}>
              <option value="DOCENTE">Docente</option>
              <option value="GESTOR">Gestor de Recursos</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <button type="submit" style={styles.button}>Crear</button>
        </form>
      </div>

      {/* Lista Usuarios (Lado Derecho) */}
      <div style={styles.listContainer}>
        <h3 style={styles.heading}>Usuarios del Sistema</h3>
        <table style={styles.table}>
          <thead>
            <tr><th>Usuario</th><th>Rol</th><th>Rol2</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={styles.td}>{u.username}</td>
                <td style={styles.td}>
                  <select 
                    value={u.role} 
                    onChange={(e) => handleUpdateUser(u._id, { role: e.target.value as UserRole })}
                    style={styles.selectCompact}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="GESTOR">GESTOR</option>
                    <option value="DOCENTE">DOCENTE</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <select 
                    value={u.role2}
                    onChange={(e) => handleUpdateUser(u._id, { role2: e.target.value as UserRole })}
                    style={styles.selectCompact}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="GESTOR">GESTOR</option>
                    <option value="DOCENTE">DOCENTE</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <span style={u.active ? styles.tagGreen : styles.tagRed}>
                    {u.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={styles.td}>
                  <button 
                    onClick={() => handleUpdateUser(u._id, { active: !u.active })}
                    style={u.active ? styles.btnDesactivar : styles.btnActivar}
                  >
                    {u.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Objeto de Estilos ---
const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    gap: "2rem",
    maxWidth: 1200,
    margin: "2.5rem auto",
    fontFamily:
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  formContainer: {
    flex: 1,
    padding: "1.5rem",
    borderRadius: 12,
    background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,255,0.95))",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
    border: "1px solid rgba(16,24,40,0.04)",
  },
  listContainer: {
    flex: 2,
    padding: "1.25rem",
    borderRadius: 12,
    background: "linear-gradient(180deg, #ffffff, #fbfbff)",
    boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
    border: "1px solid rgba(16,24,40,0.04)",
  },
  heading: {
    borderBottom: "2px solid rgba(99,102,241,0.18)",
    paddingBottom: "0.5rem",
    marginBottom: "1.25rem",
    color: "#0f172a",
    fontSize: 18,
    fontWeight: 700,
  },
  error: {
    color: "#7f1d1d",
    backgroundColor: "#ffefef",
    border: "1px solid #fca5a5",
    padding: "10px 12px",
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 13,
  },
  message: {
    color: "#064e3b",
    backgroundColor: "#ecfdf5",
    border: "1px solid #bbf7d0",
    padding: "10px 12px",
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: "14px",
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    color: "#0f172a",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "linear-gradient(180deg, #fff, #fbfbff)",
    outline: "none",
    boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
    fontSize: 14,
    transition: "box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "white",
    fontSize: 14,
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "0.2px",
    boxShadow: "0 8px 20px rgba(99,102,241,0.18)",
    transition: "transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
    color: "#0f172a",
  },
  th: {
    border: "1px solid rgba(15,23,42,0.06)",
    padding: "10px 12px",
    backgroundColor: "#f8fafc",
    textAlign: "left",
    fontWeight: 700,
  },
  td: {
    border: "1px solid rgba(15,23,42,0.04)",
    padding: "10px 12px",
    verticalAlign: "middle",
  },
  selectCompact: { 
    padding: '4px', 
    borderRadius: '4px' 
  },
  tagGreen: { 
    background: '#dcfce7', 
    color: '#166534', 
    padding: '2px 6px', 
    borderRadius: '4px', 
    fontSize: '0.8rem' 
  },
  tagRed: { 
    background: '#fee2e2', 
    color: '#991b1b', 
    padding: '2px 6px', 
    borderRadius: '4px', 
    fontSize: '0.8rem' 
  },
  btnActivar: { 
    background: '#22c55e', 
    color: 'white', 
    border: 'none', 
    padding: '4px 8px', 
    borderRadius: '4px', 
    cursor: 'pointer' 
  },
  btnDesactivar: { 
    background: '#ef4444', 
    color: 'white', 
    border: 'none', 
    padding: '4px 8px', 
    borderRadius: '4px', 
    cursor: 'pointer' 
  }
};


export default PanelAdmin;