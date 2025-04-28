// /routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.Controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
