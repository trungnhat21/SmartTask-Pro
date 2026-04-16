import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
export default function StatsSummaryCard({auth}) {
    return (
        <AuthenticatedLayout
                    user={auth.user}
                    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Thống kê</h2>}
                >
                <Head title="Thống kê" />
                <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                    {/* Biểu tượng biểu đồ màu tím */}
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-purple-50">
                        <svg 
                            className="size-7 text-purple-600" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                            />
                        </svg>
                    </div>

                    {/* Nội dung văn bản */}
                    <div>
                        <p className="mt-2 text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
                            Xem biểu đồ năng suất và nhận bản tóm tắt nhanh từ AI về hiệu suất làm việc của bạn trong tuần.
                        </p>
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}