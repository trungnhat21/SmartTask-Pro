import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const cardWrapperStyle = "bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col">
                    <h2 className="font-semibold text-3xl text-slate-800 tracking-tight">Cài đặt tài khoản</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Quản lý thông tin cá nhân và thiết lập bảo mật</p>
                </div>
            }
        >
            <Head title="Hồ sơ cá nhân" />

            <div className="py-12 bg-slate-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-indigo-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
                                <div className="absolute top-[-10%] right-[-10%] size-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="relative z-10 text-center lg:text-left">
                                    <div className="size-20 bg-white/20 rounded-3xl flex items-center justify-center text-3xl mb-6 mx-auto lg:mx-0">
                                        <i className="fa-solid fa-user-astronaut"></i>
                                    </div>
                                    <h3 className="text-2xl font-black mb-2">{auth.user.name}</h3>
                                    <p className="text-indigo-200 text-sm font-medium opacity-80 mb-6">{auth.user.email}</p>
                                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest">
                                        <span className="size-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                        Tài khoản đang hoạt động
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60">
                                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-circle-info text-indigo-500"></i>
                                    Hướng dẫn nhanh
                                </h4>
                                <ul className="space-y-4">
                                    <li className="flex gap-3 text-xs text-slate-500 leading-relaxed font-medium">
                                        <span className="text-indigo-500 font-bold">01</span>
                                        Cập nhật email chính xác để nhận các thông báo từ hệ thống.
                                    </li>
                                    <li className="flex gap-3 text-xs text-slate-500 leading-relaxed font-medium">
                                        <span className="text-indigo-500 font-bold">02</span>
                                        Sử dụng mật khẩu mạnh (trên 8 ký tự) để bảo vệ công việc của bạn.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-8">
                            
                            <div className={cardWrapperStyle}>
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <i className="fa-solid fa-id-card text-8xl text-slate-900"></i>
                                </div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="size-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                        <i className="fa-solid fa-fingerprint"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 text-lg">Thông tin cơ bản</h3>
                                        <p className="text-xs text-slate-400 font-semibold italic">Thay đổi tên hiển thị và địa chỉ liên lạc</p>
                                    </div>
                                </div>
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="w-full"
                                />
                            </div>

                            <div className={cardWrapperStyle}>
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <i className="fa-solid fa-lock-open text-8xl text-slate-900"></i>
                                </div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="size-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                        <i className="fa-solid fa-key"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 text-lg">Bảo mật tài khoản</h3>
                                        <p className="text-xs text-slate-400 font-medium italic">Chúng tôi khuyên bạn nên đổi mật khẩu định kỳ</p>
                                    </div>
                                </div>
                                <UpdatePasswordForm className="w-full" />
                            </div>

                            <div className="bg-rose-50/50 p-8 rounded-[2rem] border border-rose-100 relative overflow-hidden group transition-all duration-300 hover:bg-rose-50">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="size-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-100 group-hover:animate-bounce">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-rose-800 text-lg">Vùng nguy hiểm</h3>
                                        <p className="text-xs text-rose-500/70 font-medium italic">Hành động này không thể hoàn tác, vui lòng cân nhắc</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-rose-200">
                                    <DeleteUserForm className="w-full" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}