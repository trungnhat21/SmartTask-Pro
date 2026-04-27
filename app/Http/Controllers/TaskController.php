<?php
namespace App\Http\Controllers;
use App\Http\Controllers\CvController;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\TaskFeedback;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TaskController extends Controller
{
    // Hiển thị danh sách công việc cá nhân, tìm kiếm và định dạng ngày tháng
    public function index(Request $request)
    {
        $query = Task::where('user_id', auth()->id())
        ->withCount(['feedbacks as unread_count' => function ($query) {
            $query->where('is_read', 0)
                  ->where('receiver_id', auth()->id())
                  ->where('user_id', '!=', auth()->id());
        }]);

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        $tasks = $query->latest()->get()->map(function ($task) {
            if ($task->deadline) {
                $now = \Carbon\Carbon::now('Asia/Ho_Chi_Minh');
                $deadline = \Carbon\Carbon::parse($task->deadline, 'Asia/Ho_Chi_Minh');

                if ($now->gt($deadline) && $task->status !== 'Hoàn thành' && $task->status !== 'Quá hạn' && $task->status !== 'Chờ duyệt') {
                    \App\Models\Task::where('id', $task->id)->update(['status' => 'Quá hạn']);
                    $task->status = 'Quá hạn';
                }

                $diffInMinutes = $now->diffInMinutes($deadline, false);
                
                $task->days_left = $diffInMinutes > 0 ? (int) ceil($diffInMinutes / (60 * 24)) : 0;

                $task->deadline_formatted = $deadline->format('H:i d/m/Y');

                $task->is_near_deadline = (
                    $now->gt($deadline->copy()->subHours(48)) && 
                    $now->lt($deadline) && 
                    $task->status !== 'Hoàn thành' && 
                    $task->status !== 'Quá hạn'
                );
            } else {
                $task->is_near_deadline = false;
                $task->days_left = null;
            }
            return $task;
        });

        $nearDeadlineCount = $tasks->where('is_near_deadline', true)->count();

        return Inertia::render('Quanlycongviec', [
            'tasks' => $tasks,
            'nearDeadlineCount' => $nearDeadlineCount,
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
            abort(403, 'Bạn không có quyền cập nhật công việc này.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'priority' => 'required|string',
            'deadline' => [
                'nullable',
                'date',
                function ($attribute, $value, $fail) {
                    if (!$value) return;
                    $inputDate = \Carbon\Carbon::parse($value, 'Asia/Ho_Chi_Minh');
                    $now = \Carbon\Carbon::now('Asia/Ho_Chi_Minh');
                    if ($inputDate->lt($now)) {
                        $fail('Hạn chót không được nhỏ hơn thời gian hiện tại!');
                    }
                },
            ],
            'description' => 'nullable|string',
        ], [
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
        if ($task->user_id !== auth()->id()) abort(403);

        if ($task->created_by_admin && $request->status === 'Hoàn thành') {
            $request->validate([
                // 'report_file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:5120',
                'report_file' => 'required|file|mimes:pdf|max:10240'
            ], [
            'report_file.max'      => 'Dung lượng tệp không được vượt quá 10MB',
            'report_file.mimes'    => 'Chỉ chấp nhận tệp báo cáo định dạng PDF',
        ]);

            if ($request->hasFile('report_file')) {

                if ($task->report_file && Storage::disk('public')->exists($task->report_file)) {
                Storage::disk('public')->delete($task->report_file);
                }

                $path = $request->file('report_file')->store('reports', 'public');
                
                $task->update([
                    'status' => 'Chờ duyệt',
                    'report_file' => $path
                ]);
                return redirect()->back()->with('success', 'Báo cáo đã được gửi, vui lòng chờ duyệt!');
            }
        }

        $task->update(['status' => $request->status]);
        return redirect()->back()->with('success', 'Đã cập nhật trạng thái!');
    }
    
    // Lưu trữ công việc mới database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'priority' => 'required|string',
            'deadline' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $inputDate = \Carbon\Carbon::parse($value, 'Asia/Ho_Chi_Minh');
                    $now = \Carbon\Carbon::now('Asia/Ho_Chi_Minh');
                    if ($inputDate->lt($now)) {
                        $fail('Hạn chót không được là thời gian trong quá khứ!');
                    }
                },
            ],
            'description' => 'nullable|string',
        ], [
            'title.required' => 'Vui lòng nhập tên công việc.',
            'deadline.required' => 'Vui lòng chọn hạn chót.',
        ]);

        $validated['status'] = 'Chưa làm'; 
        $validated['user_id'] = auth()->id();
        $validated['created_by_admin'] = false; 

        Task::create($validated);

        return redirect()->route('Quanlycongviec');
    }

    // Hàm gửi phản hồi (Dùng chung cho cả User và Admin)
    public function storeFeedback(Request $request, $taskId)
    {
        $request->validate(['content' => 'required|string']);
        
        $task = \App\Models\Task::findOrFail($taskId);
        $currentUser = auth()->user();

        if ($currentUser->role === 'admin') {
            $receiverId = $task->user_id; 
        } else {
            $receiverId = \App\Models\User::where('role', 'admin')->value('id') ?? 1;
        }

        // 3. Lưu vào database
        \App\Models\TaskFeedback::create([
            'task_id'     => $taskId,
            'user_id'     => $currentUser->id,
            'content'     => $request->content,
            'type'        => $request->type ?? 'feedback',
            'is_read'     => 0,
            'receiver_id' => $receiverId,
        ]);

        return back();
    }
    public function getFeedbacks($taskId)
    {
        \App\Models\TaskFeedback::where('task_id', $taskId)
            ->where('receiver_id', auth()->id())
            ->update(['is_read' => 1]);

        $feedbacks = \App\Models\TaskFeedback::with('user:id,name')
            ->where('task_id', $taskId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($feedbacks);
    }
}