// const config = require('../config');

// function authMiddleware(req, res, next) {
//   const token = req.headers['x-api-token'] || req.headers.authorization || '';
//   if (!token) return res.status(401).json({ message: 'Missing API token' });
//   const bare = token.startsWith('Bearer ') ? token.slice(7) : token;
//   if (bare !== config.apiToken) return res.status(403).json({ message: 'Invalid token' });
//   return next();
// }

// module.exports = authMiddleware;



const config = require('../config');

module.exports = (req, res, next) => {
  // Якщо ми у середовищі тестування, пропускаємо перевірку (для зручності інтеграцій)
  if (process.env.NODE_ENV === 'test') {
    const header = req.headers['authorization'];
    if (!header || header !== `Bearer ${config.apiToken}`) {
      return res.status(401).json({ message: 'Missing or invalid API token (test)' });
    }
    return next();
  }

  const header = req.headers['authorization'];
  if (!header || header !== `Bearer ${config.apiToken}`) {
    return res.status(401).json({ message: 'Missing API token' });
  }

  next();
};
