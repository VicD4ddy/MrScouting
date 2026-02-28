'use client';

import { useEffect, useState, use } from 'react';
import { ChevronLeft, Calendar, User, Zap, Target, BookOpen, BarChart2, TrendingUp, Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getPostById } from '@/lib/services/feed';
import { RadarChart as Radar } from '@/components/charts/RadarChart';

const CATEGORY_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
    articulo: { label: 'ARTÍCULO', color: '#10b981', icon: BookOpen },
    analisis_jugador: { label: 'PLAYER DATA', color: '#bef264', icon: BarChart2 },
    analisis_tactico: { label: 'TACTICAL ANALYSIS', color: '#3b82f6', icon: Target },
    promesas: { label: 'WONDERKID', color: '#f59e0b', icon: TrendingUp },
};

function getCategoryConfig(category: string) {
    return CATEGORY_CONFIG[category] || { label: 'GENERAL', color: '#64748b', icon: Zap };
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const data = await getPostById(id);
            setPost(data);
            setLoading(false);
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">Sincronizando Nodo de Inteligencia...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
                <Shield className="w-16 h-16 text-slate-800" />
                <div className="text-center space-y-2">
                    <h3 className="text-white font-bold text-xl uppercase tracking-tighter">Nodo No Encontrado</h3>
                    <p className="text-slate-500 text-xs">El informe solicitado no existe o ha sido desclasificado.</p>
                </div>
                <Link href="/dashboard" className="px-8 py-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600/20 transition-all">
                    Volver al Feed
                </Link>
            </div>
        );
    }

    const config = getCategoryConfig(post.category);
    const Icon = config.icon;
    const authorName = post.profiles?.full_name || 'Anonymous Analyst';

    // Prepare radar data if available
    const playerMetadata = Array.isArray(post.player_metadata) ? post.player_metadata[0] : post.player_metadata;
    const radarData = playerMetadata?.radar_data ?
        Object.entries(playerMetadata.radar_data).map(([attribute, value]) => ({
            attribute,
            value: Number(value),
        })) : null;

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-32">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30">
                        <ChevronLeft size={16} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Regresar</span>
                </Link>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-[2px]`}
                        style={{ backgroundColor: `${config.color}10`, color: config.color, border: `1px solid ${config.color}20` }}>
                        {config.label}
                    </div>
                </div>
            </div>

            {/* Post Header Content */}
            <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 border-y border-white/5 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 uppercase">
                            {authorName[0]}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-xs font-bold leading-tight">{authorName}</span>
                            <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Analista Acreditado</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500">
                        <Calendar size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">
                            {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    {post.is_exclusive && (
                        <div className="bg-[#bef264]/10 border border-[#bef264]/20 text-[#bef264] px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Zap size={10} className="fill-[#bef264]" /> EXCLUSIVO PRO
                        </div>
                    )}
                </div>
            </div>

            {/* Split layout: Content + Sidebar for Player Data */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Content Body */}
                    <div className="prose prose-invert prose-blue max-w-none">
                        <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </p>
                    </div>

                    {/* Support Banner */}
                    <div className="glass border border-white/5 p-8 rounded-[32px] bg-gradient-to-br from-blue-900/10 to-transparent space-y-4">
                        <h4 className="text-blue-400 text-[10px] font-bold uppercase tracking-[3px]">Nota del Analista</h4>
                        <p className="text-slate-500 text-xs leading-relaxed italic">
                            Este reporte forma parte de la red de inteligencia de MR. SCOUTING. Los datos están normalizados bajo criterios de scouting profesional europeo.
                        </p>
                    </div>
                </div>

                {/* Sidebar for Radar/Metadata */}
                {playerMetadata && (
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass border border-white/5 p-8 rounded-[40px] space-y-8 sticky top-24 bg-gradient-to-b from-[#0a0f1e] to-transparent">
                            <div className="space-y-2 text-center">
                                <h3 className="text-xs font-bold text-white uppercase tracking-[3px] leading-tight">
                                    {playerMetadata.player_name}
                                </h3>
                                <div className="flex items-center justify-center gap-2 text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                                    <span className="text-blue-500">{playerMetadata.position}</span>
                                    <span>•</span>
                                    <span>{playerMetadata.current_team}</span>
                                </div>
                            </div>

                            {radarData && (
                                <div className="bg-black/20 rounded-[32px] p-4 border border-white/5">
                                    <Radar data={radarData} />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
                                    <span className="block text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-1">Edad</span>
                                    <span className="text-white font-bold">{playerMetadata.age}</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
                                    <span className="block text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-1">ID Nodo</span>
                                    <span className="text-blue-400 font-bold">#{post.id.slice(0, 4)}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                                <TrendingUp size={14} className="text-[#bef264]" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Descargar Informe PDF</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
