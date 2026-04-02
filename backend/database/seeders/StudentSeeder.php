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

        $studentUsers = User::where('is_student', true)->get();

        foreach ($studentUsers as $user) {
            // e.g., 2019-miit-CSE-001
            $emailBase = explode('@', $user->email)[0];
            $parts     = explode('-', $emailBase); // [2019, miit, CSE, 001]

            $year       = $parts[0];
            $major      = $parts[2];
            $rollNumber = (int) $parts[3];

            $majorId = $major == 'CSE' ? 1 : 2;

            $student_data[] = [
                'user_id'           => $user->id,
                'gpa'               => mt_rand(200, 390) / 100,
                'major_id'          => $majorId,
                'phone_number'      => $this->generateMyanmarPhoneNumber(),
                "graduation_status" => "Active",
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
