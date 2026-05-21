import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ProjectForm({ auth, allUsers, project }) {
    const isEditMode = !!project;
    const today = new Date().toISOString().split('T')[0];

    const [memberCount, setMemberCount] = useState(project?.tasks?.length || 1);

    const { data, setData, post, put, processing, errors } = useForm({
        name: project?.name || '',
        description: project?.description || '',
        priority: project?.priority || 'Trung bình',
        deadline: project?.deadline || '',
        tasks: project?.tasks || [{ user_id: '', task_name: '', deadline: '' }]
    });

    useEffect(() => {
        if (data.tasks && data.tasks.length !== memberCount) {
            setMemberCount(data.tasks.length);
        }
    }, [data.tasks]);

    const handleCountChange = (e) => {
        const count = Math.max(1, parseInt(e.target.value) || 1);
        setMemberCount(count);

        let currentTasks = [...(data.tasks || [])];
        if (count > currentTasks.length) {
            const needToAdd = count - currentTasks.length;
            for (let i = 0; i < needToAdd; i++) {
                currentTasks.push({ user_id: '', task_name: '', deadline: '' });
            }
        } else if (count < currentTasks.length) {
            currentTasks = currentTasks.slice(0, count);
        }
        setData('tasks', currentTasks);
    };

    const handleTaskFieldChange = (index, field, value) => {
        const currentTasks = data.tasks || [{ user_id: '', task_name: '', deadline: '' }];
        const updatedTasks = currentTasks.map((task, i) => {
            if (i === index) {
                return { ...task, [field]: value };
            }
            return task;
        });
        setData('tasks', updatedTasks);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('admin.projects.update', project.id));
        } else {
            post(route('admin.projects.store'));
        }
    };

    const getAvailableUsers = (currentIndex) => {
    const selectedUserIds = data.tasks
        .map((task, index) => (index !== currentIndex ? String(task.user_id || '') : null))
        .filter(id => id !== '' && id !== null);

    return allUsers.filter(user => {
        const userIdString = String(user.id);
        const currentTaskIdString = String(data.tasks[currentIndex].user_id || '');
        
        const isSelectedByOther = selectedUserIds.includes(userIdString);
        const isCurrentSelection = userIdString === currentTaskIdString;
        
        return !isSelectedByOther || isCurrentSelection;
    });
};

    return (
        <AdminLayout
            header={
                <h2 className="font-semibold text-2xl text-slate-800 leading-tight">
                    {isEditMode ? 'Cập nhật dự án' : 'Tạo dự án mới'}
                </h2>
            }
        >
            <Head title={isEditMode ? 'Sửa dự án' : 'Thêm dự án'} />

            <div className="py-12 bg-slate-100 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <Link href={route('admin.projects.index')} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                                <i className="fa-solid fa-arrow-left text-xs"></i> Quay lại danh sách
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tên dự án <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    placeholder="Nhập tên dự án hoặc chiến dịch..."
                                    className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.name ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm focus:ring-indigo-500 outline-none`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mức độ ưu tiên</label>
                                    <select value={data.priority} onChange={e => setData('priority', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-indigo-500 outline-none">
                                        <option value="Thấp">Thấp</option>
                                        <option value="Trung bình">Trung bình</option>
                                        <option value="Cao">Cao</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Hạn chót tổng dự án <span className="text-red-500">*</span></label>
                                    <input 
                                        type="date" min={today} value={data.deadline} onChange={e => setData('deadline', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.deadline ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm focus:ring-indigo-500 outline-none`}
                                    />
                                    {errors.deadline && <p className="text-red-500 text-xs mt-1 font-medium">{errors.deadline}</p>}
                                </div>
                            </div>

                            <div className="sm:w-1/3">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Số lượng thành viên tham gia <span className="text-red-500">*</span></label>
                                <input type="number" min="1" value={memberCount} onChange={handleCountChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-indigo-500 outline-none font-semibold text-indigo-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Phân công chi tiết công việc</label>
                                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50/50 p-4 space-y-3">
                                    {data.tasks.map((task, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-white border border-slate-100 rounded-xl items-center">
                                            <div className="md:col-span-1 text-center font-bold text-slate-400 text-sm">#{index + 1}</div>
                                            <div className="md:col-span-3">
                                                <select 
                                                    value={task.user_id} 
                                                    onChange={e => handleTaskFieldChange(index, 'user_id', e.target.value)} 
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none"
                                                >
                                                    <option value="">-- Chọn người làm --</option>
                                                    {getAvailableUsers(index).map(user => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors[`tasks.${index}.user_id`] && <p className="text-red-500 text-[11px] mt-0.5">{errors[`tasks.${index}.user_id`]}</p>}
                                            </div>
                                            <div className="md:col-span-5">
                                                <input type="text" value={task.task_name} onChange={e => handleTaskFieldChange(index, 'task_name', e.target.value)} placeholder="Tên công việc..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" />
                                                {errors[`tasks.${index}.task_name`] && <p className="text-red-500 text-[11px] mt-0.5">{errors[`tasks.${index}.task_name`]}</p>}
                                            </div>
                                            <div className="md:col-span-3">
                                                <input type="date" min={today} value={task.deadline} onChange={e => handleTaskFieldChange(index, 'deadline', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" />
                                                {errors[`tasks.${index}.deadline`] && <p className="text-red-500 text-[11px] mt-0.5">{errors[`tasks.${index}.deadline`]}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.tasks && <p className="text-red-500 text-xs mt-1 font-medium">{errors.tasks}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả nội dung</label>
                                <textarea rows="4" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-indigo-500 outline-none resize-none"></textarea>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                <Link href={route('admin.projects.index')} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm">Hủy bỏ</Link>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-100">
                                    {isEditMode ? 'Cập nhật thông tin' : 'Kích hoạt dự án'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}