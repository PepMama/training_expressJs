const { DataTypes } = require('sequelize');
const { bdd } = require('./../../helper/connexion.js');

const User = bdd.define('User', {
	content: {
		type: DataTypes.TEXT
	},

}, {
	tableName: 'message'
});

module.exports = User;