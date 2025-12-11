<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar; // Necessary for cache clearing

class DatabaseSeeder extends Seeder
{
    // The WithoutModelEvents trait is typically used at the class level
    // use WithoutModelEvents; 

    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            RankSeeder::class,
            DepartmentSeeder::class,
            MajorSeeder::class,
            UserSeeder::class,
            StudentSeeder::class,
        ]);

        // app()->make(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
