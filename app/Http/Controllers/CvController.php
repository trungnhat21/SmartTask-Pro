<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class CvController extends Controller
{
    public function index()
    {
        // 1. Lấy danh sách công việc chưa hoàn thành của người dùng hiện tại
        $tasks = Task::where('user_id', Auth::id())
                    ->where('status', '!=', 'Hoàn thành')
                    ->where('status', '!=', 'Quá hạn')
                    ->get();

        // 2. Thuật toán sắp xếp và xử lý dữ liệu thông minh
        $smartTasks = $tasks->map(function ($task) {
        $score = 0;
        $now = now();
        $deadline = $task->deadline ? Carbon::parse($task->deadline) : null;

            // Điểm ưu tiên
        if ($task->priority === 'Cao') {
            $score += 100;
        } elseif ($task->priority === 'Trung bình') {
            $score += 50;
        } else {
            $score += 10;
        }

            // Điểm Deadline
        $task->warning = null; 
            if ($deadline) {
                $daysLeft = $now->diffInDays($deadline, false);
                if ($daysLeft <= 0) {
                    $score += 200; 
                    $task->warning = "Sắp trễ hạn!"; 
                } elseif ($daysLeft <= 1) {
                    $score += 150; 
                } elseif ($daysLeft <= 3) {
                    $score += 80;
                }
            }

        $task->smart_score = $score;
        $task->dynamic_advice = self::generateAdvice($task->priority, $task->deadline);

        return $task;
        })
        ->sortByDesc('smart_score')
        ->values(); 

        return Inertia::render('Cvthongminh', [
            'smartTasks' => $smartTasks
        ]);
    }
    public static function generateAdvice($priority, $deadline)
    {
        $now = now();
        $dl = $deadline ? Carbon::parse($deadline) : null;

        if ($dl && $dl->isPast()) {
            return "⚠️ Việc này đã quá hạn! Bạn cần ưu tiên xử lý ngay để không bị dồn việc.";
        }
        
        if ($dl && $now->diffInDays($dl, false) <= 1) {
            return "🔥 Hạn chót rất gần rồi! Bạn hãy tập trung dứt điểm việc này trong hôm nay nhé.";
        }

        if ($priority === 'Cao') {
            return "⭐ Đây là nhiệm vụ trọng tâm. Bạn nên dành thời gian tập trung nhất để hoàn thành.";
        }

        return "✅ Công việc đã được tối ưu. Bạn hãy thực hiện theo lộ trình đã sắp xếp nhé.";
    }
}