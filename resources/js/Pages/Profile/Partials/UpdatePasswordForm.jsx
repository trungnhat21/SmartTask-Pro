import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`antialiased ${className}`}>
            <header className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                    Đổi mật khẩu
                </h2>
                <p className="mt-1 text-sm text-slate-500 font-medium">
                    Hãy đảm bảo tài khoản của bạn sử dụng mật khẩu dài và ngẫu nhiên để bảo mật tối đa.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <form onSubmit={updatePassword} className="space-y-6">
                    <div className="group">
                        <InputLabel 
                            htmlFor="current_password" 
                            value="Mật khẩu hiện tại" 
                            className="font-bold text-slate-700 ml-1 group-focus-within:text-amber-600 transition-colors"
                        />
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full bg-slate-50 border-slate-200 focus:bg-white rounded-xl py-3 transition-all"
                            autoComplete="current-password"
                            placeholder="••••••••"
                        />
                        <InputError message={errors.current_password} className="mt-2 text-xs font-bold" />
                    </div>

                    <div className="group">
                        <InputLabel 
                            htmlFor="password" 
                            value="Mật khẩu mới" 
                            className="font-bold text-slate-700 ml-1 group-focus-within:text-amber-600 transition-colors"
                        />
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full bg-slate-50 border-slate-200 focus:bg-white rounded-xl py-3 transition-all"
                            autoComplete="new-password"
                            placeholder="Tối thiểu 8 ký tự"
                        />
                        <InputError message={errors.password} className="mt-2 text-xs font-bold" />
                    </div>

                    <div className="group">
                        <InputLabel 
                            htmlFor="password_confirmation" 
                            value="Xác nhận mật khẩu mới" 
                            className="font-bold text-slate-700 ml-1 group-focus-within:text-amber-600 transition-colors"
                        />
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className="mt-1 block w-full bg-slate-50 border-slate-200 focus:bg-white rounded-xl py-3 transition-all"
                            autoComplete="new-password"
                            placeholder="Nhập lại mật khẩu mới"
                        />
                        <InputError message={errors.password_confirmation} className="mt-2 text-xs font-bold" />
                    </div>

                    <div className="flex items-center gap-5">
                        <button
                            disabled={processing}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-100 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Đang lưu...' : 'Lưu mật khẩu'}
                        </button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition duration-500 ease-out"
                            enterFrom="opacity-0 translate-x-4"
                            leave="transition duration-300 ease-in"
                            leaveTo="opacity-0 -translate-x-4"
                        >
                            <p className="text-sm font-bold text-emerald-600 flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg">
                                <i className="fa-solid fa-circle-check"></i>
                                Đã cập nhật
                            </p>
                        </Transition>
                    </div>
                </form>

                <div className="hidden md:flex justify-end items-center pr-10">
                    <div className="relative group cursor-default">

                        <div className="absolute inset-0 bg-amber-100 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                        
                        <div className="relative flex items-center justify-center">
                            <i className="fa fa-lock text-[180px] text-amber-500 opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:rotate-6"></i>
                            
                            <div className="absolute">
                                <i className="fa fa-check-circle text-[60px] text-amber-600 transition-transform duration-500 group-hover:scale-110"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}