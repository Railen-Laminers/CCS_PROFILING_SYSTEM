<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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

        $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        
        // Data banks for randomized selection
        $allergiesBank = ['Peanuts', 'Dust mites', 'Pollen', 'Seafood', 'Dairy', 'Latex'];
        $sportsBank = ['Basketball', 'Volleyball', 'Badminton', 'Tennis', 'Swimming', 'Track and Field', 'Chess', 'Football'];
        $clubsBank = ['Computer Science Society', 'Math Club', 'Debate Society', 'Drama Club', 'Photography Club', 'Red Cross Youth'];
        $rolesBank = ['President', 'Vice President', 'Secretary', 'Treasurer', 'Auditor', 'Member'];
        
        $programmingBank = ['ICPC Regional', 'Google Hash Code', 'Hackathon 2024', 'CodeForces Round', 'University Coding Challenge'];
        $quizBeeBank = ['National IT Quiz Bee', 'Math Olympiad', 'Science Trivia', 'History Bee'];

        foreach ($students as $student) {
            // 1. MEDICAL RECORD
            $hasAllergies = $faker->boolean(40);
            $allergies = $hasAllergies ? implode(', ', $faker->randomElements($allergiesBank, $faker->numberBetween(1, 3))) : null;
            
            $student->update([
                'blood_type' => $faker->randomElement($bloodTypes),
                'allergies' => $allergies,
                'medical_condition' => $faker->boolean(20) ? $faker->sentence(6) : null,
                'disabilities' => $faker->boolean(10) ? 'Dyslexia' : null,
                
                // 2. SPORTS & ACTIVITIES
                'sports_activities' => [
                    'sportsPlayed' => $faker->boolean(70) ? $faker->randomElements($sportsBank, $faker->numberBetween(1, 3)) : [],
                    'schoolTeam' => $faker->boolean(30) ? [$faker->randomElement($sportsBank) . ' Varsity Team'] : [],
                    'competitions' => $faker->boolean(50) ? ['Regional ' . $faker->randomElement($sportsBank) . ' Tournament 2024'] : [],
                    'achievements' => $faker->boolean(20) ? ['MVP ' . $faker->randomElement($sportsBank) . ' 2023'] : [],
                ],
                
                // 3. ORGANIZATIONS
                'organizations' => [
                    'clubs' => $faker->randomElements($clubsBank, $faker->numberBetween(1, 3)),
                    'fraternities' => $faker->boolean(10) ? 'Alpha Phi Omega' : null,
                    'studentCouncil' => $faker->boolean(15) ? ['Student Council ' . $faker->randomElement($rolesBank)] : [],
                    'roles' => $faker->boolean(40) ? [$faker->randomElement($clubsBank) . ' - ' . $faker->randomElement($rolesBank)] : [],
                ],

                // 4. BEHAVIOR & DISCIPLINE
                'behavior_discipline_records' => [
                    'warnings' => $faker->numberBetween(0, 3),
                    'suspensions' => $faker->numberBetween(0, 1) === 1 ? $faker->numberBetween(0, 1) : 0, // Rare suspensions
                    'counseling' => $faker->numberBetween(0, 4),
                    'incidents' => $faker->boolean(20) ? [$faker->sentence(10), 'Late for class 3 times'] : null,
                    'counselingRecords' => $faker->boolean(30) ? [$faker->sentence(8)] : null,
                ],

                // 5. EVENTS & COMPETITIONS
                'events_participated' => [
                    'quizBee' => $faker->boolean(30) ? $faker->randomElements($quizBeeBank, $faker->numberBetween(1, 2)) : [],
                    'programming' => $faker->boolean(40) ? $faker->randomElements($programmingBank, $faker->numberBetween(1, 3)) : [],
                    'athletic' => $faker->boolean(20) ? ['Intramurals 2024 - ' . $faker->randomElement($sportsBank)] : [],
                ]
            ]);

            // 6. ACADEMIC RECORDS (Generate 1-3 distinct academic records per student)
            // First, clear any existing academic records for this student so we don't infinitely stack them on re-runs
            $student->academicRecords()->delete();
            
            $numRecords = $faker->numberBetween(1, 3);
            for ($i = 1; $i <= $numRecords; $i++) {
                \App\Models\AcademicRecord::create([
                    'student_id' => $student->id,
                    'course_name' => $student->program ?? 'BS Information Technology',
                    'year_level' => $i . ($i === 1 ? 'st' : ($i === 2 ? 'nd' : 'rd')) . ' Year',
                    'semester' => $faker->randomElement(['1st', '2nd']),
                    'gpa' => $faker->randomFloat(2, 1.0, 3.0), // Philippine grading system (1.0 is excellent)
                    'current_subjects' => $faker->randomElements(['Web Development', 'Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering', 'Networking'], $faker->numberBetween(3, 5)),
                    'academic_awards' => $faker->boolean(30) ? ['Dean\'s Lister'] : [],
                    'quiz_bee_participations' => [],
                    'programming_contests' => []
                ]);
            }
        }

        $this->command->info('Successfully seeded fully randomized profiles and academic records for ' . $students->count() . ' students!');
    }
}
