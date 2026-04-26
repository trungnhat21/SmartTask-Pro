import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard({ auth, upcomingTasks = [], stats = { total: 0, completed: 0, percentage: 0 } }) {

    const messages = [
        <>Chào <span className="font-bold underline decoration-wavy">{auth.user.name}</span>! Bạn đang có <span className="px-2 py-0.5 bg-white text-indigo-600 rounded-md font-black mx-1">{upcomingTasks.length}</span> công việc sắp đến hạn. Hãy ưu tiên các mục quan trọng nhé!</>,
        <>Hiệu suất làm việc của bạn đang đạt <span className="px-2 py-0.5 bg-white text-indigo-600 rounded-md font-black mx-1">{stats.percentage}%</span>. Một kết quả rất ấn tượng, hãy tiếp tục duy trì nhé!</>,
        <>Đừng quên kiểm tra các công việc có độ ưu tiên <span className="px-2 py-0.5 bg-white text-red-600 rounded-md font-black mx-1">Cao</span> để tránh bị trễ hạn chót</>,
        <>Bạn đã hoàn thành <span className="px-2 py-0.5 bg-white text-indigo-600 rounded-md font-black mx-1">{stats.completed}</span> công việc. Hãy dành ít phút nghỉ ngơi trước khi bắt đầu việc tiếp theo</>,
        <>Bạn nên tập trung vào các dự án lớn trong buổi sáng để tối ưu hóa khả năng sáng tạo</>
    ];

    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            
            setTimeout(() => {
                setCurrentMsgIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setFade(true);
            }, 500);

        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                        Bảng Điều Khiển Hệ Thống
                    </h2>
                    <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                </div>
            }
        >
            <Head title="Bảng Điều Khiển" />

            <div className="py-10 bg-slate-50/50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    <div className="relative overflow-hidden bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-200">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="p-8 text-white relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md shrink-0">
                                        <span className="text-3xl animate-bounce inline-block">✨</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            Phân tích công việc 
                                            <span className="flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-200 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                            </span>
                                        </h3>
                                        <div className={`mt-2 text-indigo-100/90 leading-relaxed transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                                            <p className="text-base min-h-[3rem] md:min-h-0">
                                                {messages[currentMsgIndex]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                                <div 
                                    key={currentMsgIndex}
                                    className="h-full bg-white/40 animate-progress-banner"
                                    style={{ animation: 'progress-bar 5s linear forwards' }}
                                ></div>
                            </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-2 flex flex-col">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 flex-1 flex flex-col">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                                        <h3 className="font-semibold text-slate-800 text-lg">Công việc cần làm ngay</h3>
                                    </div>
                                    <Link 
                                        href={route('Quanlycongviec')} 
                                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                                    >
                                        Xem tất cả →
                                    </Link>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
                                        <div 
                                            key={task.id} 
                                            className="group flex items-center justify-between p-4 bg-white border border-slate-300 rounded-xl hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                    task.priority === 'Cao' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                                }`}>
                                                    <i className={`fa-solid ${task.priority === 'Cao' ? 'fa-fire' : 'fa-clock'} text-sm`}></i>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Hạn chót:</span>
                                                        <span className="text-xs font-semibold text-slate-600">{task.deadline_formatted}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                task.priority === 'Cao' 
                                                ? 'bg-red-50 text-red-600 border-red-100' 
                                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    )) : (
                                        <div className="text-center py-12">
                                            <div className="text-4xl mb-4">🎉</div>
                                            <p className="text-slate-400 font-medium">Tuyệt vời! Bạn không còn công việc nào tồn đọng.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-1000" 
                                    style={{ width: `${stats.percentage}%` }}
                                ></div>
                            </div>

                            <h3 className="font-semibold text-slate-800 text-lg mb-8 self-start">Hiệu suất tuần</h3>
                            
                            <div className="relative group">
                                <div 
                                    className="relative size-44 flex items-center justify-center rounded-full transition-transform group-hover:scale-105 duration-500"
                                    style={{
                                        background: `conic-gradient(#4f46e5 ${stats.percentage}%, #f1f5f9 0)`
                                    }}
                                >
                                    <div className="absolute inset-4 bg-white rounded-full shadow-inner flex flex-col items-center justify-center border border-slate-100">
                                        <span className="text-3xl font-black text-slate-800">{stats.percentage}%</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Hoàn thành</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 w-full space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Đã xong:</span>
                                    <span className="text-slate-800 font-bold">{stats.completed}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Tổng số:</span>
                                    <span className="text-slate-800 font-bold">{stats.total}</span>
                                </div>
                                <p className="text-xs text-slate-400 text-center italic border-t border-slate-50 pt-4">
                                    "Kế hoạch tốt là chìa khóa của thành công"
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="fixed bottom-8 right-8 z-50">
                <button className="group relative flex items-center gap-3 bg-slate-900 text-white pl-4 pr-6 py-3.5 rounded-2xl shadow-2xl hover:bg-indigo-600 transition-all duration-300 hover:pr-8 active:scale-95">
                    <div className="relative">
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 group-hover:border-indigo-600 transition-all"></div>
                        <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold tracking-wide">Hỏi AI Trợ Lý</span>
                </button>
            </div>
        </AuthenticatedLayout>
    );
}