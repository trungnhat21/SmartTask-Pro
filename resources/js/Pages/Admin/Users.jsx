import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react'; // Thêm useState để quản lý input

// Nhận thêm props 'filters' từ Controller gửi qua
export default function Users({ auth, users, filters = {} }) {
    // 1. Quản lý trạng thái tìm kiếm
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');

    // 2. Hàm xử lý gửi yêu cầu tìm kiếm về Server
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
    
    const handleRoleChange = (id, role) => {
        router.patch(route('admin.users.update', id), { role }, {
            preserveScroll: true,
            onSuccess: () => {
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    return (
        <AdminLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Quản lý người dùng</h2>}
        >
            <Head title="Quản lý người dùng" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        {/* --- PHẦN TÌM KIẾM VÀ LỌC (MỚI THÊM) --- */}
                        <div className="mb-6 flex flex-wrap gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Tìm theo tên, email..."
                                className="border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyUp={(e) => e.key === 'Enter' && handleSearch()} // Nhấn Enter để tìm
                            />

                            <select
                                className="border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-48"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    // Tự động lọc khi đổi vai trò trong dropdown
                                    router.get(route('admin.users.index'), 
                                        { search: search, role: e.target.value }, 
                                        { preserveState: true }
                                    );
                                }}
                            >
                                <option value="">Tất cả vai trò</option>
                                <option value="user">User</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>

                            <button
                                onClick={handleSearch}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 transition"
                            >
                                Tìm kiếm
                            </button>

                            {(filters.search || filters.role) && (
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        setRole('');
                                        router.get(route('admin.users.index'));
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 transition"
                                >
                                    Xóa lọc
                                </button>
                            )}
                        </div>

                        <div className="mb-4 text-sm text-gray-600">
                            * Lưu ý: Thay đổi vai trò sẽ có hiệu lực ngay lập tức.
                        </div>
                        
                        <table className="min-w-full divide-y divide-gray-200 border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tên</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Vai trò</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Chi tiết công việc</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select 
                                                    value={user.role || 'user'} 
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={auth.user.id === user.id}
                                                    className="border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {auth.user.id !== user.id ? (
                                                    <button 
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-600 hover:text-red-900 font-bold bg-red-50 px-3 py-1 rounded"
                                                    >
                                                        Xóa
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs underline">Đang đăng nhập</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={route('admin.tasks.index', { user_id: user.id })}
                                                    className="inline-flex items-center px-3 py-1 bg-blue-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-600 transition"
                                                >
                                                    Xem
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                            Không tìm thấy người dùng nào khớp với điều kiện lọc.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}