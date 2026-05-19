<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $totalUsers = User::count();
        $totalTasks = Task::whereIn('status', ['Đang thực hiện', 'Chờ duyệt', 'Chưa làm'])->count();
        $completedTasks = Task::where('status', 'Hoàn thành')->count();

        $query = Task::with('user');

        // Lọc theo tên công việc
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Lọc theo trạng thái
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('sort_by') && in_array($request->sort_by, ['deadline', 'priority'])) {
            $sortOrder = $request->input('sort_order', 'asc') === 'desc' ? 'desc' : 'asc';
            
            if ($request->sort_by === 'priority') {
                $query->orderByRaw("FIELD(priority, 'Thấp', 'Trung bình', 'Cao') " . $sortOrder);
            } else {
                $query->orderBy($request->sort_by, $sortOrder);
            }
        } else {
            $query->orderBy('deadline', 'asc');
        }

        $overdueTasks = $query->orderBy('deadline', 'asc')
                              ->paginate(10)
                              ->onEachSide(1)
                              ->withQueryString();

        $allUsers = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/AdminDashboard', [
            'totalUsers'     => $totalUsers,
            'totalTasks'     => $totalTasks,
            'completedTasks' => $completedTasks,
            'overdueTasks'   => $overdueTasks,
            'allUsers'       => $allUsers,
            'filters'        => $request->only(['search', 'status', 'user_id', 'sort_by', 'sort_order']),
        ]);
    }
}