<?php
namespace App\Enums;

enum ProjectStatus: string {
    case Active      = 'active';
    case Completed   = 'completed';
    case UnderReview = 'under review';
}
