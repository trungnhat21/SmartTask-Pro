<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Kiểm tra nếu chưa đăng nhập thì bắt đăng nhập
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // 2. Nếu đã đăng nhập nhưng role KHÔNG PHẢI là admin
        if (auth()->check() && auth()->user()->role !== 'admin') {
        return redirect()->route('dashboard')->with('error', 'Bạn không có quyền truy cập!');
    }

        // 3. Nếu đúng là admin thì cho phép đi tiếp
        return $next($request);
    }
}
