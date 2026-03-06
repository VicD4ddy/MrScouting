'use client';

import { createClient } from '@/lib/supabase/client';
import { getUserPosts } from '@/lib/services/chat';
import {
    Save, Share2, Grid, List, Lock, Zap, Plus, Loader2, CheckCircle, BookOpen, BarChart2, Target, TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from 'next/link';

const CATEGORY_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
    articulo: { label: 'ARTÍCULO', icon: BookOpen, color: '#34d399' },
    analisis_jugador: { label: 'PLAYER DATA', icon: BarChart2, color: '#bef264' },
    analisis_tactico: { label: 'TACTICAL', icon: Target, color: '#3b82f6' },
    promesas: { label: 'WONDERKID', icon: TrendingUp, color: '#f59e0b' },
};

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<{ full_name: string; bio: string }>({ full_name: '', bio: '' });
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const getProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }
            setUser(user);

            // Fetch the profiles row
            const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, bio')
                .eq('id', user.id)
                .single();

            setProfile({
                full_name: profileData?.full_name || user.email?.split('@')[0] || '',
                bio: profileData?.bio || '',
            });

            // Fetch own posts
            const postsData = await getUserPosts(user.id);
            setPosts(postsData);
            setLoading(false);
        };
        getProfile();
    }, []);

    const handleSave = async () => {
        if (!user || saving) return;
        setSaving(true);
        const supabase = createClient();

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: profile.full_name, bio: profile.bio })
            .eq('id', user.id);

        if (!error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
    );

    const displayName = profile.full_name || user?.email?.split('@')[0] || 'Analista';
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <div className="max-w-xl mx-auto space-y-6 pb-28">
            {/* Profile Header */}
            <div className="glass border border-white/10 rounded-3xl p-6 space-y-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 tactical-pattern opacity-5 pointer-events-none" />

                {/* Avatar */}
                <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-slate-900 border-4 border-blue-500/30 mx-auto flex items-center justify-center text-3xl font-black text-white shadow-xl">
                        {initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-[#0a0f1e]">
                        <Zap size={10} />
                    </div>
                    <div className="absolute -top-1 right-0 bg-[#bef264] text-[#0a0f1e] px-2 py-0.5 rounded text-[8px] font-black uppercase">PRO</div>
                </div>

                {/* Identity */}
                <div className="space-y-1">
                    <h1 className="text-xl font-black tracking-tight text-white uppercase">{displayName}</h1>
                    <p className="text-blue-400 text-xs font-bold">Professional Talent Analyst</p>
                    {profile.bio && (
                        <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">{profile.bio}</p>
                    )}
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-center divide-x divide-white/10">
                    <div className="px-6 space-y-0.5">
                        <div className="text-2xl font-black text-white">{posts.length}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Reportes</div>
                    </div>
                </div>

                {/* Share */}
                <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold py-3 w-full rounded-2xl text-xs uppercase tracking-wider transition-all">
                    <Share2 size={13} /> Compartir Perfil
                </button>
            </div>

            {/* Published Posts */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="font-bold text-white text-sm uppercase tracking-widest">Mis Publicaciones</h2>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                            <Grid size={13} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                            <List size={13} />
                        </button>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-10 text-slate-600 text-sm">Aún no tienes publicaciones</div>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
                        {posts.map((post) => {
                            const config = CATEGORY_CONFIG[post.category] || { label: 'GENERAL', icon: Zap, color: '#64748b' };
                            const PostIcon = config.icon;
                            return (
                                <Link
                                    key={post.id}
                                    href={`/dashboard/feed/${post.id}`}
                                    className={`relative glass border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all active:scale-[0.98] ${viewMode === 'list' ? 'flex items-center gap-4 p-3' : ''}`}
                                >
                                    <div className={`${viewMode === 'grid' ? 'h-24' : 'w-14 h-14 rounded-xl flex-shrink-0'} bg-[#161b29] flex items-center justify-center relative overflow-hidden`}>
                                        <div className="absolute inset-0 tactical-pattern opacity-10" />
                                        <PostIcon size={viewMode === 'grid' ? 24 : 18} style={{ color: config.color }} className="relative z-10 opacity-70" />
                                        {post.is_exclusive && (
                                            <div className="absolute top-1.5 right-1.5 bg-[#0a0f1e]/60 rounded p-1">
                                                <Lock size={8} className="text-[#bef264]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className={viewMode === 'grid' ? 'p-2.5 space-y-1' : 'flex-1'}>
                                        <div className="text-[7px] font-bold uppercase tracking-widest" style={{ color: config.color }}>{config.label}</div>
                                        <p className="text-white text-xs font-bold leading-snug line-clamp-2">{post.title}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Edit Profile Form */}
            <div className="glass border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[3px] text-slate-500">Editar Datos del Perfil</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nombre Operativo</label>
                        <input
                            type="text"
                            value={profile.full_name}
                            onChange={(e) => setProfile(p => ({ ...p, full_name: e.target.value }))}
                            placeholder="Tu nombre o alias"
                            className="w-full mt-1.5 bg-[#04060d]/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all text-white text-sm placeholder:text-slate-700 font-medium"
                        />
                    </div>
                    <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-1">Enlace de Comunicación</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            readOnly
                            className="w-full mt-1.5 bg-[#0a0f1e]/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-600 cursor-not-allowed italic"
                        />
                    </div>
                    <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-1">Manifiesto Táctico (Bio)</label>
                        <textarea
                            rows={3}
                            value={profile.bio}
                            onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                            placeholder="Describe tu metodología de análisis..."
                            className="w-full mt-1.5 bg-[#04060d]/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all resize-none text-white text-sm placeholder:text-slate-700 font-medium"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all shadow-xl shadow-blue-900/40 active:scale-95"
                >
                    {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <CheckCircle size={13} /> : <Save size={13} />}
                    {saved ? '¡Guardado!' : 'Guardar Cambios'}
                </button>
            </div>

            {/* Floating FAB */}
            <Link
                href="/dashboard/create"
                className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/50 transition-all active:scale-90 z-50 border border-blue-500/30"
            >
                <Plus size={22} />
            </Link>
        </div>
    );
}
