<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB; // Use DB::table for direct insert

class UserSeeder extends Seeder
{
    protected static ?string $password;

    public function run(): void
    {
        $year_sems = ['2019' => 1, '2021' => 2, '2022' => 3, '2023' => 4, '2024' => 5];
        $majors = ['cse', 'ece'];
        $rollNumbers = range(1, 60);

        $maleNames = ['Aung', 'Kyaw', 'Min', 'Tun', 'Soe', 'Naing'];
        $femaleNames = ['Moe', 'May', 'Hnin', 'Yin', 'Nwe', 'Thiri'];

        $user_data = [];
        $now = now();
        $defaultPassword = static::$password ??= Hash::make('password');

        // --- Data Generation Loop for Users ---
        foreach ($year_sems as $year => $sem_id) {
            foreach ($majors as $major) {
                foreach ($rollNumbers as $rollNumber) {
                    $formattedRoll = str_pad($rollNumber, 3, '0', STR_PAD_LEFT);
                    $email = "{$year}-miit-{$major}-{$formattedRoll}@miit.edu.mm";
                    $isMale = $rollNumber % 2 == 0;

                    $name = $isMale
                        ? $this->generateName($maleNames, 'Mg')
                        : $this->generateName($femaleNames, 'Ma');

                    $user_data[] = [
                        'name' => $name,
                        'email' => $email,
                        'is_student' => true,
                        'password' => $defaultPassword,
                        // 'created_at' => $now,
                        // 'updated_at' => $now,
                    ];
                }
            }
        }

        // Use DB::table for bulk insertion without auto-incrementing IDs
        DB::table('users')->insert($user_data);

        // Optional: Create an admin user separately
        // User::create([
        //     'name' => 'Admin IIC',
        //     'email' => 'iic@miit.edu.mm',
        //     'password' => $defaultPassword,
        // ]);
    }

    private function generateName(array $nameParts, string $prefix): string
    {
        shuffle($nameParts);
        $selectedParts = array_slice($nameParts, 0, rand(2, 3));
        return $prefix . ' ' . implode(' ', $selectedParts);
    }
}
