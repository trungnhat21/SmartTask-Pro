import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function UserForm({ auth, user = null, isEdit = false }) {
    const { data, setData, post, patch, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '', 
        role: user?.role || 'user',
        status: user?.status || 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            patch(route('admin.users.update', user.id), {
                onSuccess: () => {
                },
            });
        } else {
            post(route('admin.users.store'));
        }
    };

    return (
        <AdminLayout
            auth={auth}
            header={
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold text-2xl text-gray-800 tracking-tight">
                        {isEdit ? 'Chỉnh sửa thông tin' : 'Thêm thành viên mới'}
                    </h2>
                </div>
            }
        >
            <Head title={isEdit ? 'Sửa người dùng' : 'Thêm người dùng'} />

            <div className="py-10 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} noValidate className="space-y-6">
                        <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="font-semibold text-gray-700">Thông tin cơ bản</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 ml-1">Họ và tên</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên đầy đủ..."
                                        className={`w-full border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all ${errors.name ? 'border-red-300 bg-red-50' : ''}`}
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.name}
                                    </p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 ml-1">Địa chỉ Email</label>
                                    <input
                                        type="email"
                                        autoComplete="off"
                                        placeholder="example@gmail.com"
                                        className={`w-full border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all ${errors.email ? 'border-red-300 bg-red-50' : ''}`}
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">{errors.email}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 ml-1">
                                        Mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className={`w-full border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all ${errors.password ? 'border-red-300 bg-red-50' : ''}`}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">{errors.password}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="font-semibold text-gray-700">Quyền hạn & Hệ thống</h3>
                            </div>
                            <div className="p-6 space-y-8">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 ml-1">Cấp độ truy cập</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {['user', 'manager', 'admin', 'approve'].map((roleType) => (
                                            <label 
                                                key={roleType}
                                                className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all focus:outline-none ${
                                                    data.role === roleType 
                                                    ? 'border-indigo-600 bg-indigo-50/50' 
                                                    : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name="role" 
                                                    value={roleType}
                                                    className="sr-only" 
                                                    onChange={(e) => setData('role', e.target.value)}
                                                />
                                                <span className={`text-sm font-bold capitalize ${data.role === roleType ? 'text-indigo-700' : 'text-gray-900'}`}>
                                                    {roleType}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {roleType === 'admin' ? 'Toàn quyền hệ thống' : roleType === 'manager' ? 'Quản lý nội dung' : roleType === 'approve' ? 'Duyệt công việc' : 'Người dùng'}
                                                </span>
                                                {data.role === roleType && (
                                                    <div className="absolute top-2 right-2 text-indigo-600">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-700">Trạng thái tài khoản</span>
                                        <span className="text-xs text-gray-500 italic">Cho phép hoặc chặn quyền truy cập vào ứng dụng</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] uppercase font-semibold tracking-widest ${data.status === 'active' ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {data.status === 'active' ? 'Đang hoạt động' : 'Đã bị khóa'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setData('status', data.status === 'active' ? 'blocked' : 'active')}
                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${
                                                data.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                                                data.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Link 
                                href={route('admin.users.index')} 
                                className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Hủy bỏ
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-10 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Đang xử lý...
                                    </span>
                                ) : (
                                    isEdit ? 'Cập nhật thay đổi' : 'Thêm tài khoản'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}