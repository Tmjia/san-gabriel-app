const router = require('express').Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticar usuario y obtener token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, contrasena]
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: docente@sangabriel.edu.co
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: MiContrasena123
 *     responses:
 *       200:
 *         description: Login exitoso — devuelve el token JWT y los datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:     { type: string }
 *                     nombre: { type: string }
 *                     correo: { type: string }
 *                     rol:    { type: string, enum: [administrador, coordinador, docente, acudiente] }
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;

    // En producción esto consulta la base de datos
    // Para demo, usamos un usuario hardcodeado
    const usuarioDemo = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      nombre: 'Carlos Docente',
      correo: 'docente@sangabriel.edu.co',
      contrasenaHash: await bcrypt.hash('demo1234', 12),
      rol: 'docente'
    };

    if (correo !== usuarioDemo.correo) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuarioDemo.contrasenaHash);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuarioDemo.id, correo: usuarioDemo.correo, rol: usuarioDemo.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      token,
      usuario: {
        id:     usuarioDemo.id,
        nombre: usuarioDemo.nombre,
        correo: usuarioDemo.correo,
        rol:    usuarioDemo.rol
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
