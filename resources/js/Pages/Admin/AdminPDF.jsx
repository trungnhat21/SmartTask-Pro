import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

export default function AdminPDF({ topUsers }) {

    const getRankBadge = (rank) => {
        switch(rank) {
            case 1: return <span className="flex items-center gap-1 text-amber-500 font-semibold italic"><span className="text-lg">🏆</span> Hạng 1</span>;
            case 2: return <span className="flex items-center gap-1 text-slate-400 font-semibold italic"><span className="text-lg">🥈</span> Hạng 2</span>;
            case 3: return <span className="flex items-center gap-1 text-orange-400 font-semibold italic"><span className="text-lg">🥉</span> Hạng 3</span>;
            default: return <span className="text-slate-500 font-bold ml-2"># {rank}</span>;
        }
    };

    const exportPDF = () => {
        window.open(route('admin.admin.ranking.export'), '_blank');
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này khỏi danh sách?')) {

        }
    };

    return (
        <AdminLayout 
            header={<h2 className="font-semibold text-2xl text-slate-800 leading-tight">Bảng xếp hạng thành viên</h2>}
        >
            <Head title="Bảng xếp hạng" />

            <div className="max-w-7xl mx-auto py-8 px-4 bg-slate-200 border rounded-xl">
                <div className="mb-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800 uppercase tracking-tight">Top 5 Chiến binh xuất sắc</h3>
                    </div>

                    <button 
                        onClick={exportPDF}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Xuất bảng xếp hạng PDF
                    </button>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead>
                            <tr className="bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-8 py-6 text-left">Thứ hạng</th>
                                <th className="px-8 py-6 text-left">Thành viên</th>
                                <th className="px-8 py-6 text-center">Công việc hoàn thành</th>
                                <th className="px-8 py-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {topUsers.length > 0 ? topUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        {getRankBadge(user.rank)}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl ${user.avatar_color} flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform`}>
                                                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <span className="font-semibold text-slate-700 text-base">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl font-black text-sm">
                                            {user.completed_tasks}
                                            <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-medium italic">
                                        Chưa có dữ liệu người dùng hoàn thành công việc
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}