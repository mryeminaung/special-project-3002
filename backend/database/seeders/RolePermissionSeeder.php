<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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

        $roles = ['IC', 'Student Affairs', 'Supervisor', 'Faculty', 'Student'];
        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }

        $icPermissions = ['approve proposal', 'reject proposal'];
        foreach ($icPermissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $permissions = ['create project proposal', 'update project proposal', 'update projects', 'delete projects'];
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
    }
}
