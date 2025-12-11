<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class StudentSeeder extends Seeder
{
    protected $faker;

    public function __construct()
    {
        $this->faker = Faker::create();
    }

    public function run(): void
    {
        $studentRole = Role::where('name', 'Student')->first();
        if (!$studentRole) {
            $this->command->warn('Student Role not found! Skipping.');
            return;
        }

        $student_data = [];
        $roleAssignments = [];
        $now = now();

        $studentUsers = User::where('is_student', true)->get();

        // 2. Loop through each user to assign details and role
        foreach ($studentUsers as $user) {
            // --- Logic to derive student attributes from email ---

            // e.g., 2019-miit-CSE-001
            $emailBase = explode('@', $user->email)[0];
            $parts = explode('-', $emailBase); // [2019, miit, CSE, 001]

            $year = $parts[0];
            $major = $parts[2];
            $rollNumber = (int)$parts[3];

            $majorId = $major == 'CSE' ? 1 : 2;
            $semId = match ((int)$year) {
                2019 => 1,
                2021 => 2,
                2022 => 3,
                2023 => 4,
                2024 => 5
            };
            $formattedRoll = str_pad($rollNumber, 3, '0', STR_PAD_LEFT);

            $studentIdNum = "{$year}{$majorId}{$formattedRoll}";

            $student_data[] = [
                'user_id' => $user->id,
                'gpa' => mt_rand(200, 390) / 100,
                'major_id' => $majorId,
                'phone_number' => $this->generateMyanmarPhoneNumber(),
                "graduation_status" => "Active",
                // 'created_at' => $now,
                // 'updated_at' => $now,
            ];
        }

        Student::insert($student_data);
        // DB::table('model_has_roles')->insert($roleAssignments);

        app()->make(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    private function generateMyanmarPhoneNumber(): string
    {
        $prefix = '09';
        $numberSuffix = $this->faker->numerify(str_repeat('#', 9));
        return $prefix . $numberSuffix;
    }
}
