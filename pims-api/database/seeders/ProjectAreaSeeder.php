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
            ['name' => 'General', 'slug' => 'general', 'description' => 'Projects that do not fit into a specific category or cover multiple areas.'],
            ['name' => 'Artificial Intelligence', 'slug' => 'artificial-intelligence', 'description' => 'Projects related to machine learning, deep learning, and AI applications.'],
            ['name' => 'Data Science', 'slug' => 'data-science', 'description' => 'Projects focused on data analysis, visualization, and big data processing.'],
            ['name' => 'Cybersecurity', 'slug' => 'cybersecurity', 'description' => 'Projects that address security challenges in software and networks.'],
            ['name' => 'Software Development', 'slug' => 'software-development', 'description' => 'Projects involving web development, mobile apps, and software engineering.'],
            ['name' => 'Internet of Things (IoT)', 'slug' => 'internet-of-things-iot', 'description' => 'Projects that integrate physical devices with the internet for smart solutions.'],
            ['name' => 'Cloud Computing', 'slug' => 'cloud-computing', 'description' => 'Projects utilizing cloud platforms and services for scalable solutions.'],
            ['name' => 'Blockchain', 'slug' => 'blockchain', 'description' => 'Projects involving distributed ledger technology and smart contracts.'],
            ['name' => 'Robotics', 'slug' => 'robotics', 'description' => 'Projects focused on designing and programming robots.'],
            ['name' => 'Augmented Reality (AR)', 'slug' => 'augmented-reality-ar', 'description' => 'Projects that blend digital content with the real world.'],
            ['name' => 'Virtual Reality (VR)', 'slug' => 'virtual-reality-vr', 'description' => 'Projects creating immersive digital environments.'],
            ['name' => 'Bioinformatics', 'slug' => 'bioinformatics', 'description' => 'Projects applying computational techniques to biological data.'],
            ['name' => 'Game Development', 'slug' => 'game-development', 'description' => 'Projects related to designing and programming games.'],
            ['name' => 'Embedded Systems', 'slug' => 'embedded-systems', 'description' => 'Projects involving hardware-software integration for specialized devices.'],
            ['name' => 'Natural Language Processing', 'slug' => 'natural-language-processing', 'description' => 'Projects focused on understanding and generating human language.'],
            ['name' => 'Edge Computing', 'slug' => 'edge-computing', 'description' => 'Projects processing data near the source for real-time applications.'],
        ];

        foreach ($areas as $area) {
            ProjectArea::create($area);
        }
    }
}
