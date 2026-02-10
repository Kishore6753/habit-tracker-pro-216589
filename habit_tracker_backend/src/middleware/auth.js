const jwt = require('jsonwebtoken');
const { ApiError } = require('./errors');

/**
 * Extract bearer token from Authorization header or cookie.
 */
function getToken(req) {
  const auth = req.headers.authorization;
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7);
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

/**
 * Express middleware: require a valid JWT.
 */
function requireAuth(req, _res, next) {
  const token = getToken(req);
  if (!token) return next(new ApiError(401, 'Unauthorized'));

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new ApiError(500, 'Server misconfigured: JWT_SECRET is not set'));
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload; // { sub, email }
    return next();
  } catch (_e) {
    return next(new ApiError(401, 'Invalid token'));
  }
}

module.exports = {
  requireAuth,
};
