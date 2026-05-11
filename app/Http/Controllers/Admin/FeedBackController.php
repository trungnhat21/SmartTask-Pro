<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SupportRequest;

class FeedBackController extends Controller
{
    public function index (Request $request)
    {
        $query = SupportRequest::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' .$request->search. '%');
        }
        
        $feedbacks = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->onEachSide(1)
            ->withQueryString();

        return Inertia::render('Admin/FeedBack', [
            'feedbacks' => $feedbacks,
            'filters' => $request->only(['search'])
        ]);
    }

    public function destroy ($id) {
        $feedback = SupportRequest::findOrFail($id);
        $feedback->delete();

        return back()->with('message', 'Xóa phản hồi thành công');
    }

    public function deleteAll () {
        SupportRequest::query()->delete();
        return back()->with('message', 'Xóa tất cả phản hồi thành công');
    }
}