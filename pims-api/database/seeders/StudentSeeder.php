<?php
namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $student_data = [];

        $studentUsers = User::whereLike('email', '____-miit-%')->get();

        foreach ($studentUsers as $user) {
            // e.g., 2019-miit-cse-001@miit.edu.mm
            $emailBase = explode('@', $user->email)[0];
            $parts     = explode('-', $emailBase); // [2019, miit, cse, 001]

            $major   = strtoupper($parts[2]);
            $majorId = $major === 'CSE' ? 1 : 2;

            $student_data[] = [
                'user_id'           => $user->id,
                'gpa'               => mt_rand(200, 390) / 100,
                'major_id'          => $majorId,
                'phone_number'      => $this->generateMyanmarPhoneNumber(),
                'graduation_status' => 'Active',
            ];
        }

        Student::insert($student_data);
    }

    private function generateMyanmarPhoneNumber(): string
    {
        $operatorDigit   = fake()->randomElement([9, 2, 4, 7]);
        $remainingDigits = fake()->numerify('########');

        return '09' . $operatorDigit . $remainingDigits;
    }
}
