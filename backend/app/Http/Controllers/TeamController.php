<?php

namespace App\Http\Controllers;

class TeamController extends Controller
{
    public function index()
    {
        return [
            [
                "title" => "A Peer-to-Peer Micro-Lending & Savings Platform",
                "leader" => [
                    "id" => "1",
                    "name" => "John Doe"
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
                "title" => "IoT-Based Soil Nutrient Monitoring & Crop Recommendation System",
                "leader" => [
                    "id" => "4",
                    "name" => "Alice Wonderland"
                ],
                "members" => [
                    ["id" => "7", "name" => "Tun Aung Kyaw"],
                    ["id" => "9", "name" => "Min Khant Kyaw"],
                    ["id" => "10", "name" => "Aung Kyaw Soe"]
                ],
                "status" => "active",
                "started_at" => "2023-03-01"
            ]
        ];
    }
}
