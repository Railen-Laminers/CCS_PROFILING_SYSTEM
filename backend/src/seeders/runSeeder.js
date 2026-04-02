const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const LessonPlan = require('../models/LessonPlan');
const Material = require('../models/Material');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Course.deleteMany({});
    await Event.deleteMany({});
    await Class.deleteMany({});
    await Assignment.deleteMany({});
    await LessonPlan.deleteMany({});
    await Material.deleteMany({});

    console.log('Data cleared...');

    // Create Admin User
    const admin = await User.create({
      firstname: 'Admin',
      middlename: 'Test',
      lastname: 'User',
      user_id: '1234567',
      email: 'admin@gmail.com',
      password: 'password',
      role: 'admin',
      birth_date: '2000-01-01',
      contact_number: '09123456789',
      gender: 'male',
      address: 'Admin Address',
      is_active: true
    });

    console.log('Admin user created...');

    // Create Single Student
    const studentUser = await User.create({
      firstname: 'John',
      middlename: 'D',
      lastname: 'Student',
      user_id: '0000001',
      email: 'student@gmail.com',
      password: 'password',
      role: 'student',
      birth_date: '2000-01-01',
      contact_number: '09123456780',
      gender: 'male',
      address: 'Student Address',
      is_active: true
    });

    await Student.create({
      user_id: studentUser._id,
      program: 'BSIT',
      section: 'IT-A',
      year_level: 1,
      gpa: '3.50',
      sports_activities: { sportsPlayed: ['Basketball'] },
      organizations: { clubs: ['Computer Society'] }
    });

    console.log('Student user created...');
    
    // --- Faculty Seeder ---
    
    // Create Single Faculty
    const facultyUser = await User.create({
      firstname: 'Jane',
      middlename: 'M',
      lastname: 'Faculty',
      user_id: '00000001',
      email: 'faculty@gmail.com',
      password: 'password',
      role: 'faculty',
      birth_date: '1985-01-01',
      contact_number: '09123456781',
      gender: 'female',
      address: 'Faculty Address',
      is_active: true
    });

    await Faculty.create({
      user_id: facultyUser._id,
      department: 'Computer Science',
      position: 'Professor',
      specialization: 'Software Engineering',
      subjects_handled: ['Intro to IT', 'Software Engineering'],
      teaching_schedule: ['Mon/Wed 9:00-10:30'],
      research_projects: ['AI in Education']
    });

    console.log('Faculty user created...');

    // Create IT-related courses (Curriculum)
    const courseData = [
      { units: 3, course_code: 'IT 101', course_title: 'Introduction to Computing', year_level: 1, semester: 1, syllabus: 'Week 1: History of Computing\nWeek 2: Hardware Basics\nWeek 3: Operating Systems Overview' },
      { units: 3, course_code: 'IT 102', course_title: 'Computer Programming 1', year_level: 1, semester: 1, syllabus: 'Week 1: Visual Basic Environment\nWeek 2: Variables & Types\nWeek 3: Control Structures' },
      { units: 3, course_code: 'IT 103', course_title: 'Discrete Mathematics', year_level: 1, semester: 2, syllabus: 'Logic, Sets, Relations, Functions, and Boolean Algebra.' },
      { units: 3, course_code: 'IT 201', course_title: 'Data Structures & Algorithms', year_level: 2, semester: 1, syllabus: 'Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs.' },
      { units: 3, course_code: 'IT 205', course_title: 'Web Development Fundamentals', year_level: 2, semester: 1, syllabus: 'Week 1: HTML5 Semantics\nWeek 2: CSS Layouts flexbox/grid\nWeek 3: Client-side storage' },
      { units: 3, course_code: 'IT 301', course_title: 'Database Management Systems 1', year_level: 3, semester: 1, syllabus: 'Normalization, ER Diagrams, SQL Queries, and Transactions.' },
      { units: 3, course_code: 'IT 350', course_title: 'Software Engineering', year_level: 3, semester: 2, syllabus: 'Agile vs Waterfall, Requirements gathering, Modeling, Testing.' },
      { units: 4, course_code: 'IT 405', course_title: 'Integrative Programming', year_level: 4, semester: 1, syllabus: 'RESTful APIs, Microservices, Middleware, and Cloud Integration.' },
      { units: 3, course_code: 'IT 440', course_title: 'Capstone Project 1', year_level: 4, semester: 1, syllabus: 'Topic defense, Literature review, Methodology.' }
    ];

    await Course.insertMany(courseData);

    console.log('Curriculum Courses created...');

    // Create sample events
    await Event.create({
      title: 'Annual Tech Conference 2026',
      description: 'Join us for the biggest tech conference of the year featuring industry experts and networking opportunities.',
      start_datetime: '2026-05-15 09:00:00',
      end_datetime: '2026-05-17 18:00:00'
    });

    await Event.create({
      title: 'Web Development Workshop',
      description: 'Hands-on workshop covering modern web development frameworks and best practices.',
      start_datetime: '2026-03-25 10:00:00',
      end_datetime: '2026-03-25 17:00:00'
    });

    await Event.create({
      title: 'Data Science Symposium',
      description: 'Explore the latest trends in AI, machine learning, and data analytics.',
      start_datetime: '2026-04-10 08:30:00',
      end_datetime: '2026-04-12 16:30:00'
    });

    await Event.create({
      title: 'Cybersecurity Bootcamp',
      description: 'Intensive training on security fundamentals, ethical hacking, and threat detection.',
      start_datetime: '2026-06-05 09:00:00',
      end_datetime: '2026-06-07 18:00:00'
    });

    await Event.create({
      title: 'Mobile App Development Hackathon',
      description: '48-hour hackathon to build innovative mobile applications. Prizes for top teams!',
      start_datetime: '2026-07-20 08:00:00',
      end_datetime: '2026-07-22 20:00:00'
    });

    console.log('Events created...');
    
    // --- Instruction Seeder (Classes, Assignments, etc.) ---
    
    const courses = await Course.find();
    const facultyMembers = await Faculty.find().populate('user_id');
    
    // Create Rooms
    const Room = require('../models/Room');
    await Room.deleteMany({});
    const room1 = await Room.create({ name: 'CCS 301', type: 'Lecture', capacity: 40 });
    const room2 = await Room.create({ name: 'CCS 205', type: 'Laboratory', capacity: 30 });
    
    if (courses.length > 0 && facultyMembers.length > 0) {
      // Create Classes
      const class1 = await Class.create({
        course_id: courses[0]._id,
        instructor_id: facultyMembers[0]._id,
        section: 'IT-A',
        schedule: { date: '2026-04-06', startTime: '09:00', endTime: '10:30' },
        room_id: room1._id,
        students_count: 35
      });

      const class2 = await Class.create({
        course_id: courses[1]._id,
        instructor_id: facultyMembers[0]._id,
        section: 'IT-B',
        schedule: { date: '2026-04-07', startTime: '13:00', endTime: '14:30' },
        room_id: room2._id,
        students_count: 28
      });

      console.log('Classes and Rooms created...');

      // Create Assignments for Class 1
      await Assignment.create({
        class_id: class1._id,
        title: 'Midterm Research Paper',
        description: 'Submit a 10-page research paper on AI Ethics.',
        due_date: new Date('2026-04-15'),
        status: 'open'
      });

      await Assignment.create({
        class_id: class1._id,
        title: 'Weekly Quiz 5',
        description: 'Covers Neural Networks basics.',
        due_date: new Date('2026-03-30'),
        status: 'closed'
      });

      // Create Lesson Plan for Class 1
      await LessonPlan.create({
        class_id: class1._id,
        topic: 'Introduction to Transformers',
        content: 'Overview of Attention mechanisms and Transformer architecture.',
        date: new Date('2026-04-01')
      });

      // Create Material for Class 1
      await Material.create({
        class_id: class1._id,
        title: 'Deep Learning Slides - Week 4',
        type: 'presentation',
        file_url: 'https://example.com/slides-w4.pdf'
      });

      console.log('Assignments, Lesson Plans, and Materials created...');
    }

    console.log('Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(() => {
  seedData();
});
