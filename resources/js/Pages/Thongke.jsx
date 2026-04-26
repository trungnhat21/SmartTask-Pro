import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export default function Thongke({ auth, stats, weeklyData }) {
    const defaultStats = stats || { total: 0, completed: 0, pending: 0, overdue: 0, rate: 0 };
    const chartData = weeklyData || [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-3xl text-slate-800 tracking-tight">Báo Cáo Thống Kê</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">Theo dõi và phân tích hiệu suất làm việc hệ thống</p>
                    </div>
                    <div className="shrink-0">
                        <a 
                            href={route('pdf.index')} 
                            className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-indigo-600 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-slate-200 active:scale-95"
                        >
                            <i className="fa-solid fa-file-export text-xs"></i>
                            Xuất báo cáo PDF
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Thống kê hệ thống" />

            <div className="py-8 bg-slate-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Tổng công việc" value={defaultStats.total} icon="fa-folder-open" color="indigo" />
                        <StatCard title="Hoàn thành" value={defaultStats.completed} icon="fa-check-double" color="emerald" />
                        <StatCard title="Đang thực hiện" value={defaultStats.pending} icon="fa-spinner" color="amber" isSpin />
                        <StatCard title="Đã quá hạn" value={defaultStats.overdue} icon="fa-triangle-exclamation" color="rose" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-lg">📈 Xu hướng công việc</h3>
                                    <p className="text-xs text-slate-400 font-medium">Dữ liệu cập nhật theo tuần gần nhất</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
                                        <span className="w-3 h-1 bg-indigo-500 rounded-full"></span> Mới
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
                                        <span className="w-3 h-1 bg-emerald-500 rounded-full"></span> Xong
                                    </div>
                                </div>
                            </div>
                            
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTask" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                                            dy={10}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                                            cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="task" 
                                            stroke="#6366f1" 
                                            strokeWidth={4} 
                                            fillOpacity={1} 
                                            fill="url(#colorTask)" 
                                            animationDuration={2000}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="done" 
                                            stroke="#10b981" 
                                            strokeWidth={4} 
                                            fill="none" 
                                            strokeDasharray="8 8"
                                            animationDuration={2500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col items-center">
                            <h3 className="font-semibold text-slate-800 text-lg mb-2 self-start">🎯 Hiệu suất cá nhân</h3>
                            <p className="text-xs text-slate-400 font-medium mb-8 self-start">Tỉ lệ hoàn thành mục tiêu</p>
                            
                            <div className="relative group cursor-pointer">
                                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-all"></div>
                                <div className="relative size-56 transition-transform duration-500 group-hover:scale-105">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Đúng hạn', value: defaultStats.completed }, 
                                                    { name: 'Khác', value: (defaultStats.total - defaultStats.completed) || 1 }
                                                ]}
                                                innerRadius={75}
                                                outerRadius={95}
                                                paddingAngle={8}
                                                dataKey="value"
                                                startAngle={90}
                                                endAngle={450}
                                            >
                                                <Cell fill="#10b981" stroke="none" />
                                                <Cell fill="#f1f5f9" stroke="none" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-slate-800 tracking-tighter">{defaultStats.rate}%</span>
                                        <span className="text-[10px] uppercase text-emerald-600 font-black tracking-widest mt-1">Success</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 text-slate-100 group-hover:text-slate-200 transition-colors">
                                    <i className="fa-solid fa-quote-right text-3xl"></i>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                                    Chào <strong>{auth.user.name}</strong>, bạn hiện có <span className="text-indigo-600 font-bold">{defaultStats.pending}</span> công việc đang chờ. 
                                    Hãy cố gắng hoàn thành trước hạn chót!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon, color, isSpin = false }) {
    const cardStyles = {
        indigo: 'bg-indigo-50 border-indigo-100',
        emerald: 'bg-emerald-50 border-emerald-100',
        amber: 'bg-amber-50 border-amber-100',
        rose: 'bg-rose-50 border-rose-100',
    };

    const iconColors = {
        indigo: 'text-indigo-600 bg-white shadow-sm',
        emerald: 'text-emerald-600 bg-white shadow-sm',
        amber: 'text-amber-600 bg-white shadow-sm',
        rose: 'text-rose-600 bg-white shadow-sm',
    }

    return (
        <div className={`p-6 rounded-[2rem] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${cardStyles[color]}`}>
            <div className="flex justify-between items-center">
                <div className={`size-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:rotate-12 ${iconColors[color]}`}>
                    <i className={`fa-solid ${icon} ${isSpin ? 'fa-spin' : ''}`}></i>
                </div>
                <div className="size-2 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors"></div>
            </div>
            <div className="mt-6">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] opacity-70">{title}</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-black text-slate-800 mt-1">{value}</p>
                    <span className="text-slate-400 text-xs font-bold">items</span>
                </div>
            </div>
        </div>
    );
}