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
const Room = require('../models/Room');

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
    await Room.deleteMany({});

    console.log('Data cleared...');

    // -----------------------------------------------------------------
    // IMPORTANT: Do NOT hash passwords manually.
    // The User model's pre('save') middleware will automatically hash
    // the plain text password.
    // -----------------------------------------------------------------

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

    // Create 5 Students with skills, sports, and other data
    // NOTE: Using User.create() (not insertMany) so that pre('save') middleware runs
    const studentUsersData = [
      {
        firstname: 'John Michael',
        middlename: 'Rodriguez',
        lastname: 'Cruz',
        user_id: '2021001',
        email: 'john.cruz@ccs.edu',
        password: 'password',
        role: 'student',
        birth_date: '2003-05-15',
        contact_number: '09123456701',
        gender: 'male',
        address: '123 Mabini Street, Manila',
        is_active: true
      },
      {
        firstname: 'Maria Angelica',
        middlename: 'Santos',
        lastname: 'Lim',
        user_id: '2021002',
        email: 'maria.lim@ccs.edu',
        password: 'password',
        role: 'student',
        birth_date: '2004-02-20',
        contact_number: '09123456702',
        gender: 'female',
        address: '456 Taft Avenue, Manila',
        is_active: true
      },
      {
        firstname: 'Carlos',
        middlename: 'Miguel',
        lastname: 'Bautista',
        user_id: '2021003',
        email: 'carlos.bautista@ccs.edu',
        password: 'password',
        role: 'student',
        birth_date: '2003-11-08',
        contact_number: '09123456703',
        gender: 'male',
        address: '789 Aurora Boulevard, Quezon City',
        is_active: true
      },
      {
        firstname: 'Sofia',
        middlename: 'Garcia',
        lastname: 'Mendoza',
        user_id: '2021004',
        email: 'sofia.mendoza@ccs.edu',
        password: 'password',
        role: 'student',
        birth_date: '2004-07-22',
        contact_number: '09123456704',
        gender: 'female',
        address: '321 EDSA, Mandaluyong City',
        is_active: true
      },
      {
        firstname: 'Nathaniel',
        middlename: 'Torres',
        lastname: 'Franco',
        user_id: '2021005',
        email: 'nathaniel.franco@ccs.edu',
        password: 'password',
        role: 'student',
        birth_date: '2003-09-10',
        contact_number: '09123456705',
        gender: 'male',
        address: '654 Bonifacio Street, Makati City',
        is_active: true
      }
    ];

    // ✅ FIX: Use create() instead of insertMany() to trigger pre('save') hooks
    const createdStudentUsers = await User.create(studentUsersData);

    const studentProfiles = [
      {
        user_id: createdStudentUsers[0]._id,
        parent_guardian_name: 'Roberto Cruz',
        emergency_contact: '09123456711',
        section: 'IT-1A',
        program: 'Bachelor of Science in Information Technology',
        year_level: 3,
        gpa: 1.75,
        current_subjects: ['IT 301 - Database Management Systems 1', 'IT 350 - Software Engineering', 'IT 205 - Web Development Fundamentals'],
        academic_awards: ["Dean's List (2023)", 'Best in Programming Award (2024)'],
        quiz_bee_participations: ['Regional Quiz Bee 2024'],
        programming_contests: ['CCC Coding Competition 2024 - 2nd Place'],
        blood_type: 'O',
        disabilities: [],
        medical_condition: null,
        allergies: ['Peanuts'],
        sports_activities: { sportsPlayed: ['Basketball', 'Swimming'], achievements: 'Basketball Team Captain 2024' },
        organizations: { clubs: ['Google Developer Student Chapter', 'Tech Society'], positions: ['President'] },
        behavior_discipline_records: { warnings: 0, suspensions: 0, counseling: 0, incidents: '', counselingRecords: '' }
      },
      {
        user_id: createdStudentUsers[1]._id,
        parent_guardian_name: 'Antonio Lim',
        emergency_contact: '09123456712',
        section: 'IT-1B',
        program: 'Bachelor of Science in Information Technology',
        year_level: 3,
        gpa: 1.5,
        current_subjects: ['IT 301 - Database Management Systems 1', 'IT 350 - Software Engineering', 'IT 205 - Web Development Fundamentals'],
        academic_awards: ["Dean's List (2024)"],
        quiz_bee_participations: ['National Quiz Bee 2023'],
        programming_contests: [],
        blood_type: 'A',
        disabilities: [],
        medical_condition: 'Asthma',
        allergies: ['Dust', ' pollen'],
        sports_activities: { sportsPlayed: ['Badminton', 'Volleyball'], achievements: 'Intramural Champion 2024' },
        organizations: { clubs: ['Student Council', 'Photography Club'], positions: ['Secretary'] },
        behavior_discipline_records: { warnings: 0, suspensions: 0, counseling: 0, incidents: '', counselingRecords: '' }
      },
      {
        user_id: createdStudentUsers[2]._id,
        parent_guardian_name: 'Roberto Bautista',
        emergency_contact: '09123456713',
        section: 'IT-2A',
        program: 'Bachelor of Science in Information Technology',
        year_level: 2,
        gpa: 2.0,
        current_subjects: ['IT 201 - Data Structures & Algorithms', 'IT 205 - Web Development Fundamentals', 'IT 102 - Computer Programming 1'],
        academic_awards: [],
        quiz_bee_participations: [],
        programming_contests: ['Hackathon 2024 Participant'],
        blood_type: 'B',
        disabilities: [],
        medical_condition: null,
        allergies: [],
        sports_activities: { sportsPlayed: ['Basketball'], achievements: '' },
        organizations: { clubs: ['Game Development Club'], positions: ['Member'] },
        behavior_discipline_records: { warnings: 0, suspensions: 0, counseling: 0, incidents: '', counselingRecords: '' }
      },
      {
        user_id: createdStudentUsers[3]._id,
        parent_guardian_name: 'Ricardo Mendoza',
        emergency_contact: '09123456714',
        section: 'IT-1A',
        program: 'Bachelor of Science in Information Technology',
        year_level: 3,
        gpa: 1.25,
        current_subjects: ['IT 301 - Database Management Systems 1', 'IT 350 - Software Engineering', 'IT 205 - Web Development Fundamentals'],
        academic_awards: [],
        quiz_bee_participations: [],
        programming_contests: [],
        blood_type: 'AB',
        disabilities: [],
        medical_condition: 'None',
        allergies: [],
        sports_activities: { sportsPlayed: ['Swimming'], achievements: 'Regional Swimming Competition 2023 - 3rd Place' },
        organizations: { clubs: ['Debate Club', 'Science Club'], positions: ['Vice President'] },
        behavior_discipline_records: { warnings: 0, suspensions: 0, counseling: 0, incidents: '', counselingRecords: '' }
      },
      {
        user_id: createdStudentUsers[4]._id,
        parent_guardian_name: 'Manuel Franco',
        emergency_contact: '09123456715',
        section: 'IT-2B',
        program: 'Bachelor of Science in Information Technology',
        year_level: 2,
        gpa: 1.0,
        current_subjects: ['IT 201 - Data Structures & Algorithms', 'IT 205 - Web Development Fundamentals', 'IT 102 - Computer Programming 1'],
        academic_awards: ['With Honors (2024)'],
        quiz_bee_participations: [],
        programming_contests: ['ICPC Asia Qualifier 2024'],
        blood_type: 'O',
        disabilities: ['Dyslexia'],
        medical_condition: null,
        allergies: ['Shellfish'],
        sports_activities: { sportsPlayed: ['Chess'], achievements: 'National Chess Tournament 2023 - Champion' },
        organizations: { clubs: ['Chess Club'], positions: ['President'] },
        behavior_discipline_records: { warnings: 0, suspensions: 0, counseling: 0, incidents: '', counselingRecords: '' }
      }
    ];

    await Student.insertMany(studentProfiles);
    console.log('5 Students created with skills, sports, and other data...');

    // Create Faculty with all fields populated
    const facultyUserData = {
      firstname: 'Dr. Elena',
      middlename: 'Perez',
      lastname: 'Villanueva',
      user_id: 'FACULTY001',
      email: 'elena.villanueva@ccs.edu',
      password: 'password',
      role: 'faculty',
      birth_date: '1985-03-12',
      contact_number: '09123456799',
      gender: 'female',
      address: '999 University Avenue, Manila',
      is_active: true
    };
    const facultyUser = await User.create(facultyUserData);

    await Faculty.create({
      user_id: facultyUser._id,
      department: 'College of Computer Studies',
      position: 'Associate Professor',
      specialization: 'Database Systems and Data Science',
      subjects_handled: ['IT 301 - Database Management Systems 1', 'IT 201 - Data Structures & Algorithms', 'CS 101 - Fundamental of Computing'],
      teaching_schedule: [
        { day: 'Monday', time: '08:00 - 10:00', room: 'Lab 101' },
        { day: 'Wednesday', time: '08:00 - 10:00', room: 'Lab 101' },
        { day: 'Friday', time: '10:00 - 12:00', room: 'Room 201' }
      ],
      research_projects: [
        { title: 'AI-Based Academic Performance Prediction System', year: 2024, status: 'Completed' },
        { title: 'Machine Learning Applications in Education', year: 2025, status: 'Ongoing' }
      ]
    });
    console.log('Faculty created with all fields populated...');

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