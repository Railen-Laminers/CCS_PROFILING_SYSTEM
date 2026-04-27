const express = require('express');
const router = express.Router();
const ActivityLogController = require('../controllers/ActivityLogController');
const { protect, authorize } = require('../middleware/auth');

// All routes need authentication
router.use(protect);

// User can see his own logs
router.get('/me', ActivityLogController.myLogs);

// Admin only
router.use(authorize('admin'));
router.get('/', ActivityLogController.index);

module.exports = router;