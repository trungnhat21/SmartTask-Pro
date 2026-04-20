<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra nếu chưa đăng nhập thì bắt đăng nhập
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        //Nếu đã đăng nhập nhưng role KHÔNG PHẢI là admin
        if (auth()->check() && auth()->user()->role !== 'admin') {
        return redirect()->route('dashboard')->with('error', 'Bạn không có quyền truy cập!');
    }
    
        return $next($request);
    }
}
