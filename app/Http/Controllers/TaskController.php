<?php
namespace App\Http\Controllers;
use App\Http\Controllers\CvController;
use Illuminate\Http\Request;
use App\Models\Task;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::where('user_id', auth()->id());

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        return Inertia::render('Quanlycongviec', [
            'tasks' => $query->latest()->get(),
            'filters' => $request->only(['search', 'priority'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Task/Create');
    }

    // Chỉnh sửa: Chặn nếu là task của Admin
    public function edit(Task $task)
    {
        if ($task->user_id !== auth()->id() || $task->created_by_admin) {
            abort(403, 'Bạn không có quyền chỉnh sửa công việc của Admin.');
        }

        return Inertia::render('Task/Edit', [
            'task' => $task
        ]);
    }

    // Cập nhật: Chặn nếu là task của Admin
    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== auth()->id() || $task->created_by_admin) {
            abort(403, 'Bạn không có quyền cập nhật công việc của Admin.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'priority' => 'required|string',
            'deadline' => 'nullable|date|after_or_equal:today',
            'description' => 'nullable|string',
        ], [
            'deadline.after_or_equal' => 'Hạn chót không được nhỏ hơn ngày hiện tại',
            'deadline.date' => 'Định dạng ngày tháng không hợp lệ',
            'title.required' => 'Tên công việc không được để trống',
        ]);

        $task->update($validated);

        return redirect()->route('Quanlycongviec');
    }

    public function destroy(Task $task)
    {
        if ($task->user_id !== auth()->id() || $task->created_by_admin) {
            return redirect()->back()->with('error', 'Không thể xóa công việc do Admin giao.');
        }

        $task->delete();

        return redirect()->route('Quanlycongviec');
    }

    public function deleteMultiple(Request $request)
    {
        $ids = $request->input('ids');

        if ($ids && is_array($ids)) {
            Task::whereIn('id', $ids)
                ->where('user_id', auth()->id())
                ->where('created_by_admin', false)
                ->delete();
        }

        return redirect()->back();
    }

    public function updateStatus(Request $request, Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            abort(403);
        }

        if ($task->status === 'Quá hạn') {
            return back()->with('error', 'Công việc đã quá hạn, không thể thay đổi trạng thái!');
        }
        $task->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', 'Đã cập nhật tiến độ!');
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'priority' => 'required|string',
            'deadline' => 'required|date|after:today',
            'description' => 'nullable|string',
        ], [
            'title.required' => 'Vui lòng nhập tên công việc.',
            'deadline.required' => 'Vui lòng chọn hạn chót.',
            'deadline.after' => 'Hạn chót không được nhỏ hơn hoặc bằng ngày hiện tại.',
        ]);

        $validated['status'] = 'Mới'; 
        $validated['user_id'] = auth()->id();
        $validated['created_by_admin'] = false; 

        Task::create($validated);

        return redirect()->route('Quanlycongviec');
    }
}