<?php
namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        // IC users (also faculty)
        $icEmails     = ['win_aye@miit.edu.mm', 'myat_thuzar_tun@miit.edu.mm', 'khaing_nyunt_myaing@miit.edu.mm'];
        $adminUsers   = User::whereIn('email', $icEmails)->orderBy('id')->get();

        // Special users
        $stuAffair    = User::where('email', 'student_affairs@miit.edu.mm')->first();
        $superUser    = User::where('email', 'khaine_aye_san@miit.edu.mm')->first();
        $adminUser    = User::where('email', 'admin@miit.edu.mm')->first();

        // Regular faculty (exclude students, admin, ic, student-affairs)
        $excludedEmails = array_merge($icEmails, ['admin@miit.edu.mm', 'student_affairs@miit.edu.mm', 'khaine_aye_san@miit.edu.mm']);
        $facultyUsers = User::whereNotLike('email', '____-miit-%')
            ->whereNotIn('email', $excludedEmails)
            ->orderBy('id', 'asc')
            ->get();

        $rector     = $adminUsers->first();
        $proRectors = $adminUsers->slice(1, 2);

        $faculty_data = [];

        // IC users → Faculty records with ranks and departments
        // win_aye (first IC) → Rector (only one)
        $faculty_data[] = [
            'phone_number'  => $this->generateMyanmarPhoneNumber(),
            'user_id'       => $rector->id,
            'rank_id'       => 1, // Rector (only one)
            'department_id' => 1, // MIIT
        ];

        // Other IC users → Pro-Rector
        foreach ($proRectors as $proRector) {
            $faculty_data[] = [
                'phone_number'  => $this->generateMyanmarPhoneNumber(),
                'user_id'       => $proRector->id,
                'rank_id'       => 2, // Pro-Rector
                'department_id' => 1, // MIIT
            ];
        }

        // Admin (admin@miit.edu.mm) → N/A rank
        $faculty_data[] = [
            'phone_number'  => $this->generateMyanmarPhoneNumber(),
            'user_id'       => $adminUser->id,
            'rank_id'       => null, // N/A
            'department_id' => 1, // MIIT
        ];

        // Student Affairs → Student Affairs rank, Student Affairs department
        $faculty_data[] = [
            'phone_number'  => $this->generateMyanmarPhoneNumber(),
            'user_id'       => $stuAffair->id,
            'rank_id'       => 8, // Student Affairs
            'department_id' => 2, // Student Affairs
        ];

        // khaine_aye_san → Associate Professor, FCS department
        $faculty_data[] = [
            'phone_number'  => $this->generateMyanmarPhoneNumber(),
            'user_id'       => $superUser->id,
            'rank_id'       => 5, // Associate Professor
            'department_id' => 4, // Faculty of Computer Science
        ];

        // Regular faculty
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
