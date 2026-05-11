<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bảng xếp hạng thành viên</title>
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif; 
            font-size: 13px; 
            color: #334155;
            line-height: 1.5;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
        }
        .title { 
            text-transform: uppercase;
            font-size: 22px; 
            font-weight: bold; 
            color: #1e293b;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        .sub-title { 
            font-size: 14px;
            color: #64748b; 
        }

        table { 
            width: 100%; 
            border-collapse: separate; 
            border-spacing: 0;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
        }
        
        th { 
            background-color: #f8fafc; 
            color: #475569;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11px;
            padding: 12px 15px;
            border-bottom: 2px solid #e2e8f0;
        }

        td { 
            padding: 15px; 
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
        }

        .rank-cell {
            font-weight: bold;
            text-align: center;
            width: 100px;
        }
        
        .rank-1 { color: #b45309; background-color: #fffbeb; }
        .rank-2 { color: #475569; background-color: #f8fafc; }
        .rank-3 { color: #dd681f; background-color: #fff7ed; }

        .member-name {
            font-size: 14px;
            color: #0f172a;
        }

        .task-count {
            text-align: center;
            font-weight: 800;
            color: #4f46e5;
        }

        .footer {
            margin-top: 30px;
            text-align: right;
            font-style: italic;
            font-size: 11px;
            color: #94a3b8;
        }

        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Bảng Xếp Hạng Hiệu Suất Công Việc</div>
        <div class="sub-title">Hệ thống quản lý công việc - Báo cáo định kỳ</div>
        <div class="sub-title" style="margin-top: 5px;">Ngày lập: {{ date('d/m/Y - H:i') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Thứ hạng</th>
                <th>Thành viên</th>
                <th style="text-align: center;">Công việc hoàn thành</th>
            </tr>
        </thead>
        <tbody>
            @foreach($topUsers as $user)
            <tr class="{{ $user['rank'] == 1 ? 'rank-1' : ($user['rank'] == 2 ? 'rank-2' : ($user['rank'] == 3 ? 'rank-3' : '')) }}">
                <td class="rank-cell">
                    @if($user['rank'] == 1)
                        <span class="badge">Quán quân</span><br>
                    @endif
                    Hạng {{ $user['rank'] }}
                </td>
                <td>
                    <div class="member-name"><strong>{{ $user['name'] }}</strong></div>
                </td>
                <td class="task-count">
                    {{ $user['completed_tasks'] }} 
                    <span style="font-weight: normal; font-size: 11px; color: #94a3b8;">tasks</span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>