<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    // The WithoutModelEvents trait is typically used at the class level
    // use WithoutModelEvents; 

    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            RankSeeder::class,
            DepartmentSeeder::class,
            MajorSeeder::class,
            UserSeeder::class,
            FacultySeeder::class,
            StudentSeeder::class,
        ]);

        $superUsers = User::where('is_student', false)->take(3)->get();
        foreach ($superUsers as $user) {
            $user->assignRole('IC');
            $user->save();
            $user->refresh();
        }

        $studentAffairs = User::where('email', 'student_affairs@miit.edu.mm')->first();
        $studentAffairs->assignRole('Student Affairs');
        $studentAffairs->save();
        $studentAffairs->refresh();

        $faculties = User::where('is_student', false)->offset(4)->take(100)->get();
        foreach ($faculties as $faculty) {
            $faculty->assignRole('Faculty');
            $faculty->save();
            $faculty->refresh();
        }

        $students = User::where('is_student', true)->get();
        foreach ($students as $student) {
            $student->assignRole('Student');
            $student->save();
            $student->refresh();
        };
    }
}
