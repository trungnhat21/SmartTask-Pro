<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'nearDeadlineCount' => $request->user() 
            ? \App\Models\Task::where('user_id', $request->user()->id)
                ->whereNotIn('status', ['Hoàn thành', 'Quá hạn'])
                ->count() 
            : 0,
            'flash' => [
            'error' => $request->session()->get('error'),
            'success' => $request->session()->get('success'),
        ],
        ];
    }
}
