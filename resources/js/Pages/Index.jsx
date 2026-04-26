import { Head, Link } from '@inertiajs/react';

export default function Index({ auth }) {
    return (
        <>
            <Head title="SmartTask Pro - Hệ thống Quản lý Công việc" />
            
            <div className="bg-[#f8fafc] text-slate-600 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
                
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50 blur-[120px]" />
                    <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-50 blur-[100px]" />
                </div>

                <div className="relative flex flex-col items-center">
                    <div className="relative w-full max-w-7xl px-6">
                        
                        <header className="flex items-center justify-between py-8 border-b border-slate-200/50">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <i className="fa-solid fa-layer-group text-white text-lg"></i>
                                </div>
                                <span className="text-xl font-bold text-slate-900 tracking-tight">SmartTask <span className="text-indigo-600">Pro</span></span>
                            </div>
                            
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                                    >
                                        Bảng điều khiển →
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                                        >
                                            Đăng nhập
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 shadow-md shadow-slate-200 transition-all active:scale-95"
                                        >
                                            Đăng ký
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="py-20">
                            <div className="text-center max-w-3xl mx-auto mb-20">
                                <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                    Powered by Artificial Intelligence
                                </span>
                                <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-6 tracking-tight leading-tight">
                                    Quản lý công việc <br/>
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                                        thông minh
                                    </span>
                                </h1>
                                <p className="text-lg text-slate-500 leading-relaxed">
                                    Tối ưu hóa năng suất cá nhân. Lên lịch trình, 
                                    theo dõi tiến độ và nhận gợi ý thông minh chỉ trong một nền tảng
                                </p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
                                
                                <div className="group bg-indigo-200 p-8 rounded-[2rem] border border-slate-200/60 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-3">Quản lý Công việc</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Tạo, cập nhật và theo dõi tiến độ công việc khoa học với hệ thống ưu tiên và deadline tự động nhắc nhở
                                    </p>
                                </div>

                                <div className="group bg-blue-200 p-8 rounded-[2rem] border border-slate-200/60 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-3">Gợi ý Thông minh</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Phân tích công việc của bạn để đưa ra danh sách việc cần ưu tiên xử lý ngay lập tức
                                    </p>
                                </div>

                                <div className="group bg-green-200 p-8 rounded-[2rem] border border-slate-200/60 hover:border-green-600 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-3">Trợ lý Chatbot AI</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Hỏi đáp trực tiếp với dữ liệu công việc. Trợ lý ảo hỗ trợ trả lời mọi thắc mắc về lịch trình của bạn
                                    </p>
                                </div>

                                <div className="group bg-purple-200 p-8 rounded-[2rem] border border-slate-200/60 hover:border-purple-600 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-3">Thống kê & Tóm tắt</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Báo cáo trực quan bằng biểu đồ, giúp bạn cái nhìn tổng thể về hiệu suất làm việc hàng tuần
                                    </p>
                                </div>

                            </div>
                        </main>

                        <footer className="py-12 border-t border-slate-200/60 text-center">
                            <p className="text-sm text-slate-400 font-medium">
                                © 2026 SmartTask Pro. Thiết kế & Phát triển bởi <span className="text-slate-900">Trung Nhật</span>
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}