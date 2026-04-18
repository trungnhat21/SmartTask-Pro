<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'priority', 
        'deadline',
        'description',
        'status',
        'created_by_admin',
    ];
    protected $casts = [
    'created_by_admin' => 'boolean',
    'deadline' => 'datetime',
    ];
    /**
     * Thiết lập mối quan hệ ngược lại với User.
     * Một công việc thuộc về một người dùng (Trung Nhật).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}