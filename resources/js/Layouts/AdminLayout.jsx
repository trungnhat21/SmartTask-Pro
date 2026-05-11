import { Link, usePage } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import Dropdown from '@/Components/Dropdown';

export default function AdminLayout({ header, children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-500 backdrop-blur-md border-b border-slate-800 shadow-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
                    
                    <div className="flex items-center space-x-10">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <span className="text-white font-black text-sm">A</span>
                            </div>
                            <div className="text-white font-bold text-lg tracking-tight uppercase">
                                <span className="text-indigo-400">Admin</span>Panel
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center space-x-1">
                            <NavLink 
                                href={route('admin.adminDashboard.index')} 
                                active={route().current('admin.adminDashboard.index')}
                                className="px-4 py-2 rounded-md transition-all duration-200"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    Trang chủ
                                </span>
                            </NavLink>

                            <NavLink 
                                href={route('admin.users.index')} 
                                active={route().current('admin.users.index')}
                                className="px-4 py-2 rounded-md transition-all duration-200"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    Người dùng
                                </span>
                            </NavLink>

                            <NavLink 
                                href={route('admin.feedbacks.index')} 
                                active={route().current('admin.feedbacks.index')}
                                className="px-4 py-2 rounded-md transition-all duration-200"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    Phản hồi
                                </span>
                            </NavLink>

                            <NavLink 
                                href={route('admin.adminpdf.index')} 
                                active={route().current('admin.adminpdf.index')}
                                className="px-4 py-2 rounded-md transition-all duration-200"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Bảng xếp hạng
                                </span>
                            </NavLink>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-4 py-2 bg-slate-800 border border-slate-700 text-sm font-medium rounded-full text-slate-200 hover:bg-slate-700 hover:text-white transition-all duration-300 focus:outline-none ring-2 ring-transparent hover:ring-indigo-500/50"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-2 text-[10px] text-white font-bold">
                                                {auth.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="hidden md:inline">Chào, {auth.user.name}</span>
                                            <svg className="ms-2 -me-0.5 h-4 w-4 opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-100">Quản lý tài khoản</div>
                                    <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Hồ sơ & Mật khẩu
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('dashboard')} className="flex items-center gap-2 text-indigo-600 font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                                        Khu vực User
                                    </Dropdown.Link>
                                    <div className="border-t border-slate-100"></div>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-red-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        Đăng xuất
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="pt-16">
                {header && (
                    <header className="bg-white border-b border-slate-200">
                        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                                {header}
                            </h1>
                        </div>
                    </header>
                )}
                
                <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
                    {children}
                </main>
            </div>

            <footer className="py-8 text-center text-slate-400 text-xs">
                &copy; {new Date().getFullYear()} Admin System
            </footer>
        </div>
    );
}