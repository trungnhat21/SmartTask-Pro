import { Link, usePage } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import Dropdown from '@/Components/Dropdown'; // Đảm bảo bạn đã import Component này

export default function AdminLayout({ header, children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-800 shadow-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <div className="text-yellow-500 font-bold text-xl uppercase">Admin Panel</div>
                        <div className="hidden sm:flex space-x-4">
                            <NavLink href={route('admin.users.index')} active={route().current('admin.users.index')}>
                                Quản lý người dùng
                            </NavLink>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-300 hover:text-white focus:outline-none transition ease-in-out duration-150"
                                        >
                                            Chào, {auth.user.name}
                                            <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1  1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Đổi mật khẩu
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('dashboard')}>
                                        Khu vực User
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Đăng xuất
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="pt-20">
                {header && (
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}
                <main>{children}</main>
            </div>
        </div>
    );
}