const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const eventRoutes = require('./routes/event.routes');
const academicRecordRoutes = require('./routes/academicRecord.routes');
const studentSearchRoutes = require('./routes/studentSearch.routes');
const studentRoutes = require('./routes/student.routes');
const facultyRoutes = require('./routes/faculty.routes');
const facultySearchRoutes = require('./routes/facultySearch.routes');
const contactRoutes = require('./routes/contact.routes');
const instructionRoutes = require('./routes/instruction.routes');
const roomRoutes = require('./routes/room.routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', academicRecordRoutes);
app.use('/api/students', studentSearchRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultySearchRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/instruction', instructionRoutes);
app.use('/api/rooms', roomRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});

module.exports = app;
