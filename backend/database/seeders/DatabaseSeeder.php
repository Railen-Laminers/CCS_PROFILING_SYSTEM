<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'firstname' => 'Admin',
            'middlename' => 'Test',
            'lastname' => 'User',
            'user_id' => '1234567',
            'email' => 'admin@gmail.com',
            'password' => 'password',
            'role' => 'admin',
            'birth_date' => '2000-01-01',
            'contact_number' => '09123456789',
            'gender' => 'male',
            'address' => 'Admin Address',
            'profile_picture' => null,
            'is_active' => true,
            'last_login_at' => null,
        ]);


        // Create IT-related courses
        Course::create([
            'credits' => 3,
            'course_code' => 'IT 101',
            'course_title' => 'Introduction to Information Technology'
        ]);

        Course::create([
            'credits' => 3,
            'course_code' => 'IT 205',
            'course_title' => 'Web Development Fundamentals'
        ]);


        // In the run() method, add these events:

        // Create sample events
        Event::create([
            'title' => 'Annual Tech Conference 2026',
            'description' => 'Join us for the biggest tech conference of the year featuring industry experts and networking opportunities.',
            'start_datetime' => '2026-05-15 09:00:00',
            'end_datetime' => '2026-05-17 18:00:00',
        ]);

        Event::create([
            'title' => 'Web Development Workshop',
            'description' => 'Hands-on workshop covering modern web development frameworks and best practices.',
            'start_datetime' => '2026-03-25 10:00:00',
            'end_datetime' => '2026-03-25 17:00:00',
        ]);

        Event::create([
            'title' => 'Data Science Symposium',
            'description' => 'Explore the latest trends in AI, machine learning, and data analytics.',
            'start_datetime' => '2026-04-10 08:30:00',
            'end_datetime' => '2026-04-12 16:30:00',
        ]);

        Event::create([
            'title' => 'Cybersecurity Bootcamp',
            'description' => 'Intensive training on security fundamentals, ethical hacking, and threat detection.',
            'start_datetime' => '2026-06-05 09:00:00',
            'end_datetime' => '2026-06-07 18:00:00',
        ]);

        Event::create([
            'title' => 'Mobile App Development Hackathon',
            'description' => '48-hour hackathon to build innovative mobile applications. Prizes for top teams!',
            'start_datetime' => '2026-07-20 08:00:00',
            'end_datetime' => '2026-07-22 20:00:00',
        ]);
    }
}
