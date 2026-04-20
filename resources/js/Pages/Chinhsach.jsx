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
    const sectionStyle = "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow antialiased";


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
                alert('Yêu cầu hỗ trợ của bạn đã được gửi thành công!');
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Chính sách hệ thống</h2>}
        >
            <Head title="Chính sách bảo mật" />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-semibold text-slate-900 mb-3">Chính Sách & Điều Khoản</h1>
                        <p className="text-slate-500 font-medium italic">Đảm bảo quyền lợi và tính minh bạch cho người dùng hệ thống</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className={sectionStyle}>
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 text-xl">
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Bảo mật thông tin</h3>
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                                Mọi dữ liệu công việc và thông tin cá nhân của bạn được mã hóa và bảo vệ bằng Middleware.
                                Chúng tôi cam kết không chia sẻ dữ liệu này cho bất kỳ bên thứ ba nào
                            </p>
                        </div>

                        <div className={sectionStyle}>
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 text-xl">
                                <i className="fa-solid fa-user-gear"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Quyền của người dùng</h3>
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                                Bạn có quyền Xem, Thêm, Sửa và Xóa hoàn toàn dữ liệu của mình.
                                Dữ liệu trong trang Thống kê và file PDF được trích xuất 100% từ dữ liệu cá nhân
                            </p>
                        </div>

                        <div className={sectionStyle}>
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4 text-xl">
                                <i className="fa-solid fa-file-pdf"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Chính sách xuất PDF</h3>
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                                Chức năng xuất PDF hỗ trợ người dùng lưu trữ báo cáo công việc ngoại tuyến.
                                Bạn có thể đặt tên file tùy chọn khi tải về máy tính cá nhân
                            </p>
                        </div>

                        <div className={sectionStyle}>
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4 text-xl">
                                <i className="fa-solid fa-handshake-angle"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Trách nhiệm sử dụng</h3>
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                                Người dùng cần có trách nhiệm bảo mật mật khẩu và tài khoản. 
                                Hệ thống sẽ tự động cập nhật thời gian thực dựa trên các thay đổi từ dữ liệu của bạn
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 bg-indigo-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-xl font-bold mb-2">Bạn có thắc mắc?</h4>
                            <p className="text-indigo-200 text-sm mb-4 italic">Chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình sử dụng hệ thống.</p>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="bg-white text-indigo-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-indigo-50 transition-colors"
                            >
                                Gửi yêu cầu hỗ trợ
                            </button>
                        </div>
                        <i className="fa-solid fa-quote-right absolute right-[-20px] bottom-[-20px] text-8xl text-white opacity-10"></i>
                    </div>

                    <p className="text-center mt-8 text-slate-400 text-xs italic">
                        © 2026 Hệ thống quản lý công việc - Phát triển bởi Trung Nhật
                    </p>
                </div>
            </div>


            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={submitSupport} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-headset text-indigo-600"></i>
                        Thông tin hỗ trợ
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Họ và tên" />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="Số điện thoại" />
                            <TextInput
                                id="phone"
                                type="tel"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Nhập số điện thoại liên lạc..."
                                required
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="content" value="Nội dung cần hỗ trợ" />
                            <textarea
                                id="content"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="4"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                required
                            ></textarea>
                            <InputError message={errors.content} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                            onClick={() => setShowModal(false)}
                        >
                            Hủy bỏ
                        </button>
                        <PrimaryButton className="ml-4" disabled={processing}>
                            {processing ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}