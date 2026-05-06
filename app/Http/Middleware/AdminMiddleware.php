<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $userRole = auth()->user()->role;
        if ($userRole !== 'admin' && $userRole !== 'manager' && $userRole !== 'approve') {
            return redirect()->route('dashboard')->with('error', 'Bạn không có quyền truy cập!');
        }
        
        return $next($request);
    }
}
