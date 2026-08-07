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
            ProjectAreaSeeder::class,
        ]);

        app()->make(PermissionRegistrar::class)->forgetCachedPermissions();

        $adminRole          = Role::findByName('admin');
        $icRole             = Role::findByName('ic');
        $studentAffairsRole = Role::findByName('student-affairs');
        $supervisorRole     = Role::findByName('supervisor');
        $studentRole        = Role::findByName('student');
        $facultyRole        = Role::findByName('faculty');

        $adminUser = User::where('email', 'admin@miit.edu.mm')->first();
        $adminUser->assignRole($adminRole);
        $adminUser->save();
        $adminUser->refresh();

        // $icRole->syncPermissions(['approve proposal', 'reject proposal']);

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

        $faculties = User::where('is_student', false)
            ->offset(6)
            ->orderBy('id', 'desc')
            ->get();
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
        }
    }
}
