const User = require('./../module/user/user.model.js');
const Message = require('./../module/message/message.model.js');
const Conversation = require('./../module/conversation/conversation.model.js');

const associate = async () => {
	User.hasMany(Message, {foreignKey: "userId"});
	Message.belongsTo(User, {foreignKey:"userId"});

	Conversation.hasMany(Message, {foreignKey: "conversationId"}); // OneToMany

	User.belongsToMany(Conversation, {through: "user_has_conversation"}); // ManyToMany
	Conversation.belongsToMany(User, {through: "user_has_conversation"});
};

module.exports = associate;