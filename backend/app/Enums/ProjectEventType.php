<?php
namespace App\Enums;

enum ProjectEventType: string {
    case Special  = 'special';
    case Capstone = 'capstone';
    case Master   = 'master/thesis';
}
