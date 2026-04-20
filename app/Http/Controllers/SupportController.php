<?php
namespace App\Http\Controllers;

use App\Models\SupportRequest;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    // Xác thực dữ liệu người dùng và lưu yêu cầu hỗ trợ vào database
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|numeric',
            'content' => 'required|string',
        ], [
            'name.required' => 'Trung ơi, đừng quên nhập tên nhé!',
            'phone.numeric' => 'Số điện thoại phải là số nha.',
            'content.required' => 'Nội dung hỗ trợ không được để trống.',
        ]);

        SupportRequest::create($request->all());

        return back()->with('message', 'Yêu cầu của bạn đã được gửi thành công!');
    }
}