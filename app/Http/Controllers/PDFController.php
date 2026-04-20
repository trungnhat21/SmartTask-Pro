<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class PDFController extends Controller
{
    public function index()
    {
        $tasks = Task::where('user_id', Auth::id())->get();
        return inertia('PDF', [
            'tasks' => $tasks
        ]);
    }

    // xuất dữ liệu công việc và xuất tệp PDF
    public function export()
    {
        $tasks = Task::where('user_id', auth()->id())
                    ->orderBy('deadline', 'asc')
                    ->get();

        $data = [
            'title' => 'DANH SÁCH CÔNG VIỆC',
            'date' => date('d/m/Y H:i'),
            'tasks' => $tasks
        ];

        $pdf = Pdf::loadView('task_report', $data); 

        return $pdf->stream('danh-sach-cong-viec.pdf');
    }
}