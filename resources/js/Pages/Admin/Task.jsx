import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Tasks({ auth, tasks, users, filters }) {
    const [priority, setPriority] = useState(filters.priority || '');
    const [status, setStatus] = useState(filters.status || '');

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewTask, setReviewTask] = useState(null);

    // Các state cho Feedback
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackList, setFeedbackList] = useState([]);
    const [newFeedback, setNewFeedback] = useState('');
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

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
            deadline: task.deadline 
                ? task.deadline.replace(' ', 'T').substring(0, 16) 
                : '',
            user_id: task.user_id,
            priority: task.priority,
            description: task.description || '',
        });
        setIsModalOpen(true);
    };

    const openReviewModal = (task) => {
        setReviewTask(task);
        setIsReviewModalOpen(true);
    };

    const handleApprove = (e) => {
    if (e) e.preventDefault();
    router.patch(route('admin.tasks.approve', reviewTask.id), {}, {
        onSuccess: () => setIsReviewModalOpen(false)
    });
};

const handleReject = (e) => {
    if (e) e.preventDefault();
    router.patch(route('admin.tasks.reject', reviewTask.id), {}, {
        onSuccess: () => setIsReviewModalOpen(false)
    });
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

    const formatDeadline = (deadlineString) => {
        if (!deadlineString) return 'Chưa có';

        const cleanDate = deadlineString.replace('T', ' ').substring(0, 16);
        const [date, time] = cleanDate.split(' ');
        const [y, m, d] = date.split('-');
        return `${d}/${m}/${y} ${time}`;
    };

    const openFeedback = async (task) => {
        setSelectedTask(task);
        setIsFeedbackModalOpen(true);
        setLoadingFeedback(true);
        try {
            const response = await axios.get(route('task.get-feedbacks', task.id));
            setFeedbackList(response.data);
        } catch (error) {
            console.error("Lỗi lấy phản hồi:", error);
        } finally {
            setLoadingFeedback(false);
        }
    };

    const handleAdminReply = () => {
        if (!newFeedback.trim()) return;
        router.post(route('task.store-feedback', selectedTask.id), {
            content: newFeedback,
            type: 'reply'
        }, {
            onSuccess: () => {
                setNewFeedback('');
                openFeedback(selectedTask);
            }
        });
    };

    // 2. Hàm từ chối nhanh
    const handleAdminReject = () => {
        if (!confirm("Bạn có chắc chắn muốn từ chối phản hồi này không?")) return;
        
        router.post(route('task.store-feedback', selectedTask.id), {
            content: "Phản hồi bị từ chối",
            type: 'reject'
        }, {
            onSuccess: () => {
                setNewFeedback('');
                openFeedback(selectedTask);
            }
        });
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
                                <option value="Chờ duyệt">Chờ duyệt</option>
                                <option value="Hoàn thành">Hoàn thành</option>
                                <option value="Quá hạn">Quá hạn</option>
                                <option value="Từ chối">Từ chối</option>
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
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDeadline(task.deadline)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                task.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' : 
                                                task.status === 'Chờ duyệt' ? 'bg-yellow-100 text-yellow-800' :
                                                task.status === 'Từ chối' ? 'bg-orange-100 text-orange-800' :
                                                task.status === 'Quá hạn' ? 'bg-red-100 text-red-800' : 'bg-blue-50 text-blue-800'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm space-x-5">
                                            <button onClick={() => openEditModal(task)} className="text-blue-600 hover:text-blue-900 font-medium">
                                                <i className="fa fa-pencil" aria-hidden="true"></i></button>
                                            <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-900 font-medium">
                                                <i className="fa fa-trash" aria-hidden="true"></i></button>

                                            {task.status === 'Chờ duyệt' && (
                                                <button 
                                                    onClick={() => openReviewModal(task)} 
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                    title="Duyệt báo cáo"
                                                >
                                                    <i className="fa-solid fa-file-signature text-lg"></i>
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => openFeedback(task)}
                                                className="text-indigo-600 hover:text-indigo-900 transition relative"
                                                title="Phản hồi & Trao đổi"
                                            >
                                                <i className="fa-solid fa-comments text-lg"></i>

                                                {task.unread_count > 0 && (
                                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 bg-red-500 text-white text-[10px] rounded-full items-center justify-center border border-white font-bold">
                                                        {task.unread_count}
                                                    </span>
                                                )}
                                            </button>
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

            {isReviewModalOpen && reviewTask && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800 text-lg">🔍 Xem báo cáo: {reviewTask.title}</h3>
                            <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <i className="fa fa-times text-2xl"></i>
                            </button>
                        </div>
                        
                        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
                            {reviewTask.report_file ? (
                                (() => {
                                    const fileExt = reviewTask.report_file.split('.').pop().toLowerCase();
                                    const fileUrl = reviewTask.report_url;

                                    if (fileExt === 'pdf') {
                                        return (
                                            <iframe 
                                                src={`${fileUrl}#toolbar=0`} 
                                                className="w-full h-full min-h-[600px] border-none"
                                            />
                                        );
                                    } 

                                    return (
                                        <div className="flex flex-col items-center justify-center h-full p-20 text-gray-500">
                                            <i className="fa-regular fa-file-zipper text-6xl mb-4"></i>
                                            <p>Định dạng này không hỗ trợ xem trực tiếp.</p>
                                            <a href={fileUrl} download className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow">Tải về máy</a>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Không có file đính kèm.
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t bg-white flex justify-between items-center">
                            <div className="text-sm">
                                <span className="text-gray-500">Tên file:</span> 
                                <span className="ml-2 font-medium text-blue-600">{reviewTask.report_file?.split('/').pop()}</span>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={(e) => handleReject(e)} className="px-6 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-bold hover:bg-red-100 transition">
                                    Từ chối báo cáo
                                </button>
                                <button onClick={(e) => handleApprove(e)} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg transition">
                                    Duyệt hoàn thành
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                        type="datetime-local"
                                        step="60"
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
                                {editErrors.title && <div className="text-red-500 text-xs mt-1">{editErrors.title}</div>}
                            </div>
                            
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
                                        <option value="Chờ duyệt">Chờ duyệt</option>
                                        <option value="Hoàn thành">Hoàn thành</option>
                                        <option value="Quá hạn">Quá hạn</option>
                                        <option value="Từ chối">Từ chối</option>
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
                                <input type="datetime-local" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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

            {isFeedbackModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">

                        <div className="px-6 py-5 border-b bg-white flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <i className="fa-solid fa-comments-dot text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Trao đổi công việc</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="inline-block w-2 h-2 rounded-full bg-indigo-400"></span>
                                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                                            TASK: {selectedTask.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsFeedbackModalOpen(false)} 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc] min-h-[350px] h-[350px] scrollbar-thin scrollbar-thumb-slate-200">
                            {loadingFeedback ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <i className="fa-solid fa-spinner animate-spin text-indigo-500 text-4xl"></i>
                                    <p className="text-slate-400 text-sm font-medium">Đang tải cuộc hội thoại...</p>
                                </div>
                            ) : feedbackList.length > 0 ? (
                                feedbackList.map((fb, idx) => (
                                    <div key={idx} className={`flex ${fb.user_id === auth.user.id ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`flex flex-col ${fb.user_id === auth.user.id ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                            <span className="text-[11px] font-bold text-slate-400 mb-1.5 px-2 flex items-center gap-1.5">
                                                {fb.user?.name} 
                                                {fb.type === 'reject' && <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded text-[9px]">● ĐÃ TỪ CHỐI</span>}
                                            </span>
                                            
                                            <div className={`relative p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all ${
                                                fb.type === 'reject' 
                                                    ? 'bg-gradient-to-br from-red-500 to-red-600 text-white ring-4 ring-red-100' 
                                                    : fb.user_id === auth.user.id 
                                                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' 
                                                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-200 shadow-slate-50'
                                            }`}>
                                                {fb.content}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-40">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <i className="fa-solid fa-message-slash text-2xl text-slate-400"></i>
                                    </div>
                                    <p className="text-slate-500 font-medium italic">Chưa có trao đổi nào được ghi lại</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)] flex-shrink-0">
                            <div className="relative group">
                                <textarea 
                                    value={newFeedback}
                                    onChange={(e) => setNewFeedback(e.target.value)}
                                    placeholder="Nhập nội dung phản hồi cho User..."
                                    className="w-full border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 mb-4 resize-none transition-all p-4 pr-12 h-[80px] bg-slate-50 focus:bg-white"
                                    rows="2"
                                />
                                <div className="absolute right-4 bottom-8 text-slate-300 group-focus-within:text-indigo-400 transition-colors">
                                    <i className="fa-solid fa-pen-nib"></i>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={handleAdminReject}
                                    className="flex-1 py-3 px-6 bg-white text-red-600 rounded-2xl font-semibold hover:bg-red-50 transition-all border-2 border-red-100 flex items-center justify-center gap-2 group active:scale-95"
                                >
                                    <i className="fa-solid fa-circle-xmark text-lg"></i>
                                    Từ chối báo cáo
                                </button>
                                <button 
                                    onClick={handleAdminReply}
                                    className="flex-[2] py-3 px-6 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <i className="fa-solid fa-paper-plane text-sm"></i>
                                    <span>Gửi phản hồi ngay</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}