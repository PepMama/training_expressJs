const express = require('express');
const router = express.Router();
const messageController = require('./message.controller.js');

router.get('/', messageController.getAll);

router.get('/:id', messageController.getById);

router.post('/', messageController.create);

router.put('/:id', messageController.update);

router.delete('/:id', messageController.delete);


module.exports = router;