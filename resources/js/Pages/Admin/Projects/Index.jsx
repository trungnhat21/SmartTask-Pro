import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const ProgressCircle = ({ percent }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative w-12 h-12">
            <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r={radius} fill="none" stroke="currentColor" className="text-slate-100" strokeWidth="4" />
                <circle 
                    cx="24" cy="24" r={radius} fill="none" stroke="currentColor" 
                    className="text-indigo-500 transition-all duration-500" 
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-700">
                {percent}%
            </span>
        </div>
    );
};

export default function Index({ projects, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [priorityFilter, setPriorityFilter] = useState(filters?.priority || 'Tất cả');

    const handleFilter = (search, priority) => {
        router.get(
            route('admin.projects.index'), 
            { search: search, priority: priority }, 
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dự án này không?')) {
            router.delete(route('admin.projects.destroy', id));
        }
    };

    return (
        <AdminLayout
            header={<h2 className="font-semibold text-2xl text-slate-800 tracking-tight">Quản lý dự án</h2>}
        >
            <Head title="Danh sách dự án" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        
                        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex gap-3 w-full md:w-auto">
                                <input 
                                    type="text" 
                                    placeholder="Tìm theo tên dự án..." 
                                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        handleFilter(e.target.value, priorityFilter);
                                    }}
                                />
                                <select 
                                    className="px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-40 md:w-40 text-sm text-slate-700 bg-white"
                                    value={priorityFilter}
                                    onChange={(e) => {
                                        setPriorityFilter(e.target.value);
                                        handleFilter(searchTerm, e.target.value);
                                    }}
                                >
                                    <option>Tất cả</option>
                                    <option>Thấp</option>
                                    <option>Cao</option>
                                    <option>Trung bình</option>
                                </select>
                            </div>
                            <Link href={route('admin.projects.create')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                                Tạo dự án mới
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                        <th className="px-8 py-5 font-semibold">Tên dự án</th>
                                        <th className="px-6 py-5 font-semibold">Mức độ ưu tiên</th>
                                        <th className="px-6 py-5 font-semibold">Deadline</th>
                                        <th className="px-6 py-5 font-semibold">Chi tiết dự án</th>
                                        <th className="px-6 py-5 font-semibold">Tiến độ</th>
                                        <th className="px-8 py-5 text-right font-semibold">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {projects.data && projects.data.length > 0 ? (
                                        projects.data.map((proj) => {
                                            const members = Array.isArray(proj.users) ? proj.users : [];
                                            const completedMembers = members.filter(u => u.pivot?.status === 'Hoàn thành').length;
                                            const progress = members.length > 0 ? Math.round((completedMembers / members.length) * 100) : 0;
                                            
                                            return (
                                                <tr key={proj.id} className="group hover:bg-slate-50/80 transition-all">
                                                    <td className="px-8 py-6">
                                                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{proj.name}</div>
                                                        <div className="text-xs text-slate-400 mt-1">{proj.description || 'Không có mô tả'}</div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${proj.priority === 'Thấp' ? 'bg-red-50 text-red-600' : proj.priority === 'Cao' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                                                            {proj.priority || 'Bình thường'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6 text-sm text-slate-600">{proj.deadline ? new Date(proj.deadline).toLocaleDateString('vi-VN') : '---'}</td>
                                                    <td className="px-6 py-6">
                                                        <Link href={route('admin.projects.show', proj.id)} className="text-sm font-semibold text-indigo-600">
                                                            Xem
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-6"><ProgressCircle percent={progress} /></td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <Link href={route('admin.projects.edit', proj.id)} className="p-2 text-slate-400 hover:text-indigo-600"><i className="fa fa-edit"></i></Link>
                                                            <button onClick={() => handleDelete(proj.id)} className="p-2 text-slate-400 hover:text-red-600"><i className="fa fa-trash"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr><td colSpan="6" className="px-6 py-16 text-center text-slate-400">Không tìm thấy dự án nào</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PHÂN TRANG */}
                        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-1">
                                {projects.links.map((link, index) => {
                                    const isDots = link.label === "...";
                                    return (
                                        <button
                                            key={index}
                                            disabled={!link.url || isDots}
                                            onClick={() => !isDots && router.get(link.url, {}, { preserveState: true })}
                                            className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all 
                                                ${link.active ? 'bg-indigo-600 text-white shadow-md' : 
                                                isDots ? 'text-slate-400 cursor-default border-none' : 
                                                'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                                            dangerouslySetInnerHTML={{ 
                                                __html: link.label.replace('&laquo; Previous', 'Trước').replace('Next &raquo;', 'Sau') 
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            <div className="text-xs text-slate-500 font-bold whitespace-nowrap">
                                Hiển thị {projects.from || 0} - {projects.to || 0} / {projects.total}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}