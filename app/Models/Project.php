<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'description', 'priority', 'deadline'];

    // Quan hệ nhiều-nhiều với User
    public function users()
    {
        return $this->belongsToMany(User::class, 'project_user')
                    ->withPivot('id', 'task_name', 'deadline')
                    ->withTimestamps();
    }

    // Quan hệ 1-nhiều với Task
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function activities()
    {
        return $this->hasMany(ActivityLog::class)->latest();
    }
}