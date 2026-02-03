const User = require('./user.model.js');

exports.getAll = async (req, res) => {
  let usersList = await User.findAll();
  res.status(200).json(usersList);
};

exports.getById = async (req, res) => {
  let user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(user);
};

exports.create = async (req, res) => {
  let user = await User.create(req.body);
  res.status(201).json(user);
};

exports.update = async (req, res) => {
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
  res.status(201).json(result);
};

exports.delete = async (req, res) => {
  let result = await User.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ message: 'Lignes supprimées: ' + result(0) });
};
