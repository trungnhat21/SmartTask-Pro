import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`antialiased ${className}`}>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="max-w-xl">
                    <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                        Hủy kích hoạt tài khoản
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
                        Một khi bạn xóa tài khoản, toàn bộ dữ liệu, báo cáo công việc và lịch sử thống kê sẽ bị xóa <span className="text-rose-600 font-semibold italic underline">vĩnh viễn</span>. Vui lòng tải xuống các bản sao lưu PDF nếu cần thiết trước khi thực hiện hành động này.
                    </p>
                </div>
                
                <button 
                    onClick={confirmUserDeletion}
                    className="shrink-0 px-6 py-3 bg-white border-2 border-rose-200 text-rose-600 font-semibold text-xs uppercase tracking-[0.1em] rounded-2xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-300 shadow-sm active:scale-95"
                >
                    Bắt đầu xóa tài khoản
                </button>
            </header>

            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="md">
                <form onSubmit={deleteUser} className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="size-14 bg-rose-100 text-rose-600 rounded-[1.25rem] flex items-center justify-center text-2xl animate-pulse">
                            <i className="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
                                Xác nhận xóa vĩnh viễn?
                            </h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Hành động nguy hiểm</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        Để đảm bảo tính bảo mật, vui lòng nhập mật khẩu xác nhận của bạn. Hệ thống sẽ ngay lập tức ngắt kết nối và xóa dữ liệu sau khi bạn xác nhận.
                    </p>

                    <div className="space-y-2">
                        <InputLabel
                            htmlFor="password"
                            value="Mật khẩu của bạn"
                            className="font-bold text-slate-700 ml-1"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full bg-slate-50 border-slate-200 focus:bg-white rounded-xl py-3"
                            isFocused
                            placeholder="••••••••"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-10 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                            onClick={closeModal}
                        >
                            Tôi muốn quay lại
                        </button>

                        <button
                            disabled={processing}
                            className={`px-8 py-3 bg-rose-600 text-white font-black text-sm rounded-xl shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <i className="fa-solid fa-spinner animate-spin"></i>
                                    Đang xử lý...
                                </span>
                            ) : 'Xác nhận xóa'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}