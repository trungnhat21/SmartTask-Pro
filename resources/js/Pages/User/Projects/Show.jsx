import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Show({ auth, project, members, activities = [] }) {

    const handleStatusChange = (memberId, newStatus) => {
        if (memberId !== auth.user.id) return;
        router.patch(route('user.projects.update-status', [memberId, project.id]), {
            status: newStatus
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-2xl text-slate-900 tracking-tight">Dự án: {project.name}</h2>}>
            <Head title={project.name} />
            
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest block mb-2">Mức độ ưu tiên</span>
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                            {project.priority || 'Trung bình'}
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest block mb-2">Hạn chót dự án</span>
                        <p className="text-sm font-bold text-slate-900">{project.deadline ? new Date(project.deadline).toLocaleDateString('vi-VN') : '---'}</p>
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest block mb-2">Mô tả tổng quan</span>
                        <p className="text-sm text-slate-600 leading-relaxed italic">{project.description || 'Không có mô tả.'}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50">
                        <h3 className="text-lg font-semibold text-slate-900">Danh sách nhiệm vụ</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                <th className="px-8 py-5 font-semibold">Người thực hiện</th>
                                <th className="px-6 py-5 font-semibold">Công việc</th>
                                <th className="px-6 py-5 font-semibold">Hạn chót</th>
                                <th className="px-6 py-5 font-semibold">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/80 transition-all">
                                    <td className="px-8 py-5 font-semibold text-slate-900">{member.name}</td>
                                    <td className="px-6 py-5 text-sm text-indigo-600 font-medium">{member.pivot?.task_name || '---'}</td>
                                    <td className="px-6 py-5 text-sm text-slate-600">{member.pivot?.deadline || '---'}</td>
                                    <td className="px-6 py-5">
                                        {member.id === auth.user.id ? (
                                            <select 
                                                value={member.pivot?.status || 'Đang tiến hành'} 
                                                onChange={(e) => handleStatusChange(member.id, e.target.value)}
                                                className="text-xs font-semibold rounded-xl border-slate-200 bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                                            >
                                                <option value="Đang tiến hành">Đang tiến hành</option>
                                                <option value="Hoàn thành">Hoàn thành</option>
                                            </select>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${member.pivot?.status === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {member.pivot?.status || 'Đang tiến hành'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Lịch sử hoạt động</h3>
                    <div className="space-y-6">
                        {activities.length > 0 ? activities.map((log) => (
                            <div key={log.id} className="relative pl-8 border-l-2 border-indigo-100">
                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                <p className="text-sm text-slate-800">
                                    <span className="font-semibold">{log.user?.name}</span> {log.action}
                                </p>
                                <p className="text-[11px] text-slate-400 font-medium mt-1">
                                    {new Date(log.created_at).toLocaleString('vi-VN')}
                                </p>
                            </div>
                        )) : <p className="text-slate-400 text-sm italic">Chưa có lịch sử hoạt động.</p>}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}