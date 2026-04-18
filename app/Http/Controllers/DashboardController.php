<?php
namespace App\http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller {

    public function index()
    {
        $userId = auth()->id();

        // 1. Lấy 5 task có hạn chót gần nhất (chưa hoàn thành)
        $upcomingTasks = Task::where('user_id', $userId)
            ->where('status', '!=', 'Hoàn thành')
            ->whereNotNull('deadline')
            ->orderBy('deadline', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($task) {
                $task->deadline_formatted = Carbon::parse($task->deadline)->format('d/m/Y');
                return $task;
            });

        // 2. Thống kê năng suất
        $totalTasks = Task::where('user_id', $userId)->count();
        $completedTasks = Task::where('user_id', $userId)
            ->where('status', 'Hoàn thành')
            ->count();

        // Tính phần trăm (tránh chia cho 0)
        $percentage = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        return Inertia::render('Dashboard', [
            'upcomingTasks' => $upcomingTasks,
            'stats' => [
                'total' => $totalTasks,
                'completed' => $completedTasks,
                'percentage' => $percentage
            ]
        ]);
    }
}