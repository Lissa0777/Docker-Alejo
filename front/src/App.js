import React, { useState } from 'react';

const styles = {
  body: {
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    background: '#0a0a0f',
    fontFamily: "'DM Sans', sans-serif",
    color: '#e8e8f0',
  },
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '60px 24px',
  },
  title: {
    fontFamily: "sans-serif",
    fontSize: '48px',
    fontWeight: 800,
    margin: 0,
    color: '#fff',
    lineHeight: 1.1,
  },
  subtitle: {
    color: '#6060a0',
    marginTop: '8px',
    fontSize: '15px',
  },
  btn: {
    background: '#7c6af7',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '32px',
    marginBottom: '32px',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  item: {
    background: '#16161a',
    border: '1px solid #2a2a35',
    borderLeft: '3px solid #7c6af7',
    borderRadius: '10px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#7c6af7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
    flexShrink: 0,
  },
  id: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#6060a0',
  },
  error: {
    background: '#2a1a1a',
    border: '1px solid #f77c7c44',
    borderRadius: '10px',
    padding: '16px',
    color: '#f77c7c',
    fontSize: '14px',
  },
};

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cargado, setCargado] = useState(false);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
      setCargado(true);
    } catch (err) {
      setError('No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>Lista de Usuarios</h1>
        <p style={styles.subtitle}>React + Express + MySQL — Dockerizado</p>

        <button style={styles.btn} onClick={cargarUsuarios}>
          {loading ? 'Cargando...' : 'Cargar usuarios'}
        </button>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        {cargado && usuarios.length === 0 && (
          <p style={{ color: '#6060a0' }}>No hay usuarios.</p>
        )}

        {usuarios.length > 0 && (
          <ul style={styles.list}>
            {usuarios.map(u => (
              <li key={u.id} style={styles.item}>
                <div style={styles.avatar}>
                  {u.nombre.charAt(0).toUpperCase()}
                </div>
                <span>{u.nombre}</span>
                <span style={styles.id}>#{u.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
