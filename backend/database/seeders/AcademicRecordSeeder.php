<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcademicRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = \App\Models\Student::all();

        if ($students->isEmpty()) {
            $this->command->info('No students found. Run student seeders first.');
            return;
        }

        foreach ($students as $student) {
            \App\Models\AcademicRecord::create([
                'student_id' => $student->id,
                'course_name' => 'BS Computer Science',
                'year_level' => '3rd Year',
                'semester' => '1st',
                'gpa' => 3.80,
                'current_subjects' => ['Data Structures', 'Web Development', 'Database Systems', 'Software Engineering'],
                'academic_awards' => ['Dean\'s Lister - 2023', 'Academic Excellence Award'],
                'quiz_bee_participations' => ['National IT Quiz Bee 2024 - 2nd Place'],
                'programming_contests' => ['ACM ICPC Regional 2024', 'Google Code Jam 2024']
            ]);
            
            \App\Models\AcademicRecord::create([
                'student_id' => $student->id,
                'course_name' => 'BS Computer Science',
                'year_level' => '2nd Year',
                'semester' => '2nd',
                'gpa' => 3.90,
                'current_subjects' => ['Object-Oriented Programming', 'Calculus II', 'Linear Algebra'],
                'academic_awards' => ['Dean\'s Lister - 2022'],
                'quiz_bee_participations' => [],
                'programming_contests' => []
            ]);
        }

        $this->command->info('Academic records seeded successfully for ' . $students->count() . ' students.');
    }
}
