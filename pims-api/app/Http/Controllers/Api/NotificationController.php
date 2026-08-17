<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $notifications = Auth::user()
            ->notifications()
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn($n) => [
                'id'        => $n->id,
                'data'      => $n->data,
                'read'      => ! is_null($n->read_at),
                'createdAt' => $n->created_at->toISOString(),
            ]);

        $unreadCount = Auth::user()->unreadNotifications()->count();

        return $this->successResponse('Notifications retrieved.', [
            'notifications' => $notifications,
            'unreadCount'   => $unreadCount,
        ]);
    }

    public function markRead(string $id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return $this->successResponse('Notification marked as read.', null);
    }

    public function markAllRead()
    {
        Auth::user()->unreadNotifications()->update(['read_at' => now()]);

        return $this->successResponse('All notifications marked as read.', null);
    }
}
