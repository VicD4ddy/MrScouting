'use client';

import { FileText, Plus, Eye, Share2, MoreVertical, Star, TrendingUp, Shield, Zap, ArrowUpRight, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getUserPosts } from '@/lib/services/feed';

const CATEGORY_CONFIG: Record<string, { label: string, color: string }> = {
    articulo: { label: 'ARTÍCULO', color: '#3b82f6' },
    analisis_jugador: { label: 'PLAYERS', color: '#bef264' },
    analisis_tactico: { label: 'TÁCTICAS', color: '#10b981' },
    promesas: { label: 'PROMESAS', color: '#f59e0b' },
};

export default function ReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Todos' | 'Borradores' | 'Publicados' | 'Exclusivos'>('Todos');

    useEffect(() => {
        const fetchUserReports = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const data = await getUserPosts(user.id, activeTab);
                setReports(data);
            }
            setLoading(false);
        };

        fetchUserReports();
    }, [activeTab]);

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-blue-500">
                        Archivo de Informes
                    </h1>
                    <p className="text-slate-500 text-xs font-medium">
                        Repositorio Central de Inteligencia Táctica
                    </p>
                </div>

                <Link href="/dashboard/create" className="flex items-center justify-center gap-3 bg-[#bef264] text-[#0a0f1e] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#bef264]/20 hover:scale-105 transition-all active:scale-95 group">
                    <Plus className="w-4 h-4" /> Registrar Informe
                </Link>
            </div>

            {/* Tactical Navigation */}
            <div className="flex flex-wrap gap-8 border-b border-[#252b46]/50 pb-6">
                {(['Todos', 'Borradores', 'Publicados', 'Exclusivos'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[10px] font-bold uppercase tracking-[3px] transition-all relative pb-4 px-1 ${activeTab === tab
                            ? 'text-[#bef264]'
                            : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#bef264] shadow-[0_0_10px_#bef264]"></div>}
                    </button>
                ))}
            </div>

            {/* Reports Feed */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Recuperando Archivos...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-6 glass border border-white/5 rounded-[32px]">
                        <FileText className="w-12 h-12 text-slate-800" />
                        <div className="text-center space-y-2">
                            <h3 className="text-white font-bold text-lg uppercase tracking-tight">Sin registros en "{activeTab}"</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Inicia tu primera investigación para poblar el archivo.</p>
                        </div>
                    </div>
                ) : (
                    reports.map((report) => {
                        const config = CATEGORY_CONFIG[report.category] || { label: 'GENERAL', color: '#64748b' };
                        return (
                            <div key={report.id} className="group relative glass border border-[#252b46] rounded-[32px] p-8 hover:border-blue-500/30 transition-all duration-500 flex flex-col md:flex-row md:items-center gap-8 bg-gradient-to-br from-white/[0.01] to-transparent">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-600/20 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="w-16 h-16 bg-[#0a0f1e] border border-[#252b46] rounded-2xl flex items-center justify-center group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all relative z-10 rotate-3 group-hover:rotate-0">
                                        <FileText className="w-7 h-7 text-blue-500 group-hover:text-blue-400" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors tracking-tight">
                                            {report.title}
                                        </h3>
                                        {report.is_exclusive && (
                                            <div className="flex items-center gap-2 bg-[#bef264]/10 text-[#bef264] px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-[2px] border border-[#bef264]/20 w-fit">
                                                <Zap size={10} /> ACCESO ELITE
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={12} className="text-blue-500" />
                                            <span style={{ color: config.color }}>{config.label}</span>
                                        </div>
                                        <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                        <div className="flex items-center gap-2">
                                            <Shield size={12} />
                                            <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                        <div className="flex items-center gap-2 font-black italic text-blue-400">
                                            <ArrowUpRight size={12} />
                                            <span>#{report.id.slice(0, 4)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-6 md:pt-0 border-t border-[#252b46]/50 md:border-t-0">
                                    <button className="p-4 rounded-2xl bg-slate-900/50 border border-[#252b46] text-slate-500 hover:text-white hover:border-slate-600 transition-all">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <Link
                                        href={`/dashboard/feed/${report.id}`}
                                        className="flex-1 md:flex-none px-8 py-4 bg-[#162d9c]/10 text-blue-400 border border-blue-600/20 rounded-2xl font-bold text-[10px] uppercase tracking-[3px] hover:bg-[#162d9c] hover:text-white transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        GESTIONAR <ArrowUpRight size={14} />
                                    </Link>
                                    <button className="p-4 rounded-2xl bg-slate-900/50 border border-[#252b46] text-slate-500 hover:text-white transition-all">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
