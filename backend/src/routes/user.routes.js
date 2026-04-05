const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/', UserController.index);
router.get('/students', UserController.getStudents);
router.get('/faculty', UserController.getFaculty);
router.get('/:identifier', UserController.show);
router.post('/', UserController.store);
router.put('/:identifier', UserController.update);
router.delete('/:identifier', UserController.destroy);
router.post('/import-students', upload.single('file'), UserController.importStudents);

module.exports = router;
