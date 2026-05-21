<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with(['users' => function($q) {
            $q->withPivot('task_name', 'deadline', 'status');
        }]);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('priority') && $request->priority !== 'Tất cả') {
            $query->where('priority', $request->priority);
        }

        $projects = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters'  => $request->only(['search', 'priority'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Projects/Form', [
            'allUsers' => User::select('id', 'name')->get(),
            'project'  => null
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
        'name' => 'required',
        'deadline' => 'required|date',
        'tasks' => 'required|array|min:1',
        'tasks.*.user_id' => 'required',
        'tasks.*.task_name' => 'required',
        'tasks.*.deadline' => 'required|date',
    ], [
        'name.required' => 'Tên dự án không được để trống.',
        'tasks.*.user_id.required' => 'Vui lòng chọn người thực hiện',
        'tasks.*.task_name.required' => 'Tên công việc không được để trống',
        'tasks.*.deadline.required' => 'Hạn chót không được để trống',
    ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $request->description,
            'priority' => $request->priority,
            'deadline' => $validated['deadline'],
        ]);

        $syncData = [];
        foreach ($request->tasks as $task) {
            $syncData[$task['user_id']] = [
                'task_name' => $task['task_name'],
                'deadline'  => $task['deadline']
            ];
        }

        $project->users()->attach($syncData);

        // Ghi log
        $this->logActivity($project->id, "đã tạo dự án mới: " . $project->name);

        return redirect()->route('admin.projects.index')->with('success', 'Tạo dự án thành công!');
    }

    public function edit(Project $project)
    {
        $project->load(['users' => function($query) {
            $query->withPivot('task_name', 'deadline');
        }]);
        
        $formattedTasks = $project->users->map(function ($user) {
            return [
                'user_id'   => $user->id,
                'task_name' => $user->pivot->task_name,
                'deadline'  => $user->pivot->deadline,
            ];
        })->toArray();

        return Inertia::render('Admin/Projects/Form', [
            'allUsers' => User::select('id', 'name')->get(),
            'project'  => [
                'id'          => $project->id,
                'name'        => $project->name,
                'description' => $project->description,
                'priority'    => $project->priority,
                'deadline'    => $project->deadline,
                'tasks'       => !empty($formattedTasks) ? $formattedTasks : [['user_id' => '', 'task_name' => '', 'deadline' => '']]
            ]
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|string',
            'deadline' => 'required|date',
            'tasks' => 'required|array|min:1',
            'tasks.*.user_id' => 'required|exists:users,id',
            'tasks.*.task_name' => 'required|string|max:255',
            'tasks.*.deadline' => 'required|date',
        ]);

        $project->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'deadline' => $validated['deadline'],
        ]);

        $syncData = [];
        foreach ($request->tasks as $task) {
            $syncData[$task['user_id']] = [
                'task_name' => $task['task_name'],
                'deadline'  => $task['deadline']
            ];
        }

        $project->users()->sync($syncData);

        // Ghi log
        $this->logActivity($project->id, "đã cập nhật thông tin dự án");

        return redirect()->route('admin.projects.index')->with('success', 'Cập nhật dự án thành công!');
    }

    public function destroy(Project $project)
    {
        $project->users()->detach();
        $project->delete();

        return redirect()->route('admin.projects.index')->with('success', 'Xóa dự án thành công!');
    }

    public function show(Project $project)
    {
        $project->load(['users' => function($query) {
            $query->withPivot('task_name', 'deadline', 'status');
        }]);

        // Lấy danh sách hoạt động
        $activities = ActivityLog::where('project_id', $project->id)
            ->with('user:id,name')
            ->latest()
            ->get();

        return Inertia::render('Admin/Projects/Show', [
            'project' => $project,
            'members' => $project->users,
            'activities' => $activities
        ]);
    }

    // Hàm phụ trợ để ghi log
    private function logActivity($projectId, $action)
    {
        ActivityLog::create([
            'project_id' => $projectId,
            'user_id' => Auth::id(),
            'action' => $action
        ]);
    }
}