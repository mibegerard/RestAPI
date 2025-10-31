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
        title: '🎾 Tennis Players REST API',
        version: '1.0.0',
        description:
          'API REST complète pour la gestion des joueurs de tennis avec analytics avancées',
        contact: {
          name: 'Gerard Mibe',
          email: 'mibekeumeni@gmail.com',
        },
        license: {
          name: 'ISC',
        },
      },
      servers: [
        {
          url: `http://localhost:${port}/api`,
          description: 'Development server',
        },
      ],
      components: {
        schemas: {
          // Player Schemas
          Player: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'ID unique du joueur',
                example: 52,
              },
              firstname: {
                type: 'string',
                description: 'Prénom du joueur',
                example: 'Novak',
              },
              lastname: {
                type: 'string',
                description: 'Nom de famille du joueur',
                example: 'Djokovic',
              },
              shortname: {
                type: 'string',
                description: 'Nom court unique',
                example: 'N.DJO',
              },
              sex: {
                type: 'string',
                enum: ['M', 'F'],
                description: 'Sexe du joueur',
                example: 'M',
              },
              country: {
                type: 'object',
                properties: {
                  picture: {
                    type: 'string',
                    description: 'URL du drapeau du pays',
                    example:
                      'https://i.eurosport.com/2013/11/15/1130863-18941711-800-450.jpg?w=1050',
                  },
                  code: {
                    type: 'string',
                    description: 'Code pays ISO',
                    example: 'SRB',
                  },
                },
              },
              picture: {
                type: 'string',
                description: 'URL de la photo du joueur',
                example: 'https://i.eurosport.com/2013/11/15/1130863-18941711-800-450.jpg?w=1050',
              },
              data: {
                type: 'object',
                properties: {
                  rank: {
                    type: 'integer',
                    description: 'Classement mondial',
                    example: 2,
                  },
                  points: {
                    type: 'integer',
                    description: 'Points ATP/WTA',
                    example: 2542,
                  },
                  weight: {
                    type: 'integer',
                    description: 'Poids en kg',
                    example: 80000,
                  },
                  height: {
                    type: 'integer',
                    description: 'Taille en cm',
                    example: 188,
                  },
                  age: {
                    type: 'integer',
                    description: 'Âge du joueur',
                    example: 31,
                  },
                  last: {
                    type: 'array',
                    description: 'Derniers résultats (1=victoire, 0=défaite)',
                    items: {
                      type: 'integer',
                      enum: [0, 1],
                    },
                    example: [1, 1, 1, 1, 1],
                  },
                },
              },
            },
            required: ['firstname', 'lastname', 'shortname', 'sex', 'country', 'picture', 'data'],
          },
          PlayerInput: {
            type: 'object',
            properties: {
              firstname: {
                type: 'string',
                description: 'Prénom du joueur',
                example: 'Rafael',
              },
              lastname: {
                type: 'string',
                description: 'Nom de famille du joueur',
                example: 'Nadal',
              },
              shortname: {
                type: 'string',
                description: 'Nom court unique',
                example: 'R.NAD',
              },
              sex: {
                type: 'string',
                enum: ['M', 'F'],
                description: 'Sexe du joueur',
                example: 'M',
              },
              country: {
                type: 'object',
                properties: {
                  picture: { type: 'string' },
                  code: { type: 'string' },
                },
              },
              picture: {
                type: 'string',
                description: 'URL de la photo du joueur',
              },
              data: {
                type: 'object',
                properties: {
                  rank: { type: 'integer' },
                  points: { type: 'integer' },
                  weight: { type: 'integer' },
                  height: { type: 'integer' },
                  age: { type: 'integer' },
                  last: {
                    type: 'array',
                    items: { type: 'integer', enum: [0, 1] },
                  },
                },
              },
            },
            required: ['firstname', 'lastname', 'shortname', 'sex', 'country', 'picture', 'data'],
          },
          PlayerPartial: {
            type: 'object',
            description: 'Schéma pour mise à jour partielle - tous les champs sont optionnels',
            properties: {
              firstname: { type: 'string' },
              lastname: { type: 'string' },
              shortname: { type: 'string' },
              sex: { type: 'string', enum: ['M', 'F'] },
              country: {
                type: 'object',
                properties: {
                  picture: { type: 'string' },
                  code: { type: 'string' },
                },
              },
              picture: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  rank: { type: 'integer' },
                  points: { type: 'integer' },
                  weight: { type: 'integer' },
                  height: { type: 'integer' },
                  age: { type: 'integer' },
                  last: {
                    type: 'array',
                    items: { type: 'integer', enum: [0, 1] },
                  },
                },
              },
            },
          },

          // Analytics Schemas
          CountryStats: {
            type: 'object',
            properties: {
              country: {
                type: 'string',
                description: 'Code pays',
                example: 'ESP',
              },
              totalPlayers: {
                type: 'integer',
                description: 'Nombre total de joueurs',
                example: 15,
              },
              avgWinRate: {
                type: 'number',
                description: 'Taux de victoire moyen (%)',
                example: 68.5,
              },
              totalMatches: {
                type: 'integer',
                description: 'Total de matchs joués',
                example: 142,
              },
              totalWins: {
                type: 'integer',
                description: 'Total de victoires',
                example: 89,
              },
            },
          },
          BMIAnalysis: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Catégorie BMI',
                example: 'Normal',
              },
              range: {
                type: 'string',
                description: 'Plage BMI',
                example: '18.5-24.9',
              },
              count: {
                type: 'integer',
                description: 'Nombre de joueurs dans cette catégorie',
                example: 45,
              },
              percentage: {
                type: 'number',
                description: 'Pourcentage du total',
                example: 67.2,
              },
              avgBMI: {
                type: 'number',
                description: 'BMI moyen de la catégorie',
                example: 22.1,
              },
            },
          },
          HeightStats: {
            type: 'object',
            properties: {
              min: {
                type: 'integer',
                description: 'Taille minimale (cm)',
                example: 165,
              },
              max: {
                type: 'integer',
                description: 'Taille maximale (cm)',
                example: 211,
              },
              average: {
                type: 'number',
                description: 'Taille moyenne (cm)',
                example: 185.7,
              },
              median: {
                type: 'number',
                description: 'Taille médiane (cm)',
                example: 185.0,
              },
            },
          },

          // Response Schemas
          SuccessResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },
              message: {
                type: 'string',
                example: 'Opération réussie',
              },
              data: {
                type: 'object',
                description: 'Données retournées',
              },
            },
          },
          PaginatedResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },
              data: {
                type: 'array',
                items: { $ref: '#/components/schemas/Player' },
              },
              pagination: {
                type: 'object',
                properties: {
                  currentPage: { type: 'integer', example: 1 },
                  totalPages: { type: 'integer', example: 5 },
                  totalCount: { type: 'integer', example: 67 },
                  hasNext: { type: 'boolean', example: true },
                  hasPrev: { type: 'boolean', example: false },
                },
              },
            },
          },

          // Error Schemas
          ValidationError: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false,
              },
              statusCode: {
                type: 'integer',
                example: 400,
              },
              message: {
                type: 'string',
                example: 'Données de validation invalides',
              },
            },
          },
          NotFoundError: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false,
              },
              statusCode: {
                type: 'integer',
                example: 404,
              },
              message: {
                type: 'string',
                example: 'Joueur avec ID 999 introuvable',
              },
            },
          },
          ConflictError: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false,
              },
              statusCode: {
                type: 'integer',
                example: 409,
              },
              message: {
                type: 'string',
                example: 'Un joueur avec cet ID existe déjà',
              },
            },
          },
          ServerError: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false,
              },
              statusCode: {
                type: 'integer',
                example: 500,
              },
              message: {
                type: 'string',
                example: 'Erreur interne du serveur',
              },
            },
          },
        },
      },
    },
    apis: ['./src/swagger/*.js'], // Chemin vers les fichiers de documentation Swagger
  };

  const specs = swaggerJsdoc(options);

  // Swagger UI setup
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'REST API Documentation',
    }),
  );

  console.log(
    `[INFO] ${new Date().toISOString()} - Swagger docs available at http://localhost:${port}/api-docs`,
  );
};

module.exports = swaggerDocs;
