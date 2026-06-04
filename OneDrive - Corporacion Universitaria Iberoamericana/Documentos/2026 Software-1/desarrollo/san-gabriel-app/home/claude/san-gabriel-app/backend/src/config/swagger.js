const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'San Gabriel API',
      version: '1.0.0',
      description: 'API REST para el sistema de gestión académica de la Institución Educativa San Gabriel',
      contact: {
        name: 'Equipo de desarrollo',
        email: 'dev@sangabriel.edu.co'
      }
    },
    servers: [
      { url: 'http://localhost:3001/api/v1', description: 'Desarrollo local' },
      { url: 'https://api.sangabriel.edu.co/api/v1', description: 'Producción' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Nota: {
          type: 'object',
          properties: {
            id:          { type: 'string', format: 'uuid' },
            valor:       { type: 'number', minimum: 1.0, maximum: 5.0 },
            materia:     { type: 'string' },
            periodo:     { type: 'string' },
            estado:      { type: 'string', enum: ['borrador', 'en_revision', 'aprobada', 'devuelta'] },
            observacion: { type: 'string' }
          }
        },
        NuevaNota: {
          type: 'object',
          required: ['materiaId', 'periodoId', 'valor'],
          properties: {
            materiaId: { type: 'string', format: 'uuid' },
            periodoId: { type: 'string', format: 'uuid' },
            valor:     { type: 'number', minimum: 1.0, maximum: 5.0 },
            observacion: { type: 'string' }
          }
        },
        RespuestaNotas: {
          type: 'object',
          properties: {
            estudianteId: { type: 'string' },
            nombre:       { type: 'string' },
            notas:        { type: 'array', items: { '$ref': '#/components/schemas/Nota' } }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerSpec };
