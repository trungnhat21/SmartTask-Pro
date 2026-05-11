<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class AdminPDFController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/AdminPDF', [
            'topUsers' => $this->getRankingData()
        ]);
    }

    public function export()
    {
        $topUsers = $this->getRankingData();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('ranking_pdf', compact('topUsers'));

        return $pdf->download('bang-xep-hang-' . now()->format('d-m-Y') . '.pdf');
    }

    private function getRankingData()
    {

        $users = User::select('id', 'name')
            ->withCount(['tasks' => function ($query) {
                $query->where('status', 'Hoàn thành');
            }])
            ->orderBy('tasks_count', 'desc')
            ->get();

        $rankedUsers = [];
        $currentRank = 1;
        $previousTasks = null;

        foreach ($users as $index => $user) {

            if ($index >= 5 && $user->tasks_count < ($previousTasks ?? 0)) {
                break;
            }

            if ($user->tasks_count !== $previousTasks) {
                $currentRank = $index + 1;
            }

            $rankedUsers[] = [
                'id' => $user->id,
                'name' => $user->name,
                'completed_tasks' => $user->tasks_count,
                'rank' => $currentRank,
                'avatar_color' => $this->getAvatarColor($currentRank - 1),
            ];

            $previousTasks = $user->tasks_count;
        }

        return array_slice($rankedUsers, 0, 5);
    }

    private function getAvatarColor($index) {
        $colors = [
            'bg-amber-100 text-amber-600',
            'bg-slate-200 text-slate-600',
            'bg-orange-100 text-orange-600',
            'bg-indigo-50 text-indigo-600',
            'bg-rose-50 text-rose-600'
        ];
        return $colors[$index] ?? 'bg-gray-100 text-gray-600';
    }
}