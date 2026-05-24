import axios from 'axios';

/**
 * Instancia centralizada de Axios con:
 * - URL base del API configurada por variable de entorno
 * - Timeout de 10 segundos
 * - Interceptor de solicitud: adjunta el token JWT automáticamente
 * - Interceptor de respuesta: redirige al login si el token expira (401)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// ── Interceptor de solicitud: agregar token JWT ──────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Interceptor de respuesta: manejar errores globales ────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido: limpiar sesión y redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
