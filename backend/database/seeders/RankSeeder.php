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
                'description' => 'The executive head and chief academic officer of the institution.'
            ],
            [
                'name' => 'Pro-Rector',
                'description' => 'The deputy to the Rector, assisting in institutional management.'
            ],
            [
                'name' => 'Professor',
                'description' => 'A senior academic leader recognized for excellence in research and teaching.'
            ],
            [
                'name' => 'Associate Professor',
                'description' => 'A mid-level academic with significant experience in their field.'
            ],
            [
                'name' => 'Lecturer',
                'description' => 'A faculty member primarily responsible for delivering course instruction.'
            ],
            [
                'name' => 'Assistant Lecturer',
                'description' => 'A junior faculty member assisting in teaching and academic duties.'
            ],
            [
                'name' => 'Tutor',
                'description' => 'An entry-level role providing academic support and small-group guidance.'
            ],
        ]);
    }
}
