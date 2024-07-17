const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'News and Blog Post API',
      version: '1.0.0',
      description: "SEA AWARENESS is an application that provides the latest news information on the readiness of different South East Asian countries, while also spreading awareness into the hardships of the these countries.",
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./controllers/*.js', './models/*.js'], // files containing annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };

