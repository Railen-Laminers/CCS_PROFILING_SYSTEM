<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create an admin user
        User::create([
            'firstname' => 'Admin',
            'middlename' => 'Test',
            'lastname' => 'User',
            'user_id' => '1234567',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create a faculty user
        User::create([
            'firstname' => 'Faculty',
            'middlename' => 'Test',
            'lastname' => 'User',
            'user_id' => '2345678',
            'email' => 'faculty@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'faculty',
        ]);

        // Create a student user
        User::create([
            'firstname' => 'Student',
            'middlename' => 'Test',
            'lastname' => 'User',
            'user_id' => '3456789',
            'email' => 'student@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);
    }
}
