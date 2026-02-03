const express = require('express');
const router = express.Router();
const conversationController = require('./conversation.controller.js');

router.post('/', conversationController.create);
router.get('/', conversationController.getAll);
router.get('/:id', conversationController.getById);

module.exports = router;
