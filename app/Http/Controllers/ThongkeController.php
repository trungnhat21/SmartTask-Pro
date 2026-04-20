<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ThongkeController extends Controller
{
    // Tổng hợp số liệu thống kê công việc và dữ liệu biểu đồ
    public function index()
    {
        $userId = Auth::id();
        $now = Carbon::now();

        $stats = [
        'total' => Task::where('user_id', $userId)->count(),
        
        'completed' => Task::where('user_id', $userId)
            ->where('status', 'Hoàn thành')
            ->count(),
        
        'pending' => Task::where('user_id', $userId)
            ->where('status', 'Đang làm')
            ->count(),
        
        'overdue' => Task::where('user_id', $userId)
            ->where(function ($query) use ($now) {
                $query->where('status', 'Quá hạn')
                      ->orWhere(function ($q) use ($now) {
                          $q->whereIn('status', ['Chưa làm', 'Đang làm'])
                            ->where('deadline', '<', $now);
                      });
            })
            ->count(),
    ];

        $stats['rate'] = $stats['total'] > 0 
            ? round(($stats['completed'] / $stats['total']) * 100) 
            : 0;

        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $weeklyData[] = [
                'name' => $date->format('d/m'),
                'task' => Task::where('user_id', $userId)
                    ->whereDate('created_at', $date)
                    ->count(),
                'done' => Task::where('user_id', $userId)
                    ->whereDate('updated_at', $date)
                    ->where('status', 'Hoàn thành')
                    ->count(),
            ];
        }

        return Inertia::render('Thongke', [
            'stats' => $stats,
            'weeklyData' => $weeklyData
        ]);
    }
}