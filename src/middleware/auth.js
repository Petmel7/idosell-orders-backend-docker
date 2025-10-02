const config = require('../config');

function authMiddleware(req, res, next) {
  const token = req.headers['x-api-token'] || req.headers.authorization || '';
  if (!token) return res.status(401).json({ message: 'Missing API token' });
  const bare = token.startsWith('Bearer ') ? token.slice(7) : token;
  if (bare !== config.apiToken) return res.status(403).json({ message: 'Invalid token' });
  return next();
}

module.exports = authMiddleware;