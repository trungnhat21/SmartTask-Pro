import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Tasks({ auth, tasks, users, filters }) {
    const [priority, setPriority] = useState(filters.priority || '');
    const [status, setStatus] = useState(filters.status || '');

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const { 
        data: assignData, 
        setData: setAssignData, 
        post: assignPost, 
        reset: resetAssign,
        errors: assignErrors 
    } = useForm({
        title: '',
        user_id: filters.user_id || '', 
        priority: 'Trung bình',
        description: '',
        deadline: '',
        status: 'Chưa làm',
        created_by_admin: true 
    });

    const handleAssignTask = (e) => {
        e.preventDefault();
        assignPost(route('admin.tasks.store'), {
            onSuccess: () => {
                setIsAssignModalOpen(false);
                resetAssign();
            },
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, patch, delete: destroy, reset, errors: editErrors, } = useForm({
        id: '',
        title: '',
        status: '',
        deadline: '',
        user_id: '',
        description: '',
        priority: '', 
    });

    const openEditModal = (task) => {
        setData({
            id: task.id,
            title: task.title,
            status: task.status,
            deadline: task.deadline,
            user_id: task.user_id,
            priority: task.priority,
            description: task.description || '',
        });
        setIsModalOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        patch(route('admin.tasks.update', data.id), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
            destroy(route('admin.tasks.destroy', id));
        }
    };

    const handleFilter = () => {
        router.get(route('admin.tasks.index'), { 
            priority, 
            status, 
            user_id: filters.user_id
        }, { preserveState: true });
    };

    const handleDeleteAll = () => {
        const message = filters.user_id 
            ? 'Bạn có chắc chắn muốn xóa TẤT CẢ công việc của người dùng này?' 
            : 'CẢNH BÁO: Bạn sẽ xóa TOÀN BỘ công việc của TẤT CẢ người dùng. Tiếp tục?';

        if (confirm(message)) {
            router.delete(route('admin.tasks.destroyAll'), {
                data: { user_id: filters.user_id }
            });
        }
    };

    return (
        <AdminLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Quản lý công việc hệ thống</h2>}
        >
            <Head title="Quản lý công việc" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-4 mb-4 rounded-lg shadow flex flex-wrap items-center gap-4 text-sm">
                        <button 
                            onClick={() => router.get(route('admin.users.index'))} 
                            className="bg-gray-500 text-white px-4 py-1.5 rounded-md hover:bg-gray-600 flex items-center gap-1 transition"
                        >
                            Quay lại
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <span>Ưu tiên:</span>
                            <select className="border-gray-300 rounded-md py-1" value={priority} onChange={e => setPriority(e.target.value)}>
                                <option value="">Tất cả</option>
                                <option value="Thấp">Thấp</option>
                                <option value="Trung bình">Trung bình</option>
                                <option value="Cao">Cao</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Trạng thái:</span>
                            <select className="border-gray-300 rounded-md py-1" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="">Tất cả</option>
                                <option value="Chưa làm">Chưa làm</option>
                                <option value="Đang làm">Đang làm</option>
                                <option value="Hoàn thành">Hoàn thành</option>
                                <option value="Quá hạn">Quá hạn</option>
                            </select>
                        </div>

                        <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition">Lọc</button>
                        
                        <button 
                            onClick={() => setIsAssignModalOpen(true)} 
                            className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 font-bold shadow-sm transition"
                        >
                            Giao việc mới
                        </button>

                        <button onClick={handleDeleteAll} className="ml-auto bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 font-medium transition">
                            Xóa danh sách này
                        </button>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <table className="min-w-full divide-y divide-gray-200 border">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Công việc</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Người thực hiện</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Nguồn gốc</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ưu tiên</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Deadline</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tasks.length > 0 ? tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{task.user ? task.user.name : 'Chưa gán'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {task.created_by_admin ? (
                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase">Admin</span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] uppercase">User</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={task.priority === 'Cao' ? 'text-red-600 font-bold' : 'text-gray-600'}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{task.deadline}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                task.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' : 
                                                task.status === 'Quá hạn' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm space-x-5">
                                            <button onClick={() => openEditModal(task)} className="text-blue-600 hover:text-blue-900 font-medium">
                                                <i className="fa fa-pencil" aria-hidden="true"></i></button>
                                            <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-900 font-medium">
                                                <i className="fa fa-trash" aria-hidden="true"></i></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500 italic">Không có công việc nào phù hợp.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border-t-4 border-green-500">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            🚀 Giao công việc mới
                        </h3>
                        <form onSubmit={handleAssignTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Tên công việc</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                    value={assignData.title}
                                    onChange={e => setAssignData('title', e.target.value)}
                                    placeholder="Nhập tên công việc..."
                                />
                                {assignErrors.title && <div className="text-red-500 text-xs mt-1">{assignErrors.title}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Người thực hiện</label>
                                <select 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                    value={assignData.user_id}
                                    onChange={e => setAssignData('user_id', e.target.value)}
                                    required
                                >
                                    <option value="">-- Chọn người thực hiện --</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Mô tả</label>
                                <textarea 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                    value={assignData.description}
                                    onChange={e => setAssignData('description', e.target.value)}
                                    placeholder="Nhập mô tả chi tiết..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Độ ưu tiên</label>
                                    <select 
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                        value={assignData.priority}
                                        onChange={e => setAssignData('priority', e.target.value)}
                                    >
                                        <option value="Thấp">Thấp</option>
                                        <option value="Trung bình">Trung bình</option>
                                        <option value="Cao">Cao</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Hạn chót</label>
                                    <input 
                                        type="date" 
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                        value={assignData.deadline}
                                        onChange={e => setAssignData('deadline', e.target.value)}
                                    />
                                    {assignErrors.deadline && <div className="text-red-500 text-xs mt-1">{assignErrors.deadline}</div>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition">Hủy</button>
                                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-md hover:bg-green-700 transition">Giao việc ngay</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-500">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Chỉnh sửa công việc</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên công việc</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                            </div>
                                {editErrors.title && <div className="text-red-500 text-xs mt-1">{editErrors.title}</div>}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Độ ưu tiên</label>
                                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={data.priority} onChange={e => setData('priority', e.target.value)}>
                                        <option value="Thấp">Thấp</option>
                                        <option value="Trung bình">Trung bình</option>
                                        <option value="Cao">Cao</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={data.status} onChange={e => setData('status', e.target.value)}>
                                        <option value="Chưa làm">Chưa làm</option>
                                        <option value="Đang làm">Đang làm</option>
                                        <option value="Hoàn thành">Hoàn thành</option>
                                        <option value="Quá hạn">Quá hạn</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Người thực hiện</label>
                                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={data.user_id} onChange={e => setData('user_id', e.target.value)}>
                                    <option value="">Chọn người thực hiện</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                                <input type="date" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.deadline} 
                                    onChange={e => setData('deadline', e.target.value)}
                                 />
                                {editErrors.deadline && <div className="text-red-500 text-xs mt-1">{editErrors.deadline}</div>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Hủy</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">Cập nhật</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}