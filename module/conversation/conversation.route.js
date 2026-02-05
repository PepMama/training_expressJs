const express = require('express');
const router = express.Router();
const conversationController = require('./conversation.controller.js');
const authMiddleware = require('../auth/auth.middleware.js');

router.post('/', authMiddleware, conversationController.create);
router.get('/', authMiddleware, conversationController.getAll);
router.get('/:id', authMiddleware, conversationController.getById);
router.post('/addContactToConversation/:id', authMiddleware, conversationController.getById);

module.exports = router;
