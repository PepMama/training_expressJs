const Conversation = require('../conversation/conversation.model.js');
const Message = require('./message.model.js');
const User = require('./../user/user.model.js');
const { getIO } = require('./../../helper/socketManager.js');

exports.getAll = async (req, res) => {
  try {
    let messageList = await Message.findAll();
    res.status(200).json(messageList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    let message = await Message.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (!req.body.conversationId) {
      return res.status(400).json({ error: 'Conversation is required' });
    }
    let conversation = await Conversation.findOne({
      where: {
        id: req.body.conversationId,
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
      ],
    });
    if (!conversation) {
      return res.status(401).json({ error: 'You are not in this conversation' });
    }
    let message = await Message.create({
      content: req.body.message,
      conversationId: req.body.conversationId,
      userId: req.token.userId,
    });

    const io = getIO();
    io.to('conversation-' + conversation.id).emit('message', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    let result = await Message.update(
      {
        ...req.body,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );
    res.status(201).json({ message: 'Lignes modifiées : ' + result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    let result = await Message.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: 'Lignes supprimées : ' + result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
