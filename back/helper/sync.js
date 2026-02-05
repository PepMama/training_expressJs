const { bdd } = require('./../helper/connexion.js');
const associate = require('./associate.js');

const sync = async () => {
	await associate();
	await bdd.sync({alter: true});
}

sync();

// script : node ./helper/sync.js