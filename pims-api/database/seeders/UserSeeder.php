<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    protected static ?string $password;

    public function run(): void
    {
        $this->seedAdminData();
        $this->seedFacultyData();
        $this->seedStudentData();
    }

    private function seedAdminData()
    {
        $adminPassword         = Hash::make('admin@123');
        $icPassword            = Hash::make('miit@123');
        $studentAffairPassword = Hash::make('studentaffair@123');

        $admin_data = [
            [
                'name'       => 'Dr. Win Aye',
                'email'      => 'win_aye@miit.edu.mm',
                'is_student' => false,
                'password'   => $icPassword,
            ],
            [
                'name'       => 'Dr. Myat Thuzar Tun',
                'email'      => 'myat_thuzar_tun@miit.edu.mm',
                'is_student' => false,
                'password'   => $icPassword,
            ],
            [
                'name'       => 'Daw Khaing Nyunt Myaing',
                'email'      => 'khaing_nyunt_myaing@miit.edu.mm',
                'is_student' => false,
                'password'   => $icPassword,
            ],
            [
                'name'       => 'Admin',
                'email'      => 'admin@miit.edu.mm',
                'is_student' => false,
                'password'   => $adminPassword,
            ],
            [
                'name'       => 'Student Affairs',
                'email'      => 'student_affairs@miit.edu.mm',
                'is_student' => false,
                'password'   => $studentAffairPassword,
            ],
        ];
        User::insert($admin_data);
    }

    private function seedFacultyData()
    {
        $facultyPassword = Hash::make('faculty@123');
        $faculty_data    = [];

        $faculty_data[] = [
            'name'       => 'Daw Khaine Aye San',
            'email'      => "khaine_aye_san@miit.edu.mm",
            'is_student' => false,
            'password'   => $facultyPassword,
        ];

        $maleNames   = ['Aung', 'Kyaw', 'Min', 'Tun', 'Soe', 'Naing'];
        $femaleNames = ['Moe', 'May', 'Hnin', 'Yin', 'Nwe', 'Thiri'];

        for ($i = 0; $i < 100; $i++) {
            $isMale = $i % 2 == 0;

            $name = $isMale
                ? $this->generateName($maleNames, 'U')
                : $this->generateName($femaleNames, 'Daw');

            $emailPrefix = str_replace(
                ['u ', 'daw ', ' '],
                ['', '', '_'],
                strtolower($name)
            );

            $faculty_data[] = [
                'name'  => $name,
                'email' => "{$emailPrefix}@miit.edu.mm",
                'is_student' => false,
                'password'   => $facultyPassword,
            ];
        }
        DB::table('users')->insert($faculty_data);
    }

    private function seedStudentData()
    {
        $studentPassword = Hash::make('student@123');
        $student_data    = [];

        $maleNames   = ['Aung', 'Kyaw', 'Min', 'Tun', 'Soe', 'Naing'];
        $femaleNames = ['Moe', 'May', 'Hnin', 'Yin', 'Nwe', 'Thiri'];

        // $year_sems = ['2019' => 1, '2021' => 2, '2022' => 3, '2023' => 4, '2024' => 5];
        $year_sems   = ['2019' => 1];
        $majors      = ['cse', 'ece'];
        $rollNumbers = range(1, 60);

        foreach ($year_sems as $year => $sem_id) {
            foreach ($majors as $major) {
                foreach ($rollNumbers as $rollNumber) {
                    $formattedRoll = str_pad($rollNumber, 3, '0', STR_PAD_LEFT);
                    $email         = "{$year}-miit-{$major}-{$formattedRoll}@miit.edu.mm";
                    $isMale        = $rollNumber % 2 == 0;

                    $name = $isMale
                        ? $this->generateName($maleNames, 'Mg')
                        : $this->generateName($femaleNames, 'Ma');

                    $student_data[] = [
                        'name'       => $name,
                        'email'      => $email,
                        'is_student' => true,
                        'password'   => $studentPassword,
                    ];
                }
            }
        }

        DB::table('users')->insert($student_data);
    }

    private function generateName(array $nameParts, string $prefix): string
    {
        shuffle($nameParts);
        $selectedParts = array_slice($nameParts, 0, rand(2, 3));
        return $prefix . ' ' . implode(' ', $selectedParts);
    }
}
