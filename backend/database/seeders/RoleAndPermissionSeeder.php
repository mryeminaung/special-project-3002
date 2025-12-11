<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rolesData = [
            ['name' => 'IIC', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Student Affairs', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Supervisor', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Student', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
        ];

        $permissionsData = [
            ['name' => 'create projects', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'view projects', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'update projects', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'delete projects', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
        ];

        Role::insert($rolesData);
        Permission::insert($permissionsData);

        $iicRole = Role::where('name', 'IIC')->first();
        $iicRole->syncPermissions(Permission::pluck('name'));
    }
}
