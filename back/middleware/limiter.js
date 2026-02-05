const rateLimit = require('express-rate-limit');

const getLimiter = (time, limit) => {
  const limiter = rateLimit({
    windowMs: time * 60 * 1000,
    limit: limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  });
  return limiter;
};

module.exports = getLimiter;
