import React, { useState } from 'react';

const S = {
  page: { margin: 0, padding: 0, minHeight: '100vh', background: '#080810', fontFamily: 'sans-serif', color: '#e8e8f0' },
  wrap: { maxWidth: '680px', margin: '0 auto', padding: '56px 24px' },
  title: { fontSize: '42px', fontWeight: 800, margin: 0, color: '#fff' },
  sub: { color: '#5050a0', marginTop: '6px', fontSize: '14px' },
  card: { background: '#13131c', border: '1px solid #22222f', borderRadius: '14px', padding: '24px', marginTop: '32px' },
  label: { fontSize: '12px', fontWeight: 600, color: '#5050a0', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' },
  row: { display: 'flex', gap: '10px' },
  input: { flex: 1, background: '#1a1a28', border: '1px solid #2a2a40', borderRadius: '8px', padding: '10px 14px', color: '#e8e8f0', fontSize: '14px', outline: 'none' },
  btn: { background: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  btnLoad: { background: '#13131c', color: '#6c5ce7', border: '1px solid #6c5ce7', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '24px' },
  list: { listStyle: 'none', margin: '24px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' },
  item: { background: '#1a1a28', border: '1px solid #22222f', borderLeft: '3px solid #6c5ce7', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '34px', height: '34px', borderRadius: '50%', background: '#6c5ce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 },
  name: { flex: 1, fontSize: '15px' },
  id: { fontSize: '12px', color: '#5050a0' },
  del: { background: 'transparent', border: 'none', color: '#f77c7c', cursor: 'pointer', fontSize: '16px', padding: '4px 8px', borderRadius: '6px' },
  err: { background: '#1f1010', border: '1px solid #f77c7c33', borderRadius: '8px', padding: '12px', color: '#f77c7c', fontSize: '13px', marginTop: '12px' },
  ok: { background: '#101f10', border: '1px solid #4caf8833', borderRadius: '8px', padding: '12px', color: '#4caf88', fontSize: '13px', marginTop: '12px' },
};

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cargado, setCargado] = useState(false);

  const mostrar = (texto, tipo = 'ok') => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg(null), 3000);
  };

  const cargar = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/usuarios');
      setUsuarios(await r.json());
      setCargado(true);
    } catch { mostrar('Error al cargar usuarios', 'err'); }
    setLoading(false);
  };

  const agregar = async () => {
    if (!nombre.trim()) return mostrar('Escribe un nombre', 'err');
    try {
      const r = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
      });
      const nuevo = await r.json();
      setUsuarios(prev => [...prev, nuevo]);
      setNombre('');
      mostrar(`✅ ${nuevo.nombre} agregado`);
    } catch { mostrar('Error al agregar', 'err'); }
  };

  const eliminar = async (id, nombre) => {
    try {
      await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      setUsuarios(prev => prev.filter(u => u.id !== id));
      mostrar(`🗑️ ${nombre} eliminado`);
    } catch { mostrar('Error al eliminar', 'err'); }
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <h1 style={S.title}>Lista de Usuarios</h1>
        <p style={S.sub}>React + Express + MySQL — Dockerizado</p>

        <div style={S.card}>
          <label style={S.label}>Agregar usuario</label>
          <div style={S.row}>
            <input
              style={S.input}
              placeholder="Nombre del usuario..."
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && agregar()}
            />
            <button style={S.btn} onClick={agregar}>Agregar</button>
          </div>
          {msg && <div style={msg.tipo === 'ok' ? S.ok : S.err}>{msg.texto}</div>}
        </div>

        <button style={S.btnLoad} onClick={cargar}>
          {loading ? 'Cargando...' : '↻ Cargar usuarios'}
        </button>

        {cargado && usuarios.length === 0 && (
          <p style={{ color: '#5050a0', marginTop: '24px' }}>No hay usuarios.</p>
        )}

        {usuarios.length > 0 && (
          <ul style={S.list}>
            {usuarios.map(u => (
              <li key={u.id} style={S.item}>
                <div style={S.avatar}>{u.nombre.charAt(0).toUpperCase()}</div>
                <span style={S.name}>{u.nombre}</span>
                <span style={S.id}>#{usuarios.indexOf(u) + 1}</span>
                <button style={S.del} onClick={() => eliminar(u.id, u.nombre)} title="Eliminar">🗑️</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}