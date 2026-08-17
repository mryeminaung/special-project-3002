<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool { return true; }
    public function view(User $user, Project $project): bool { return true; }
}
