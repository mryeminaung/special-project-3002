<?php
namespace App\Enums;

enum ProjectProgressStatus: string {
    case Completed     = 'completed';
    case Not_Completed = 'not completed';
    case Submitted     = 'submitted';
    case Not_Submitted = 'not submitted';
    case Pending       = 'pending';
}
