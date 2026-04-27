import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Quanlycongviec({ auth, tasks, filters, nearDeadlineCount }) { 
    // Tìm kiếm + độ ưu tiên
    const [search, setSearch] = useState(filters?.search || '');
    const [priority, setPriority] = useState(filters?.priority || '');

    // Checkbox
    const [selectedIds, setSelectedIds] = useState([]);

    // Upload file báo cáo
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});

    // Xem chi tiết công việc
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Gửi báo cáo
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);

    // phản hồi task từ user
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackList, setFeedbackList] = useState([]);
    const [newFeedback, setNewFeedback] = useState('');
    const [loadingFeedback, setLoadingFeedback] = useState(false);

    // Mở modal xem chi tiết công việc
    const openModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Lọc danh sách công việc
    const handleFilter = () => {
        router.get(route('Quanlycongviec'), 
            { search, priority }, 
            { preserveState: true, replace: true }
        );
    };

    // Xóa 1 công việc
    const deleteTask = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
            router.delete(route('task.destroy', id));
        }
    };

    // Cập nhật trạng thái công việc
    const updateStatus = (id, newStatus) => {
        const task = tasks.find(t => t.id === id);
        
        if (task.created_by_admin && newStatus === 'Hoàn thành') {
            setCurrentTaskId(id);
            setIsReportModalOpen(true);
        } else {
            router.patch(route('task.update-status', id), {
                status: newStatus
            }, { preserveScroll: true });
        }
    };

    // Gửi báo cáo
    const handleSendReport = (e) => {
        e.preventDefault();
        setErrors({});
        const formData = new FormData();
        formData.append('report_file', file);
        formData.append('status', 'Hoàn thành');
        formData.append('_method', 'PATCH'); 

        router.post(route('task.update-status', currentTaskId), formData, {
            forceFormData: true,
            onBefore: () => setUploading(true),
            onProgress: (event) => {
                if (event.percentage) {
                    setProgress(event.percentage);
                }
            },
            onSuccess: () => {
                setIsReportModalOpen(false);
                setFile(null);
                setErrors({});
            },
            onError: (errorsFromServer) => {
                setUploading(false);
                setErrors(errorsFromServer);
                console.log("Lỗi từ server:", errorsFromServer);
            },
            onFinish: () => {
                setUploading(false);
                setProgress(0);
            }
        });
    };

    // Chọn / bỏ chọn checkbox
    const handleCheckboxChange = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Xóa nhiều công việc đã chọn
    const deleteSelected = () => {
        if (confirm(`Bạn có chắc muốn xóa ${selectedIds.length} công việc đã chọn?`)) {
            router.post(route('task.delete-multiple'), {
                ids: selectedIds
            }, {
                onSuccess: () => setSelectedIds([]),
            });
        }
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

    const sendFeedback = () => {
        if (!newFeedback.trim()) return;
        router.post(route('task.store-feedback', selectedTask.id), {
            content: newFeedback,
            type: 'feedback'
        }, {
            onSuccess: () => {
                setNewFeedback('');
                openFeedback(selectedTask);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="font-bold text-2xl text-gray-800 tracking-tight">Trung tâm Công việc</h2>
                    </div>
                    {nearDeadlineCount > 0 && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-xl animate-pulse">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                            </span>
                            <span className="text-red-700 text-sm font-semibold uppercase tracking-wider">
                                {nearDeadlineCount} Task tới hạn!
                            </span>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Quản lý công việc" />

            <div className="py-8 bg-orange-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="bg-gray-300 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-200/50 p-5 mb-10">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                            
                            <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-slate-100/50 p-1.5 rounded-[1.5rem] border border-slate-200/40">
                                
                                <div className="relative flex-grow group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <i className="fa-solid fa-magnifying-glass text-xs"></i>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                        placeholder="Tìm kiếm công việc..." 
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-sm placeholder:text-slate-400 shadow-sm transition-all"
                                    />
                                </div>

                                <div className="relative min-w-[160px]">
                                    <select 
                                        value={priority}
                                        onChange={(e) => {
                                            setPriority(e.target.value);
                                            router.get(route('Quanlycongviec'), { search, priority: e.target.value });
                                        }}
                                        className="w-full bg-white border-none rounded-2xl text-sm py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-indigo-500/20 shadow-sm appearance-none cursor-pointer text-slate-600 font-medium"
                                    >
                                        <option value="">Tất cả mức độ</option>
                                        <option value="Cao">🔴 Ưu tiên Cao</option>
                                        <option value="Trung bình">🟡 Trung bình</option>
                                        <option value="Thấp">🟢 Ưu tiên Thấp</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                                        <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleFilter}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
                                >
                                    Lọc kết quả
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {selectedIds.length > 0 && (
                                    <button
                                        onClick={deleteSelected}
                                        className="group bg-white text-red-500 px-5 py-2.5 rounded-2xl hover:bg-red-50 shadow-sm transition-all flex items-center gap-2 text-sm font-semibold border border-red-100 animate-in fade-in zoom-in-95 duration-300"
                                    >
                                        <i className="fa-solid fa-trash-can text-xs group-hover:shake"></i>
                                        Xóa mục đã chọn ({selectedIds.length})
                                    </button>
                                )}

                                <Link 
                                    href={route('task.create')} 
                                    className="bg-slate-900 text-white px-7 py-3 rounded-2xl hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all flex items-center gap-2 text-sm font-bold active:scale-95 group"
                                >
                                    Tạo công việc
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {tasks && tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div 
                                    key={task.id} 
                                    className={`group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                                        task.status === 'Hoàn thành' 
                                        ? 'bg-gray-50 border-gray-100 grayscale-[0.5]'
                                        : 'bg-white border-gray-100 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50/50' 
                                    }`}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1">
                                            {!task.created_by_admin ? (
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.includes(task.id)}
                                                    onChange={() => handleCheckboxChange(task.id)}
                                                    className="w-5 h-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" 
                                                />
                                            ) : (
                                                <div className="w-5 flex justify-center text-indigo-300" title="Admin đã khóa">
                                                    <i className="fa-solid fa-shield-halved text-sm"></i>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className={`text-base font-semibold tracking-tight transition-all ${
                                                    task.status === 'Hoàn thành' ? 'text-gray-400 line-through italic' : 'text-gray-900'
                                                }`}>
                                                    {task.title}
                                                </h4>
                                                {task.created_by_admin && (
                                                    <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-md uppercase">
                                                        Admin Assign
                                                    </span>
                                                )}
                                                {task.is_near_deadline && task.status !== 'Hoàn thành' && (
                                                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-md font-black animate-pulse">
                                                        {task.days_left === 0 ? "DEADLINE HÔM NAY" : `CÒN ${task.days_left} NGÀY`}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                                <span className="flex items-center gap-1.5">
                                                    <i className="fa-regular fa-calendar-check"></i>
                                                    {task.deadline_formatted || task.deadline}
                                                </span>
                                                <span className={`flex items-center gap-1 ${
                                                    task.priority === 'Cao' ? 'text-red-500' : 
                                                    task.priority === 'Trung bình' ? 'text-indigo-500' : 'text-emerald-500'
                                                }`}>
                                                    <i className="fa-solid fa-bolt-lightning text-[10px]"></i>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-gray-100">
                                        
                                        <div className="flex flex-col items-end gap-2">
                                            {task.status === 'Chờ duyệt' ? (
                                                <span className="px-3 py-1.5 text-[11px] rounded-xl font-bold bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-bounce"></span> Đợi phê duyệt
                                                </span>
                                            ) : task.status === 'Từ chối' ? (
                                                <span className="px-3 py-1.5 text-[11px] rounded-xl font-bold bg-red-50 text-red-600 border border-red-100">Bị từ chối</span>
                                            ) : task.status === 'Hoàn thành' ? (
                                                <span className="px-3 py-1.5 text-[11px] rounded-xl font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 italic">Hoàn thành</span>
                                            ) : task.status === 'Quá hạn' ? (
                                                <span className="px-3 py-1.5 text-[11px] rounded-xl font-bold bg-red-600 text-white shadow-lg shadow-red-200">Trễ hạn</span>
                                            ) : (
                                                <select 
                                                    value={task.status || 'Chưa làm'} 
                                                    onChange={(e) => updateStatus(task.id, e.target.value)}
                                                    className="text-xs border-none bg-gray-100 hover:bg-white hover:ring-2 hover:ring-indigo-500 rounded-xl py-1.5 font-semibold transition-all cursor-pointer"
                                                >
                                                    {task.status === 'Chưa làm' && (
                                                        <>
                                                            <option value="Chưa làm" disabled>Chưa làm</option>
                                                            <option value="Đang làm">Tiến hành</option>
                                                        </>
                                                    )}
                                                    {task.status === 'Đang làm' && (
                                                        <>
                                                            <option value="Đang làm" disabled>Đang làm</option>
                                                            <option value="Hoàn thành">Hoàn thành</option>
                                                        </>
                                                    )}
                                                </select>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                            {task.status === 'Từ chối' && (
                                                <button 
                                                    onClick={() => { setCurrentTaskId(task.id); setIsReportModalOpen(true); }}
                                                    className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-md shadow-orange-100"
                                                    title="Nộp lại"
                                                >
                                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                                </button>
                                            )}

                                            {task.created_by_admin && (
                                                <button 
                                                    onClick={() => openFeedback(task)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all relative"
                                                    title="Phản hồi Admin"
                                                >
                                                    <i className="fa-solid fa-comments text-sm"></i>
                                                    {task.unread_count > 0 && (
                                                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            
                                                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-black items-center justify-center border-2 border-white shadow-sm">
                                                                {task.unread_count > 9 ? '9+' : task.unread_count}
                                                            </span>
                                                        </span>
                                                    )}
                                                </button>
                                            )}

                                            <button 
                                                onClick={() => openModal(task)}
                                                className="p-2 text-gray-500 hover:bg-white hover:text-indigo-600 rounded-lg transition-all"
                                                title="Xem"
                                            >
                                                <i className="fa-solid fa-eye text-sm"></i>
                                            </button>

                                            {!task.created_by_admin ? (
                                                <>
                                                    <Link 
                                                        href={route('task.edit', task.id)} 
                                                        className="p-2 text-gray-500 hover:bg-white hover:text-blue-600 rounded-lg transition-all"
                                                    >
                                                        <i className="fa-solid fa-pen-to-square text-sm"></i>
                                                    </Link>

                                                    <button 
                                                        onClick={() => deleteTask(task.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all"
                                                    >
                                                        <i className="fa-solid fa-trash text-sm"></i>
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="p-2 text-gray-300">
                                                    <i className="fa-solid fa-lock text-sm"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-4">
                                    <i className="fa-solid fa-folder-open text-3xl text-gray-300"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Mọi thứ đều sạch sẽ!</h3>
                                <p className="text-gray-500 mt-2">Hãy bắt đầu bằng cách tạo một công việc mới.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full overflow-hidden border border-white animate-in zoom-in duration-300">
                        <div className="p-8 border-b flex justify-between items-center bg-indigo-50/50">
                            <h3 className="text-2xl font-semibold text-gray-800 uppercase tracking-tight">Chi tiết công việc</h3>
                            <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-red-500 transition-all shadow-sm">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-indigo-400 uppercase tracking-[0.2em]">Tên công việc</label>
                                <p className="text-2xl font-semibold text-gray-900">{selectedTask.title}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-indigo-400 uppercase tracking-[0.2em]">Nội dung thực hiện</label>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 min-h-[200px] text-gray-600 text-lg font-semibold leading-relaxed whitespace-pre-line shadow-inner">
                                    {selectedTask.description || "Không có mô tả bổ sung."}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-semibold text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
                            >
                                Đã xem xong
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isReportModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-10 duration-500">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-indigo-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                                <i className="fa-solid fa-file-pdf"></i>
                            </div>
                            <h3 className="text-2xl  text-gray-900">Báo cáo tiến độ công việc</h3>
                            <p className="text-gray-500 text-sm mt-2 italic">Vui lòng tải lên tài liệu hoàn thành công việc</p>
                        </div>
                        
                        <form onSubmit={handleSendReport}>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    accept="application/pdf"
                                    onChange={(e) => {
                                        setFile(e.target.files[0])
                                        setErrors({});
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border-2 border-dashed border-gray-200 group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all p-10 rounded-[2rem] text-center">
                                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-300 group-hover:text-indigo-400 mb-2"></i>
                                    <p className="text-sm font-semibold text-gray-500 group-hover:text-indigo-600">
                                        {file ? file.name : "Chọn file hoặc kéo thả vào đây"}
                                    </p>
                                    <span className="text-[10px] text-red-500 mt-2 block font-semibold">ĐỊNH DẠNG: ONLY PDF</span>
                                </div>
                            </div>
                            
                            {errors.report_file && (
                                <div className="mt-2 text-center">
                                    <span className="text-red-500 text-xs font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100">
                                        <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                                        {errors.report_file}
                                    </span>
                                </div>
                            )}

                            <div className="mt-8 flex flex-col gap-3">
                                <button 
                                    type="submit" 
                                    disabled={uploading}
                                    className={`w-full py-4 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 ${
                                        uploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-gray-900'
                                    }`}
                                >
                                    {uploading ? (
                                        <>
                                            <i className="fa-solid fa-spinner animate-spin"></i>
                                            ĐANG TẢI {progress}%
                                        </>
                                    ) : 'XÁC NHẬN HOÀN THÀNH'}
                                </button>
                                
                                <button 
                                    type="button"
                                    disabled={uploading} 
                                    onClick={() => { setIsReportModalOpen(false); setFile(null); }} 
                                    className="w-full py-3 text-gray-400 font-semibold hover:text-red-500 transition-all"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isFeedbackModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b bg-gray-50">
                            <h3 className="text-xl font-semibold">Phản hồi công việc</h3>
                            <div className="text-sm text-gray-500 mt-1">
                                <p>Task: <span className="font-semibold text-gray-800">{selectedTask.title}</span></p>
                                <p>Hạn chót: <span className="text-red-500">{selectedTask.deadline_formatted}</span></p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                            {loadingFeedback ? (
                                <div className="text-center py-10">
                                    <i className="fa-solid fa-spinner animate-spin text-indigo-500 text-2xl"></i>
                                </div>
                            ) : feedbackList && feedbackList.length > 0 ? (
                                feedbackList.map((fb, idx) => (
                                    <div key={idx} className={`flex flex-col ${fb.user_id === auth.user.id ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                                            fb.type === 'reject' ? 'bg-red-100 text-red-700 border border-red-200' :
                                            fb.user_id === auth.user.id ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'
                                        }`}>
                                            <p className="font-semibold text-[10px] mb-1 opacity-70">
                                                {fb.user?.name} {fb.type === 'reject' && '• ĐÃ TỪ CHỐI'}
                                            </p>
                                            {fb.content}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 mt-10">Chưa có trao đổi nào</div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-white">
                            <textarea 
                                value={newFeedback}
                                onChange={(e) => setNewFeedback(e.target.value)}
                                placeholder="Viết nội dung phản hồi..."
                                className="w-full border-gray-200 rounded-xl text-sm focus:ring-indigo-500 mb-3"
                                rows="2"
                            />
                            <div className="flex gap-2">
                                <button onClick={() => setIsFeedbackModalOpen(false)} className="flex-1 py-2 text-gray-500 font-bold">Đóng</button>
                                <button 
                                    onClick={sendFeedback}
                                    className="flex-[2] py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
                                >
                                    Gửi phản hồi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}