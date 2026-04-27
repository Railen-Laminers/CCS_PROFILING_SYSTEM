const Room = require('../models/Room');
const ActivityLogService = require('../services/ActivityLogService');

// Helper: deep equality check for any values (including arrays/objects)
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, idx) => deepEqual(item, b[idx]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => deepEqual(a[key], b[key]));
  }
  return false;
}

// Helper: format value for display in logs (readable)
function formatValue(value) {
  if (value == null) return '(empty)';
  if (value instanceof Date) return value.toLocaleDateString();
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.length > 3) return `[${value.length} items]`;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    if (keys.length > 5) return `{${keys.length} properties}`;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  if (typeof value === 'string' && value.length > 100) {
    return value.substring(0, 97) + '...';
  }
  return String(value);
}

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

      // Log room creation
      await ActivityLogService.logActivity({
        user: req.user,
        action: 'ROOM_CREATED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'room',
        status_code: 201,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          room_id: room._id,
          room_name: room.name,
          capacity: room.capacity,
          building: room.building,
          floor: room.floor,
          is_available: room.isAvailable
        }
      });

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
      // 1. Fetch current room BEFORE update
      const currentRoom = await Room.findById(req.params.id).lean();
      if (!currentRoom) {
        return res.status(404).json({ message: 'Room not found' });
      }

      // 2. Perform update
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedRoom) return res.status(404).json({ message: 'Room not found' });

      // 3. Build changes object – ONLY fields present in req.body that actually changed
      const changes = {};
      for (const field of Object.keys(req.body)) {
        const oldVal = currentRoom[field];
        const newVal = updatedRoom[field];
        if (!deepEqual(oldVal, newVal)) {
          changes[field] = {
            old: formatValue(oldVal),
            new: formatValue(newVal)
          };
        }
      }

      // 4. Log only if there are actual changes
      if (Object.keys(changes).length > 0) {
        await ActivityLogService.logActivity({
          user: req.user,
          action: 'ROOM_UPDATED',
          method: req.method,
          endpoint: req.originalUrl,
          target_resource: 'room',
          status_code: 200,
          ip_address: req.ip,
          user_agent: req.get('user-agent') || null,
          metadata: {
            room_id: updatedRoom._id,
            room_name: updatedRoom.name,
            changes: changes
          }
        });
      }

      res.status(200).json(updatedRoom);
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoom(req, res, next) {
    try {
      // Fetch room details before deletion for logging
      const roomToDelete = await Room.findById(req.params.id).lean();
      if (!roomToDelete) {
        return res.status(404).json({ message: 'Room not found' });
      }

      await Room.findByIdAndDelete(req.params.id);

      // Log room deletion
      await ActivityLogService.logActivity({
        user: req.user,
        action: 'ROOM_DELETED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'room',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          room_id: roomToDelete._id,
          room_name: roomToDelete.name,
          capacity: roomToDelete.capacity,
          building: roomToDelete.building,
          floor: roomToDelete.floor
        }
      });

      res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoomController;