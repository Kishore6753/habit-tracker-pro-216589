const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const { errorHandler } = require('./middleware/errors');

// Initialize express app
const app = express();

// CORS: allow React dev server (default http://localhost:3000) and configured origin.
// NOTE: set FRONTEND_ORIGIN to your deployed frontend URL.
const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGIN ? [process.env.FRONTEND_ORIGIN] : [])
    .concat(['http://localhost:3000'])
);

app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser tools (no origin) and allowed origins
    if (!origin || allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.set('trust proxy', true);

// Swagger UI with dynamic server URL
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use('/', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
