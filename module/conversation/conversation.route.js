const express = require('express');
const router = express.Router();
const conversationController = require('./conversation.controller.js');
const authMiddleware = require('../auth/auth.middleware.js');

router.post('/', authMiddleware, conversationController.create);
router.get('/', conversationController.getAll);
router.get('/:id', conversationController.getById);

module.exports = router;
