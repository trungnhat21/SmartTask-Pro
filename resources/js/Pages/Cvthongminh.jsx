import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Cvthongminh({ auth, smartTasks }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lộ trình ưu tiên thông minh</h2>}
        >
            <Head title="Sắp xếp thông minh" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header Card: Hệ thống phân tích */}
                    <div className="relative overflow-hidden flex items-start gap-4 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm mb-8">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <i className="fa-solid fa-gears text-6xl text-blue-500"></i>
                        </div>
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-200">
                            <i className="fa-solid fa-bolt text-white text-xl"></i>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-gray-900">Hệ thống Phân tích Công việc</h3>
                            <p className="mt-1 text-gray-600">
                                Chào <strong>{auth.user.name}</strong>, hệ thống đã lọc và đưa các <strong>nhiệm vụ trọng tâm</strong> lên đầu dựa trên độ ưu tiên và thời gian.
                            </p>
                        </div>
                    </div>

                    {/* Danh sách công việc */}
                    <div className="space-y-6">
                        {smartTasks && smartTasks.filter(t => t.status !== 'Quá hạn' && t.status !== 'Hoàn thành').length > 0 ? (
                            smartTasks
                                .filter(task => task.status !== 'Quá hạn' && task.status !== 'Hoàn thành')
                                .map((task, index) => (
                                    <div 
                                        key={task.id} 
                                        className={`relative p-6 rounded-2xl border transition-all duration-500 ${
                                            index === 0 
                                            ? 'bg-white border-blue-400 shadow-xl shadow-blue-100 scale-[1.03] z-10' 
                                            : task.priority === 'Cao'
                                            ? 'bg-white border-blue-200 shadow-md opacity-100'
                                            : 'bg-white border-gray-200 shadow-sm opacity-90'
                                        }`}
                                    >
                                    {/* Nhãn trạng thái */}
                                    <div className="absolute -top-3 left-6 flex gap-2">
                                        {task.priority === 'Cao' && (
                                            <div className="flex items-center gap-1 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full uppercase font-black tracking-widest shadow-md">
                                                <i className="fa-solid fa-star"></i>
                                                Nhiệm vụ trọng tâm
                                            </div>
                                        )}
                                        
                                        {task.warning && (
                                            <div className="flex items-center gap-1 bg-red-600 text-white text-[10px] px-3 py-1 rounded-full uppercase font-black tracking-widest shadow-md">
                                                <i className="fa-solid fa-triangle-exclamation animate-pulse"></i>
                                                {task.warning}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-between items-start mb-4 pt-2">
                                        <div className="flex-1">
                                            <h4 className={`text-xl font-extrabold ${task.priority === 'Cao' ? 'text-blue-950' : 'text-gray-800'}`}>
                                                {task.title}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                                                    <i className="fa-regular fa-calendar-check text-blue-500"></i>
                                                    <span>{task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Chưa đặt hạn'}</span>
                                                </div>
                                                <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-tight ${
                                                    task.priority === 'Cao' 
                                                    ? 'bg-red-50 text-red-600 border border-red-100' 
                                                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>


                                    <div className={`flex items-start gap-4 p-4 rounded-xl border-l-4 ${
                                        task.priority === 'Cao' 
                                        ? 'bg-blue-50/50 border-l-blue-600 border-y-blue-100 border-r-blue-100' 
                                        : 'bg-gray-50 border-l-gray-400 border-y-gray-100 border-r-gray-100'
                                    }`}>
                                        <div className="shrink-0">
                                            <div className={`size-8 rounded-full flex items-center justify-center ${task.priority === 'Cao' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                                                <i className={`fa-solid fa-lightbulb ${task.priority === 'Cao' ? 'text-blue-600' : 'text-gray-500'}`}></i>
                                            </div>
                                        </div>
                                        <div className="text-sm leading-relaxed">
                                            <p className={`font-bold uppercase text-[11px] mb-1 tracking-wider ${task.priority === 'Cao' ? 'text-blue-700' : 'text-gray-600'}`}>
                                                Phân tích hệ thống:
                                            </p>
                                            <div className={`${task.priority === 'Cao' ? 'text-blue-900 font-semibold' : 'text-gray-700'}`}>
                                                {task.dynamic_advice}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-inner">
                                <div className="text-6xl mb-6">🎯</div>
                                <h3 className="text-xl font-bold text-gray-900">Danh sách trống!</h3>
                                <p className="text-gray-500 mt-2">Mọi việc đã xong, Bạn hãy nghỉ ngơi nhé!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}