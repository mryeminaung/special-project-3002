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
            ['name' => 'Computer Science'],
            ['name' => 'Computer Systems and Software'],
            ['name' => 'Electronic and Communication Engineering'],
            ['name' => 'Information Technology'],
            ['name' => 'Mechanical Engineering'],
        ]);
    }
}
