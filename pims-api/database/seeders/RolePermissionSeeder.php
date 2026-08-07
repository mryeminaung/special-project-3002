<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()->make(PermissionRegistrar::class)->forgetCachedPermissions();

        $roles = ["admin", 'ic', 'student-affairs', 'supervisor', 'faculty', 'student'];

        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }

        // $icPermissions = ['approve proposal', 'reject proposal'];
        // foreach ($icPermissions as $permission) {
        //     Permission::create(['name' => $permission]);
        // }

        // $permissions = ['create proposal', 'edit proposal', 'edit project', 'delete project', 'submit reports', 'create tasks', 'edit tasks', 'delete tasks'];

        // foreach ($permissions as $permission) {
        //     Permission::create(['name' => $permission]);
        // }
    }
}
