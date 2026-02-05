const { DataTypes } = require('sequelize');
const { bdd } = require('./../../helper/connexion.js');

const RefreshToken = bdd.define(
  'RefreshToken',
  {
    deviceId: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    userAgent: {
      type: DataTypes.STRING(255),
    },
    expiredAt: {
      type: DataTypes.DATE,
    },
    hash: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: 'refreshToken',
  },
);

module.exports = RefreshToken;
