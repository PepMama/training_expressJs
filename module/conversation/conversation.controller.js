const Conversation = require('./conversation.model.js');

exports.getAll = async(req, res) => {
	let conversationController = await Conversation.findAll();
	res.status(200).json(conversationController);
}

exports.getById = async(req, res) => {
	let conversation = await Conversation.findOne({
		where: {
			id: req.params.id
		}
	});
	res.status(200).json(conversation);
}

exports.create = async (req, res) => {
  let conversation = await Conversation.create(req.body);
  res.status(201).json(conversation);
};
