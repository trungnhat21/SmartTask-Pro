<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Báo cáo công việc</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .sub-title { text-align: center; margin-bottom: 20px; color: #555; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .priority-Cao { color: red; font-weight: bold; }
        .status-quahan { color: #d9534f; }
    </style>
</head>
<body>
    <div class="title">{{ $title }}</div>
    <div class="sub-title">Ngày lập: {{ $date }}</div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%">STT</th>
                <th style="width: 45%">Công việc</th>
                <th style="width: 15%">Ưu tiên</th>
                <th style="width: 20%">Hạn chót</th>
                <th style="width: 15%">Trạng thái</th>
            </tr>
        </thead>
        <tbody>
            @foreach($tasks as $index => $task)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td><strong>{{ $task->title }}</strong></td>
                <td class="priority-{{ $task->priority }}">{{ $task->priority }}</td>
                <td>{{ \Carbon\Carbon::parse($task->deadline)->format('H:i d/m/Y') }}</td>
                <td>{{ $task->status }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>