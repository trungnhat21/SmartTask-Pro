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
        'report_file',
    ];
    protected $casts = [
    'created_by_admin' => 'boolean',
    'deadline' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function feedbacks()
    {
        // Một Task có nhiều Feedback
        return $this->hasMany(TaskFeedback::class, 'task_id');
    }
}