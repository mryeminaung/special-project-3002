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
        $roles = ['admin', 'ic', 'student-affairs', 'supervisor', 'faculty', 'student', 'examiner'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Permissions
        $permissions = [
            // Proposals
            'approve-proposal',
            'reject-proposal',

            // Projects
            'mark-project-complete',
            'manage-examiners',
            'set-seminar-deadlines',
            'update-report-status',
            'update-seminar-status',

            // Announcements
            'manage-announcements',
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
        ]);

        Role::findByName('supervisor')->syncPermissions([
            'manage-examiners',
            'set-seminar-deadlines',
            'update-report-status',
            'update-seminar-status',
        ]);
    }
}
