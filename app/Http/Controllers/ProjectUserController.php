<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;

class ProjectUserController extends Controller
{
    public function index(Request $request)
    {
        $query = Auth::user()->projects()
            ->withPivot('task_name', 'deadline');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $projects = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('User/Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only(['search'])
        ]);
    }

    public function show($id)
    {

        $project = Auth::user()->projects()->findOrFail($id);

        $members = $project->users()->withPivot('task_name', 'deadline', 'status')->get();

        $activities = ActivityLog::where('project_id', $project->id)
            ->with('user:id,name')
            ->latest()
            ->get();

        return Inertia::render('User/Projects/Show', [
            'project' => $project,
            'members' => $members,
            'activities' => $activities
        ]);
    }

    public function updateStatus(Request $request, $userId, $projectId)
    {
        $request->validate(['status' => 'required|in:Đang tiến hành,Hoàn thành']);

        $affected = DB::table('project_user')
            ->where('user_id', $userId)
            ->where('project_id', $projectId)
            ->update(['status' => $request->status]);

        if ($affected) {
            ActivityLog::create([
                'project_id' => $projectId,
                'user_id' => Auth::id(),
                'action' => "đã cập nhật trạng thái nhiệm vụ thành: " . $request->status
            ]);
        }

        return back()->with('success', 'Đã cập nhật trạng thái!');
    }
}