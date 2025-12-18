<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faculty_data = [];

        $adminUsers = User::where('is_student', false)->take(3)->get();
        $facultyUsers = User::where('is_student', false)->offset(4)->take(100)->get();

        $rector = $adminUsers->first();
        $proRectors = $adminUsers->slice(1, 2);

        $faculty_data[] = [
            'phone_number' => $this->generateMyanmarPhoneNumber(),
            'user_id' => $rector->id,
            'rank_id' => 1,
            'department_id' => 1
        ];

        foreach ($proRectors as $proRector) {
            $faculty_data[] = [
                'phone_number' => $this->generateMyanmarPhoneNumber(),
                'user_id' => $proRector->id,
                'rank_id' => 2,
                'department_id' => 1
            ];
        }

        foreach ($facultyUsers as $facultyUser) {
            $faculty_data[] = [
                'phone_number' => $this->generateMyanmarPhoneNumber(),
                'user_id' => $facultyUser->id,
                'rank_id' => fake()->numberBetween(3, 6),
                'department_id' => fake()->numberBetween(1, 5)
            ];
        }
        Faculty::insert($faculty_data);
    }


    private function generateMyanmarPhoneNumber(): string
    {
        $operatorDigit = fake()->randomElement([9, 2, 4, 7]);
        $remainingDigits = fake()->numerify('########');

        return '09' . $operatorDigit . $remainingDigits;
    }
}
