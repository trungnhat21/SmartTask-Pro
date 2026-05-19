import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Dashboard({ auth, upcomingTasks = [], stats = { total: 0, completed: 0, percentage: 0 } }) {
    const messages = [
        <>Chào <span className="font-bold underline decoration-wavy">{auth.user.name}</span>! Bạn đang có <span className="px-2 py-0.5 bg-white text-indigo-600 rounded-md font-black mx-1">{upcomingTasks.length}</span> công việc sắp đến hạn. Hãy ưu tiên các mục quan trọng nhé!</>,
        <>Hiệu suất làm việc của bạn đang đạt <span className="px-2 py-0.5 bg-white text-indigo-600 rounded-md font-black mx-1">{stats.percentage}%</span>. Một kết quả rất ấn tượng, hãy tiếp tục duy trì nhé!</>,
        <>Đừng quên kiểm tra các công việc có độ ưu tiên <span className="px-2 py-0.5 bg-white text-red-600 rounded-md font-black mx-1">Cao</span> để tránh bị trễ hạn chót</>,
        <>Bạn đã hoàn thành <span className="px-2 py-0.5 bg-white text-indigo-600 rounded-md font-black mx-1">{stats.completed}</span> công việc. Hãy dành ít phút nghỉ ngơi trước khi bắt đầu việc tiếp theo</>,
        <>Bạn nên tập trung vào các dự án lớn trong buổi sáng để tối ưu hóa khả năng sáng tạo</>
    ];

    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentMsgIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setFade(true);
            }, 500);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // AI
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Khởi tạo chatHistory từ localStorage
    const [chatHistory, setChatHistory] = useState(() => {
        const savedChat = localStorage.getItem(`chat_history_${auth.user.id}`);
        return savedChat ? JSON.parse(savedChat) : [
            { role: 'ai', text: `Xin chào ${auth.user.name}, tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?` }
        ];
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Lưu chat vào localStorage mỗi khi lịch sử thay đổi
    useEffect(() => {
        localStorage.setItem(`chat_history_${auth.user.id}`, JSON.stringify(chatHistory));
    }, [chatHistory]);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        if (isAiModalOpen) {
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [chatHistory, isAiModalOpen, isTyping]);

    // Xử lý chọn ảnh và chuyển sang Base64
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!chatInput.trim() && !imagePreview) || isTyping) return;

        const userMsg = chatInput;
        const currentImage = imagePreview;

        // Cập nhật UI ngay lập tức
        setChatHistory(prev => [...prev, { 
            role: 'user', 
            text: userMsg, 
            image: currentImage
        }]);
        
        setChatInput('');
        setImagePreview(null);
        setIsTyping(true);

        try {
            const response = await axios.post(route('ai.chat'), { 
                prompt: userMsg,
                image: currentImage 
            });
            setChatHistory(prev => [...prev, { role: 'ai', text: response.data.response }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'ai', text: 'Rất tiếc, đã có lỗi xảy ra' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                        Tổng quan Công việc
                    </h2>
                    <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                </div>
            }
        >
            <Head title="Bảng Điều Khiển" />

            <div className="py-10 bg-slate-50/50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    <div className="relative overflow-hidden bg-indigo-500 rounded-2xl shadow-2xl shadow-indigo-200">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="p-8 text-white relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md shrink-0">
                                        <span className="text-3xl animate-bounce inline-block">✨</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            Phân tích công việc 
                                            <span className="flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-200 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                            </span>
                                        </h3>
                                        <div className={`mt-2 text-indigo-100/90 leading-relaxed transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                                            <p className="text-base min-h-[3rem] md:min-h-0">
                                                {messages[currentMsgIndex]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                                <div 
                                    key={currentMsgIndex}
                                    className="h-full bg-white/40 animate-progress-banner"
                                    style={{ animation: 'progress-bar 5s linear forwards' }}
                                ></div>
                            </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-2 flex flex-col">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 flex-1 flex flex-col">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                                        <h3 className="font-semibold text-slate-800 text-lg">Công việc cần làm ngay</h3>
                                    </div>
                                    <Link 
                                        href={route('Quanlycongviec')} 
                                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                                    >
                                        Xem tất cả →
                                    </Link>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
                                        <div 
                                            key={task.id} 
                                            className="group flex items-center justify-between p-4 bg-white border border-slate-300 rounded-xl hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                    task.priority === 'Cao' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                                }`}>
                                                    <i className={`fa-solid ${task.priority === 'Cao' ? 'fa-fire' : 'fa-clock'} text-sm`}></i>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Hạn chót:</span>
                                                        <span className="text-xs font-semibold text-slate-600">{task.deadline_formatted}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${
                                                task.priority === 'Cao' 
                                                ? 'bg-red-50 text-red-600 border-red-100' 
                                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    )) : (
                                        <div className="text-center py-12">
                                            <div className="text-4xl mb-4">🎉</div>
                                            <p className="text-slate-400 font-medium">Tuyệt vời! Bạn không còn công việc nào tồn đọng</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-1000" 
                                    style={{ width: `${stats.percentage}%` }}
                                ></div>
                            </div>

                            <h3 className="font-semibold text-slate-800 text-lg mb-8 self-start">Hiệu suất công việc</h3>
                            
                            <div className="relative group">
                                <div 
                                    className="relative size-44 flex items-center justify-center rounded-full transition-transform group-hover:scale-105 duration-500"
                                    style={{
                                        background: `conic-gradient(#4f46e5 ${stats.percentage}%, #f1f5f9 0)`
                                    }}
                                >
                                    <div className="absolute inset-4 bg-white rounded-full shadow-inner flex flex-col items-center justify-center border border-slate-100">
                                        <span className="text-3xl font-black text-slate-800">{stats.percentage}%</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Hoàn thành</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 w-full space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Đã xong:</span>
                                    <span className="text-slate-800 font-bold">{stats.completed}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Tổng số:</span>
                                    <span className="text-slate-800 font-bold">{stats.total}</span>
                                </div>
                                <p className="text-xs text-slate-400 text-center italic border-t border-slate-50 pt-4">
                                    "Kế hoạch tốt là chìa khóa của thành công"
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="fixed bottom-8 right-8 z-50">
                <button 
                    onClick={() => setIsAiModalOpen(true)}
                    className="group relative flex items-center gap-3 bg-slate-900 text-white pl-4 pr-6 py-3.5 rounded-2xl shadow-2xl hover:bg-indigo-600 transition-all duration-300 hover:pr-8 active:scale-95"
                >
                    <div className="relative">
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 group-hover:border-indigo-600 transition-all"></div>
                        <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold tracking-wide">Hỏi AI Trợ Lý</span>
                </button>
            </div>

            {isAiModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 sm:p-8 pointer-events-none">

                    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 pointer-events-auto flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
                        
                        <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-500 p-2 rounded-xl">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-sm">Trợ lý Gemini AI</h4>
                            </div>
                            <button onClick={() => setIsAiModalOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 p-5 overflow-y-auto max-h-[500px] min-h-[300px] space-y-4 bg-slate-50/50">
                            {chatHistory.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                                        msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                    }`}>
                                        {msg.image && <img src={msg.image} alt="upload" className="mb-2 rounded-lg max-w-full h-auto" />}
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && <div className="text-xs text-slate-400 italic">Đang trả lời...</div>}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {imagePreview && (
                            <div className="px-4 py-2 bg-slate-100 flex items-center gap-2">
                                <div className="relative">
                                    <img src={imagePreview} className="h-16 w-16 object-cover rounded-lg border-2 border-indigo-500" />
                                    <button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-[10px]">✕</button>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2">
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="bg-slate-100 text-slate-600 p-2.5 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </button>
                                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
                                
                                <input 
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Nhập câu hỏi hoặc gửi ảnh..."
                                    className="flex-1 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                />
                                <button type="submit" disabled={isTyping} className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}