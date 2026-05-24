const router = require('express').Router();
const { verificarToken, soloRoles } = require('../middleware/auth');

/**
 * @openapi
 * /grupos/{grupoId}/asistencia:
 *   get:
 *     summary: Consultar registro de asistencia de un grupo en una fecha
 *     tags: [Asistencia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: grupoId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: fecha
 *         in: query
 *         required: false
 *         schema: { type: string, format: date }
 *         description: Formato YYYY-MM-DD. Por defecto es la fecha actual.
 *     responses:
 *       200:
 *         description: Registros de asistencia del grupo
 *   post:
 *     summary: Registrar la asistencia diaria del grupo
 *     tags: [Asistencia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fecha, registros]
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *               registros:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     estudianteId: { type: string }
 *                     estado:
 *                       type: string
 *                       enum: [presente, ausente, tarde]
 *     responses:
 *       201:
 *         description: Asistencia registrada. Si hay inasistencias consecutivas, se notifica al acudiente.
 */
router.get(
  '/:grupoId/asistencia',
  verificarToken,
  soloRoles(['administrador', 'coordinador', 'docente']),
  async (req, res, next) => {
    try {
      const { grupoId } = req.params;
      const fecha = req.query.fecha || new Date().toISOString().split('T')[0];

      res.json({
        grupoId,
        fecha,
        registros: [
          { estudianteId: '1', nombre: 'Valentina Ospina',  estado: 'presente' },
          { estudianteId: '2', nombre: 'Santiago Morales',  estado: 'ausente'  },
          { estudianteId: '3', nombre: 'Daniela Cifuentes', estado: 'presente' },
        ]
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:grupoId/asistencia',
  verificarToken,
  soloRoles(['docente']),
  async (req, res, next) => {
    try {
      const { fecha, registros } = req.body;

      if (!fecha || !Array.isArray(registros) || registros.length === 0) {
        return res.status(400).json({ mensaje: 'Fecha y registros son requeridos' });
      }

      const ausentes = registros.filter(r => r.estado === 'ausente');

      res.status(201).json({
        mensaje: 'Asistencia registrada correctamente',
        fecha,
        totalRegistros: registros.length,
        ausentes: ausentes.length,
        notificacionesEnviadas: ausentes.length // en producción envía correo con Nodemailer
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
