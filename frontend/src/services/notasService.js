import api from './api';

/**
 * Capa de abstracción para todas las peticiones relacionadas con notas.
 * Los componentes llaman a estos métodos en lugar de usar api.get/post directamente,
 * lo que centraliza las URLs y facilita los cambios en el API.
 */
export const notasService = {
  /** Obtener notas de un estudiante, opcionalmente filtradas por periodo */
  obtener: (estudianteId, periodoId, signal) =>
    api.get(`/estudiantes/${estudianteId}/notas`,
      { params: { periodoId }, signal }),

  /** Registrar una nueva nota (estado inicial: borrador) */
  registrar: (estudianteId, datos) =>
    api.post(`/estudiantes/${estudianteId}/notas`, datos),

  /** Aprobar una nota (solo coordinador) */
  aprobar: (notaId) =>
    api.patch(`/notas/${notaId}/estado`, { estado: 'aprobada' }),

  /** Devolver una nota al docente con un motivo */
  devolver: (notaId, motivo) =>
    api.patch(`/notas/${notaId}/estado`, { estado: 'devuelta', motivo }),
};
