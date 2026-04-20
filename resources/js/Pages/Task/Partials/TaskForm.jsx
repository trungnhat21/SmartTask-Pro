import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link } from '@inertiajs/react';

export default function TaskForm({ data, setData, errors, processing, submit, isEdit = false }) {
    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="title" value="Tên công việc" />
                <TextInput
                    id="title"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Ví dụ: Thiết kế giao diện Admin..."
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel htmlFor="priority" value="Độ ưu tiên" />
                    <select
                        id="priority"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}
                    >
                        <option value="Thấp">Thấp</option>
                        <option value="Trung bình">Trung bình</option>
                        <option value="Cao">Cao</option>
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="deadline" value="Hạn chót" />
                    <TextInput
                        id="deadline"
                        type="datetime-local"
                        className="mt-1 block w-full"
                        value={data.deadline}
                        onChange={(e) => setData('deadline', e.target.value)}
                    />
                    <InputError message={errors.deadline} className="mt-2" />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="description" value="Ghi chú thêm" />
                <textarea
                    id="description"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    rows="4"
                    value={data.description || ''}
                    onChange={(e) => setData('description', e.target.value)}
                ></textarea>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                <Link href={route('Quanlycongviec')} className="text-sm text-gray-600 underline">Quay lại</Link>
                <PrimaryButton disabled={processing}>
                    {isEdit ? 'Cập nhật công việc' : 'Lưu công việc'}
                </PrimaryButton>
            </div>
        </form>
    );
}