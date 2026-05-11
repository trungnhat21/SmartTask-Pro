import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function FeedBack({ feedbacks, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.feedbacks.index'), { search }, { preserveState: true });
    };

    const deleteFeedback = (id) => {
        if (confirm('Xác nhận xóa phản hồi này?')) {
            router.delete(route('admin.feedbacks.destroy', id));
        }
    };

    const deleteAllFeedbacks = () => {
        if (confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa TẤT CẢ phản hồi? Thao tác này không thể hoàn tác')) {
            router.post(route('admin.feedbacks.deleteAll'));
        }
    };

    return (
        <AdminLayout 
            header={<h2 className="font-semibold text-2xl text-slate-800 leading-tight">Quản lý phản hồi</h2>}
        >
            <Head title="Phản hồi khách hàng" />

            <div className="max-w-7xl mx-auto py-4">
                <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        />
                        <div className="absolute left-4 top-3.5 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </form>

                    <button
                        onClick={deleteAllFeedbacks}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white hover:bg-red-600 rounded-2xl font-semibold text-sm shadow-lg shadow-red-200 transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Dọn sạch hòm thư
                    </button>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-slate-800">Hộp thư góp ý</h3>
                            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-semibold rounded-lg uppercase tracking-wider">
                                {feedbacks.length} Bản ghi
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="bg-slate-50/80">
                                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Người dùng</th>
                                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Nội dung phản hồi</th>
                                    <th className="px-8 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-widest">Thời gian</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {feedbacks.data.length > 0 ? (
                                    feedbacks.data.map((fb) => (
                                        <tr key={fb.id} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800">{fb.name}</span>
                                                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                            <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C10.119 18 2 9.881 2 2V3z" /></svg>
                                                            {fb.phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-sm text-slate-600 max-w-md leading-relaxed">
                                                    {fb.content}
                                                </p>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right">
                                                <div className="text-sm font-bold text-slate-700">
                                                    {new Date(fb.created_at).toLocaleDateString('vi-VN')}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold">
                                                    {new Date(fb.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => deleteFeedback(fb.id)}
                                                    className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-red-200"
                                                    title="Xóa phản hồi"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium">
                                            Không có phản hồi nào được tìm thấy
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Phân trang */}
                    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex gap-1">
                            {feedbacks.links.map((link, index) => {
                                const isDots = link.label === "...";
                                return (
                                    <button
                                        key={index}
                                        disabled={!link.url || isDots}
                                        onClick={() => !isDots && router.get(link.url, { search }, { preserveState: true })}
                                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                                            link.active 
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                                                : isDots
                                                    ? 'text-slate-400 cursor-default border-none'
                                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                        } ${(!link.url && !isDots) ? 'opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ 
                                            __html: link.label.replace('&laquo; Previous', 'Trước').replace('Next &raquo;', 'Sau') 
                                        }}
                                    />
                                );
                            })}
                        </div>
                        <div className="text-xs text-slate-500 font-bold">
                            Hiển thị <span className="text-indigo-600">{feedbacks.from || 0}</span> - <span className="text-indigo-600">{feedbacks.to || 0}</span> / {feedbacks.total}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}