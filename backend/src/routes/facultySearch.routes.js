const express = require('express');
const router = express.Router();
const FacultySearchController = require('../controllers/FacultySearchController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Faculty search & filter
router.get('/search', FacultySearchController.search);
router.get('/departments', FacultySearchController.departments);
router.get('/positions', FacultySearchController.positions);

module.exports = router;
