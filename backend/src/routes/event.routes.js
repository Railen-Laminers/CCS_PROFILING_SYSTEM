const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Event management
router.get('/', EventController.index);
router.get('/:search', EventController.show);
router.post('/', EventController.store);
router.put('/:id', EventController.update);
router.delete('/:id', EventController.destroy);

// Participant management
router.get('/student/:userId', EventController.getStudentEvents);
router.get('/student/:userId/curricular', EventController.getStudentCurricularEvents);
router.post('/:id/register', EventController.register);
router.delete('/:id/register', EventController.unregister);

module.exports = router;
