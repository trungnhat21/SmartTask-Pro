<?php
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\TaskController as AdminTaskController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Trang danh sách công việc
    Route::get('/quan-ly-cong-viec', [TaskController::class, 'index'])->name('Quanlycongviec');

    // Trang hiển thị form thêm mới
    Route::get('/quan-ly-cong-viec/them-moi', [TaskController::class, 'create'])->name('task.create');

    // Xử lý lưu dữ liệu khi bấm nút "LƯU CÔNG VIỆC"
    Route::post('/quan-ly-cong-viec/luu', [TaskController::class, 'store'])->name('task.store');

    Route::get('/quan-ly-cong-viec/{task}/edit', [TaskController::class, 'edit'])->name('task.edit');

    Route::patch('/quan-ly-cong-viec/{task}', [TaskController::class, 'update'])->name('task.update');

    Route::delete('/quan-ly-cong-viec/{task}', [TaskController::class, 'destroy'])->name('task.destroy');
    
    Route::post('/tasks/delete-multiple', [TaskController::class, 'deleteMultiple'])->name('task.delete-multiple');

    Route::patch('/quan-ly-cong-viec/{task}/update-status', [TaskController::class, 'updateStatus'])->name('task.update-status');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/Cv-thong-minh', [CvController::class, 'index'])->name('Cvthongminh');

});

Route::get('/Thong-ke', function () {
    return Inertia::render('Thongke');
})->middleware(['auth', 'verified'])->name('Thongke');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Admin
Route::middleware([ \App\Http\Middleware\AdminMiddleware::class ])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/', function () {
        return redirect()->route('admin.users.index');
    });
    
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    
    // Quản lý Tasks cho Admin
    Route::get('/tasks', [AdminTaskController::class, 'index'])->name('tasks.index');
    
    Route::delete('/tasks/destroy-all', [AdminTaskController::class, 'destroyAll'])->name('tasks.destroyAll');
    // -----------------------

    Route::get('/tasks/create', [AdminTaskController::class, 'create'])->name('tasks.create');
    Route::post('/tasks', [AdminTaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/{task}/edit', [AdminTaskController::class, 'edit'])->name('tasks.edit');
    Route::patch('/tasks/{task}', [AdminTaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [AdminTaskController::class, 'destroy'])->name('tasks.destroy');
});

require __DIR__.'/auth.php';
