const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
router.get('/login', authController.login);
router.get('/register', authController.register);
router.post('/register', authController.register_post);
router.get('/logout', authController.logout);
router.post('/login', authController.checkLogin);
module.exports = router;
