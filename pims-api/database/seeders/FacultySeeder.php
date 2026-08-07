<?php
namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUsers = User::where('is_student', false)->take(3)->get();
        $stuAffair  = User::where('email', "student_affairs@miit.edu.mm")->first();
        $superUser  = User::where('email', "khaine_aye_san@miit.edu.mm")->first();
        $adminUser  = User::where('email', "admin@miit.edu.mm")->first();

        $facultyUsers = User::where('is_student', false)
            ->orderBy('id', 'asc')
            ->offset(6)
            ->get();

        $rector     = $adminUsers->first();
        $proRectors = $adminUsers->slice(1, 2);

        $faculty_data = [];

        $faculty_data[] = [
            'phone_number'  => $this->generateMyanmarPhoneNumber(),
            'user_id'       => $rector->id,
            'rank_id'       => 1,
            'department_id' => 1,
        ];

        foreach ($proRectors as $proRector) {
            $faculty_data[] = [
                'phone_number'  => $this->generateMyanmarPhoneNumber(),
                'user_id'       => $proRector->id,
                'rank_id'       => 2,
                'department_id' => 1,
            ];
        }

        $faculty_data[] = [
            'phone_number'  => $this->generateMyanmarPhoneNumber(),
            'user_id'       => $adminUser->id,
            'rank_id'       => 1,
            'department_id' => 1,
        ];

        $faculty_data[] = [
            'phone_number'  => $this->generateMyanmarPhoneNumber(),
            'user_id'       => $stuAffair->id,
            'rank_id'       => 8,
            'department_id' => 1,
        ];

        $faculty_data[] = [
            'phone_number'  => $this->generateMyanmarPhoneNumber(),
            'user_id'       => $superUser->id,
            'rank_id'       => 4,
            'department_id' => 4,
        ];

        foreach ($facultyUsers as $facultyUser) {
            $faculty_data[] = [
                'phone_number'  => $this->generateMyanmarPhoneNumber(),
                'user_id'       => $facultyUser->id,
                'rank_id'       => fake()->numberBetween(3, 7),
                'department_id' => fake()->numberBetween(3, 8),
            ];
        }
        Faculty::insert($faculty_data);
    }

    private function generateMyanmarPhoneNumber(): string
    {
        $operatorDigit   = fake()->randomElement([9, 2, 4, 7]);
        $remainingDigits = fake()->numerify('########');

        return '09' . $operatorDigit . $remainingDigits;
    }
}
