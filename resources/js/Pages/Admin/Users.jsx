import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Users({ auth, users, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');

    const handleSearch = () => {
        router.get(route('admin.users.index'), 
            { search: search, role: role }, 
            { 
                preserveState: true,
                replace: true,    
                preserveScroll: true 
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    // Hàm phụ trợ để hiển thị label vai trò đẹp hơn
    const getRoleBadge = (role) => {
        const roles = {
            admin: { label: 'Admin', class: 'bg-purple-100 text-purple-700' },
            manager: { label: 'Manager', class: 'bg-blue-100 text-blue-700' },
            approve: { label: 'Approver', class: 'bg-amber-100 text-amber-700' },
            user: { label: 'User', class: 'bg-gray-100 text-gray-700' },
        };
        const config = roles[role] || roles.user;
        return <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${config.class}`}>{config.label}</span>;
    };

    return (
        <AdminLayout
            auth={auth}
            header={<h2 className="font-semibold text-2xl text-gray-800 tracking-tight">Quản lý người dùng</h2>}
        >
            <Head title="Quản lý người dùng" />

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-3 flex-1">
                                <div className="relative w-full md:w-72">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên hoặc email..."
                                        className="pl-10 w-full border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>

                                <select
                                    className="border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-44 transition-all"
                                    value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value);
                                        router.get(route('admin.users.index'), 
                                            { search: search, role: e.target.value }, 
                                            { preserveState: true }
                                        );
                                    }}
                                >
                                    <option value="">Tất cả vai trò</option>
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                    <option value="approve">Approver</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <button
                                    onClick={handleSearch}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-indigo-200 transition-all active:scale-95"
                                >
                                    Lọc kết quả
                                </button>

                                {(filters.search || filters.role) && (
                                    <button
                                        onClick={() => {
                                            setSearch('');
                                            setRole('');
                                            router.get(route('admin.users.index'));
                                        }}
                                        className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
                                    >
                                        Xóa tất cả bộ lọc
                                    </button>
                                )}
                            </div>
                            {auth.user.role === 'admin' && (
                                <Link
                                    href={route('admin.users.create')}
                                    className="inline-flex items-center justify-center px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-emerald-200 transition-all active:scale-95 whitespace-nowrap"
                                >
                                    Thêm người dùng
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thông tin người dùng</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Công việc</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {users.data && users.data.length > 0 ? (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm border-2 border-white shadow-sm">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {getRoleBadge(user.role)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <Link
                                                        href={route('admin.tasks.index', { user_id: user.id })}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md text-xs font-bold transition-colors border border-blue-100"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        Tasks
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-4 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold ${
                                                        user.status === 'blocked' 
                                                        ? 'bg-red-100 text-red-700' 
                                                        : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                        {user.status === 'blocked' ? 'Bị khóa' : 'Hoạt động'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end items-center gap-2">
                                                        {auth.user.role === 'admin' ? (
                                                            <>
                                                                <Link
                                                                    href={route('admin.users.edit', user.id)}
                                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group"
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </Link>

                                                                {auth.user.id !== user.id ? (
                                                                    <button
                                                                        onClick={() => handleDelete(user.id)}
                                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                        title="Xóa người dùng"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                    </button>
                                                                ) : (
                                                                    <span className="px-2 py-1 bg-gray-100 text-gray-400 text-[10px] uppercase font-bold rounded italic tracking-tighter">You</span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-[10px] text-gray-400 font-medium italic border border-gray-100 px-2 py-1 rounded">
                                                                Chỉ xem
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
                                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                    </div>
                                                    <p className="text-gray-500 font-medium italic">Không tìm thấy người dùng nào khớp với điều kiện lọc</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {/* Phân trang */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex gap-1">
                                    {users.links.map((link, index) => {
                                        // Kiểm tra nếu là dấu ba chấm
                                        const isDots = link.label === "...";

                                        return (
                                            <button
                                                key={index}
                                                disabled={!link.url || isDots}
                                                onClick={() => {
                                                    if (!isDots && link.url) {
                                                        router.get(link.url, { search, role }, { preserveState: true });
                                                    }
                                                }}
                                                className={`px-3 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                                                    link.active 
                                                        ? 'bg-indigo-600 text-white border-indigo-600' 
                                                        : isDots
                                                            ? 'bg-transparent text-gray-400 border-none cursor-default'
                                                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                                                } ${(!link.url && !isDots) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                dangerouslySetInnerHTML={{ 
                                                    __html: link.label
                                                        .replace('&laquo; Previous', 'Trước')
                                                        .replace('Next &raquo;', 'Sau') 
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Hiển thị <span className="font-semibold">{users.from || 0}</span> - <span className="font-semibold">{users.to || 0}</span> trên tổng số <span className="font-semibold">{users.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}