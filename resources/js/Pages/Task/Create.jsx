import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import TaskForm from './Partials/TaskForm'; // Đảm bảo đường dẫn này đúng

export default function Create({ auth }) {
    // PHẢI NẰM TRONG HÀM: Khai báo form
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        priority: 'Trung bình',
        deadline: '',
        description: '',
    });

    // PHẢI NẰM TRONG HÀM: Xử lý submit
    const submit = (e) => {
        e.preventDefault();
        post(route('task.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Thêm công việc mới</h2>}
        >
            <Head title="Thêm công việc" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        {/* Gọi component TaskForm và truyền đủ props */}
                        <TaskForm 
                            data={data} 
                            setData={setData} 
                            errors={errors} 
                            processing={processing} 
                            submit={submit} 
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}