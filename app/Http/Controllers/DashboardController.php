<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller {

    // Thống kê số liệu công việc và lấy danh sách các nhiệm vụ sắp đến hạn
    public function index()
    {
        $userId = auth()->id();

        $upcomingTasks = Task::where('user_id', $userId)
            ->whereIn('status', ['Mới', 'Chưa làm', 'Đang làm'])
            ->where('deadline', '>=', now()->startOfDay()) 
            ->whereNotNull('deadline')
            ->orderBy('deadline', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($task) {
                $task->deadline_formatted = Carbon::parse($task->deadline)->format('d/m/Y');
                return $task;
            });

        $totalTasks = Task::where('user_id', $userId)->count();
        $completedTasks = Task::where('user_id', $userId)
            ->where('status', 'Hoàn thành')
            ->count();

        $percentage = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        return Inertia::render('Dashboard', [
            'upcomingTasks' => $upcomingTasks,
            'stats' => [
                'total' => $totalTasks,
                'completed' => $completedTasks,
                'percentage' => $percentage
            ]
        ]);
    }

    // Ai trợ lý
    public function aiChat(Request $request)
    {
        $request->validate([
            'prompt' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $prompt = $request->input('prompt');
        $imageInput = $request->input('image');
        $apiKey = trim(env('GEMINI_API_KEY'));

        if (!$apiKey) {
            return response()->json(['response' => 'Hệ thống chưa cấu hình API Key'], 500);
        }

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=" . $apiKey;
            
            $parts = [];
            $parts[] = ['text' => $prompt ?? 'Hãy phân tích hình ảnh này'];

            if ($imageInput) {
                if (preg_match('/^data:(image\/(?:png|jpe?g|webp|gif));base64,(.+)$/i', $imageInput, $matches)) {
                    $mimeType = $matches[1];
                    $base64Data = trim($matches[2]);

                    if (!empty($base64Data)) {
                        $parts[] = [
                            'inline_data' => [
                                'mime_type' => $mimeType,
                                'data'      => $base64Data
                            ]
                        ];
                    }
                }
            }

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->timeout(60)
            ->post($url, [
                'contents' => [
                    [
                        'parts' => $parts
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 800,
                ]
            ]);

            $data = $response->json();

            if ($response->successful()) {
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    $aiText = $data['candidates'][0]['content']['parts'][0]['text'];
                } else {
                    $aiText = 'AI không thể trả lời câu hỏi này vì vi phạm chính sách an toàn nội dung';
                }
                
                return response()->json([
                    'response' => $aiText
                ]);
            }

            $errorMessage = $data['error']['message'] ?? 'Không rõ nguyên nhân';
            return response()->json([
                'response' => 'Lỗi từ Google API (' . $response->status() . '): ' . $errorMessage
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'response' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }
}