<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Department::insert([
            ['name' => 'MIIT'],
            ['name' => 'Student Affairs'],
            ['name' => 'Data Center'],
            ['name' => 'Faculty of Computer Science'],
            ['name' => 'Faculty of Information Science'],
            ['name' => 'Faculty of Computing'],
            ['name' => 'Department of Information Technology'],
            ['name' => 'Department of Natural Science'],
            ['name' => 'Department of English'],
        ]);
    }
}
