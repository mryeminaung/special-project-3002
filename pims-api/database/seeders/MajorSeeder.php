<?php

namespace Database\Seeders;

use App\Models\Major;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $majors =
            [
                ["name" => "CSE", "description" => " Computer Science & Engineering"],
                ["name" => "ECE", "description" => "Electronics & Communication Engineering"],
            ];

        foreach ($majors as $major) {
            Major::create($major);
        }
    }
}
