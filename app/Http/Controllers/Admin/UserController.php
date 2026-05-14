<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

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
            ->when($role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->onEachSide(1)
            ->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']) 
        ]);
    }


    public function create()
    {
        return Inertia::render('Admin/Edit/UserForm', [
            'isEdit' => false
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
            ],
            'password' => ['required', Rules\Password::defaults()],
            'role' => 'required|in:admin,user,manager,approve',
            'status' => 'required|string|in:active,blocked',
        ], [
            'email.regex' => 'Định dạng email không hợp lệ',
            'email.email' => 'Địa chỉ email phải là một email hợp lệ',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => $request->status,
        ]);

        return redirect()->route('admin.users.index')->with('message', 'Thêm thành công!');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Edit/UserForm', [
            'user' => $user,
            'isEdit' => true
        ]);
    }
    
    // Cập nhật vai trò cho người dùng khóa tài khoản
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
            ],

            'password' => ['nullable', Rules\Password::defaults()],
            'role' => 'sometimes|in:admin,user,manager,approve',
            'status' => 'sometimes|string|in:active,blocked',
        ], [
            'email.regex' => 'Định dạng email không hợp lệ (yêu cầu @gmail.com)',
            'email.email' => 'Địa chỉ email không đúng định dạng',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->has('role')) {
            if ($user->id === Auth::id() && $request->role !== 'admin') {
                return redirect()->back()->with('error', 'Không thể tự hạ cấp vai trò của chính mình');
            }
            $user->role = $request->role;
        }

        if ($request->has('status')) {
            if ($user->id === Auth::id() && $request->status === 'blocked') {
                return redirect()->back()->with('error', 'Không thể tự khóa chính mình');
            }
            $user->status = $request->status;
        }

        $user->save();

        return redirect()->route('admin.users.index')->with('message', 'Cập nhật người dùng thành công');
    }

    // Xóa người dùng khỏi hệ thống
    public function destroy(User $user)
    {

        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'Cảnh báo: Không thể tự xóa chính mình khỏi hệ thống');
        }

        $userName = $user->name;
        $user->delete();

        return redirect()->back()->with('message', 'Đã xóa người dùng ' . $userName . ' thành công');
    }

    public static function middleware(): array
    {
        return [
            new Middleware(function ($request, $next) {
                $user = Auth::user();
                $restrictedMethods = ['create', 'store', 'edit', 'update', 'destroy'];
                
                $routeAction = $request->route()->getActionMethod();

                if ($user && in_array($user->role, ['manager', 'approve']) && in_array($routeAction, $restrictedMethods)) {
                    $roleName = $user->role === 'manager' ? 'Manager' : 'Approve';
                    return redirect()->route('admin.users.index')
                                    ->with('error', "Cấp {$roleName} không có quyền thực hiện thao tác này");
            }

                return $next($request);
            }, only: ['create', 'store', 'edit', 'update', 'destroy']),
        ];
    }
}