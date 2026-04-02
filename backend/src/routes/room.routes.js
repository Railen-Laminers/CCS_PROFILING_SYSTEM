const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/RoomController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/', RoomController.getRooms);
router.post('/', RoomController.createRoom);
router.put('/:id', RoomController.updateRoom);
router.delete('/:id', RoomController.deleteRoom);

module.exports = router;
