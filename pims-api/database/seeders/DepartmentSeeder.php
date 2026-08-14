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
            [
                'name' => 'MIIT',
                'slug' => 'miit',
                'code' => 'MIIT',
                'description' => 'Myanmar Institute of Information Technology — the parent institution overseeing all academic and administrative departments.',
            ],
            [
                'name' => 'Student Affairs',
                'slug' => 'student-affairs',
                'code' => 'SA',
                'description' => 'Handles student welfare, extracurricular activities, campus life, and student support services.',
            ],
            [
                'name' => 'Data Center',
                'slug' => 'data-center',
                'code' => 'DC',
                'description' => 'Manages institutional data infrastructure, database systems, and data governance across the institute.',
            ],
            [
                'name' => 'Faculty of Computer Science',
                'slug' => 'faculty-of-computer-science',
                'code' => 'FCS',
                'description' => 'Covers theoretical and applied computer science including algorithms, systems, and software engineering.',
            ],
            [
                'name' => 'Faculty of Information Science',
                'slug' => 'faculty-of-information-science',
                'code' => 'FIS',
                'description' => 'Focuses on information systems, data management, and the intersection of technology and business processes.',
            ],
            [
                'name' => 'Faculty of Computing',
                'slug' => 'faculty-of-computing',
                'code' => 'FC',
                'description' => 'Broad computing faculty covering programming, web technologies, and practical software development.',
            ],
            [
                'name' => 'Department of Information Technology',
                'slug' => 'department-of-information-technology',
                'code' => 'DIT',
                'description' => 'Specializes in IT infrastructure, networking, cybersecurity, and enterprise technology solutions.',
            ],
            [
                'name' => 'Department of Natural Science',
                'slug' => 'department-of-natural-science',
                'code' => 'DNS',
                'description' => 'Provides foundational courses in mathematics, physics, and other natural sciences for tech students.',
            ],
            [
                'name' => 'Department of English',
                'slug' => 'department-of-english',
                'code' => 'DE',
                'description' => 'Offers English language proficiency courses and communication skills training for all students.',
            ],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
