import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Footer from '@/Components/Footer';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, nearDeadlineCount } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (flash && flash.error) {
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-orange-200 flex flex-col pt-16">
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-slate-200/60 bg-orange-500 backdrop-blur-md transition-all duration-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('dashboard')} className="flex items-center gap-2 group">
                                    <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                                        <ApplicationLogo className="h-6 w-auto fill-current text-white" />
                                    </div>
                                    <span className="hidden md:block text-lg font-bold text-slate-900 tracking-tight">
                                        SmartTask <span className="text-indigo-600">Pro</span>
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-1 sm:-my-px sm:ms-10 sm:flex items-center">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-slate-50"
                                >
                                    Trang chủ
                                </NavLink>

                                <NavLink
                                    href={route('Quanlycongviec')}
                                    active={route().current('Quanlycongviec')}
                                    className="relative px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-slate-50"
                                >
                                    <span>Quản lý công việc</span>
                                    {nearDeadlineCount > 0 && (
                                        <span className="absolute top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                            {nearDeadlineCount}
                                        </span>
                                    )}
                                </NavLink>

                                <NavLink
                                    href={route('Cvthongminh')}
                                    active={route().current('Cvthongminh')}
                                    className="px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-slate-50"
                                >
                                    Gợi ý thông minh
                                </NavLink>

                                <NavLink
                                    href={route('Thongke')}
                                    active={route().current('Thongke')}
                                    className="px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-slate-50"
                                >
                                    Thống kê
                                </NavLink>

                                <NavLink
                                    href={route('Chinhsach')}
                                    active={route().current('Chinhsach')}
                                    className="px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-slate-50"
                                >
                                    Chính sách
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold leading-4 text-slate-700 transition duration-150 ease-in-out hover:border-indigo-300 hover:bg-slate-50 focus:outline-none"
                                            >
                                                <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-bold border border-indigo-200">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-1 h-4 w-4 text-slate-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-slate-100">
                                        <div className="px-4 py-2">
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tài khoản</p>
                                            <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                                        </div>
                                        
                                        <div className="py-1">
                                            <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">
                                                <i className="fa-regular fa-user text-slate-400"></i> Hồ sơ
                                            </Dropdown.Link>
                                            {user.role === 'admin' && (
                                                <Dropdown.Link href={route('admin.users.index')} className="flex items-center gap-2 text-indigo-600 font-semibold">
                                                    <i className="fa-solid fa-shield-halved"></i> Khu vực Admin
                                                </Dropdown.Link>
                                            )}
                                        </div>

                                        <div className="py-1">
                                            <Dropdown.Link
                                                href={route('logout')} 
                                                method="post"
                                                as="button"
                                                className="flex w-full items-center gap-2 text-red-600 hover:bg-red-50"
                                            >
                                                <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
                                            </Dropdown.Link>
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 transition duration-150 ease-in-out hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-white border-b border-slate-200 shadow-xl'}>
                    <div className="space-y-1 pb-3 pt-2 px-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-slate-100 pb-1 pt-4 px-4 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-base font-bold text-slate-800">{user.name}</div>
                                <div className="text-sm font-medium text-slate-500">{user.email}</div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Hồ sơ</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-red-600">
                                Đăng xuất
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {showError && flash && flash.error && (
                <div className="mx-auto max-w-7xl mt-4 px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md transition-opacity duration-500" role="alert">
                        <strong className="font-bold text-red-700">Cảnh báo: </strong>
                        <span className="block sm:inline">{flash.error}</span>
                        
                    </div>
                </div>
            )}

            {header && (
                <header className="bg-gray-100 shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}