<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Hiển thị danh sách người dùng kèm chức năng tìm kiếm và lọc theo vai trò
    public function index(Request $request)
    {
        $search = $request->input('search');
        $role = $request->input('role');

        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
                });
            })
            // Lọc theo vai trò nếu có chọn role
            ->when($role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']) 
        ]);
    }
    // Cập nhật vai trò cho người dùng
    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,user,manager',
        ]);

        if ($user->id === Auth::id() && $request->role !== 'admin') {
            return redirect()->back()->with('error', 'Bạn không thể tự hạ cấp vai trò của chính mình!');
        }

        $user->update([
            'role' => $request->role,
        ]);

        return redirect()->back()->with('message', 'Cập nhật người dùng ' . $user->name . ' thành công');
    }

    // Xóa người dùng khỏi hệ thống
    public function destroy(User $user)
    {

        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'Cảnh báo: Bạn không thể tự xóa chính mình khỏi hệ thống!');
        }

        $userName = $user->name;
        $user->delete();

        return redirect()->back()->with('message', 'Đã xóa người dùng ' . $userName . ' thành công');
    }
}