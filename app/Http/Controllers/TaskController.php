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

    // Tìm kiếm theo tên (title) nếu có nhập
    if ($request->filled('search')) {
        $query->where('title', 'like', '%' . $request->search . '%');
    }

    // Lọc theo độ ưu tiên nếu có chọn
    if ($request->filled('priority')) {
        $query->where('priority', $request->priority);
    }

    return Inertia::render('Quanlycongviec', [
        'tasks' => $query->latest()->get(),
        'filters' => $request->only(['search', 'priority'])
    ]);
}
    //Thêm
    public function create()
    {
        return Inertia::render('Task/Create');
    }

    //Chỉnh sửa
    public function edit(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Task/Edit', [
            'task' => $task
        ]);
    }

    // Lưu dữ liệu sau khi sửa
    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'priority' => 'required|string',
            'deadline' => 'required|date|after:today',
            'description' => 'nullable|string',
        ]);

        $task->update($validated);

        return redirect()->route('Quanlycongviec');
    }

    //Xóa từng mục
    public function destroy(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            abort(403);
        }

        $task->delete();

        // Quay lại trang danh sách kèm thông báo (nếu cần)
        return redirect()->route('Quanlycongviec');
    }

    //Xóa được chọn
    public function deleteMultiple(Request $request)
    {
        // Lấy mảng IDs từ request gửi lên
        $ids = $request->input('ids');

        if ($ids && is_array($ids)) {
            Task::whereIn('id', $ids)
                ->where('user_id', auth()->id())
                ->delete();
        }

        return redirect()->back();
    }
    // Hàm xử lý lưu dữ liệu
    public function store(Request $request)
    {
        // 1. Validate dữ liệu
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

        // 2. Gán trạng thái mặc định (Bỏ phần AI_suggestion vì đã xóa cột DB)
        $validated['status'] = 'Mới'; 
        $validated['user_id'] = auth()->id();

        // 3. Lưu vào Database
        Task::create($validated);

        return redirect()->route('Quanlycongviec');
    }
}