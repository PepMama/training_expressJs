const Message = require('./message.model.js');

exports.getAll = async(req, res) => {
	let messageList = await Message.findAll();
	res.status(200).json(messageList);
}

exports.getById = async(req, res) => {
	let message = await Message.findOne({
		where: {
			id: req.params.id
		}
	});
	res.status(200).json(message);
}

exports.create = async (req, res) => {
  let message = await Message.create(req.body);
  res.status(201).json(message);
};

exports.update = async(req, res) => {
	let result = await Message.update({	
		...req.body
	}, {
		where: {
			id: req.params.id
		}
	});
	res.status(201).json(result);
}

exports.delete = async(req, res) => {
	let result = await Message.destroy({
		where: {
			id: req.params.id
		}
	})
	res.status(200).json({message: "Lignes supprimées: " + result(0)});
}
