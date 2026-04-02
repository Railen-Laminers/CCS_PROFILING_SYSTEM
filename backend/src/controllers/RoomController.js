const Room = require('../models/Room');

class RoomController {
  static async getRooms(req, res, next) {
    try {
      const rooms = await Room.find();
      res.status(200).json(rooms);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = [error.errors[key].message];
        });
        return res.status(400).json({ message: 'Validation Error', errors });
      }
      next(error);
    }
  }

  static async createRoom(req, res, next) {
    try {
      const room = await Room.create(req.body);
      res.status(201).json(room);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Room name already exists.', errors: { name: ['Room name already exists'] } });
      }
      next(error);
    }
  }

  static async updateRoom(req, res, next) {
    try {
      const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!room) return res.status(404).json({ message: 'Room not found' });
      res.status(200).json(room);
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoom(req, res, next) {
    try {
      const room = await Room.findByIdAndDelete(req.params.id);
      if (!room) return res.status(404).json({ message: 'Room not found' });
      res.status(200).json({ message: 'Room deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoomController;
