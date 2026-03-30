const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Student management - these endpoints match the frontend expectations
router.get('/', UserController.getStudents);
router.get('/:identifier', UserController.show);
router.post('/', UserController.store);
router.put('/:identifier', UserController.update);
router.delete('/:identifier', UserController.destroy);

module.exports = router;
