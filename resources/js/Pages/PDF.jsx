import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function PDF({ auth, tasks }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-2xl text-slate-800 tracking-tight">
                    Xuất Báo Cáo <span className="text-red-600">PDF</span>
                </h2>
            }
        >
            <Head title="Xuất PDF" />

            <div className="py-12 bg-slate-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-slate-100">
                        
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800">Bản xem trước danh sách</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                        <p className="text-sm text-slate-500 font-medium">
                                            Tổng cộng: <span className="text-slate-900 font-bold">{tasks.length}</span> công việc hiện tại
                                        </p>
                                    </div>
                                </div>
                                
                                <a 
                                    href={route('pdf.export')} 
                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-red-100 transition-all active:scale-95 group"
                                >
                                    <i className="fa-solid fa-file-pdf text-lg group-hover:scale-110 transition-transform"></i>
                                    Tải File PDF Ngay
                                </a>
                            </div>

                            <div className="overflow-hidden border border-slate-100 rounded-xl shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Tên công việc</th>
                                            <th className="px-6 py-4 font-semibold">Ưu tiên</th>
                                            <th className="px-6 py-4 font-semibold">Hạn chót</th>
                                            <th className="px-6 py-4 font-semibold text-right">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {tasks.map((task) => (
                                            <tr 
                                                key={task.id} 
                                                className="bg-white hover:bg-slate-50/50 transition-colors group"
                                            >
                                                <td className="px-6 py-4 font-semibold text-slate-700 group-hover:text-red-600 transition-colors">
                                                    {task.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                                                        task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {task.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 font-medium">
                                                    {new Date(task.deadline).toLocaleString('vi-VN', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-semibold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        {task.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-widest px-2">
                                <span>Hệ thống báo cáo nội bộ</span>
                                <span>{new Date().toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}