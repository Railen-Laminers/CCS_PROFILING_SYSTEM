const express = require('express');
const router = express.Router();
const InstructionController = require('../controllers/InstructionController');

router.get('/classes', InstructionController.getClasses);
router.get('/assignments', InstructionController.getAssignments);
router.get('/lesson-plans', InstructionController.getLessonPlans);
router.get('/materials', InstructionController.getMaterials);

module.exports = router;
