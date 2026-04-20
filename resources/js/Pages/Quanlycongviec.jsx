import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Quanlycongviec({ auth, tasks, filters }) { 
    const [search, setSearch] = useState(filters?.search || '');
    const [priority, setPriority] = useState(filters?.priority || '');
    const [selectedIds, setSelectedIds] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const openModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleFilter = () => {
        router.get(route('Quanlycongviec'), 
            { search, priority }, 
            { preserveState: true, replace: true }
        );
    };

    const deleteTask = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
            router.delete(route('task.destroy', id));
        }
    };

    const updateStatus = (id, newStatus) => {
        router.patch(route('task.update-status', id), {
            status: newStatus
        }, { preserveScroll: true });
    };

    const handleCheckboxChange = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const deleteSelected = () => {
        if (confirm(`Trung có chắc muốn xóa ${selectedIds.length} công việc đã chọn?`)) {
            router.post(route('task.delete-multiple'), {
                ids: selectedIds
            }, {
                onSuccess: () => setSelectedIds([]),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Danh sách Công việc</h2>}
        >
            <Head title="Quản lý công việc" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 px-2"> 
                            <div className="flex flex-1 flex-col md:flex-row gap-4">
                                <div className="relative w-full md:w-80">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                        placeholder="Tìm kiếm công việc..." 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
                                    />
                                </div>

                                <select 
                                    value={priority}
                                    onChange={(e) => {
                                        setPriority(e.target.value);
                                        router.get(route('Quanlycongviec'), { search, priority: e.target.value });
                                    }}
                                    className="border border-gray-300 rounded-lg text-sm py-2 pl-3 pr-8 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Tất cả mức độ</option>
                                    <option value="Cao">Cao</option>
                                    <option value="Trung bình">Trung bình</option>
                                    <option value="Thấp">Thấp</option>
                                </select>
                                
                                <button 
                                    onClick={handleFilter}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                                >
                                    Lọc
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0"> 
                                <Link 
                                    href={route('task.create')} 
                                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                                >
                                    Thêm công việc mới
                                </Link>

                                {selectedIds.length > 0 && (
                                    <button
                                        onClick={deleteSelected}
                                        className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 shadow-sm transition-all flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                        Xóa ({selectedIds.length})
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {tasks && tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-4">
                                            {!task.created_by_admin ? (
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.includes(task.id)}
                                                    onChange={() => handleCheckboxChange(task.id)}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500" 
                                                />
                                            ) : (
                                                <div className="w-4 flex justify-center text-gray-400">
                                                    <i className="fa-solid fa-thumbtack text-[10px]" title="Được giao"></i>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {task.title}
                                                    {task.created_by_admin && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">ADMIN GIAO</span>}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Hạn chót: <span className="font-medium text-gray-700">
                                                        {task.deadline_formatted || task.deadline}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                                task.priority === 'Cao' ? 'bg-red-100 text-red-600' : 
                                                task.priority === 'Trung bình' ? 'bg-blue-100 text-blue-600' : 
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {task.priority}
                                            </span>
                                            {task.status === 'Quá hạn' ? (
                                                <span className="text-red-600 font-bold text-sm px-2">
                                                    Quá hạn
                                                </span>
                                            ) : (
                                                <select 
                                                    value={task.status || 'Chưa làm'} 
                                                    onChange={(e) => updateStatus(task.id, e.target.value)}
                                                    
                                                    className="text-sm border-gray-300 rounded-md py-1 focus:ring-indigo-500 bg-white"
                                                    >
                                                        <option value="Chưa làm">Chưa làm</option>
                                                        <option value="Đang làm">Đang làm</option>
                                                        <option value="Hoàn thành">Hoàn thành</option>
                                                </select>
                                            )}
                                            <div className="flex gap-4 items-center">
                                                <button 
                                                    onClick={() => openModal(task)}
                                                    className="text-gray-500 hover:text-indigo-600 transition"
                                                    title="Xem chi tiết"
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>

                                                {!task.created_by_admin && (
                                                    <Link 
                                                        href={route('task.edit', task.id)} 
                                                        className="text-blue-600 hover:underline text-sm"
                                                    >
                                                        <i className="fa fa-pencil" aria-hidden="true"></i>
                                                    </Link>
                                                )}

                                                {!task.created_by_admin && (
                                                    <button 
                                                        onClick={() => deleteTask(task.id)}
                                                        className="text-red-600 hover:underline text-sm font-medium"
                                                    >
                                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                                    </button>
                                                )}

                                                {task.created_by_admin && (
                                                    <i className="fa-solid fa-lock text-gray-300 text-sm" title="Không thể sửa/xóa"></i>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    Chưa có công việc nào được tạo.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">Thông tin chi tiết</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase">Tên công việc</label>
                                <p className="text-lg font-medium text-gray-900">{selectedTask.title}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase">Mô tả chi tiết</label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[120px] text-gray-600 text-sm whitespace-pre-line">
                                    {selectedTask.description || "Không có mô tả chi tiết cho công việc này."}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 text-right">
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}