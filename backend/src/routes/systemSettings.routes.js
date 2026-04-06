const express = require('express');
const router = express.Router();

const SystemSettingsController = require('../controllers/SystemSettingsController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload.middleware');

// Public read (useful for login screens / branding)
router.get('/', SystemSettingsController.getSystemSettings);

// Admin-only update; accepts JSON or multipart/form-data with optional `logo`
router.put(
  '/',
  protect,
  authorize('admin'),
  upload.single('logo'),
  SystemSettingsController.updateSystemSettings
);

module.exports = router;

