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

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $tasks = $query->orderBy('deadline', 'asc')->get()->map(function ($task) {
            if ($task->deadline) {
                $deadline = Carbon::parse($task->deadline);
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

    public function destroyAll(Request $request)
    {
        $query = Task::query();
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        $query->delete();

        return back()->with('success', 'Đã xóa danh sách công việc.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return back()->with('success', 'Đã xóa công việc thành công.');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|string',
            'deadline' => 'nullable', 
            'priority' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
        ]);

        if (!empty($request->deadline)) {
            $cleanDeadline = str_replace('T', ' ', $request->deadline);
            $validated['deadline'] = Carbon::parse($cleanDeadline)->format('Y-m-d H:i:s');
        }

        $task->update($validated);
        return back()->with('success', 'Cập nhật thành công!');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
            'deadline' => 'required', 
            'priority' => 'required|string',
            'status' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $cleanDeadline = str_replace('T', ' ', $request->deadline);
        $validated['deadline'] = Carbon::parse($cleanDeadline)->format('Y-m-d H:i:s');

        Task::create([
            'title' => $validated['title'],
            'user_id' => $validated['user_id'],
            'deadline' => $validated['deadline'],
            'priority' => $validated['priority'],
            'status' => $validated['status'],
            'description' => $validated['description'],
            'created_by_admin' => true, 
        ]);

        return back()->with('success', 'Giao việc thành công!');
    }
}