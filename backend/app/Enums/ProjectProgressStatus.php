<?php
namespace App\Enums;

enum ProjectProgressStatus: string {
    case SUBMITTED     = 'Submitted';
    case COMPLETED     = 'Completed';
    case NOT_SUBMITTED = 'Not Submitted';
    case PENDING       = 'Pending';
}
