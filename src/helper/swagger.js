/**
 * Swagger configuration for API documentation
 */
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDocs = (app, port) => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'REST API Documentation',
                version: '1.0.0',
                description: 'A comprehensive REST API built with Express.js and MongoDB',
                contact: {
                    name: 'API Support',
                    email: 'support@example.com',
                },
            },
            servers: [
                {
                    url: `http://localhost:${port}`,
                    description: 'Development server',
                },
            ],
            components: {
                schemas: {
                    Error: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false,
                            },
                            message: {
                                type: 'string',
                                example: 'Error message',
                            },
                        },
                    },
                    Success: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                                example: 'Operation successful',
                            },
                        },
                    },
                },
            },
        },
        apis: ['./src/routes/*.js'], // Chemin vers les fichiers contenant les annotations Swagger
    };

    const specs = swaggerJsdoc(options);
    
    // Swagger UI setup
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'REST API Documentation',
    }));

    console.log(`[INFO] ${new Date().toISOString()} - Swagger docs available at http://localhost:${port}/api-docs`);
};

module.exports = swaggerDocs;