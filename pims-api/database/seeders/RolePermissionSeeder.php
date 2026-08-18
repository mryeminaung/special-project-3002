<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()->make(PermissionRegistrar::class)->forgetCachedPermissions();

        // Roles
        $roles = ['admin', 'ic', 'student-affairs', 'supervisor', 'faculty', 'student', 'examiner', 'team-leader'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Permissions
        $permissions = [
            // Proposals
            'approve-proposal',
            'reject-proposal',
            'view-all-proposals',
            'submit-proposal',

            // Projects
            'mark-project-complete',
            'manage-examiners',
            'set-seminar-deadlines',
            'update-report-status',
            'update-seminar-status',
            'upload-report',

            // Grades
            'give-grade',

            // Announcements
            'manage-announcements',

            // Admin
            'manage-events',
            'manage-departments',
            'manage-project-areas',
            'manage-faculties',
            'manage-students',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Assign permissions to roles
        Role::findByName('ic')->syncPermissions([
            'approve-proposal',
            'reject-proposal',
            'mark-project-complete',
            'manage-announcements',
            'view-all-proposals',
            'manage-events',
        ]);

        Role::findByName('supervisor')->syncPermissions([
            'manage-examiners',
            'set-seminar-deadlines',
            'update-report-status',
            'update-seminar-status',
            'view-all-proposals',
        ]);

        Role::findByName('faculty')->syncPermissions([
            'view-all-proposals',
        ]);

        Role::findByName('examiner')->syncPermissions([
            'give-grade',
        ]);

        Role::findByName('student')->syncPermissions([
            'submit-proposal',
        ]);

        Role::findByName('team-leader')->syncPermissions([
            'submit-proposal',
            'upload-report',
        ]);

        Role::findByName('student-affairs')->syncPermissions([
            'view-all-proposals',
        ]);

        Role::findByName('admin')->syncPermissions([
            'manage-departments',
            'manage-project-areas',
            'manage-faculties',
            'manage-students',
        ]);
    }
}
