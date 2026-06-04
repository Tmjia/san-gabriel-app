const router = require('express').Router();
const { verificarToken, soloRoles } = require('../middleware/auth');

/**
 * @openapi
 * /estudiantes/{estudianteId}/notas:
 *   get:
 *     summary: Obtener las notas de un estudiante
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: estudianteId
 *         in: path
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID único del estudiante
 *       - name: periodoId
 *         in: query
 *         required: false
 *         schema: { type: string }
 *         description: Filtrar por periodo académico
 *     responses:
 *       200:
 *         description: Lista de notas del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaNotas'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Estudiante no encontrado
 *   post:
 *     summary: Registrar una nota para el estudiante
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevaNota'
 *     responses:
 *       201:
 *         description: Nota registrada correctamente (estado inicial: borrador)
 *       400:
 *         description: Datos inválidos (nota fuera de rango, periodo cerrado)
 */
router.get(
  '/:estudianteId/notas',
  verificarToken,
  soloRoles(['administrador', 'coordinador', 'docente', 'acudiente']),
  async (req, res, next) => {
    try {
      const { estudianteId } = req.params;
      const { periodoId } = req.query;

      // Demo: datos estáticos — en producción consulta Sequelize
      const notas = [
        { id: '1', materia: 'Matemáticas', valor: 4.2, periodo: '1', estado: 'aprobada', observacion: '' },
        { id: '2', materia: 'Español',     valor: 3.8, periodo: '1', estado: 'aprobada', observacion: '' },
        { id: '3', materia: 'Ciencias',    valor: 4.5, periodo: '1', estado: 'aprobada', observacion: '' },
      ].filter(n => !periodoId || n.periodo === periodoId);

      res.json({
        estudianteId,
        nombre: 'Valentina Ospina Ruiz',
        notas,
        promedio: (notas.reduce((s, n) => s + n.valor, 0) / notas.length).toFixed(1)
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:estudianteId/notas',
  verificarToken,
  soloRoles(['docente']),
  async (req, res, next) => {
    try {
      const { valor, materiaId, periodoId, observacion } = req.body;

      if (!valor || valor < 1.0 || valor > 5.0) {
        return res.status(400).json({ mensaje: 'La nota debe estar entre 1.0 y 5.0' });
      }

      // En producción: await Nota.create({ ... })
      res.status(201).json({
        mensaje: 'Nota registrada correctamente',
        nota: {
          id: Date.now().toString(),
          estudianteId: req.params.estudianteId,
          materiaId,
          periodoId,
          valor,
          observacion: observacion || '',
          estado: 'borrador',
          docente: req.usuario.id,
          fechaRegistro: new Date().toISOString()
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @openapi
 * /notas/{notaId}/estado:
 *   patch:
 *     summary: Cambiar el estado de una nota (aprobar o devolver)
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: notaId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [estado]
 *             properties:
 *               estado: { type: string, enum: [aprobada, devuelta] }
 *               motivo: { type: string, description: Requerido si estado es devuelta }
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       403:
 *         description: Solo el coordinador puede cambiar el estado de las notas
 */

module.exports = router;
