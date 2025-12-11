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
        $ranks = [
            ['name' => 'Rector'],
            ['name' => 'Pro-Rector'],
            ['name' => 'Professor'],
            ['name' => 'Associate Professor (AP)'],
            ['name' => 'Lecturer (Lect)'],
            ['name' => 'Assistant Lecturer (AL)'],
            ['name' => 'Tutor'],
            ['name' => 'Student'],
        ];
        Rank::insert($ranks);
    }
}
