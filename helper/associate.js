const User = require('./../module/user/user.model.js');
const Message = require('./../module/message/message.model.js');

const associate = async () => {
	User.hasMany(Message, {foreignKey: "userId"});
	Message.belongsTo(User, {foreignKey:"userId"});
};

module.exports = associate;