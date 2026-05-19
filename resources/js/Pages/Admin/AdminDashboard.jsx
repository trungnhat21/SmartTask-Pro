import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminDashboard({ auth, totalUsers, totalTasks, overdueTasks, completedTasks, allUsers, filters }) {

    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [userFilter, setUserFilter] = useState(filters?.user_id || '');
    const [sortBy, setSortBy] = useState(filters?.sort_by || '');
    const [sortOrder, setSortOrder] = useState(filters?.sort_order || '');

    const handleFilter = () => {
        router.get(route('admin.adminDashboard.index'), {
            search: searchQuery,
            status: statusFilter,
            user_id: userFilter,
            sort_by: sortBy,
            sort_order: sortOrder
        }, { preserveState: true,
             replace: true,
             onSuccess: ()  => {
                setSearchQuery('');
             }
         });
    };

    const handleSortChange = (column, order) => {
        setSortBy(column);
        setSortOrder(order);

        router.get(route('admin.adminDashboard.index'), {
            search: searchQuery,
            status: statusFilter,
            user_id: userFilter,
            sort_by: column,
            sort_order: order
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    return (
        <AdminLayout
            header={<h2 className="font-semibold text-2xl text-slate-800 leading-tight">Tổng quan hệ thống</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12 bg-slate-200 border rounded-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <i className="fa-solid fa-users text-xl"></i>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tổng User</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalUsers || 0}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <i className="fa-solid fa-list-check text-xl"></i>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Đang thực hiện</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalTasks || 0}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                <i className="fa-solid fa-circle-check text-xl"></i>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Đã hoàn thành</p>
                                <h3 className="text-2xl font-bold text-slate-900">{completedTasks || 0}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Quá hạn</p>
                                <h3 className="text-2xl font-bold text-slate-900">{overdueTasks?.length || 0}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2 ml-1">Tìm công việc</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <i className="fa-solid fa-magnifying-glass text-sm"></i>
                                </span>
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Nhập tên công việc..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-48">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2 ml-1">Người phụ trách</label>
                            <select 
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value)}
                                className="w-full py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                <option value="">Tất cả User</option>
                                {allUsers?.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full md:w-48">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2 ml-1">Trạng thái</label>
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="Chưa làm">Chưa làm</option>
                                <option value="Đang làm">Đang làm</option>
                                <option value="Chờ duyệt">Chờ duyệt</option>
                                <option value="Quá hạn">Quá hạn</option>
                                <option value="Hoàn thành">Hoàn thành</option>
                            </select>
                        </div>

                        <button 
                            onClick={handleFilter}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                        >
                            <i className="fa-solid fa-filter"></i> Lọc kết quả
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Danh sách công việc</h3>
                            </div>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full uppercase">Hệ thống</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-slate-600 text-sm uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Tên công việc</th>
                                        <th className="px-6 py-4 font-semibold">Người phụ trách</th>
                                        <th className="px-6 py-4 font-semibold relative">
                                            <div className="inline-block text-left">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        window._openPriority = false;
                                                        window._openDeadline = !window._openDeadline;
                                                        router.reload({ preserveState: true });
                                                    }}
                                                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors uppercase font-semibold"
                                                >
                                                    <span>Hạn chót</span>
                                                    <i className="fa-solid fa-caret-down text-xs text-slate-400"></i>
                                                </button>

                                                {window._openDeadline && (
                                                    <div className="absolute left-6 mt-2 w-36 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden normal-case font-normal text-slate-700 border border-slate-100">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => {
                                                                    window._openDeadline = false;
                                                                    handleSortChange('deadline', 'asc');
                                                                }}
                                                                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${sortBy === 'deadline' && sortOrder === 'asc' ? 'text-indigo-600 font-semibold bg-indigo-50/50' : ''}`}
                                                            >
                                                                <span>Gần nhất</span>
                                                                {sortBy === 'deadline' && sortOrder === 'asc' && <i className="fa-solid fa-check text-[10px]"></i>}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    window._openDeadline = false;
                                                                    handleSortChange('deadline', 'desc');
                                                                }}
                                                                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${sortBy === 'deadline' && sortOrder === 'desc' ? 'text-indigo-600 font-semibold bg-indigo-50/50' : ''}`}
                                                            >
                                                                <span>Xa nhất</span>
                                                                {sortBy === 'deadline' && sortOrder === 'desc' && <i className="fa-solid fa-check text-[10px]"></i>}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 font-semibold relative">
                                            <div className="inline-block text-left">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        window._openDeadline = false;
                                                        window._openPriority = !window._openPriority;
                                                        router.reload({ preserveState: true });
                                                    }}
                                                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors uppercase font-semibold"
                                                >
                                                    <span>Mức độ</span>
                                                    <i className="fa-solid fa-caret-down text-xs text-slate-400"></i>
                                                </button>

                                                {window._openPriority && (
                                                    <div className="absolute left-6 mt-2 w-40 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden normal-case font-normal text-slate-700 border border-slate-100">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => {
                                                                    window._openPriority = false;
                                                                    handleSortChange('priority', 'asc');
                                                                }}
                                                                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${sortBy === 'priority' && sortOrder === 'asc' ? 'text-indigo-600 font-semibold bg-indigo-50/50' : ''}`}
                                                            >
                                                                <span>Thấp đến Cao</span>
                                                                {sortBy === 'priority' && sortOrder === 'asc' && <i className="fa-solid fa-check text-[10px]"></i>}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    window._openPriority = false;
                                                                    handleSortChange('priority', 'desc');
                                                                }}
                                                                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${sortBy === 'priority' && sortOrder === 'desc' ? 'text-indigo-600 font-semibold bg-indigo-50/50' : ''}`}
                                                            >
                                                                <span>Cao đến Thấp</span>
                                                                {sortBy === 'priority' && sortOrder === 'desc' && <i className="fa-solid fa-check text-[10px]"></i>}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                                        <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {overdueTasks.data && overdueTasks.data.length > 0 ? overdueTasks.data.map((task) => (
                                        <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-800">{task.title}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{task.user?.name || 'Chưa rõ'}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-red-600 font-medium">
                                                    {new Date(task.deadline).toLocaleDateString('vi-VN')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded uppercase">
                                                    {task.priority || 'Cao'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase inline-block ${
                                                    task.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' : 
                                                    task.status === 'Chờ duyệt' ? 'bg-yellow-100 text-yellow-700' :
                                                    task.status === 'Đang làm' ? 'bg-blue-100 text-blue-700' :
                                                    task.status === 'Quá hạn' ? 'bg-red-100 text-red-700' : 
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {task.status || 'Chưa làm'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {(auth.user.role === 'admin' || auth.user.role === 'manager') && (
                                                    <button
                                                        onClick={() => router.get(route('admin.tasks.index'), { task_id: task.id })}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                        title="Xem chi tiết công việc"
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                                <i className="fa-solid fa-magnifying-glass text-3xl mb-3 block"></i>
                                                Không tìm thấy công việc nào phù hợp
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/*Phân trang*/}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex gap-1">
                                {overdueTasks.links.map((link, index) => {
                                    const isDots = link.label === "...";

                                    return (
                                        <button
                                            key={index}
                                            disabled={!link.url || isDots} 
                                            onClick={() => {
                                                if (!isDots) {
                                                    router.get(link.url, {
                                                        search: searchQuery,
                                                        status: statusFilter,
                                                        user_id: userFilter
                                                    }, { preserveState: true });
                                                }
                                            }}
                                            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                                                link.active 
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                                                    : isDots
                                                        ? 'bg-transparent text-slate-400 border-none cursor-default'
                                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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
                            
                            <div className="text-xs text-slate-500 font-medium">
                                Hiển thị {overdueTasks.from} - {overdueTasks.to} trong tổng số {overdueTasks.total}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}