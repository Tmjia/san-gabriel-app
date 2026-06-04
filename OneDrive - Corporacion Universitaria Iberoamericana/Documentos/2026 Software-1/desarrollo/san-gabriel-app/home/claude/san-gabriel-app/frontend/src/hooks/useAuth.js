import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook personalizado que encapsula useContext(AuthContext).
 *
 * Lanza un error descriptivo si se usa fuera del AuthProvider,
 * lo que facilita detectar errores de configuración durante el desarrollo.
 *
 * Uso en cualquier componente:
 *   const { usuario, login, logout, tieneRol } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error(
      'useAuth() debe usarse dentro de un <AuthProvider>. ' +
      'Verifique que App.jsx envuelve la aplicación con <AuthProvider>.'
    );
  }
  return context;
}
