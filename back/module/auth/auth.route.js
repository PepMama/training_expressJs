const express = require('express');
const router = express.Router();
const authController = require('./auth.controller.js');

// pourquoi post : pour éviter d'afficher les informations de connexion dans l'url
router.post('/login', authController.login);

router.post('/signin', authController.signin);

module.exports = router;