import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Chinhsach({ auth }) {
    const [showModal, setShowModal] = useState(false);
    
    const sectionStyle = "bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 antialiased relative overflow-hidden group";

    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user.name || '',
        phone: '',
        content: '',
    });

    const submitSupport = (e) => {
        e.preventDefault();
        post(route('support.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col">
                    <h2 className="font-semibold text-3xl text-slate-800 tracking-tight">Chính sách hệ thống</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Cơ sở pháp lý và cam kết bảo mật dữ liệu</p>
                </div>
            }
        >
            <Head title="Chính sách bảo mật" />

            <div className="py-12 bg-slate-50/50 min-h-screen">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">

                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] bg-indigo-50 px-4 py-2 rounded-full">Legal Information</span>
                        <h1 className="text-5xl font-semibold text-slate-900 mt-6 mb-4 tracking-tighter">Điều Khoản Sử Dụng</h1>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            Chúng tôi ưu tiên tuyệt đối việc bảo mật dữ liệu cá nhân và sự minh bạch trong mọi hoạt động quản lý công việc của người dùng
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className={sectionStyle}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full opacity-50 transition-colors group-hover:bg-indigo-100"></div>
                            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-indigo-100 transition-transform group-hover:scale-110">
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Bảo mật thông tin</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                Mọi dữ liệu công việc và thông tin cá nhân của bạn được mã hóa và bảo vệ cấp cao. Chúng tôi cam kết không chia sẻ dữ liệu này cho bất kỳ bên thứ ba nào
                            </p>
                        </div>

                        <div className={sectionStyle}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full opacity-50 transition-colors group-hover:bg-emerald-100"></div>
                            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-emerald-100 transition-transform group-hover:scale-110">
                                <i className="fa-solid fa-user-gear"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Quyền của người dùng</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                Bạn có toàn quyền <span className="text-emerald-600 font-semibold italic">Xem, Thêm, Sửa và Xóa</span> dữ liệu của mình. Hệ thống đảm bảo tính toàn vẹn khi trích xuất báo cáo từ cơ sở dữ liệu cá nhân
                            </p>
                        </div>

                        <div className={sectionStyle}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full opacity-50 transition-colors group-hover:bg-rose-100"></div>
                            <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-rose-100 transition-transform group-hover:scale-110">
                                <i className="fa-solid fa-file-pdf"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Chính sách xuất PDF</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                Chức năng xuất PDF được tối ưu hóa cho lưu trữ ngoại tuyến. File trích xuất được định dạng chuyên nghiệp, hỗ trợ bạn trong việc báo cáo và lưu giữ hồ sơ công việc cá nhân
                            </p>
                        </div>

                        <div className={sectionStyle}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full opacity-50 transition-colors group-hover:bg-amber-100"></div>
                            <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-amber-100 transition-transform group-hover:scale-110">
                                <i className="fa-solid fa-handshake-angle"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Trách nhiệm sử dụng</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                Hãy chủ động bảo mật tài khoản cá nhân. Hệ thống tự động đồng bộ hóa thời gian thực, vì vậy mọi thay đổi sẽ ảnh hưởng ngay lập tức đến kết quả thống kê của bạn
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl shadow-slate-200">
                        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                            <div>
                                <h4 className="text-3xl font-semibold text-white mb-3">Bạn cần sự trợ giúp?</h4>
                                <p className="text-indigo-200/80 font-medium italic">Đội ngũ kỹ thuật luôn sẵn sàng giải đáp mọi thắc mắc của bạn 24/7.</p>
                            </div>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-indigo-50 transition-all shadow-xl active:scale-95 shrink-0"
                            >
                                <i className="fa-solid fa-paper-plane mr-2"></i>
                                Gửi yêu cầu ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="md">
                <form onSubmit={submitSupport} className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
                            <i className="fa-solid fa-headset"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Hỗ trợ kỹ thuật</h2>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Gửi thắc mắc của bạn</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Họ và tên" className="font-bold text-slate-700" />
                            <TextInput
                                id="name"
                                className="mt-2 block w-full bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="Số điện thoại" className="font-bold text-slate-700" />
                            <TextInput
                                id="phone"
                                type="tel"
                                className="mt-2 block w-full bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="09xx xxx xxx"
                                required
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="content" value="Nội dung cần hỗ trợ" className="font-bold text-slate-700" />
                            <textarea
                                id="content"
                                className="mt-2 block w-full border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm transition-all"
                                rows="4"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                required
                            ></textarea>
                            <InputError message={errors.content} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                            onClick={() => setShowModal(false)}
                        >
                            Hủy bỏ
                        </button>
                        <PrimaryButton 
                            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl shadow-lg shadow-indigo-100" 
                            disabled={processing}
                        >
                            {processing ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}