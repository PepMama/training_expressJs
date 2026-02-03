const express = require('express');
const app = express();
const userRouter = require('./module/user/user.route.js');
const messageRouter = require('./module/message/message.route.js');
const { connect } = require('./helper/connexion.js');
const associate = require('./helper/associate.js');

const startBdd = async() => {
	await connect();
	await associate();
}
startBdd();

app.use(express.json());

app.use('/user', userRouter);
app.use('/message', messageRouter);

module.exports = app;