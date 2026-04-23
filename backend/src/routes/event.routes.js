const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');
const { protect, authorize } = require('../middleware/auth');

// Custom middleware to allow both admin and student
const allowStudent = (req, res, next) => {
    if (req.user.role === 'student' || req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Students or admins only.' });
};

// Custom middleware to allow a student to access only their own student events
const allowOwnStudentEvents = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    if (req.user.role === 'student' && req.params.userId === req.user._id.toString()) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. You can only view your own events.' });
};

// All routes are protected
router.use(protect);

// View events – allow both admin and student
router.get('/', allowStudent, EventController.index);
router.get('/:search', allowStudent, EventController.show);  // optional: allow viewing single event

// Admin-only write operations
router.post('/', authorize('admin'), EventController.store);
router.put('/:id', authorize('admin'), EventController.update);
router.delete('/:id', authorize('admin'), EventController.destroy);

// Participant management – allow admin or student (self)
router.get('/student/:userId', allowOwnStudentEvents, EventController.getStudentEvents);
router.get('/student/:userId/curricular', allowOwnStudentEvents, EventController.getStudentCurricularEvents);
router.post('/:id/register', allowStudent, EventController.register);
router.delete('/:id/register', allowStudent, EventController.unregister);

// Invitation management
router.get('/student/:userId/invitations', allowOwnStudentEvents, EventController.getStudentInvitations);
router.post('/:id/invite', authorize('admin'), EventController.invite);
router.post('/:id/respond', allowStudent, EventController.respondInvitation);

module.exports = router;