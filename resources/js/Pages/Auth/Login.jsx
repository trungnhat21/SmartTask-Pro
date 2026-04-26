import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Đăng nhập" />

            <div className="max-w-md mx-auto py-8">
                <header className="mb-10 text-center">
                    <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                        Đăng nhập ngay
                    </h2>
                    <p className="mt-3 text-sm text-slate-500 font-semibold">
                        Chào mừng bạn quay trở lại.
                    </p>
                </header>

                {status && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-sm font-bold text-emerald-600 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-1">
                        <InputLabel htmlFor="email" value="Email" className="font-semibold text-slate-700 ml-1" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900 rounded-xl py-3 px-4 shadow-sm transition-all outline-none"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email của bạn"
                        />
                        <InputError message={errors.email} className="mt-1.5 text-xs font-medium" />
                    </div>

                    <div className="space-y-1">
                        <InputLabel htmlFor="password" value="Mật khẩu" className="font-semibold text-slate-700 ml-1" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900 rounded-xl py-3 px-4 shadow-sm transition-all outline-none"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                        <InputError message={errors.password} className="mt-1.5 text-xs font-medium" />
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center cursor-pointer group">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-slate-300 text-slate-900 shadow-sm focus:ring-slate-900"
                            />
                            <span className="ms-2 text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                                Ghi nhớ
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors underline decoration-slate-200 underline-offset-4"
                            >
                                Quên mật khẩu?
                            </Link>
                        )}
                    </div>

                    <div className="pt-2 flex flex-col space-y-4">
                        <button
                            disabled={processing}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-md"
                        >
                            {processing ? 'Đang xác thực...' : 'Đăng nhập'}
                        </button>
                        
                        <div className="text-center pt-2">
                            <span className="text-sm text-slate-500 font-medium">Chưa có tài khoản? </span>
                            <Link
                                href={route('register')}
                                className="text-sm font-bold text-slate-900 hover:underline transition-all"
                            >
                                Đăng ký ngay
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}