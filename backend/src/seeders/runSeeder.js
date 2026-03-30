const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Event = require('../models/Event');

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

    // Generate 16 dummy students
    const firstNames = ['John Carlo', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Emma', 'Robert', 'Olivia', 'William', 'Sophia', 'Richard', 'Ava', 'Joseph', 'Mia'];
    const lastNames = ['Abigania', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
    const programs = ['BSIT', 'BSCS'];
    const sections = ['A', 'B', 'C'];

    for (let i = 0; i < 16; i++) {
      const firstName = firstNames[i];
      const lastName = lastNames[i];
      const program = programs[Math.floor(Math.random() * programs.length)];
      const sectionPrefix = program === 'BSIT' ? 'IT' : 'CS';
      const section = `${sectionPrefix}-${sections[Math.floor(Math.random() * sections.length)]}`;

      const user = await User.create({
        firstname: firstName,
        middlename: '',
        lastname: lastName,
        user_id: `ST${String(Math.floor(10000 + Math.random() * 90000))}`,
        email: `${firstName.toLowerCase().replace(/\s+/g, '')}.${lastName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        password: 'password',
        role: 'student',
        birth_date: new Date(1998 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        contact_number: `09${String(Math.floor(100000000 + Math.random() * 900000000))}`,
        gender: Math.random() > 0.5 ? 'male' : 'female',
        address: `${Math.floor(Math.random() * 1000)} Main Street, City`,
        is_active: true
      });

      // Generate random sports activities
      const sportsOptions = ['Basketball', 'Volleyball', 'Football', 'Badminton', 'Table Tennis', 'Swimming', 'Athletics', 'Chess'];
      const numSports = Math.floor(Math.random() * 3) + 1;
      const selectedSports = [];
      for (let j = 0; j < numSports; j++) {
        const sport = sportsOptions[Math.floor(Math.random() * sportsOptions.length)];
        if (!selectedSports.includes(sport)) {
          selectedSports.push(sport);
        }
      }

      // Generate random organizations
      const orgsOptions = ['Computer Society', 'Google Developer Student Club', 'IEEE Student Branch', 'ACM Student Chapter', 'Tech Innovators Club', 'Coding Club', 'Robotics Club', 'Data Science Club'];
      const numOrgs = Math.floor(Math.random() * 2) + 1;
      const selectedOrgs = [];
      for (let j = 0; j < numOrgs; j++) {
        const org = orgsOptions[Math.floor(Math.random() * orgsOptions.length)];
        if (!selectedOrgs.includes(org)) {
          selectedOrgs.push(org);
        }
      }

      await Student.create({
        user_id: user._id,
        program: program,
        section: section,
        year_level: Math.floor(Math.random() * 4) + 1,
        gpa: (Math.random() * 1.5 + 2.5).toFixed(2),
        sports_activities: { sportsPlayed: selectedSports },
        organizations: { clubs: selectedOrgs }
      });
    }

    console.log('Students created...');
    
    // --- Faculty Seeder ---
    
    const facultyData = [
      {
        user: {
          firstname: 'Roberto',
          middlename: '',
          lastname: 'Fernandez',
          user_id: 'FAC-CS-001',
          email: 'r.fernandez@ccs.edu',
          contact_number: '09171234580',
          address: 'CCS Building - Room 301',
          gender: 'male',
          birth_date: '1975-03-15'
        },
        faculty: {
          department: 'Computer Science',
          position: 'Professor',
          specialization: 'Artificial Intelligence, Machine Learning',
          subjects_handled: ['AI Fundamentals', 'Machine Learning', 'Deep Learning', 'Neural Networks'],
          teaching_schedule: ['Mon 9:00-12:00 - AI Fundamentals', 'Wed 13:00-16:00 - Machine Learning'],
          research_projects: ['Neural Network Optimization', 'Predictive Analytics']
        }
      },
      {
        user: {
          firstname: 'Maria',
          middlename: '',
          lastname: 'Gonzales',
          user_id: 'FAC-IT-002',
          email: 'm.gonzales@ccs.edu',
          contact_number: '09191234581',
          address: 'CCS Building - Room 205',
          gender: 'female',
          birth_date: '1980-07-22'
        },
        faculty: {
          department: 'Information Technology',
          position: 'Associate Professor',
          specialization: 'Network Security, Cyber Security',
          subjects_handled: ['Network Security', 'Ethical Hacking', 'Cryptography'],
          teaching_schedule: ['Tue 10:00-13:00 - Network Security', 'Thu 10:00-13:00 - Ethical Hacking'],
          research_projects: ['Advanced Threat Detection', 'Blockchain Security']
        }
      },
      {
        user: {
          firstname: 'Antonio',
          middlename: '',
          lastname: 'Rivera',
          user_id: 'FAC-CS-003',
          email: 'a.rivera@ccs.edu',
          contact_number: '09191234582',
          address: 'CCS Building - Room 108',
          gender: 'male',
          birth_date: '1982-11-08'
        },
        faculty: {
          department: 'Computer Science',
          position: 'Assistant Professor',
          specialization: 'Software Engineering, Web Development',
          subjects_handled: ['Software Engineering', 'Web Development', 'Agile Methodologies'],
          teaching_schedule: ['Mon 13:00-16:00 - Software Engineering', 'Wed 9:00-12:00 - Web Development'],
          research_projects: ['Microservices Architecture', 'Full-Stack Performance']
        }
      }
    ];

    for (const f of facultyData) {
      const user = await User.create({
        ...f.user,
        password: 'password',
        role: 'faculty',
        is_active: true
      });

      await Faculty.create({
        user_id: user._id,
        ...f.faculty
      });
    }

    console.log('Faculty seed records created...');

    // Create IT-related courses
    await Course.create({
      credits: 3,
      course_code: 'IT 101',
      course_title: 'Introduction to Information Technology'
    });

    await Course.create({
      credits: 3,
      course_code: 'IT 205',
      course_title: 'Web Development Fundamentals'
    });

    console.log('Courses created...');

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
