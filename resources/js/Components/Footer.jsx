export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-6 mt-auto dark:bg-zinc-900 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-500">
                        © {new Date().getFullYear()} <span className="font-bold text-indigo-600">SmartTask Pro</span>. 
                        Phát triển bởi Nguyễn Nhật Trung.
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            AI System Active
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}