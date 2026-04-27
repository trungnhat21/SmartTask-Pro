<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\TaskFeedback;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    // Lấy danh sách công việc hệ thống, lọc dữ liệu và tính toán trạng thái quá hạn
    public function index(Request $request)
    {
        $query = Task::with('user')->withCount(['feedbacks as unread_count' => function ($q) {
            $q->where('is_read', 0)
              ->where('receiver_id', auth()->id())
              ->where('user_id', '!=', auth()->id());
        }]);;

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
                $now = Carbon::now('Asia/Ho_Chi_Minh');
                $deadline = Carbon::parse($task->deadline, 'Asia/Ho_Chi_Minh');

                if ($task->status !== 'Hoàn thành' &&  $task->status !== 'Chờ duyệt' && $now->gt($deadline)) {
                    $task->status = 'Quá hạn';
                }
            } 
            
            if ($task->status === 'Mới' || !$task->status) {
                $task->status = 'Chưa làm';
            }
            
            if ($task->report_file) {
                 $task->report_url = asset('storage/app/public/' . $task->report_file);
                //$task->report_url = asset('storage/' . $task->report_file);
            } else {
                $task->report_url = null;
            }

            return $task;
        });

        return Inertia::render('Admin/Task', [
            'tasks' => $tasks,
            'users' => User::all(['id', 'name']),
            'filters' => $request->only(['priority', 'status', 'user_id'])
        ]);
    }

    // Xóa tất cả công việc của một người dùng cụ thể
    public function destroyAll(Request $request)
    {
        $query = Task::query();
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        $query->delete();

        return back()->with('success', 'Đã xóa danh sách công việc.');
    }

    // Xóa một công việc bất kỳ theo ID
    public function destroy(Task $task)
    {
        $task->delete();
        return back()->with('success', 'Đã xóa công việc thành công.');
    }

    // Cập nhật thông tin chi tiết và thời hạn của công việc
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|string',
            'deadline' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    if (!$value) return;
                    $inputDate = Carbon::parse($value, 'Asia/Ho_Chi_Minh');
                    $now = Carbon::now('Asia/Ho_Chi_Minh');
                    if ($inputDate->lt($now)) {
                        $fail('Hạn chót không được là thời gian trong quá khứ!');
                    }
                },
            ], 
            'priority' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
        ]);

        if (!empty($request->deadline)) {
            $validated['deadline'] = Carbon::parse($request->deadline, 'Asia/Ho_Chi_Minh')->format('Y-m-d H:i:s');
        }

        $task->update($validated);
        return back()->with('success', 'Cập nhật thành công!');
    }

    public function approve($id)
    {
        $task = Task::findOrFail($id);
        $task->update(['status' => 'Hoàn thành']);
        return back()->with('success', 'Đã duyệt công việc.');
    }

    public function reject($id)
    {
        $task = Task::findOrFail($id);
        if ($task->report_file) {
            \Storage::disk('public')->delete($task->report_file);
        }
        $task->update([
            'status' => 'Từ chối',
            'report_file' => null
        ]);
        return back()->with('success', 'Đã từ chối báo cáo.');
    }

    // Khởi tạo công việc mới và trực tiếp giao cho một người dùng trong hệ thống
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
            'deadline' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    if (!$value) return;
                    $inputDate = Carbon::parse($value, 'Asia/Ho_Chi_Minh');
                    $now = Carbon::now('Asia/Ho_Chi_Minh');
                    if ($inputDate->lt($now)) {
                        $fail('Hạn chót không được là thời gian trong quá khứ!');
                    }
                },
            ], 
            'priority' => 'required|string',
            'status' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $validated['deadline'] = Carbon::parse($request->deadline, 'Asia/Ho_Chi_Minh')->format('Y-m-d H:i:s');

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

    public function getFeedbacks($taskId) {
        $feedbacks = TaskFeedback::with('user:id,name')
            ->where('task_id', $taskId)
            ->orderBy('created_at', 'asc')
            ->get();
        return response()->json($feedbacks);
    }

    public function storeFeedback(Request $request, $taskId) {
        $request->validate([
            'content' => 'required|string',
            'type' => 'required|in:feedback,reply,reject'
        ]);
        $task = Task::findOrFail($taskId);
        TaskFeedback::create([
            'task_id' => $taskId,
            'user_id' => auth()->id(),
            'content' => $request->content,
            'type' => $request->type ?? 'feedback',
            'is_read' => 0,
            'receiver_id' => $task->user_id,
        ]);

        return back()->with('message', 'Thao tác thành công');
    }
}