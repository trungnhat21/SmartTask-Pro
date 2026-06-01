import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { useRef, useEffect } from 'react';

export default function Tasks({ auth, tasks, users, filters }) {
    const [priority, setPriority] = useState(filters.priority || '');
    const [status, setStatus] = useState(filters.status || '');
    const [taskRows, setTaskRows] = useState(tasks.data || []);

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewTask, setReviewTask] = useState(null);

    // Các state cho Feedback
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackList, setFeedbackList] = useState([]);
    const [newFeedback, setNewFeedback] = useState('');
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        setTaskRows(tasks.data || []);
    }, [tasks.data]);

    const fetchUnreadCounts = async () => {
        try {
            const response = await axios.get(route('admin.tasks.unread-feedback-counts'), {
                headers: { Accept: 'application/json' }
            });
            console.log('📩 Admin unread counts:', response.data); // Debug
            const counts = response.data;
            const countMap = {};
            counts.forEach(item => {
                countMap[item.id] = item.unread_count;
            });
            setTaskRows((prev) => prev.map((task) => {
                const newCount = countMap[task.id] || 0;
                if (newCount !== task.unread_count) {
                    console.log(`Task ${task.id}: ${task.unread_count} → ${newCount}`); // Debug
                }
                return { ...task, unread_count: newCount };
            }));
        } catch (error) {
            console.error('Lỗi lấy số tin nhắn chưa đọc:', error);
        }
    };

    const fetchLatestFeedback = async () => {
        try {
            const response = await axios.get(route('task.get-feedbacks', selectedTask.id));
            setFeedbackList(response.data);
        } catch (error) {
            console.error("Lỗi cập nhật tin nhắn:", error);
        }
    };

    useEffect(() => {
        fetchUnreadCounts(); 
        const interval = setInterval(fetchUnreadCounts, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isFeedbackModalOpen || !selectedTask) return;
        const interval = setInterval(fetchLatestFeedback, 1000);
        return () => clearInterval(interval);
    }, [isFeedbackModalOpen, selectedTask]);

    useEffect(() => {
        const handleStorageChange = async (event) => {
            if (event.key === 'feedback_notification') {
                console.log('Nhận được feedback từ user:', event.newValue);
                await fetchUnreadCounts();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

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

        const dateObj = new Date(deadlineString);
        
        if (isNaN(dateObj.getTime())) return 'Sai định dạng';

        const d = String(dateObj.getDate()).padStart(2, '0');
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const y = dateObj.getFullYear();
        const hr = String(dateObj.getHours()).padStart(2, '0');
        const min = String(dateObj.getMinutes()).padStart(2, '0');

        return `${d}/${m}/${y} ${hr}:${min}`;
    };

    const openFeedback = async (task) => {
        setSelectedTask(task);
        setIsFeedbackModalOpen(true);
        setLoadingFeedback(true);
        setTaskRows((prev) => prev.map((item) => item.id === task.id ? { ...item, unread_count: 0 } : item));
        try {
            const response = await axios.get(route('task.get-feedbacks', task.id));
            setFeedbackList(response.data);
            await fetchUnreadCounts();
        } catch (error) {
            console.error("Lỗi lấy phản hồi:", error);
        } finally {
            setLoadingFeedback(false);
        }
    };

    const handleAdminReply = async () => {
        if (!newFeedback.trim()) return;

        try {
            await axios.post(route('task.store-feedback', selectedTask.id), {
                content: newFeedback,
                type: 'reply'
            }, {
                headers: { Accept: 'application/json' }
            });
            setNewFeedback('');
            setTaskRows((prev) => prev.map((item) => item.id === selectedTask.id ? { ...item, unread_count: 0 } : item));
            fetchLatestFeedback();
            localStorage.setItem('admin_reply_notification', JSON.stringify({
                taskId: selectedTask.id,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Lỗi gửi phản hồi:', error);
        }
    };

    // 2. Hàm từ chối nhanh
    const handleAdminReject = async () => {
        if (!confirm("Bạn có chắc chắn muốn từ chối phản hồi này không?")) return;
        
        try {
            await axios.post(route('task.store-feedback', selectedTask.id), {
                content: "Phản hồi bị từ chối",
                type: 'reject'
            }, {
                headers: { Accept: 'application/json' }
            });
            setNewFeedback('');
            setTaskRows((prev) => prev.map((item) => item.id === selectedTask.id ? { ...item, unread_count: 0 } : item));
            openFeedback(selectedTask);
        } catch (error) {
            console.error('Lỗi từ chối phản hồi:', error);
        }
    };

    // Cuộn xuống cuối
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    // Tự động cuộn khi danh sách phản hồi thay đổi
    useEffect(() => {
        scrollToBottom();
    }, [feedbackList]);
    
    return (
        <AdminLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Quản lý công việc</h2>}
        >
            <Head title="Quản lý công việc" />

            <div className="py-12 bg-slate-200 border rounded-xl">
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
                        
                        {(auth.user.role === 'admin' || auth.user.role === 'manager') && (
                            <>
                                <button 
                                    onClick={() => setIsAssignModalOpen(true)} 
                                    className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 font-bold shadow-sm transition"
                                >
                                    Giao việc mới
                                </button>

                                {!filters?.task_id && (
                                    <button 
                                        onClick={handleDeleteAll} 
                                        className="ml-auto bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 font-medium transition"
                                    >
                                        Xóa danh sách này
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <table className="min-w-full divide-y divide-gray-200 border">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Công việc</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Người thực hiện</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nguồn gốc</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ưu tiên</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Hạn chót</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {taskRows.length > 0 ? taskRows.map((task) => (
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
                                        <td className="px-6 py-4 text-sm min-w-[140px] whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase inline-block ${
                                                task.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' : 
                                                task.status === 'Chờ duyệt' ? 'bg-yellow-100 text-yellow-700' :
                                                task.status === 'Từ chối' ? 'bg-orange-100 text-orange-700' :
                                                task.status === 'Quá hạn' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center justify-start gap-x-4">
                                                {(auth.user.role === 'admin' || auth.user.role === 'manager') && (
                                                    <>
                                                        <button onClick={() => openEditModal(task)} className="text-blue-600 hover:text-blue-900 transition" title="Chỉnh sửa">
                                                            <i className="fa fa-pencil text-base"></i>
                                                        </button>
                                                        
                                                        <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-900 transition" title="Xóa">
                                                            <i className="fa fa-trash text-base"></i>
                                                        </button>
                                                    </>
                                                )}
                                                <button 
                                                    onClick={() => openFeedback(task)}
                                                    className="text-indigo-600 hover:text-indigo-900 transition relative"
                                                    title="Phản hồi & Trao đổi"
                                                >
                                                    <i className="fa-solid fa-comments text-lg"></i>
                                                    {task.unread_count > 0 && (
                                                        <span className="absolute -top-2 -right-2 flex h-4 w-4 bg-red-500 text-white text-[9px] rounded-full items-center justify-center border border-white font-bold">
                                                            {task.unread_count}
                                                        </span>
                                                    )}
                                                </button>

                                                {task.status === 'Chờ duyệt' && (
                                                    <button 
                                                        onClick={() => openReviewModal(task)} 
                                                        className="text-yellow-600 hover:text-yellow-900 transition"
                                                        title="Duyệt báo cáo"
                                                    >
                                                        <i className="fa-solid fa-file-signature text-lg"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500 italic">Không có công việc nào phù hợp</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        {/*Phân trang*/}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex gap-1">
                                {tasks.links.map((link, index) => {
                                    const isDots = link.label === "...";

                                    return (
                                        <button
                                            key={index}
                                            disabled={!link.url || isDots}
                                            onClick={() => {
                                                if (!isDots && link.url) {
                                                    router.get(link.url, { 
                                                        priority, 
                                                        status, 
                                                        user_id: filters.user_id 
                                                    }, { preserveState: true });
                                                }
                                            }}
                                            className={`px-3 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                                                link.active 
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100' 
                                                    : isDots
                                                        ? 'bg-transparent text-slate-400 border-none cursor-default'
                                                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
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
                            <div className="text-sm text-slate-600 font-medium">
                                Hiển thị <span className="text-indigo-600">{tasks.from || 0}</span> - <span className="text-indigo-600">{tasks.to || 0}</span> trên tổng số <span className="text-indigo-600">{tasks.total}</span> công việc
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {filters?.task_id && (
                <div className="mb-6 mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between text-sm text-indigo-900 shadow-sm transition-all animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                            <i className="fa-solid fa-circle-info"></i>
                        </div>
                        <div>
                            <p className="font-semibold">Chế độ xem một công việc</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            router.get(route('admin.tasks.index'), {
                                user_id: filters.user_id
                            });
                        }}
                        className="px-4 py-2 bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-xs font-semibold border border-indigo-200 hover:border-indigo-600 transition-all shadow-sm flex items-center gap-2"
                    >
                        <i className="fa-solid fa-user"></i> Xem tất cả công việc của người này
                    </button>
                </div>
            )}

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
                                            <p>Định dạng này không hỗ trợ xem trực tiếp</p>
                                            <a href={fileUrl} download className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow">Tải về máy</a>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Không có file đính kèm
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
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsAssignModalOpen(false)}
                    ></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform transition-all">
                            
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </div>
                                        Giao công việc mới
                                    </h3>
                                    <button 
                                        onClick={() => setIsAssignModalOpen(false)}
                                        className="text-white/80 hover:text-white transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleAssignTask} className="p-7 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Tên công việc</label>
                                    <input 
                                        type="text" 
                                        className={`w-full px-4 py-2.5 rounded-2xl border ${assignErrors.title ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-600 placeholder:text-slate-400`}
                                        value={assignData.title}
                                        onChange={e => setAssignData('title', e.target.value)}
                                        placeholder="Nhập tên công việc"
                                    />
                                    {assignErrors.title && <div className="text-red-500 text-xs font-semibold mt-1.5 ml-1 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" /></svg>
                                        {assignErrors.title}
                                    </div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Người thực hiện</label>
                                    <select 
                                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-600 bg-white cursor-pointer"
                                        value={assignData.user_id}
                                        onChange={e => setAssignData('user_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Chọn thành viên phụ trách --</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Mô tả chi tiết</label>
                                    <textarea 
                                        rows="5"
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-600 placeholder:text-slate-400 resize-none"
                                        value={assignData.description}
                                        onChange={e => setAssignData('description', e.target.value)}
                                        placeholder="Có thể mô tả cụ thể công việc"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Độ ưu tiên</label>
                                        <div className="relative">
                                            <select 
                                                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 appearance-none transition-all outline-none text-slate-600 bg-white"
                                                value={assignData.priority}
                                                onChange={e => setAssignData('priority', e.target.value)}
                                            >
                                                <option value="Thấp">🟢 Thấp</option>
                                                <option value="Trung bình">🟡 Trung bình</option>
                                                <option value="Cao">🔴 Cao</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Hạn chót</label>
                                        <input 
                                            type="datetime-local"
                                            step="60"
                                            className={`w-full px-4 py-2.5 rounded-2xl border ${assignErrors.deadline ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-600`}
                                            value={assignData.deadline}
                                            onChange={e => setAssignData('deadline', e.target.value)}
                                        />
                                        {assignErrors.deadline && <div className="text-red-500 text-[10px] font-semibold mt-1.5 ml-1 leading-tight">{assignErrors.deadline}</div>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pt-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAssignModalOpen(false)} 
                                        className="flex-1 px-6 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        Đóng
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-[2] px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>Giao việc ngay</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform transition-all">
                            
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-10 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-semibold text-white flex items-center gap-4">
                                        <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
                                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        Chỉnh sửa công việc
                                    </h3>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full transition-all"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleUpdate} className="p-4 space-y-7">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Tên công việc</label>
                                    <input 
                                        type="text" 
                                        className={`w-full px-5 py-3.5 rounded-2xl border ${editErrors.title ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-600 font-medium`}
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                    {editErrors.title && <div className="text-red-500 text-xs font-semibold mt-2 ml-1 italic">{editErrors.title}</div>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Độ ưu tiên</label>
                                        <select 
                                            className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-600 bg-white cursor-pointer shadow-sm"
                                            value={data.priority} 
                                            onChange={e => setData('priority', e.target.value)}
                                        >
                                            <option value="Thấp">🟢 Thấp</option>
                                            <option value="Trung bình">🟡 Trung bình</option>
                                            <option value="Cao">🔴 Cao</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Trạng thái công việc</label>
                                        <select 
                                            className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-600 bg-white cursor-pointer shadow-sm"
                                            value={data.status} 
                                            onChange={e => setData('status', e.target.value)}
                                        >
                                            <option value="Chưa làm">⚪ Chưa làm</option>
                                            <option value="Đang làm">🔵 Đang làm</option>
                                            <option value="Chờ duyệt">🟠 Chờ duyệt</option>
                                            <option value="Hoàn thành">✅ Hoàn thành</option>
                                            <option value="Quá hạn">⚠️ Quá hạn</option>
                                            <option value="Từ chối">❌ Từ chối</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Người thực hiện</label>
                                        <select 
                                            className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-600 bg-white cursor-pointer shadow-sm"
                                            value={data.user_id} 
                                            onChange={e => setData('user_id', e.target.value)}
                                        >
                                            <option value="">Chọn người thực hiện</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Hạn chót</label>
                                        <input 
                                            type="datetime-local" 
                                            className={`w-full px-5 py-3.5 rounded-2xl border ${editErrors.deadline ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-600 shadow-sm`}
                                            value={data.deadline} 
                                            onChange={e => setData('deadline', e.target.value)}
                                        />
                                        {editErrors.deadline && <div className="text-red-500 text-xs font-semibold mt-2 ml-1 italic">{editErrors.deadline}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Nội dung công việc</label>
                                    <textarea 
                                        rows="4"
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-600 placeholder:text-slate-400 resize-none shadow-sm"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Nhập ghi chú chi tiết cho công việc này..."
                                    />
                                </div>

                                <div className="flex items-center gap-5 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="flex-1 px-8 py-4 text-sm font-semibold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-[2] px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <span>Lưu thay đổi</span>
                                    </button>
                                </div>
                            </form>
                        </div>
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

                        <div
                         ref={scrollRef}
                         className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc] min-h-[350px] h-[350px] scrollbar-thin scrollbar-thumb-slate-200">
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
                                    type="button"
                                    onClick={handleAdminReject}
                                    className="flex-1 py-3 px-6 bg-white text-red-600 rounded-2xl font-semibold hover:bg-red-50 transition-all border-2 border-red-100 flex items-center justify-center gap-2 group active:scale-95"
                                >
                                    <i className="fa-solid fa-circle-xmark text-lg"></i>
                                    Từ chối phản hồi
                                </button>
                                <button 
                                    type="button"
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