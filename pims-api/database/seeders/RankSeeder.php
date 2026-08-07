<?php

namespace Database\Seeders;

use App\Models\Rank;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Rank::insert([
            [
                'name' => 'Rector',
                'description' => 'Responsible for overall leadership and management of the institution.'
            ],
            [
                'name' => 'Pro-Rector',
                'description' => 'Assists the Rector in managing academic and administrative affairs.'
            ],
            [
                'name' => 'Professor',
                'description' => 'Leads research and teaching activities at the highest academic level.'
            ],
            [
                'name' => 'Associate Professor',
                'description' => 'Experienced academic contributing to research and teaching.'
            ],
            [
                'name' => 'Lecturer',
                'description' => 'Delivers lectures and supports student learning.'
            ],
            [
                'name' => 'Assistant Lecturer',
                'description' => 'Supports lecturers in teaching and academic tasks.'
            ],
            [
                'name' => 'Tutor',
                'description' => 'Provides academic guidance and support to students.'
            ],
            [
                'name' => 'Student Affairs',
                'description' => 'Handles student services and supports student development.'
            ],
        ]);
    }
}
