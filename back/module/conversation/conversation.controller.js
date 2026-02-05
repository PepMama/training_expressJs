const Conversation = require('./conversation.model.js');
const User = require('./../user/user.model.js');
const Message = require('./../message/message.model.js');

exports.getAll = async (req, res) => {
  try {
    let conversationList = await Conversation.findAll({
      include: [
        {
          model: User,
          through: { attributes: [] },
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
          through: { attributes: [] },
          required: false,
        },
      ],
    });
    res.status(200).json(conversationList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    let conversation = await Conversation.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: User,
          through: { attributes: [] },
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    let conversation = await Conversation.create(req.body);
    let author = await User.findOne({
      where: {
        id: req.token.userId,
      },
    });
    conversation.addUser(author);
    let recipient = await User.findOne({
      where: {
        id: req.body.userId,
      },
    });
    conversation.addUser(recipient);

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.send = async (req, res) => {};

exports.addContact = async (req, res) => {
  try {
    let contact = await User.findOne({
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
        },
      ],
    });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation does not exists' });
    }
    if (!conversation.users.some((user) => user.id === req.token.userId)) {
      return res.status(401).json({ error: 'You are not in this conversation' });
    }
    if (conversation.users.some((user) => user.id === req.body.userId)) {
      return res.status(400).json({ error: 'User is already in this conversation' });
    }
    await conversation.addUser(contact);
    res.status(201).json({ message: 'Contact ajouté' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
