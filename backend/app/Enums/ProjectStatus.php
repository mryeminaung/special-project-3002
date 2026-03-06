<?php
namespace App\Enums;

enum ProjectStatus: string {
    case NotStarted  = 'not started';
    case Active      = 'active';
    case Completed   = 'completed';
    case UnderReview = 'under review';
}
