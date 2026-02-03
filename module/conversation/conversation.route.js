const express = require('express');
const router = express.Router();
const conversationController = require('./conversation.controller.js');

router.post('/', conversationController.create);
router.post('/message', conversationController.send);
router.get('/', conversationController.getAll);
router.get('/:id', conversationController.getbyId);

module.exports = router;