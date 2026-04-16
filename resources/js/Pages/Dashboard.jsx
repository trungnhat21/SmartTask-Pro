import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Bảng Điều Khiển Hệ Thống AI
                </h2>
            }
        >
            <Head title="Bảng Điều Khiển" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* KHU VỰC 1: AI SUGGESTION - Banner nổi bật nhất */}
                    <div className="overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg sm:rounded-lg">
                        <div className="p-6 text-white">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🤖</span>
                                <h3 className="text-lg font-bold">Trợ lý AI phân tích:</h3>
                            </div>
                            <p className="mt-2 text-indigo-100">
                                Chào Trung! Bạn có 5 công việc trong hôm nay. Tôi khuyên bạn nên xử lý 
                                <span className="font-bold underline ml-1">"Thiết kế Database"</span> trước vì nó có độ ưu tiên cao nhất.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* KHU VỰC 2: DANH SÁCH CÔNG VIỆC NHANH (Chiếm 2/3) */}
                        <div className="md:col-span-2 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-700">Công việc cần làm ngay</h3>
                                    <button className="text-sm text-indigo-600 hover:underline">Xem tất cả</button>
                                </div>
                                
                                {/* Danh sách Task mẫu */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                                        <div>
                                            <p className="font-medium text-gray-800">Thiết kế Database đồ án</p>
                                            <p className="text-xs text-gray-500">Hạn chót: Hôm nay</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">Gấp</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                                        <div>
                                            <p className="font-medium text-gray-800">Cài đặt Mailtrap Testing</p>
                                            <p className="text-xs text-gray-500">Hạn chót: Ngày mai</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">Bình thường</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KHU VỰC 3: THỐNG KÊ NHANH (Chiếm 1/3) */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="font-bold text-gray-700 mb-4">Năng suất tuần này</h3>
                                <div className="flex flex-col items-center justify-center py-4">
                                    {/* Giả lập một biểu đồ hình tròn hoặc con số */}
                                    <div className="relative size-32 flex items-center justify-center rounded-full border-8 border-indigo-500 text-2xl font-bold text-indigo-600">
                                        75%
                                    </div>
                                    <p className="mt-4 text-sm text-gray-600">Bạn đã hoàn thành 12/16 việc</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* NÚT CHATBOT AI (Góc màn hình) */}
            <div className="fixed bottom-10 right-10">
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <span>Hỏi AI Trợ Lý</span>
                </button>
            </div>
        </AuthenticatedLayout>
    );
}