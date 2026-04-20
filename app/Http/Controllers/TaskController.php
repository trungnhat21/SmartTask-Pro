<?php
namespace App\Http\Controllers;
use App\Http\Controllers\CvController;
use Illuminate\Http\Request;
use App\Models\Task;
use Inertia\Inertia;

class TaskController extends Controller
{
    // Hiển thị danh sách công việc cá nhân, tìm kiếm và định dạng ngày tháng
    public function index(Request $request)
    {
        $query = Task::where('user_id', auth()->id());

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $tasks = $query->latest()->get()->map(function ($task) {
            if ($task->deadline) {
                $task->deadline_formatted = \Carbon\Carbon::parse($task->deadline)->format('H:i d/m/Y');
            }
            return $task;
        });

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        return Inertia::render('Quanlycongviec', [
            'tasks' => $tasks,
            'filters' => $request->only(['search', 'priority'])
        ]);
    }

    // Tạo mới một công việc
    public function create()
    {
        return Inertia::render('Task/Create');
    }

    //Chỉnh sửa công việc và chặn quyền can thiệp vào việc của Admin
    public function edit(Task $task)
    {
        if ($task->user_id !== auth()->id() || $task->created_by_admin) {
            abort(403, 'Bạn không có quyền chỉnh sửa công việc của Admin.');
        }

        return Inertia::render('Task/Edit', [
            'task' => $task
        ]);
    }

    // Cập nhật nội dung công việc sau khi đã xác thực dữ liệu và kiểm tra quyền sở hữu
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

    // Xóa một công việc cá nhân và ngăn việc xóa các nhiệm vụ do Admin giao
    public function destroy(Task $task)
    {
        if ($task->user_id !== auth()->id() || $task->created_by_admin) {
            return redirect()->back()->with('error', 'Không thể xóa công việc do Admin giao.');
        }

        $task->delete();

        return redirect()->route('Quanlycongviec');
    }

    // Xóa toàn bộ công việc cùng lúc dựa trên danh sách ID được chọn
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

    // Cập nhật trạng thái tiến độ của công việc và chặn xử lý đối với các việc đã quá hạn
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
    
    // Lưu trữ công việc mới database
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