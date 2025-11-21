const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Super Servicios Express API',
      version: '1.0.0',
      description: 'API REST para gestión de taller automotriz - Sistema de citas, clientes, vehículos y servicios',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'admin@taller.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de Desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Mensaje de error',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Error de validación',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        Cliente: {
          type: 'object',
          properties: {
            id_cliente: {
              type: 'integer',
              example: 1,
            },
            nombre: {
              type: 'string',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@mail.com',
            },
            telefono: {
              type: 'string',
              example: '6441234567',
            },
            direccion: {
              type: 'string',
              example: 'Calle Principal #123',
            },
          },
        },
        ClienteInput: {
          type: 'object',
          required: ['nombre', 'email'],
          properties: {
            nombre: {
              type: 'string',
              example: 'Juan Pérez',
              minLength: 3,
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@mail.com',
            },
            telefono: {
              type: 'string',
              example: '6441234567',
            },
            direccion: {
              type: 'string',
              example: 'Calle Principal #123',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@taller.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'admin123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/api/**/*.js'], // Ruta a los archivos con anotaciones JSDoc
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
