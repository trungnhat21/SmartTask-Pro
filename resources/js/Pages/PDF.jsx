import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function PDF({ auth, tasks }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Xuất Báo Cáo PDF</h2>}
        >
            <Head title="Xuất PDF" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-8 shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-semibold">Bản xem trước danh sách</h3>
                                <p className="text-sm text-gray-500">Tổng cộng: {tasks.length} công việc</p>
                            </div>
                            
                            <a 
                                href={route('pdf.export')} 
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                            >
                                <i className="fa-solid fa-file-pdf"></i>
                                Tải File PDF Ngay
                            </a>
                        </div>

                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Tên công việc</th>
                                        <th className="px-6 py-3">Ưu tiên</th>
                                        <th className="px-6 py-3">Hạn chót</th>
                                        <th className="px-6 py-3">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr key={task.id} className="bg-white border-b">
                                            <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                                            <td className="px-6 py-4">{task.priority}</td>
                                            <td className="px-6 py-4">
                                                {new Date(task.deadline).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4">{task.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}