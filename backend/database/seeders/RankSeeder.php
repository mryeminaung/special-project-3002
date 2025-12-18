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
            ['name' => 'Rector'],
            ['name' => 'Pro-Rector'],
            ['name' => 'Professor'],
            ['name' => 'Associate Professor'],
            ['name' => 'Lecturer'],
            ['name' => 'Assistant Lecturer'],
            // ['name' => 'Student'],
        ]);
    }
}
