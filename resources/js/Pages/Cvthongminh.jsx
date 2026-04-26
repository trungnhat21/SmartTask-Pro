import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Cvthongminh({ auth, smartTasks }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-2xl text-orange-900 tracking-tight">
                    Lộ trình Thông minh
                </h2>
            }
        >
            <Head title="Sắp xếp thông minh" />

            <div className="py-12 bg-orange-50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="relative overflow-hidden flex items-start gap-5 rounded-3xl border border-orange-200 bg-white p-8 shadow-sm mb-10">
                        <div className="absolute top-[-10%] right-[-2%] opacity-5 rotate-12">
                            <i className="fa-solid fa-bolt text-[120px] text-orange-500"></i>
                        </div>
                        
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-orange-600 shadow-lg shadow-orange-200 text-white">
                            <i className="fa-solid fa-bolt text-2xl"></i>
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-xl font-semibold text-slate-900">Hệ thống Phân tích Công việc</h3>
                            <p className="mt-1 text-slate-600 leading-relaxed">
                                Chào <strong>{auth.user.name}</strong>, hệ thống đã lọc và đưa các <strong className="text-orange-600">nhiệm vụ trọng tâm</strong> lên đầu dựa trên độ ưu tiên và thời gian
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {smartTasks && smartTasks.filter(t => t.status !== 'Quá hạn' && t.status !== 'Hoàn thành').length > 0 ? (
                            smartTasks
                                .filter(task => task.status !== 'Quá hạn' && task.status !== 'Hoàn thành')
                                .map((task, index) => (
                                    <div 
                                        key={task.id} 
                                        className={`relative p-8 rounded-[2rem] border transition-all duration-500 ${
                                            index === 0 
                                            ? 'bg-white border-orange-400 shadow-xl shadow-orange-100 scale-[1.02] z-10' 
                                            : task.priority === 'Cao'
                                            ? 'bg-white border-orange-200 shadow-md'
                                            : 'bg-white/80 border-gray-200 shadow-sm opacity-95'
                                        }`}
                                    >

                                        <div className="absolute -top-3.5 left-8 flex gap-2">
                                            {task.priority === 'Cao' && (
                                                <div className="flex items-center gap-1.5 bg-orange-600 text-white text-[10px] px-4 py-1.5 rounded-full uppercase font-semibold tracking-widest shadow-md">
                                                    <i className="fa-solid fa-bolt"></i>
                                                    Nhiệm vụ trọng tâm
                                                </div>
                                            )}
                                            
                                            {task.warning && (
                                                <div className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] px-4 py-1.5 rounded-full uppercase font-semibold tracking-widest shadow-md">
                                                    <i className="fa-solid fa-triangle-exclamation animate-pulse"></i>
                                                    {task.warning}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex justify-between items-start mb-6 pt-2">
                                            <div className="flex-1">
                                                <h4 className={`text-2xl font-semibold tracking-tight ${task.priority === 'Cao' ? 'text-orange-900' : 'text-slate-800'}`}>
                                                    {task.title}
                                                </h4>
                                                
                                                <div className="flex items-center gap-4 mt-3">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-500 font-bold">
                                                        <i className="fa-regular fa-calendar-check text-orange-500"></i>
                                                        <span>{task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Chưa đặt hạn'}</span>
                                                    </div>
                                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-black uppercase border ${
                                                        task.priority === 'Cao' 
                                                        ? 'bg-orange-50 text-orange-600 border-orange-100' 
                                                        : 'bg-slate-50 text-slate-500 border-slate-100'
                                                    }`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`flex items-start gap-4 p-5 rounded-2xl border ${
                                            task.priority === 'Cao' 
                                            ? 'bg-orange-50/50 border-orange-100' 
                                            : 'bg-slate-50 border-slate-100'
                                        }`}>
                                            <div className="shrink-0 mt-1">
                                                <i className={`fa-solid fa-bolt ${task.priority === 'Cao' ? 'text-orange-600' : 'text-slate-400'}`}></i>
                                            </div>
                                            <div className="text-sm leading-relaxed">
                                                <p className={`font-semibold uppercase text-[10px] mb-1 tracking-wider ${task.priority === 'Cao' ? 'text-orange-700' : 'text-slate-500'}`}>
                                                    Phân tích hệ thống:
                                                </p>
                                                <div className={`font-medium ${task.priority === 'Cao' ? 'text-orange-950' : 'text-slate-700'}`}>
                                                    {task.dynamic_advice}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-orange-100">
                                <div className="text-6xl mb-6">🎯</div>
                                <h3 className="text-xl font-black text-orange-900">Danh sách trống!</h3>
                                <p className="text-slate-500 mt-2">Mọi việc đã xong, Bạn hãy nghỉ ngơi nhé!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}