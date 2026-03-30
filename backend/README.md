# CCS Profiling System - Node.js Backend

This is the Node.js/Express backend for the CCS Profiling System, converted from the original Laravel backend.

## Features

- **Authentication**: JWT-based authentication with login/logout
- **User Management**: CRUD operations for users (admin, student, faculty)
- **Student Management**: Student profiles with academic information
- **Faculty Management**: Faculty profiles with department information
- **Course Management**: CRUD operations for courses
- **Event Management**: CRUD operations for events
- **Academic Records**: Manage student academic records
- **Student Search**: Advanced search and filtering for students

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017 or configure in .env)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already provided) with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/css_profiling
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

4. Seed the database (optional):
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with user_id or email
- `GET /api/auth/me` - Get current user profile (protected)
- `POST /api/auth/logout` - Logout (protected)

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/students` - List all students
- `GET /api/users/faculty` - List all faculty
- `GET /api/users/:identifier` - Get user by ID or user_id
- `POST /api/users` - Create new user
- `PUT /api/users/:identifier` - Update user
- `DELETE /api/users/:identifier` - Delete user (must be inactive)

### Courses (Admin only)
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course by ID or course_code
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Events (Admin only)
- `GET /api/events` - List all events
- `GET /api/events/:search` - Get event by ID or title
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Academic Records (Admin only)
- `GET /api/academic-records/users/:userId/academic-records` - Get student's academic records
- `POST /api/academic-records/users/:userId/academic-records` - Create academic record
- `GET /api/academic-records/:id` - Get academic record by ID
- `PUT /api/academic-records/:id` - Update academic record
- `DELETE /api/academic-records/:id` - Delete academic record

### Student Search (Admin only)
- `GET /api/students/search` - Search students with filters
- `GET /api/students/sports` - Get distinct sports
- `GET /api/students/organizations` - Get distinct organizations

## Default Credentials

After running the seeder, you can login with:
- **Admin**: user_id: `1234567`, email: `admin@gmail.com`, password: `password`
- **Students**: Various students with password: `password`

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth and error handling middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── seeders/         # Database seeders
│   └── server.js        # Main application file
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Migration from Laravel

This backend is a direct conversion from the Laravel backend with the following changes:

1. **Authentication**: Changed from Laravel Sanctum to JWT
2. **Database**: Still uses MongoDB but with Mongoose instead of Laravel MongoDB
3. **Validation**: Uses express-validator instead of Laravel Form Requests
4. **Error Handling**: Custom error handling middleware
5. **Structure**: Follows Node.js/Express conventions

## Notes

- The API maintains the same endpoints and response formats as the Laravel backend
- The frontend should work without any changes
- JWT tokens are used instead of Sanctum tokens
- Password hashing uses bcryptjs instead of Laravel's Hash facade
