const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', AuthController.login);
router.post('/verify-2fa', AuthController.verify2FA);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected routes
router.get('/me', protect, AuthController.me);
router.put('/profile', protect, AuthController.updateProfile);
router.post('/toggle-2fa', protect, AuthController.toggle2FA);
router.post('/logout', protect, AuthController.logout);

module.exports = router;
