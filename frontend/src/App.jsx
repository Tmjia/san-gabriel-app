import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

import Login              from './pages/Login';
import DashboardDocente   from './pages/docente/DashboardDocente';
import RegistroNotas      from './pages/docente/RegistroNotas';
import AsistenciaGrupo    from './pages/docente/AsistenciaGrupo';
import DashboardAcudiente from './pages/acudiente/DashboardAcudiente';

/** Redirige al login si no hay sesión activa */
function RutaPrivada() {
  const { usuario } = useAuth();
  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Bloquea el acceso si el usuario no tiene el rol requerido */
function SoloRol({ roles }) {
  const { tieneRol } = useAuth();
  return tieneRol(roles) ? <Outlet /> : <Navigate to="/sin-acceso" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas privadas — requieren sesión */}
          <Route element={<RutaPrivada />}>

            {/* Docente */}
            <Route element={<SoloRol roles={['docente']} />}>
              <Route path="/docente"                      element={<DashboardDocente />} />
              <Route path="/docente/notas/:grupoId"       element={<RegistroNotas />} />
              <Route path="/docente/asistencia/:grupoId"  element={<AsistenciaGrupo />} />
            </Route>

            {/* Acudiente */}
            <Route element={<SoloRol roles={['acudiente']} />}>
              <Route path="/acudiente" element={<DashboardAcudiente />} />
            </Route>

          </Route>

          {/* Redirecciones */}
          <Route path="/"           element={<Navigate to="/login" replace />} />
          <Route path="/sin-acceso" element={<p style={{padding:'2rem'}}>Sin acceso — contacte al administrador.</p>} />
          <Route path="*"           element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
