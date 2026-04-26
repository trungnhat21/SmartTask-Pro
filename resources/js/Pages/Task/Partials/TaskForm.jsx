import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link } from '@inertiajs/react';

export default function TaskForm({ data, setData, errors, processing, submit, isEdit = false }) {
    return (
        <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-8" noValidate>
            {/* Header Form */}
            <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <i className={`fa-solid ${isEdit ? 'fa-pen-to-square' : 'fa-plus-circle'} text-indigo-600`}></i>
                    {isEdit ? 'Cập nhật công việc' : 'Tạo công việc mới'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Thông tin công việc được đồng bộ trên hệ thống quản lý.</p>
            </div>

            <div>
                <InputLabel htmlFor="title" className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
                    <i className="fa-solid fa-list-check text-gray-400"></i>
                    Tên công việc
                </InputLabel>
                <TextInput
                    id="title"
                    className="mt-1 block w-full px-4 py-3 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Nhập tên công việc..."
                />
                <InputError message={errors.title} className="mt-2 font-medium" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <InputLabel htmlFor="priority" className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
                        <i className="fa-solid fa-flag text-gray-400"></i>
                        Mức độ ưu tiên
                    </InputLabel>
                    <select
                        id="priority"
                        className="mt-1 block w-full border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg py-3 px-4 shadow-sm transition-all cursor-pointer"
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}
                    >
                        <option value="Thấp">🟢 Thấp</option>
                        <option value="Trung bình">🟡 Trung bình</option>
                        <option value="Cao">🔴 Cao</option>
                    </select>
                    <InputError message={errors.priority} className="mt-2 font-medium" />
                </div>

                <div>
                    <InputLabel htmlFor="deadline" className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
                        <i className="fa-solid fa-calendar-clock text-gray-400"></i>
                        Hạn chót
                    </InputLabel>
                    <TextInput
                        id="deadline"
                        type="datetime-local"
                        className="mt-1 block w-full px-4 py-3 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all"
                        value={data.deadline}
                        onChange={(e) => setData('deadline', e.target.value)}
                    />
                    <InputError message={errors.deadline} className="mt-2 font-medium" />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="description" className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
                    <i className="fa-solid fa-comment-dots text-gray-400"></i>
                    Chi tiết công việc
                </InputLabel>
                <textarea
                    id="description"
                    className="mt-1 block w-full border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm px-4 py-3 min-h-[120px] transition-all"
                    placeholder="Mô tả chi tiết các bước cần thực hiện..."
                    value={data.description || ''}
                    onChange={(e) => setData('description', e.target.value)}
                ></textarea>
                <InputError message={errors.description} className="mt-2 font-medium" />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <Link 
                    href={route('Quanlycongviec')} 
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Quay lại
                </Link>

                <PrimaryButton 
                    disabled={processing}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-widest shadow-md"
                >
                    {processing ? (
                        <i className="fa-solid fa-circle-notch animate-spin"></i>
                    ) : (
                        <i className={`fa-solid ${isEdit ? 'fa-save' : 'fa-paper-plane'}`}></i>
                    )}
                    {isEdit ? 'Cập nhật công việc' : 'Lưu công việc'}
                </PrimaryButton>
            </div>
        </form>
    );
}