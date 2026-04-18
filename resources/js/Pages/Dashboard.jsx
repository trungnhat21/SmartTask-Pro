import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Cập nhật dòng này: Thêm { auth, upcomingTasks, stats } vào trong ngoặc nhọn
export default function Dashboard({ auth, upcomingTasks = [], stats = { total: 0, completed: 0, percentage: 0 } }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Bảng Điều Khiển Hệ Thống
                </h2>
            }
        >
            <Head title="Bảng Điều Khiển" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* KHU VỰC 1: AI SUGGESTION */}
                    <div className="overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg sm:rounded-lg">
                        <div className="p-6 text-white">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🤖</span>
                                <h3 className="text-lg font-bold">Trợ lý AI phân tích:</h3>
                            </div>
                            <p className="mt-2 text-indigo-100">
                                Chào {auth.user.name}! Bạn đang có <span className="font-bold">{upcomingTasks.length}</span> công việc sắp tới. 
                                Hãy tập trung hoàn thành các mục có độ ưu tiên cao trước nhé
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                        {/* KHU VỰC 2: CÔNG VIỆC CẦN LÀM NGAY */}
                        <div className="md:col-span-2 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-700">Công việc cần làm ngay</h3>
                                    <Link href={route('Quanlycongviec')} className="text-sm text-indigo-600 hover:underline">Xem tất cả</Link>
                                </div>
                                
                                <div className="space-y-3">
                                    {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
                                        <div key={task.id} className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 ${
                                            task.priority === 'Cao' ? 'border-red-500' : 'border-blue-500'
                                        }`}>
                                            <div>
                                                <p className="font-medium text-gray-800">{task.title}</p>
                                                <p className="text-xs text-gray-500">Hạn chót: {task.deadline_formatted}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                task.priority === 'Cao' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 text-center py-4">Không có công việc sắp tới.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* KHU VỰC 3: THỐNG KÊ NĂNG SUẤT */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="font-bold text-gray-700 mb-4">Tiến độ công việc</h3>
                                <div className="flex flex-col items-center justify-center py-4">
                                    <div 
                                        className="relative size-32 flex items-center justify-center rounded-full border-8 border-gray-100 text-2xl font-bold text-indigo-600"
                                        style={{
                                            background: `conic-gradient(#4f46e5 ${stats.percentage}%, #f3f4f6 0)`
                                        }}
                                    >
                                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                            {stats.percentage}%
                                        </div>
                                    </div>
                                    
                                    <p className="mt-6 text-sm text-gray-600 text-center">
                                        Bạn đã hoàn thành <span className="font-bold text-gray-800">{stats.completed}/{stats.total}</span> công việc
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* NÚT CHATBOT AI */}
            <div className="fixed bottom-10 right-10">
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Hỏi AI Trợ Lý</span>
                </button>
            </div>
        </AuthenticatedLayout>
    );
}