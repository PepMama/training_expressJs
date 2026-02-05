const User = require('./../user/user.model.js');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('./refreshToken.model.js');
require('dotenv').config();

exports.login = async (req, res) => {
  try {
    if (!req.body.email && !req.body.username) {
      return res.status(400).json({ error: 'Email or username is required' });
    }
    if (!req.body.password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    let user = await User.findOne({
      where: {
        [Op.or]: {
          email: req.body.email || '',
          username: req.body.username || '',
        },
      },
    });
    if (!user) {
      return res.status(400).json({ error: 'Account not found' });
    }
    let result = bcrypt.compareSync(req.body.password, user.password);
    if (!result) {
      return res.status(400).json({ error: 'Wrong password' });
    }
    let token = jwt.sign({ userId: user.id }, process.env.JWT_KEY);

    const refreshToken = crypto.randomBytes(32).toString('hex');
    const hashToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await RefreshToken.create({
      userId: user.id,
      devideId: req.headers['X-DEVICE-ID'],
      expiresAt: new Date(Date.now() + 7 * 60 * 60 * 100),
      userAgent: req.get('user-agent'),
      hash: hashToken,
    });
    res.cookie('refresh_token', hashToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!req.body.password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    if (!req.body.username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    const result = await User.findAll({
      where: {
        [Op.or]: {
          email: req.body.email,
          username: req.body.username,
        },
      },
    });
    if (result.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }
    let hash = bcrypt.hashSync(req.body.password, 10);
    let user = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hash,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
