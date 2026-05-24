import { createContext, useState, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

/**
 * Proveedor del contexto de autenticación.
 * Envuelve toda la aplicación en App.jsx para que cualquier componente
 * pueda acceder al estado de sesión mediante useContext(AuthContext)
 * o el hook personalizado useAuth().
 */
export function AuthProvider({ children }) {
  // Recuperar sesión previa al iniciar la aplicación
  const [usuario, setUsuario] = useState(() => {
    try {
      const stored = localStorage.getItem('usuario');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [cargandoAuth, setCargandoAuth] = useState(false);
  const [errorAuth,    setErrorAuth   ] = useState(null);

  const login = useCallback(async (correo, contrasena) => {
    setCargandoAuth(true);
    setErrorAuth(null);
    try {
      const { data } = await api.post('/auth/login', { correo, contrasena });
      localStorage.setItem('token',   data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      setUsuario(data.usuario);
      return { exito: true };
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Credenciales incorrectas';
      setErrorAuth(msg);
      return { exito: false, error: msg };
    } finally {
      setCargandoAuth(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setErrorAuth(null);
  }, []);

  /** Verifica si el usuario tiene uno o varios roles específicos */
  const tieneRol = useCallback((roles) => {
    if (!usuario) return false;
    const lista = Array.isArray(roles) ? roles : [roles];
    return lista.includes(usuario.rol);
  }, [usuario]);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, tieneRol,
                                   cargandoAuth, errorAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
