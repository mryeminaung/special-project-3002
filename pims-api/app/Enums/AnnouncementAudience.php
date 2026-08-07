<?php
namespace App\Enums;

enum AnnouncementAudience: string {
    case STUDENTS  = 'students';
    case FACULTIES = 'faculties';
    case BOTH      = 'both';
}
