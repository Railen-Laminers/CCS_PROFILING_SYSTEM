const express = require('express');
const router = express.Router();
const StudentSearchController = require('../controllers/StudentSearchController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Student search & filter
router.get('/search', StudentSearchController.search);
router.get('/sports', StudentSearchController.sports);
router.get('/organizations', StudentSearchController.organizations);
router.get('/sections', StudentSearchController.sections);

module.exports = router;
