const rateLimit = require('express-rate-limit');

const getLimiter = () => {
  const limiter = rateLimit({
    windows: 15 * 60 * 100,
    limit: 100,
    standardHeader: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
  });
  return limiter;
};

module.exports = getLimiter;
