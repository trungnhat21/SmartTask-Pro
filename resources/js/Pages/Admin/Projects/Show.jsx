import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ project, members, activities = [] }) {
    if (!project) {
        return (
            <AdminLayout header={<h2 className="font-semibold text-2xl text-slate-800">Chi tiết dự án</h2>}>
                <div className="py-12 text-center text-slate-500">Không tìm thấy thông tin dự án này</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-2xl text-slate-900 tracking-tight">Chi tiết: {project.name}</h2>
                </div>
            }
        >
            <Head title={`Chi tiết - ${project.name}`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest block mb-2">Mức độ ưu tiên</span>
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${
                                project.priority === 'Khẩn cấp' ? 'bg-red-50 text-red-700' : 
                                project.priority === 'Cao' ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {project.priority || 'Bình thường'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest block mb-2">Hạn chót dự án</span>
                            <span className="text-sm font-bold text-slate-900">{project.deadline ? new Date(project.deadline).toLocaleDateString('vi-VN') : '---'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest block mb-2">Mô tả</span>
                            <p className="text-sm text-slate-600 leading-relaxed italic">{project.description || 'Không có mô tả chi tiết.'}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-50">
                            <h3 className="text-lg font-semibold text-slate-900">Danh sách nhiệm vụ</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                        <th className="px-8 py-5 font-semibold">Thành viên</th>
                                        <th className="px-6 py-5 font-semibold">Nhiệm vụ</th>
                                        <th className="px-6 py-5 font-semibold">Hạn chót</th>
                                        <th className="px-6 py-5 font-semibold">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {members && members.map((user, index) => (
                                        <tr key={index} className="hover:bg-slate-50/80 transition-all">
                                            <td className="px-8 py-5 font-semibold text-slate-900">{user.name}</td>
                                            <td className="px-6 py-5 text-sm text-indigo-600 font-medium">{user.pivot?.task_name}</td>
                                            <td className="px-6 py-5 text-sm text-slate-600">{user.pivot?.deadline}</td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${user.pivot?.status === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {user.pivot?.status || 'Đang làm'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 3. LỊCH SỬ HOẠT ĐỘNG */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <h3 className="text-lg font-semibold text-slate-900 mb-6">Lịch sử hoạt động</h3>
                        <div className="space-y-6">
                            {activities.length > 0 ? (
                                activities.map((log) => (
                                    <div key={log.id} className="relative pl-8 border-l-2 border-indigo-100">
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                        <p className="text-sm text-slate-800">
                                            <span className="font-semibold">{log.user?.name || 'Hệ thống'}</span> {log.action}
                                        </p>
                                        <p className="text-[11px] text-slate-400 font-medium mt-1">
                                            {new Date(log.created_at).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic">Chưa có hoạt động nào được ghi lại.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}