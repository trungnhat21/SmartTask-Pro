import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Đăng ký" />

            <div className="max-w-md mx-auto py-8">
                <header className="mb-10 text-center">
                    <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                        Tạo tài khoản
                    </h2>
                    <p className="mt-3 text-sm text-slate-500 font-medium">
                        Điền thông tin bên dưới để bắt đầu trải nghiệm.
                    </p>
                </header>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-1">
                        <InputLabel htmlFor="name" value="Tên tài khoản" className="font-semibold text-slate-700 ml-1" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="block w-full bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900 rounded-xl py-3 px-4 shadow-sm transition-all"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nhập họ tên"
                        />
                        <InputError message={errors.name} className="mt-1.5 text-xs font-medium" />
                    </div>

                    <div className="space-y-1">
                        <InputLabel htmlFor="email" value="Email" className="font-semibold text-slate-700 ml-1" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900 rounded-xl py-3 px-4 shadow-sm transition-all"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="example@gmail.com"
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
                            className="block w-full bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900 rounded-xl py-3 px-4 shadow-sm transition-all"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Tối thiểu 8 ký tự"
                        />
                        <InputError message={errors.password} className="mt-1.5 text-xs font-medium" />
                    </div>

                    <div className="space-y-1">
                        <InputLabel htmlFor="password_confirmation" value="Xác nhận mật khẩu" className="font-semibold text-slate-700 ml-1" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900 rounded-xl py-3 px-4 shadow-sm transition-all"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                        />
                        <InputError message={errors.password_confirmation} className="mt-1.5 text-xs font-medium" />
                    </div>

                    <div className="pt-4 flex flex-col space-y-4">
                        <button 
                            disabled={processing}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
                        </button>
                        
                        <div className="text-center">
                            <Link
                                href={route('login')}
                                className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                Bạn đã có tài khoản? Đăng nhập
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}