<?php
namespace Database\Seeders;

use App\Models\ProjectArea;
use Illuminate\Database\Seeder;

class ProjectAreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = [
            ['name' => 'General', 'description' => 'Projects that do not fit into a specific category or cover multiple areas.'],
            ['name' => 'Artificial Intelligence', 'description' => 'Projects related to machine learning, deep learning, and AI applications.'],
            ['name' => 'Data Science', 'description' => 'Projects focused on data analysis, visualization, and big data processing.'],
            ['name' => 'Cybersecurity', 'description' => 'Projects that address security challenges in software and networks.'],
            ['name' => 'Software Development', 'description' => 'Projects involving web development, mobile apps, and software engineering.'],
            ['name' => 'Internet of Things (IoT)', 'description' => 'Projects that integrate physical devices with the internet for smart solutions.'],
            ['name' => 'Cloud Computing', 'description' => 'Projects utilizing cloud platforms and services for scalable solutions.'],
            ['name' => 'Blockchain', 'description' => 'Projects involving distributed ledger technology and smart contracts.'],
            ['name' => 'Robotics', 'description' => 'Projects focused on designing and programming robots.'],
            ['name' => 'Augmented Reality (AR)', 'description' => 'Projects that blend digital content with the real world.'],
            ['name' => 'Virtual Reality (VR)', 'description' => 'Projects creating immersive digital environments.'],
            ['name' => 'Bioinformatics', 'description' => 'Projects applying computational techniques to biological data.'],
            ['name' => 'Game Development', 'description' => 'Projects related to designing and programming games.'],
            ['name' => 'Embedded Systems', 'description' => 'Projects involving hardware-software integration for specialized devices.'],
            ['name' => 'Natural Language Processing', 'description' => 'Projects focused on understanding and generating human language.'],
            ['name' => 'Edge Computing', 'description' => 'Projects processing data near the source for real-time applications.'],
        ];

        foreach ($areas as $area) {
            ProjectArea::create($area);
        }
    }
}
