import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Quanlycongviec({ auth, tasks, filters }) { 
    const [search, setSearch] = useState(filters?.search || '');
    const [priority, setPriority] = useState(filters?.priority || '');
    const [selectedIds, setSelectedIds] = useState([]);

    // Hàm xử lý gửi yêu cầu tìm kiếm
    const handleFilter = () => {
        router.get(route('Quanlycongviec'), 
            { search, priority }, 
            { preserveState: true, replace: true }
        );
    };
    //Xóa từng công việc
    const deleteTask = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
            router.delete(route('task.destroy', id));
        }
    };
    //Xóa công việc đã được chọn
    const handleCheckboxChange = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // 3. Hàm xóa các mục đã chọn
    const deleteSelected = () => {
        if (confirm(`Trung có chắc muốn xóa ${selectedIds.length} công việc đã chọn?`)) {
            router.post(route('task.delete-multiple'), {
                ids: selectedIds
            }, {
                onSuccess: () => setSelectedIds([]), // Xóa xong thì làm trống giỏ hàng
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
                                {/* Tìm kiếm theo tên */}
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

                                {/* Lọc theo độ ưu tiên */}
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

                        {/* Danh sách hiển thị dữ liệu từ Database */}
                        <div className="space-y-3">
                            {tasks && tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(task.id)}
                                                onChange={() => handleCheckboxChange(task.id)}
                                                className="rounded text-indigo-600 focus:ring-indigo-500" 
                                            />
                                            <div>
                                                <p className="font-bold text-gray-800">{task.title}</p>
                                                <p className="text-sm text-gray-500">Hạn chót: {task.deadline}</p>
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
                                            <span className="text-sm text-gray-600 font-semibold">{task.status || 'Chờ'}</span>
                                            <div className="flex gap-4">
                                                <Link 
                                                    href={route('task.edit', task.id)} 
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                                </Link>
                                                <button 
                                                    onClick={() => deleteTask(task.id)}
                                                    className="text-red-600 hover:underline text-sm font-medium"
                                                >
                                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                                </button>
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
        </AuthenticatedLayout>
    );
}