const Conversation = require('./conversation.model.js');
const User = require('./../user/user.model.js');
const Message = require('./../message/message.model.js');

exports.getAll = async (req, res) => {
  let conversationController = await Conversation.findAll({
    include: [
      {
        model: User,
        througt: { attributes: [] },
        attributes: [],
        required: true,
        where: {
          id: req.token.userId,
        },
        as: 'filter',
      },
      {
        model: User,
        as: 'users',
        attributes: { exclude: ['password'] },
        througt: { attributes: [] },
        required: false,
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
    include: [
      {
        model: User,
        througt: { attributes: [] },
        attributes: [],
        required: true,
        where: {
          id: req.token.userId,
        },
        as: 'filter',
      },
      {
        model: Message,
      },
    ],
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

exports.addContactToConversation = async (req, res) => {
  try {
    let contact = User.findOne({
      where: {
        id: req.body.userId,
      },
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact does not exists' });
    }

    let conversation = await Conversation.findOne({
      where: {
        id: req.body.conversationId,
      },
      include: [
        {
          model: User,
          as: 'users',
          where: {
            id: req.token.userId,
          },
          required: false,
        },
      ],
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation does not exists' });
    }

    if (!conversation.users) {
      return res.status(403).json({ error: 'User is not part of this conversation' });
    }

    await conversation.addUser(contact);

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
};
