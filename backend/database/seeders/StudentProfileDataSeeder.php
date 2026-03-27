<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class StudentProfileDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        $students = \App\Models\Student::all();

        if ($students->isEmpty()) {
            $this->command->info('No students found. Run student seeders first.');
            return;
        }

        $programs = ['BSIT', 'BSCS'];
        $sections = ['IT-A', 'IT-B', 'IT-C', 'CS-A', 'CS-B'];
        $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

        // Data banks for randomized selection
        $allergiesBank = ['Peanuts', 'Dust mites', 'Pollen', 'Seafood', 'Dairy', 'Latex'];
        $sportsBank = ['Basketball', 'Volleyball', 'Badminton', 'Tennis', 'Swimming', 'Track and Field', 'Chess', 'Football'];
        $clubsBank = ['Computer Science Society', 'Math Club', 'Debate Society', 'Drama Club', 'Photography Club', 'Red Cross Youth'];
        $rolesBank = ['President', 'Vice President', 'Secretary', 'Treasurer', 'Auditor', 'Member'];

        $programmingBank = ['ICPC Regional', 'Google Hash Code', 'Hackathon 2024', 'CodeForces Round', 'University Coding Challenge'];
        $quizBeeBank = ['National IT Quiz Bee', 'Math Olympiad', 'Science Trivia', 'History Bee'];

        foreach ($students as $student) {
            // Assign a program based on section prefix
            $program = $faker->randomElement($programs);
            $sectionPrefix = $program === 'BSIT' ? 'IT' : 'CS';
            $section = $sectionPrefix . '-' . $faker->randomElement(['A', 'B', 'C']);

            // 1. CORE ACADEMIC FIELDS
            $yearLevel = $faker->numberBetween(1, 4);
            $gpa = $faker->randomFloat(2, 1.0, 4.0);

            // 2. MEDICAL RECORD
            $hasAllergies = $faker->boolean(40);
            $allergies = $hasAllergies ? implode(', ', $faker->randomElements($allergiesBank, $faker->numberBetween(1, 3))) : null;

            $student->update([
                // Core fields
                'program' => $program,
                'section' => $section,
                'year_level' => $yearLevel,
                'gpa' => $gpa,

                // Medical
                'blood_type' => $faker->randomElement($bloodTypes),
                'allergies' => $allergies,
                'medical_condition' => $faker->boolean(20) ? $faker->sentence(6) : null,
                'disabilities' => $faker->boolean(10) ? 'Dyslexia' : null,

                // Sports & Activities
                'sports_activities' => [
                    'sportsPlayed' => $faker->boolean(70) ? $faker->randomElements($sportsBank, $faker->numberBetween(1, 3)) : [],
                    'schoolTeam' => $faker->boolean(30) ? [$faker->randomElement($sportsBank) . ' Varsity Team'] : [],
                    'competitions' => $faker->boolean(50) ? ['Regional ' . $faker->randomElement($sportsBank) . ' Tournament 2024'] : [],
                    'achievements' => $faker->boolean(20) ? ['MVP ' . $faker->randomElement($sportsBank) . ' 2023'] : [],
                ],

                // Organizations
                'organizations' => [
                    'clubs' => $faker->randomElements($clubsBank, $faker->numberBetween(1, 3)),
                    'fraternities' => $faker->boolean(10) ? 'Alpha Phi Omega' : null,
                    'studentCouncil' => $faker->boolean(15) ? ['Student Council ' . $faker->randomElement($rolesBank)] : [],
                    'roles' => $faker->boolean(40) ? [$faker->randomElement($clubsBank) . ' - ' . $faker->randomElement($rolesBank)] : [],
                ],

                // Behavior & Discipline
                'behavior_discipline_records' => [
                    'warnings' => $faker->numberBetween(0, 3),
                    'suspensions' => $faker->boolean(10) ? 1 : 0,
                    'counseling' => $faker->numberBetween(0, 4),
                    'incidents' => $faker->boolean(20) ? $faker->sentence(10) : 'No incidents recorded',
                    'counselingRecords' => $faker->boolean(30) ? $faker->sentence(8) : 'No counseling records',
                ],

                // Events & Competitions
                'events_participated' => [
                    'quizBee' => $faker->boolean(30) ? $faker->randomElements($quizBeeBank, $faker->numberBetween(1, 2)) : [],
                    'programming' => $faker->boolean(40) ? $faker->randomElements($programmingBank, $faker->numberBetween(1, 3)) : [],
                    'athletic' => $faker->boolean(20) ? ['Intramurals 2024 - ' . $faker->randomElement($sportsBank)] : [],
                ],

                // Academic details
                'current_subjects' => $faker->randomElements(['Web Development', 'Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering', 'Networking', 'Operating Systems', 'Discrete Mathematics'], $faker->numberBetween(3, 6)),
                'academic_awards' => $faker->boolean(30) ? $faker->randomElements(["Dean's Lister", 'With Honors', 'Academic Excellence Award', 'Best in Thesis'], $faker->numberBetween(1, 2)) : [],
            ]);

            // ACADEMIC RECORDS — clear existing and regenerate
            $student->academicRecords()->delete();

            $numRecords = $faker->numberBetween(1, 3);
            for ($i = 1; $i <= $numRecords; $i++) {
                $yearSuffix = match ($i) { 1 => 'st', 2 => 'nd', 3 => 'rd', default => 'th' };
                \App\Models\AcademicRecord::create([
                    'student_id' => $student->id,
                    'course_name' => $program === 'BSIT' ? 'BS Information Technology' : 'BS Computer Science',
                    'year_level' => "{$i}{$yearSuffix} Year",
                    'semester' => $faker->randomElement(['1st', '2nd']),
                    'gpa' => $faker->randomFloat(2, 1.0, 3.0),
                    'current_subjects' => $faker->randomElements(['Web Development', 'Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering', 'Networking'], $faker->numberBetween(3, 5)),
                    'academic_awards' => $faker->boolean(30) ? ["Dean's Lister"] : [],
                    'quiz_bee_participations' => $faker->boolean(25) ? $faker->randomElements($quizBeeBank, $faker->numberBetween(1, 2)) : [],
                    'programming_contests' => $faker->boolean(35) ? $faker->randomElements($programmingBank, $faker->numberBetween(1, 2)) : [],
                ]);
            }
        }

        $this->command->info('Successfully seeded profiles and academic records for ' . $students->count() . ' students!');
    }
}
