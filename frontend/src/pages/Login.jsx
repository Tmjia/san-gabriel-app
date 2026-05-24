import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RUTA_POR_ROL = {
  docente:       '/docente',
  coordinador:   '/coordinador',
  administrador: '/admin/usuarios',
  acudiente:     '/acudiente',
};

export default function Login() {
  const [correo,    setCorreo   ] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { login, cargandoAuth, errorAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await login(correo, contrasena);
    if (resultado.exito) {
      const u = JSON.parse(localStorage.getItem('usuario'));
      navigate(RUTA_POR_ROL[u.rol] || '/login', { replace: true });
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>I.E. San Gabriel</h1>
        <p style={styles.subtitulo}>Portal Académico</p>
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.campo}>
            <label style={styles.label}>Correo institucional</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="correo@sangabriel.edu.co"
              required
              autoFocus
              style={styles.input}
            />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {errorAuth && (
            <p role="alert" style={styles.error}>{errorAuth}</p>
          )}
          <button
            type="submit"
            disabled={cargandoAuth || !correo || !contrasena}
            style={styles.boton}
          >
            {cargandoAuth ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  main:     { minHeight:'100vh', display:'flex', alignItems:'center',
              justifyContent:'center', background:'#f0f4f8' },
  card:     { background:'#fff', borderRadius:'12px', padding:'2.5rem',
              width:'100%', maxWidth:'400px', boxShadow:'0 4px 20px rgba(0,0,0,.1)' },
  titulo:   { margin:'0 0 .25rem', color:'#1F3864', fontSize:'1.6rem' },
  subtitulo:{ margin:'0 0 2rem', color:'#666', fontSize:'.95rem' },
  campo:    { marginBottom:'1.25rem' },
  label:    { display:'block', marginBottom:'.4rem', fontWeight:600,
              color:'#333', fontSize:'.9rem' },
  input:    { width:'100%', padding:'.65rem .75rem', border:'1.5px solid #ddd',
              borderRadius:'8px', fontSize:'1rem', boxSizing:'border-box',
              outline:'none', transition:'border .2s' },
  error:    { color:'#c0392b', background:'#fdecea', padding:'.6rem .8rem',
              borderRadius:'6px', marginBottom:'1rem', fontSize:'.9rem' },
  boton:    { width:'100%', padding:'.8rem', background:'#1F3864', color:'#fff',
              border:'none', borderRadius:'8px', fontSize:'1rem', fontWeight:600,
              cursor:'pointer', transition:'background .2s' },
};
