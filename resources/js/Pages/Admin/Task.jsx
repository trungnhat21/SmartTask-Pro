import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Tasks({ auth, tasks, users, filters }) {
    const [priority, setPriority] = useState(filters.priority || '');
    const [status, setStatus] = useState(filters.status || '');

    // Thêm state mới
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const { data: assignData, setData: setAssignData, post: assignPost, reset: resetAssign } = useForm({
        title: '',
        user_id: filters.user_id || '', // Mặc định là người đang được chọn
        priority: 'Trung bình',
        deadline: '',
        status: 'Chưa làm',
        created_by_admin: true // Đánh dấu đây là admin giao
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


    const handleFilter = () => {
        router.get(route('admin.tasks.index'), { 
            priority, 
            status, 
            user_id: filters.user_id
        }, { preserveState: true });
    };

    // 2. Hàm xóa tất cả (Sửa để chỉ xóa người đang được chọn)
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

    const { data, setData, patch, delete: destroy, reset } = useForm({
        id: '',
        title: '',
        status: '',
        deadline: '',
        user_id: '',
        priority: '', 
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openEditModal = (task) => {
        setData({
            id: task.id,
            title: task.title,
            status: task.status,
            deadline: task.deadline,
            user_id: task.user_id,
            priority: task.priority,
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

    return (
        <AdminLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Danh sách công việc</h2>}
        >
            <Head title="Quản lý công việc" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-4 mb-4 rounded-lg shadow flex items-center gap-4 text-sm">
                        <button 
                            onClick={() => router.get(route('admin.users.index'))} 
                            className="bg-gray-500 text-white px-4 py-1.5 rounded-md hover:bg-gray-600 flex items-center gap-1"
                        >
                            ← Quay lại
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
                        <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700">Lọc</button>
                        <button 
                            onClick={() => setIsAssignModalOpen(true)} 
                            className="ml-2 bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 font-medium"
                        >
                            + Giao việc
                        </button>
                        <button onClick={handleDeleteAll} className="ml-auto bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 font-medium">
                            Xóa tất cả danh sách
                        </button>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <table className="min-w-full divide-y divide-gray-200 border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Công việc</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Người thực hiện</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ưu tiên</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Deadline</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className="px-6 py-4 text-sm font-medium">{task.title}</td>
                                        <td className="px-6 py-4 text-sm">{task.user ? task.user.name : 'Chưa gán'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={task.priority === 'Cao' ? 'text-red-600 font-bold' : ''}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{task.deadline}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                task.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' : 
                                                task.status === 'Quá hạn' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm space-x-2">
                                            <button onClick={() => openEditModal(task)} className="text-blue-600 hover:underline">Sửa</button>
                                            <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:underline">Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Chỉnh sửa công việc</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Tên công việc</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Độ ưu tiên</label>
                                <select 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.priority}
                                    onChange={e => setData('priority', e.target.value)}
                                >
                                    <option value="Thấp">Thấp</option>
                                    <option value="Trung bình">Trung bình</option>
                                    <option value="Cao">Cao</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Người thực hiện</label>
                                <select 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.user_id}
                                    onChange={e => setData('user_id', e.target.value)}
                                >
                                    <option value="">Chọn người thực hiện</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.status || 'Chưa làm'}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="Chưa làm">Chưa làm</option>
                                    <option value="Đang làm">Đang làm</option>
                                    <option value="Hoàn thành">Hoàn thành</option>
                                    <option value="Quá hạn">Quá hạn</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                                <input 
                                    type="date" 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.deadline}
                                    onChange={e => setData('deadline', e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Hủy</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}