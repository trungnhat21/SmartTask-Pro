export default function Footer() {
    return (
        <footer className="bg-orange-300 border-t border-slate-200/60 pt-12 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-layer-group text-white text-xs"></i>
                            </div>
                            <span className="text-lg font-bold text-slate-900 tracking-tight">
                                SmartTask <span className="text-indigo-600">Pro</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Giải pháp quản lý công việc thông minh tối ưu hiệu suất cá nhân
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Hệ thống</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 hover:translate-x-1 inline-block transition-colors">Bảng điều khiển</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 hover:translate-x-1 inline-block transition-colors">Danh sách dự án</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 hover:translate-x-1 inline-block transition-colors">Trợ lý AI</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Thông tin</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 hover:translate-x-1 inline-block transition-colors">Hướng dẫn sử dụng</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 hover:translate-x-1 inline-block transition-colors">Chính sách bảo mật</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 hover:translate-x-1 inline-block transition-colors">Điều khoản dịch vụ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Kết nối</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <i className="fa-brands fa-facebook-f text-sm"></i>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <i className="fa-brands fa-github text-sm"></i>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <i className="fa-brands fa-linkedin-in text-sm"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-slate-400 font-medium">
                        © {new Date().getFullYear()} <span className="text-slate-900">SmartTask Pro</span>. 
                        Phát triển bởi <span className="text-slate-700 hover:text-indigo-600 cursor-pointer transition-colors">Nguyễn Nhật Trung</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center px-3 py-1 bg-green-50 rounded-full border border-green-100">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[11px] font-bold text-green-600 uppercase tracking-tight">AI System Active</span>
                        </div>
                        
                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                            v2.1.0-stable
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}