const Sequelize = require('sequelize');
require("dotenv").config();

const passwordBdd = process.env.DATABASE_PASSWORD;
const userBdd = process.env.DATABASE_USER;
const portBdd = process.env.DATABASE_PORT;
const hostBdd = process.env.DATABASE_HOST;
const nameBdd = process.env.DATABASE_NAME;


const bdd = new Sequelize(nameBdd, userBdd, passwordBdd, {
	dialect: 'mysql',
	host: hostBdd,
	port: portBdd
});

const connect = async () => {
	try{
		await bdd.authenticate();
		console.log("Connected to the database");
	}catch(error) {
		console.error("Unable to connect ot the database" + error);
	}
}

module.exports = {connect, bdd};