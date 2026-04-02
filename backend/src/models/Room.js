const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Lecture', 'Laboratory'],
    default: 'Lecture'
  },
  capacity: {
    type: Number,
    default: 40
  }
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
