<?php

return [
    'confirmed' => ':attribute xác nhận không khớp.',
    'email' => ':attribute phải là một địa chỉ email hợp lệ.',
    'current_password' => 'Mật khẩu cũ không chính xác.',
    'different' => ':attribute mới không được giống với mật khẩu hiện tại',
    'max' => [
        'numeric' => ':attribute không được lớn hơn :max.',
        'string' => ':attribute không được lớn hơn :max ký tự.',
    ],
    'min' => [
        'numeric' => ':attribute phải tối thiểu là :min.',
        'string' => ':attribute phải có ít nhất :min ký tự.',
    ],
    'required' => ':attribute không được để trống.',
    'unique' => ':attribute đã tồn tại trong hệ thống.',

    // Thêm các quy tắc

    'attributes' => [
        'name' => 'Họ tên',
        'email' => 'Địa chỉ Email',
        'password' => 'Mật khẩu',
        'password_confirmation' => 'Xác nhận mật khẩu',
        'current_password' => 'Mật khẩu cũ',
    ],
];