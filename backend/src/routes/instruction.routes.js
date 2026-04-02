const express = require('express');
const router = express.Router();
const InstructionController = require('../controllers/InstructionController');
const upload = require('../middleware/upload.middleware');

router.get('/classes', InstructionController.getClasses);
router.post('/classes', InstructionController.createClass);
router.put('/classes/:id', InstructionController.updateClass);
router.delete('/classes/:id', InstructionController.deleteClass);

router.get('/assignments', InstructionController.getAssignments);
router.get('/lesson-plans', InstructionController.getLessonPlans);
router.post('/lesson-plans', upload.single('attached_file'), InstructionController.createLessonPlan);
router.delete('/lesson-plans/:id', InstructionController.deleteLessonPlan);

router.get('/materials', InstructionController.getMaterials);
router.post('/materials', InstructionController.createMaterial);
router.delete('/materials/:id', InstructionController.deleteMaterial);

module.exports = router;
