<?php
namespace App\http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller {

    // Thống kê số liệu công việc và lấy danh sách các nhiệm vụ sắp đến hạn
    public function index()
    {
        $userId = auth()->id();

        $upcomingTasks = Task::where('user_id', $userId)
            ->whereIn('status', ['Mới', 'Chưa làm', 'Đang làm'])
            ->where('deadline', '>=', now()->startOfDay()) 
            ->whereNotNull('deadline')
            ->orderBy('deadline', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($task) {
                $task->deadline_formatted = Carbon::parse($task->deadline)->format('d/m/Y');
                return $task;
            });

        $totalTasks = Task::where('user_id', $userId)->count();
        $completedTasks = Task::where('user_id', $userId)
            ->where('status', 'Hoàn thành')
            ->count();

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