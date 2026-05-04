<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{

    // Đăng nhập mà status là blocked
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check() && auth()->user()->status === 'blocked') {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'email' => 'Tài khoản của bạn vừa bị khóa bởi quản trị viên!',
            ]);
        }

        return $next($request);
    }
}
