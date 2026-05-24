const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./src/config/swagger');
const { sequelize }   = require('./src/config/database');

const authRoutes       = require('./src/routes/auth');
const notasRoutes      = require('./src/routes/notas');
const asistenciaRoutes = require('./src/routes/asistencia');

const app = express();

// Seguridad y parseo
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Documentación interactiva del API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoints de la API versionada
app.use('/api/v1/auth',        authRoutes);
app.use('/api/v1/estudiantes', notasRoutes);
app.use('/api/v1/grupos',      asistenciaRoutes);

// Endpoint de salud para monitoreo
app.get('/health', (_, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 3001;

sequelize.authenticate()
  .then(() => {
    console.log('✓ Conexión a PostgreSQL establecida');
    app.listen(PORT, () =>
      console.log(`✓ Servidor ejecutándose en http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('✗ Error de conexión a la base de datos:', err.message);
    process.exit(1);
  });
