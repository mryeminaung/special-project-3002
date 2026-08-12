<?php
namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        $icEmails     = ['win_aye@miit.edu.mm', 'myat_thuzar_tun@miit.edu.mm', 'khaing_nyunt_myaing@miit.edu.mm'];
        $adminUsers   = User::whereIn('email', $icEmails)->orderBy('id')->get();
        $stuAffair    = User::where('email', 'student_affairs@miit.edu.mm')->first();
        $superUser    = User::where('email', 'khaine_aye_san@miit.edu.mm')->first();
        $adminUser    = User::where('email', 'admin@miit.edu.mm')->first();

        $excludedEmails = array_merge($icEmails, ['admin@miit.edu.mm', 'student_affairs@miit.edu.mm', 'khaine_aye_san@miit.edu.mm']);
        $facultyUsers = User::whereNotLike('email', '____-miit-%')
            ->whereNotIn('email', $excludedEmails)
            ->orderBy('id', 'asc')
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
