import { Head, Link } from '@inertiajs/react';

export default function Index({ auth }) {
    return (
        <>
            <Head title="Hệ thống Quản lý Công việc AI" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50 min-h-screen">
                <div className="relative flex flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                
                                <span className="text-2xl font-bold text-[#FF2D20]">SmartTask Pro</span>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-[#FF2D20] dark:text-white"
                                    >
                                        Vào Bảng Điều Khiển
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-[#FF2D20] dark:text-white"
                                        >
                                            Đăng nhập
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="ml-4 rounded-md bg-[#FF2D20] px-4 py-2 text-white transition hover:bg-[#e0261b]"
                                        >
                                            Đăng ký
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">
                            <div className="text-center mb-12">
                                <h1 className="text-4xl text-black dark:text-white mb-4">
                                    Quản lý công việc thông minh
                                </h1>
                                <p className="text-lg">Tối ưu hóa năng suất của bạn bằng lịch trình công việc thông minh</p>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">

                                <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10">
                                        <svg className="size-6 text-[#FF2D20]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-black dark:text-white">Quản lý Công việc</h2>
                                        <p className="mt-2 text-sm/relaxed">Tạo, cập nhật và theo dõi tiến độ công việc một cách khoa học với mức độ ưu tiên và deadline rõ ràng.</p>
                                    </div>
                                </div>


                                <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                                        <svg className="size-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-black dark:text-white">Gợi ý Thông minh</h2>
                                        <p className="mt-2 text-sm/relaxed">Phân tích danh sách công việc của bạn để đưa ra đề xuất việc nên làm trước, dựa trên tính cấp thiết.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                                        <svg className="size-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-black dark:text-white">Trợ lý Chatbot AI</h2>
                                        <p className="mt-2 text-sm/relaxed">Hỏi đáp về các công việc của bạn. Trợ lý AI hiểu dữ liệu của bạn để trả lời những câu hỏi như "Hôm nay tôi nên làm gì?".</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                                        <svg className="size-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-black dark:text-white">Thống kê & Tóm tắt</h2>
                                        <p className="mt-2 text-sm/relaxed">Xem biểu đồ năng suất và bản tóm tắt nhanh hiệu suất làm việc của bạn trong tuần.</p>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                            Dự án Quản lý Công việc - Phát triển bởi Trung Nhật
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}