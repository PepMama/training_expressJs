const { Op } = require('sequelize');
const User = require('./user.model.js');
const Conversation = require('../conversation/conversation.model.js');

exports.getAll = async (req, res) => {
  try {
    let userList = await User.findAll();
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    let user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    let result = await User.update(
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
    let result = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: 'Lignes supprimées : ' + result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchContact = async (req, res) => {
  try {
    let userList = await User.findAll({
      where: {
        username: {
          [Op.like]: '%' + req.params.username + '%',
        },
      },
    });
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addContact = async (req, res) => {
  try {
    let currentUser = await User.findOne({
      where: {
        id: req.token.userId,
      },
    });
    let contact = await User.findOne({
      where: {
        id: req.body.contactId,
      },
    });
    if (!contact) {
      return res.status(404).json({ error: 'User not found' });
    }
    currentUser.addContact(contact);
    let conversation = await Conversation.create({});
    conversation.addUser(currentUser);
    conversation.addUser(contact);
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
