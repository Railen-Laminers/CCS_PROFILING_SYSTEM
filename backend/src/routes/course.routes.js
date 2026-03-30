const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/CourseController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Course management
router.get('/', CourseController.index);
router.get('/:id', CourseController.show);
router.post('/', CourseController.store);
router.put('/:id', CourseController.update);
router.delete('/:id', CourseController.destroy);

module.exports = router;
