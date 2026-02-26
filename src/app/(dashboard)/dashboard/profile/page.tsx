'use client';

import { createClient } from '@/lib/supabase/client';
import {
    User, Mail, Shield, Globe, Camera, Save, ExternalLink, Zap, Award, Activity, FileText,
    Share2, Grid, List, Phone, Lock, Star, TrendingUp, Plus
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from 'next/link';

// Mock published intelligence posts
const MOCK_PUBLISHED = [
    { id: '1', title: '2024 Mid-Season European Prospects', category: 'TALENT REPORT', date: 'Oct 24', count: '12 Players', locked: true, bg: 'from-blue-900/50 to-slate-900' },
    { id: '2', title: 'Under-the-Radar: South American...', category: 'REGIONAL ANALYSIS', date: 'Sep 18', count: '6 Players', locked: true, bg: 'from-emerald-900/50 to-slate-900' },
    { id: '3', title: 'Metric Evolution: Modern Fullback...', category: 'DEEP DIVE', date: 'Aug 05', count: '', locked: false, bg: 'from-violet-900/50 to-slate-900' },
    { id: '4', title: 'Academy Watch: Top U17 Talents', category: 'YOUTH FOCUS', date: 'Jul 29', count: '', locked: true, bg: 'from-amber-900/50 to-slate-900' },
];

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const getProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getProfile();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="text-blue-500 w-6 h-6 animate-pulse" />
                </div>
            </div>
        </div>
    );

    const userName = user?.email?.split('@')[0] || 'Analista';

    return (
        <div className="max-w-xl mx-auto space-y-6 pb-28">
            {/* Profile Header */}
            <div className="glass border border-white/10 rounded-3xl p-6 space-y-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 tactical-pattern opacity-5 pointer-events-none" />

                {/* Avatar */}
                <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-slate-900 border-4 border-blue-500/30 mx-auto flex items-center justify-center text-3xl font-black text-white shadow-xl">
                        {userName[0].toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-[#0a0f1e]">
                        <Zap size={10} />
                    </div>
                    <div className="absolute -top-1 right-0 bg-[#bef264] text-[#0a0f1e] px-2 py-0.5 rounded text-[8px] font-black uppercase">PRO</div>
                </div>

                {/* Identity */}
                <div className="space-y-1">
                    <h1 className="text-xl font-black tracking-tight text-white uppercase">{userName}</h1>
                    <p className="text-blue-400 text-xs font-bold">Professional Talent Analyst</p>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                        Specializing in deep-dive talent analytics and regional prospect scouting for elite-level recruitment.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-center divide-x divide-white/10">
                    <div className="px-6 space-y-0.5">
                        <div className="text-2xl font-black text-white">142</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Reports</div>
                    </div>
                    <div className="px-6 space-y-0.5">
                        <div className="text-2xl font-black text-white">98%</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Accuracy</div>
                    </div>
                    <div className="px-6 space-y-0.5">
                        <div className="text-2xl font-black text-white">12</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Years Exp</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/30">
                        <Zap size={14} /> Access External Services
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all">
                            <Mail size={13} /> Contact
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all">
                            <Share2 size={13} /> Share
                        </button>
                    </div>
                </div>
            </div>

            {/* Published Intelligence */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="font-bold text-white text-sm uppercase tracking-widest">Published Intelligence</h2>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Grid size={13} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                        >
                            <List size={13} />
                        </button>
                    </div>
                </div>

                <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
                    {MOCK_PUBLISHED.map((post) => (
                        <Link
                            key={post.id}
                            href={`/dashboard/feed/${post.id}`}
                            className={`relative glass border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all active:scale-[0.98] group ${viewMode === 'list' ? 'flex items-center gap-4 p-3' : ''}`}
                        >
                            <div className={`${viewMode === 'grid' ? 'h-28' : 'w-14 h-14 rounded-xl flex-shrink-0'} bg-gradient-to-br ${post.bg} flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 tactical-pattern opacity-20" />
                                {post.locked && (
                                    <div className="absolute top-1.5 right-1.5 bg-[#0a0f1e]/60 rounded p-1">
                                        <Lock size={8} className="text-[#bef264]" />
                                    </div>
                                )}
                            </div>
                            <div className={viewMode === 'grid' ? 'p-2.5 space-y-1' : 'flex-1'}>
                                <div className="text-[7px] font-bold uppercase tracking-widest text-blue-400">{post.category}</div>
                                <p className="text-white text-xs font-bold leading-snug line-clamp-2">{post.title}</p>
                                <div className="text-[9px] text-slate-500">{post.date}{post.count ? ` · ${post.count}` : ''}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Edit Profile Form */}
            <div className="glass border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[3px] text-slate-500">Edit Profile Data</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-1">Operating Name</label>
                        <input
                            type="text"
                            placeholder={userName}
                            className="w-full mt-1.5 bg-[#04060d]/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all text-white text-sm placeholder:text-slate-700 font-medium"
                        />
                    </div>
                    <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-1">Communication Link</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            readOnly
                            className="w-full mt-1.5 bg-[#0a0f1e]/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-600 cursor-not-allowed italic"
                        />
                    </div>
                    <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-1">Tactical Manifesto (Bio)</label>
                        <textarea
                            rows={3}
                            placeholder="Describe your analysis methodology..."
                            className="w-full mt-1.5 bg-[#04060d]/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all resize-none text-white text-sm placeholder:text-slate-700 font-medium"
                        />
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all shadow-xl shadow-blue-900/40 active:scale-95">
                    <Save size={13} /> Save Changes
                </button>
            </div>

            {/* Floating + FAB */}
            <Link
                href="/dashboard/create"
                className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/50 transition-all active:scale-90 z-50 border border-blue-500/30"
            >
                <Plus size={22} />
            </Link>
        </div>
    );
}
