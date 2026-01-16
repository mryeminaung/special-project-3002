<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return [
            [
                "id" => "1",
                "name" => "A Peer-to-Peer Micro-Lending & Savings Platform",
                "slug" => "a-peer-to-peer-micro-lending-and-savings-platform",
                "description" => "This is the description for Project Alpha.",
                "teamLeader" => [
                    "id" => "1",
                    "name" => "John Doe"
                ],
                "supervisor" => [
                    "id" => "5",
                    "name" => "Dr. Smith"
                ],
                "members" => [
                    ["id" => "2", "name" => "Jane Doe"],
                    ["id" => "3", "name" => "Peter Jones"],
                    ["id" => "4", "name" => "Peter Jones"],
                    ["id" => "5", "name" => "Peter Jones"]
                ],
                "status" => "active",
                "started_at" => "2023-01-15"
            ],
            [
                "id" => "2",
                "name" => "IoT-Based Soil Nutrient Monitoring & Crop Recommendation System
 ",
                "slug" => "iot-based-soil-nutrient-monitoring-and-crop-recommendation-system",
                "description" => "This is the description for Project Beta.",
                "teamLeader" => [
                    "id" => "4",
                    "name" => "Alice Wonderland"
                ],
                "supervisor" => [
                    "id" => "6",
                    "name" => "Prof. Johnson"
                ],
                "members" => [
                    ["id" => "7", "name" => "Bob The Builder"]
                ],
                "status" => "under review",
                "started_at" => "2023-03-01"
            ]
        ];
    }

    public function show(Project $project)
    {
        return $project;
    }
}
