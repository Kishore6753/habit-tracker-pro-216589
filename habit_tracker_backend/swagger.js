const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Habit Tracker API',
      version: '1.0.0',
      description: 'Express REST API for Habit Tracker (auth, habits, completions, progress, reminders, analytics, export).',
    },
    tags: [
      { name: 'System', description: 'Service endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Habits', description: 'Habit CRUD & listing' },
      { name: 'Completions', description: 'Mark/unmark completions' },
      { name: 'Progress', description: 'Streaks and completion percentages' },
      { name: 'Calendar', description: 'Calendar views' },
      { name: 'Reminders', description: 'Reminders CRUD (scheduler placeholder)' },
      { name: 'Analytics', description: 'Aggregate analytics' },
      { name: 'Search', description: 'Search habits' },
      { name: 'Export', description: 'Export reports' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // JSDoc annotations live in route files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
