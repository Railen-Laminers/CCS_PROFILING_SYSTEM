const express = require('express');
const router = express.Router();
const InstructionController = require('../controllers/InstructionController');
const upload = require('../middleware/upload.middleware');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Routes accessible to both faculty and admin
router.get('/classes', authorize('faculty', 'admin'), InstructionController.getClasses);
router.post('/classes', authorize('faculty', 'admin'), InstructionController.createClass);
router.put('/classes/:id', authorize('faculty', 'admin'), InstructionController.updateClass);
router.delete('/classes/:id', authorize('faculty', 'admin'), InstructionController.deleteClass);

router.get('/lesson-plans', authorize('faculty', 'admin'), InstructionController.getLessonPlans);
router.post('/lesson-plans', authorize('faculty', 'admin'), upload.single('attached_file'), InstructionController.createLessonPlan);
router.delete('/lesson-plans/:id', authorize('faculty', 'admin'), InstructionController.deleteLessonPlan);

router.get('/materials', authorize('faculty', 'admin'), InstructionController.getMaterials);
router.post('/materials', authorize('faculty', 'admin'), InstructionController.createMaterial);
router.delete('/materials/:id', authorize('faculty', 'admin'), InstructionController.deleteMaterial);

router.get('/section/:section/courses', authorize('faculty', 'admin'), InstructionController.getSectionCourses);

module.exports = router;