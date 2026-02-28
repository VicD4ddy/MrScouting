'use client';

import { useEffect, useState } from 'react';
import { Star, Lock, BookOpen, Target, BarChart2, TrendingUp, Zap, ChevronRight, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { getFeedPosts } from '@/lib/services/feed';

const CATEGORY_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
    articulo: { label: 'ARTÍCULO', color: '#10b981', icon: BookOpen },
    analisis_jugador: { label: 'PLAYER DATA', color: '#bef264', icon: BarChart2 },
    analisis_tactico: { label: 'TACTICAL ANALYSIS', color: '#3b82f6', icon: Target },
    promesas: { label: 'WONDERKID', color: '#f59e0b', icon: TrendingUp },
};

function getCategoryConfig(category: string) {
    return CATEGORY_CONFIG[category] || { label: 'GENERAL', color: '#64748b', icon: Zap };
}

const TABS = ['Todo', 'Artículos', 'Tácticas', 'Jugadores'];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={10}
                    className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}
                />
            ))}
            <span className="text-[10px] text-slate-400 font-bold ml-1">{rating.toFixed(1)}</span>
        </div>
    );
}

function PostCard({ post }: { post: any }) {
    const config = getCategoryConfig(post.category);
    const Icon = config.icon;
    const authorName = post.profiles?.full_name || 'Anonymous';

    return (
        <Link
            href={`/dashboard/feed/${post.id}`}
            className="block glass border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all active:scale-[0.98] group"
        >
            {/* Thumbnail */}
            <div className={`h-48 bg-gradient-to-br from-slate-900 to-[#0a0f1e] border-b border-white/5 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 tactical-pattern opacity-10" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                        style={{ backgroundColor: `${config.color}20`, border: `1px solid ${config.color}30` }}
                    >
                        <Icon size={28} style={{ color: config.color }} />
                    </div>
                </div>
                {/* Category badge */}
                <div
                    className="absolute top-3 left-3 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest"
                    style={{ backgroundColor: `${config.color}20`, color: config.color, border: `1px solid ${config.color}30` }}
                >
                    {config.label}
                </div>
                {post.is_exclusive && (
                    <div className="absolute top-3 right-3 bg-[#bef264] text-[#0a0f1e] px-2 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <Zap size={8} /> PRO
                    </div>
                )}
            </div>

            {/* Card body */}
            <div className="p-4 space-y-3">
                <h3 className="font-bold text-white text-sm leading-snug group-hover:text-blue-400 transition-colors">
                    {post.title}
                </h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white uppercase">
                            {authorName[0]}
                        </div>
                        <span className="text-slate-400 text-xs font-medium">{authorName}</span>
                    </div>
                    {post.is_exclusive && (
                        <div className="bg-blue-600/20 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase">PRO</div>
                    )}
                </div>
                <StarRating rating={4.5} /> {/* Default rating since it's not in schema yet */}
            </div>
        </Link>
    );
}

export default function DashboardFeedPage() {
    const [activeTab, setActiveTab] = useState('Todo');
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const data = await getFeedPosts(activeTab);
            setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, [activeTab]);

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Feed de Inteligencia</h1>
                    <p className="text-slate-500 text-xs font-medium mt-0.5">Análisis y reportes de la élite mundial</p>
                </div>
                <Link href="/dashboard/create" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 group">
                    <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>NUEVO ANÁLISIS</span>
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                            : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Sincronizando Feed...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 glass border border-white/5 rounded-3xl gap-4">
                    <Target className="w-12 h-12 text-slate-800" />
                    <div className="text-center">
                        <h3 className="text-slate-300 font-bold">No hay informes disponibles</h3>
                        <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest mt-1">Sé el primero en publicar inteligencia táctica</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
