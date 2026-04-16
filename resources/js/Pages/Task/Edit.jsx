import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import TaskForm from './Partials/TaskForm';

export default function Edit({ auth, task }) {
    // Khởi tạo form với dữ liệu cũ của công việc
    const { data, setData, patch, processing, errors } = useForm({
        title: task.title || '',
        priority: task.priority || 'Trung bình',
        deadline: task.deadline || '',
        description: task.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Dùng patch để cập nhật dữ liệu
        patch(route('task.update', task.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chỉnh sửa công việc</h2>}
        >
            <Head title="Chỉnh sửa công việc" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        {/* Sử dụng TaskForm chung, truyền isEdit=true */}
                        <TaskForm 
                            data={data} 
                            setData={setData} 
                            errors={errors} 
                            processing={processing} 
                            submit={submit} 
                            isEdit={true} 
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}