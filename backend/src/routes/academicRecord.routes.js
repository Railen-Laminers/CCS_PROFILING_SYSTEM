const express = require('express');
const router = express.Router();
const AcademicRecordController = require('../controllers/AcademicRecordController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Academic records for a user/student
router.get('/:userId/academic-records', AcademicRecordController.index);
router.post('/:userId/academic-records', AcademicRecordController.store);

// Academic record CRUD
router.get('/:id', AcademicRecordController.show);
router.put('/:id', AcademicRecordController.update);
router.delete('/:id', AcademicRecordController.destroy);

module.exports = router;
