const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res) => {
  let token = req.headers.authorization?.slpit(' ')[1];
  try {
    req.token = jwt.verify(token.process.env.JWT_KEY);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = auth;
