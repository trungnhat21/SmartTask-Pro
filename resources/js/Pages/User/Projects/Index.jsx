import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, projects, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('user.projects.index'), { search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-2xl">Dự án tham gia</h2>}>
            <Head title="Dự án của tôi" />
            <div className="py-12 max-w-7xl mx-auto px-4">
                
                {/* Thanh tìm kiếm */}
                <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                    <input
                        type="text"
                        placeholder="Tìm dự án..."
                        className="px-4 py-2 border rounded-lg w-full md:w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Tìm</button>
                </form>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tên dự án</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Công việc của tôi</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Hạn chót</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {projects.data.length > 0 ? (
                                    projects.data.map((proj) => (
                                        <tr key={proj.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-bold text-gray-900">{proj.name}</td>
                                            <td className="px-6 py-4 text-indigo-600 font-medium">{proj.pivot?.task_name}</td>
                                            <td className="px-6 py-4 text-gray-600">{proj.pivot?.deadline}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={route('user.projects.show', proj.id)} className="text-blue-600 font-bold hover:underline">Xem</Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Không tìm thấy dự án nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Phân trang */}
                    <div className="p-4 border-t flex flex-wrap items-center justify-between gap-4 bg-gray-50">
                        <div className="text-sm text-gray-600">
                            Hiển thị <span className="font-bold">{projects.from || 0}</span> đến <span className="font-bold">{projects.to || 0}</span> trong tổng số <span className="font-bold">{projects.total}</span> dự án
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                            {projects.links.map((link, index) => {
                                const isDots = link.label === "...";
                                
                                return (
                                    <button
                                        key={index}
                                        onClick={() => link.url && !isDots && router.get(link.url, {}, { preserveState: true })}
                                        disabled={!link.url || isDots}
                                        className={`px-3 py-1.5 text-sm border rounded-lg transition-all 
                                            ${link.active 
                                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                                : isDots 
                                                    ? 'bg-transparent text-gray-400 border-none cursor-default' 
                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                                            } 
                                            ${!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
                                        }
                                        dangerouslySetInnerHTML={{ 
                                            __html: link.label
                                                .replace('&laquo; Previous', 'Trước')
                                                .replace('Next &raquo;', 'Sau') 
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}