const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');

// Public route for contact inquiry
router.post('/', ContactController.sendInquiry);

module.exports = router;
