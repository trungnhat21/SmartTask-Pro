<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Các trường dữ liệu Trung cho phép lưu vào database từ Form
    protected $fillable = [
        'user_id',
        'title',      // Tên công việc
        'priority',   // Độ ưu tiên
        'deadline',   // Hạn chót
        'description', // Ghi chú thêm
        'status',
        'created_by_admin',
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