const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', protect, AuthController.me);
router.post('/logout', protect, AuthController.logout);

module.exports = router;
