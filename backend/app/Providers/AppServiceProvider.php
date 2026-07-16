<?php

namespace App\Providers;

use App\Services\AnnouncementService;
use App\Services\CommentService;
use App\Services\DashboardService;
use App\Services\DepartmentService;
use App\Services\FileService;
use App\Services\ProjectAreaService;
use App\Services\ProjectEventService;
use App\Services\ProjectService;
use App\Services\ProposalService;
use App\Services\SupervisorService;
use App\Services\UserService;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AnnouncementService::class);
        $this->app->singleton(CommentService::class);
        $this->app->singleton(DashboardService::class);
        $this->app->singleton(DepartmentService::class);
        $this->app->singleton(FileService::class);
        $this->app->singleton(ProjectAreaService::class);
        $this->app->singleton(ProjectEventService::class);
        $this->app->singleton(ProjectService::class);
        $this->app->singleton(ProposalService::class);
        $this->app->singleton(SupervisorService::class);
        $this->app->singleton(UserService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
    }
}
