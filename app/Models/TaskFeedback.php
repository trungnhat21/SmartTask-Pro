<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskFeedback extends Model {
    protected $table = 'task_feedbacks';
    protected $fillable = ['task_id', 'user_id', 'content', 'type', 'is_read', 'receiver_id'];
    public $timestamps = false;

    public function user() {
        return $this->belongsTo(User::class);
    }
}
