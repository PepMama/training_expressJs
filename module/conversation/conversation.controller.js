const Conversation = require('./conversation.model.js');
const User = require('./../user/user.model.js');

exports.getAll = async (req, res) => {
  let conversationController = await Conversation.findAll({
    include: [
      {
        model: User,
        througt: 'user_has_conversation',
        attributes: {
          exlude: ['password'],
        },
      },
    ],
  });
  res.status(200).json(conversationController);
};

exports.getById = async (req, res) => {
  let conversation = await Conversation.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(conversation);
};

exports.create = async (req, res) => {
  let conversation = await Conversation.create(req.body);

  let author = User.findOne({
    where: {
      id: req.token.userId,
    },
  });
  conversation.addUser(author);

  let recipient = User.findOne({
    where: {
      id: req.body.userId,
    },
  });
  conversation.addUser(recipient);

  res.status(201).json(conversation);
};
