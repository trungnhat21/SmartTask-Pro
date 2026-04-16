<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Hiển thị danh sách người dùng
     */
    public function index(Request $request)
{
    // Lấy giá trị tìm kiếm từ request
    $search = $request->input('search');
    $role = $request->input('role');

    $users = User::query()
        // Tìm theo tên hoặc email nếu có nhập search
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

    /**
     * Cập nhật vai trò người dùng
     */
    public function update(Request $request, User $user)
    {
        // 1. Kiểm tra dữ liệu hợp lệ
        $request->validate([
            'role' => 'required|in:admin,user,manager',
        ]);

        // 2. Bảo mật: Không cho phép Admin tự hạ cấp chính mình xuống 'user'
        if ($user->id === Auth::id() && $request->role !== 'admin') {
            return redirect()->back()->with('error', 'Bạn không thể tự hạ cấp vai trò của chính mình!');
        }

        // 3. Cập nhật
        $user->update([
            'role' => $request->role,
        ]);

        return redirect()->back()->with('message', 'Cập nhật người dùng ' . $user->name . ' thành công');
    }

    /**
     * Xóa người dùng
     */
    public function destroy(User $user)
    {
        // 1. Bảo mật: Không cho phép xóa chính mình
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'Cảnh báo: Bạn không thể tự xóa chính mình khỏi hệ thống!');
        }

        // 2. Thực hiện xóa
        $userName = $user->name;
        $user->delete();

        return redirect()->back()->with('message', 'Đã xóa người dùng ' . $userName . ' thành công');
    }
}