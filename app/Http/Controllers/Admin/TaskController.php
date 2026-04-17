<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TaskController extends Controller
{
    public function index(Request $request)
{
    $query = Task::with('user');

    // 1. Chỉ lọc theo độ ưu tiên
    if ($request->filled('priority')) {
        $query->where('priority', $request->priority);
    }

    // 2. Chỉ lọc theo trạng thái
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    if ($request->filled('user_id')) {
        $query->where('user_id', $request->user_id);
    }

    $tasks = $query->orderBy('deadline', 'asc')->get()->map(function ($task) {
        if ($task->deadline) {
            $deadline = \Carbon\Carbon::parse($task->deadline);
            if ($task->status !== 'Hoàn thành' && $deadline->isPast() && !$deadline->isToday()) {
                $task->status = 'Quá hạn';
            } elseif ($task->status === 'Mới' || !$task->status) {
                $task->status = 'Chưa làm';
            }
        }
        return $task;
    });

    return Inertia::render('Admin/Task', [
        'tasks' => $tasks,
        'users' => User::all(['id', 'name']),
        'filters' => $request->only(['priority', 'status', 'user_id'])
    ]);
}

// Hàm xóa toàn bộ danh sách
    public function destroyAll(Request $request)
    {
        $query = \App\Models\Task::query();

        // Nếu có truyền user_id lên, chỉ xóa công việc của người đó
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        } else {
            $query->delete(); 
        }

        $query->delete();

        return back()->with('success', 'Đã xóa danh sách công việc tương ứng.');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|string',
            'deadline' => 'nullable|date|after_or_equal:today',
            'priority' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
        ], [
            'deadline.after_or_equal' => 'Hạn chót không được nhỏ hơn ngày hiện tại',
            'deadline.date' => 'Định dạng ngày tháng không hợp lệ',
            'title.required' => 'Tên công việc không được để trống',
        ]);

        $task->update($validated);

        return back()->with('success', 'Cập nhật công việc thành công');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return back()->with('success', 'Đã xóa công việc thành công');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
            'deadline' => 'required|date|after_or_equal:today', 
            'priority' => 'required|string',
            'status' => 'required|string',
            'description' => 'nullable|string',
        ], [
            'title.required' => 'Bạn chưa nhập tên công việc',
            'deadline.required' => 'Bạn chưa chọn hạn chót',
            'deadline.date' => 'Định dạng ngày tháng không hợp lệ',
            'deadline.after_or_equal' => 'Hạn chót không được nhỏ hơn ngày hiện tại',
        ]);

        Task::create([
            'title' => $validated['title'],
            'user_id' => $validated['user_id'],
            'deadline' => $validated['deadline'],
            'priority' => $validated['priority'],
            'status' => $validated['status'],
            'description' => $validated['description'],
            'created_by_admin' => true, 
        ]);

        return back()->with('success', 'Đã giao công việc mới thành công!');
    }
}