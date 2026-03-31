const express = require('express');
const router = express.Router();
const InstructionController = require('../controllers/InstructionController');

// Classes
router.get('/classes', InstructionController.getClasses);
router.post('/classes', InstructionController.createClass);
router.put('/classes/:id', InstructionController.updateClass);
router.delete('/classes/:id', InstructionController.deleteClass);

// Assignments
router.get('/assignments', InstructionController.getAssignments);
router.post('/assignments', InstructionController.createAssignment);
router.put('/assignments/:id', InstructionController.updateAssignment);
router.delete('/assignments/:id', InstructionController.deleteAssignment);

// Lesson Plans
router.get('/lesson-plans', InstructionController.getLessonPlans);
router.post('/lesson-plans', InstructionController.createLessonPlan);
router.put('/lesson-plans/:id', InstructionController.updateLessonPlan);
router.delete('/lesson-plans/:id', InstructionController.deleteLessonPlan);

// Materials
router.get('/materials', InstructionController.getMaterials);
router.post('/materials', InstructionController.createMaterial);
router.put('/materials/:id', InstructionController.updateMaterial);
router.delete('/materials/:id', InstructionController.deleteMaterial);

module.exports = router;

