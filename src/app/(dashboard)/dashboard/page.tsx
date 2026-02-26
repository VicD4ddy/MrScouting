'use client';

import { useState } from 'react';
import { Star, Lock, BookOpen, Target, BarChart2, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// --- Mock Data (to be replaced with Supabase queries) ---
const MOCK_POSTS = [
    {
        id: '1',
        category: 'TACTICAL ANALYSIS',
        categoryColor: '#3b82f6',
        title: 'The Modern Inverted Fullback Analysis',
        author: 'Marcus Enders',
        isPro: true,
        rating: 4.8,
        coverBg: 'from-slate-900 to-[#0a0f1e]',
        icon: Target,
        type: 'Articles',
    },
    {
        id: '2',
        category: 'SCOUTING REPORT',
        categoryColor: '#10b981',
        title: 'Top 5 U-21 Midfielders to Watch in 2026',
        author: 'Sarah Jenkins',
        isPro: true,
        rating: 5.0,
        coverBg: 'from-emerald-900/40 to-[#0a0f1e]',
        icon: BookOpen,
        type: 'Articles',
    },
    {
        id: '3',
        category: 'PLAYER DATA',
        categoryColor: '#bef264',
        title: 'The Evolution of the False Nine: 2010–2024',
        author: 'David Thorne',
        isPro: false,
        rating: 4.2,
        coverBg: 'from-blue-900/30 to-[#0a0f1e]',
        icon: BarChart2,
        type: 'Players',
    },
    {
        id: '4',
        category: 'TACTICAL ANALYSIS',
        categoryColor: '#3b82f6',
        title: 'High Press Systems: A Data Deep Dive',
        author: 'Carlos Vega',
        isPro: true,
        rating: 4.6,
        coverBg: 'from-indigo-900/40 to-[#0a0f1e]',
        icon: Target,
        type: 'Tactics',
    },
    {
        id: '5',
        category: 'PLAYER DATA',
        categoryColor: '#bef264',
        title: 'João Neves: The Complete Midfield Profile',
        author: 'Luis Tactics',
        isPro: true,
        rating: 4.9,
        coverBg: 'from-violet-900/30 to-[#0a0f1e]',
        icon: TrendingUp,
        type: 'Players',
    },
];

const TABS = ['All', 'Articles', 'Tactics', 'Players'];

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

function PostCard({ post }: { post: typeof MOCK_POSTS[0] }) {
    const Icon = post.icon;
    return (
        <Link
            href={`/dashboard/feed/${post.id}`}
            className="block glass border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all active:scale-[0.98] group"
        >
            {/* Thumbnail */}
            <div className={`h-48 bg-gradient-to-br ${post.coverBg} border-b border-white/5 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 tactical-pattern opacity-10" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                        style={{ backgroundColor: `${post.categoryColor}20`, border: `1px solid ${post.categoryColor}30` }}
                    >
                        <Icon size={28} style={{ color: post.categoryColor }} />
                    </div>
                </div>
                {/* Category badge */}
                <div
                    className="absolute top-3 left-3 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest"
                    style={{ backgroundColor: `${post.categoryColor}20`, color: post.categoryColor, border: `1px solid ${post.categoryColor}30` }}
                >
                    {post.category}
                </div>
                {post.isPro && (
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
                        <div className="w-5 h-5 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white">
                            {post.author[0]}
                        </div>
                        <span className="text-slate-400 text-xs font-medium">{post.author}</span>
                        {post.isPro && (
                            <div className="bg-blue-600/20 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase">PRO</div>
                        )}
                    </div>
                    <StarRating rating={post.rating} />
                </div>
            </div>
        </Link>
    );
}

export default function DashboardFeedPage() {
    const [activeTab, setActiveTab] = useState('All');

    const filtered = activeTab === 'All'
        ? MOCK_POSTS
        : MOCK_POSTS.filter((p) => p.type === activeTab);

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Intelligence Feed</h1>
                    <p className="text-slate-500 text-xs font-medium mt-0.5">Análisis y reportes de la élite mundial</p>
                </div>
                <Link href="/dashboard/create" className="flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-600/20 transition-all">
                    <ChevronRight size={12} />
                    Nuevo
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
            <div className="grid grid-cols-1 gap-4">
                {filtered.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
