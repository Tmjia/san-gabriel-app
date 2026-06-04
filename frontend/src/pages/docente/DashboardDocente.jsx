import { useAuth } from '../../hooks/useAuth';

export default function DashboarddelDocente() {
  const { usuario, logout } = useAuth();
  return (
    <main style={{padding:'2rem', fontFamily:'sans-serif'}}>
      <h1>Dashboard del Docente</h1>
      <p>Bienvenido, <strong>{usuario?.nombre}</strong> | Rol: {usuario?.rol}</p>
      <p style={{color:'#666', marginBottom:'2rem'}}>
        Módulo en desarrollo — los componentes completos están documentados en el informe.
      </p>
      <button onClick={logout}
        style={{padding:'.6rem 1.2rem', background:'#c0392b', color:'#fff',
                border:'none', borderRadius:'6px', cursor:'pointer'}}>
        Cerrar sesión
      </button>
    </main>
  );
}
