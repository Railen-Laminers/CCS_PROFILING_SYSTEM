const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class ID is required']
  },
  title: {
    type: String,
    required: [true, 'Material title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['document', 'presentation', 'video', 'link'],
    required: [true, 'Material type is required']
  },
  file_url: {
    type: String,
    trim: true
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
