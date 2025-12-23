<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
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

        app()->make(PermissionRegistrar::class)->forgetCachedPermissions();

        $icRole = Role::findByName('IC');
        $studentAffairsRole = Role::findByName('Student Affairs');
        $supervisorRole = Role::findByName('Supervisor');
        $studentRole = Role::findByName('Student');
        $facultyRole = Role::findByName('Faculty');

        $icRole->syncPermissions(['approve proposal', 'reject proposal']);

        $superUsers = User::where('is_student', false)->take(3)->get();
        foreach ($superUsers as $user) {
            $user->assignRole($icRole);
            $user->save();
            $user->refresh();
        }

        $studentAffairs = User::where('email', 'student_affairs@miit.edu.mm')->first();
        $studentAffairs->assignRole($studentAffairsRole);
        $studentAffairs->save();
        $studentAffairs->refresh();

        $faculties = User::where('is_student', false)->offset(4)->take(19)->get();
        foreach ($faculties as $faculty) {
            $faculty->assignRole($facultyRole);
            $faculty->save();
            $faculty->refresh();
        }

        $students = User::where('is_student', true)->get();
        foreach ($students as $student) {
            $student->assignRole($studentRole);
            $student->save();
            $student->refresh();
        };
    }
}
