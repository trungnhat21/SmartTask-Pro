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
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Báo Cáo Thống Kê</h2>}
        >
            <Head title="Thống kê" />

            <div className="py-8 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Tổng công việc" value={defaultStats.total} icon="📁" trend="" color="indigo" />
                        <StatCard title="Hoàn thành" value={defaultStats.completed} icon="✅" trend="" color="emerald" />
                        <StatCard title="Đang làm" value={defaultStats.pending} icon="⏳" trend="" color="amber" />
                        <StatCard title="Quá hạn" value={defaultStats.overdue} icon="⚠️" trend="" color="rose" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">📈 Tiến độ công việc</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorTask" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                        <Area type="monotone" dataKey="task" name="Giao mới" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTask)" />
                                        <Area type="monotone" dataKey="done" name="Hoàn thành" stroke="#10b981" strokeWidth={3} fill="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <h3 className="font-bold text-gray-700 mb-4 self-start">🎯 Hiệu suất cá nhân</h3>
                            <div className="relative size-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Đúng hạn', value: defaultStats.completed }, 
                                                { name: 'Quá hạn/Cần làm', value: (defaultStats.total - defaultStats.completed) }
                                            ]}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#10b981" />
                                            <Cell fill="#f1f5f9" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-slate-800">{defaultStats.rate}%</span>
                                    <span className="text-[10px] uppercase text-slate-400 font-bold">Hoàn thành</span>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 w-full">
                                <p className="text-xs text-indigo-700 leading-relaxed">
                                    Chào <strong>{auth.user.name}</strong>, bạn hiện có <strong>{defaultStats.pending}</strong> công việc đang chờ xử lý.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <a 
                            href={route('pdf.index')} 
                            className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold text-sm transition-all border border-indigo-100"
                        >
                            <i className="fa-solid fa-file-export"></i>
                            Xuất file PDF
                        </a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon, trend, color }) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
                <div className={`size-12 rounded-xl flex items-center justify-center text-2xl ${colors[color]}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-black text-gray-800 mt-1">{value}</p>
            </div>
        </div>
    );
}