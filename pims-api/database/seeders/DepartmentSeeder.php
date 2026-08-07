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
        $departments = [
            ['name' => 'MIIT', 'slug' => 'miit', 'code' => 'MIIT'],
            ['name' => 'Student Affairs', 'slug' => 'student-affairs', 'code' => 'SA'],
            ['name' => 'Data Center', 'slug' => 'data-center', 'code' => 'DC'],
            ['name' => 'Faculty of Computer Science', 'slug' => 'faculty-of-computer-science', 'code' => 'FCS'],
            ['name' => 'Faculty of Information Science', 'slug' => 'faculty-of-information-science', 'code' => 'FIS'],
            ['name' => 'Faculty of Computing', 'slug' => 'faculty-of-computing', 'code' => 'FC'],
            ['name' => 'Department of Information Technology', 'slug' => 'department-of-information-technology', 'code' => 'DIT'],
            ['name' => 'Department of Natural Science', 'slug' => 'department-of-natural-science', 'code' => 'DNS'],
            ['name' => 'Department of English', 'slug' => 'department-of-english', 'code' => 'DE'],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
