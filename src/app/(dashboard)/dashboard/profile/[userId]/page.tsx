'use client';

import { createClient } from '@/lib/supabase/client';
import { getPublicProfile, getUserPosts, getOrCreateConversation } from '@/lib/services/chat';
import { BookOpen, BarChart2, Target, TrendingUp, Lock, Zap, MessageSquare, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORY_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
    articulo: { label: 'ARTÍCULO', icon: BookOpen, color: '#34d399' },
    analisis_jugador: { label: 'PLAYER DATA', icon: BarChart2, color: '#bef264' },
    analisis_tactico: { label: 'TACTICAL', icon: Target, color: '#3b82f6' },
    promesas: { label: 'WONDERKID', icon: TrendingUp, color: '#f59e0b' },
};

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isStartingChat, setIsStartingChat] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);

            // If viewing own profile, redirect to own profile page
            if (user?.id === userId) {
                router.replace('/dashboard/profile');
                return;
            }

            const [profileData, postsData] = await Promise.all([
                getPublicProfile(userId),
                getUserPosts(userId),
            ]);

            setProfile(profileData);
            setPosts(postsData);
            setLoading(false);
        };
        load();
    }, [userId, router]);

    const handleMessage = async () => {
        if (!currentUserId) return;
        setIsStartingChat(true);
        const conversationId = await getOrCreateConversation(currentUserId, userId);
        if (conversationId) {
            router.push(`/dashboard/messages/${conversationId}`);
        }
        setIsStartingChat(false);
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/dashboard/profile/${userId}`;
        if (navigator.share) {
            await navigator.share({ title: profile?.full_name || 'Perfil', url });
        } else {
            await navigator.clipboard.writeText(url);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
    );

    if (!profile) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
            <p className="text-white font-bold text-lg">Perfil no encontrado</p>
            <Link href="/dashboard" className="text-blue-400 text-sm">← Volver al feed</Link>
        </div>
    );

    const displayName = profile.full_name || 'Analista';
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <div className="max-w-xl mx-auto space-y-6 pb-28">
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
                <ArrowLeft size={16} /> Volver
            </button>

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
                </div>

                {/* Identity */}
                <div className="space-y-1">
                    <h1 className="text-xl font-black tracking-tight text-white uppercase">{displayName}</h1>
                    <p className="text-blue-400 text-xs font-bold">Professional Talent Analyst</p>
                    {profile.bio && (
                        <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">{profile.bio}</p>
                    )}
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-center divide-x divide-white/10">
                    <div className="px-6 space-y-0.5">
                        <div className="text-2xl font-black text-white">{posts.length}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Reportes</div>
                    </div>
                </div>

                {/* Action Buttons */}
                {currentUserId && (
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleMessage}
                            disabled={isStartingChat}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                        >
                            {isStartingChat ? <Loader2 size={13} className="animate-spin" /> : <MessageSquare size={13} />}
                            Enviar Mensaje
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all"
                        >
                            <Share2 size={13} /> Compartir
                        </button>
                    </div>
                )}
            </div>

            {/* Published Posts */}
            {posts.length > 0 && (
                <div className="space-y-3">
                    <h2 className="font-bold text-white text-sm uppercase tracking-widest px-1">
                        Publicaciones ({posts.length})
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {posts.map((post) => {
                            const config = CATEGORY_CONFIG[post.category] || { label: 'GENERAL', icon: Zap, color: '#64748b' };
                            const PostIcon = config.icon;
                            return (
                                <Link
                                    key={post.id}
                                    href={`/dashboard/feed/${post.id}`}
                                    className="relative glass border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all active:scale-[0.98] group"
                                >
                                    <div className="h-24 bg-[#161b29] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 tactical-pattern opacity-10" />
                                        <PostIcon size={24} style={{ color: config.color }} className="relative z-10 opacity-70" />
                                        {post.is_exclusive && (
                                            <div className="absolute top-1.5 right-1.5 bg-[#0a0f1e]/60 rounded p-1">
                                                <Lock size={8} className="text-[#bef264]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2.5 space-y-1">
                                        <div className="text-[7px] font-bold uppercase tracking-widest" style={{ color: config.color }}>
                                            {config.label}
                                        </div>
                                        <p className="text-white text-xs font-bold leading-snug line-clamp-2">{post.title}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
