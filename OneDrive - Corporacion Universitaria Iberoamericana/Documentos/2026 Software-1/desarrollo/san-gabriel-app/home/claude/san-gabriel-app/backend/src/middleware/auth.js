const jwt = require('jsonwebtoken');

/**
 * Middleware: verifica que el request incluya un JWT válido.
 * Si el token es válido, adjunta el payload decodificado en req.usuario.
 */
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ mensaje: 'Token de acceso requerido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

/**
 * Middleware factory: verifica que el usuario tenga uno de los roles permitidos.
 * Se usa después de verificarToken.
 * @param {string[]} rolesPermitidos - Lista de roles con acceso al endpoint.
 */
function soloRoles(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: 'No tiene permisos para realizar esta acción'
      });
    }
    next();
  };
}

module.exports = { verificarToken, soloRoles };
