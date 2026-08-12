<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
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
        $facultyRole        = Role::findByName('faculty');
        $studentRole        = Role::findByName('student');

        $adminUser = User::where('email', 'admin@miit.edu.mm')->first();
        $adminUser->assignRole($adminRole);

        $icEmails = ['win_aye@miit.edu.mm', 'myat_thuzar_tun@miit.edu.mm', 'khaing_nyunt_myaing@miit.edu.mm'];
        User::whereIn('email', $icEmails)->each(fn($u) => $u->assignRole($icRole));

        $studentAffairs = User::where('email', 'student_affairs@miit.edu.mm')->first();
        $studentAffairs->assignRole($studentAffairsRole);

        // faculty = all non-student emails excluding known admin/ic/student-affairs accounts
        $excludedEmails = array_merge($icEmails, ['admin@miit.edu.mm', 'student_affairs@miit.edu.mm']);
        User::whereNotLike('email', '____-miit-%')
            ->whereNotIn('email', $excludedEmails)
            ->each(fn($u) => $u->assignRole($facultyRole));

        // students have emails matching: {year}-miit-{major}-{roll}@miit.edu.mm
        User::whereLike('email', '____-miit-%')
            ->each(fn($u) => $u->assignRole($studentRole));
    }
}
