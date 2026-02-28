'use client';

import { useState } from 'react';
import { RadarChart as Radar } from '@/components/charts/RadarChart';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Layout, FileText, Target, Users, Zap, Shield, HelpCircle, Save, TrendingUp, Info, ChevronRight, Share2 } from "lucide-react";

export default function CreateContentPage() {
    const [category, setCategory] = useState('articulo');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isExclusive, setIsExclusive] = useState(false);

    // Player Metadata
    const [playerName, setPlayerName] = useState('');
    const [age, setAge] = useState(20);
    const [position, setPosition] = useState('');
    const [team, setTeam] = useState('');

    // Radar Stats
    const [stats, setStats] = useState({
        Pase: 50,
        Tiro: 50,
        Defensa: 50,
        Ritmo: 50,
        Fisico: 50,
        Regate: 50,
    });

    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleStatChange = (stat: string, value: number) => {
        setStats(prev => ({ ...prev, [stat]: value }));
    };

    const radarData = Object.entries(stats).map(([attribute, value]) => ({
        attribute,
        value,
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Insert Post
        const { data: post, error: postError } = await supabase
            .from('posts')
            .insert({
                author_id: user.id,
                title,
                content,
                category,
                is_exclusive: isExclusive,
            })
            .select()
            .single();

        if (postError) {
            alert(postError.message);
            setLoading(false);
            return;
        }

        // 2. Insert Player Metadata if applicable
        if (category === 'analisis_jugador' || category === 'promesas') {
            const { error: metaError } = await supabase
                .from('player_metadata')
                .insert({
                    post_id: post.id,
                    player_name: playerName,
                    age,
                    position,
                    current_team: team,
                    radar_data: stats,
                });

            if (metaError) {
                alert(metaError.message);
            }
        }

        router.push('/dashboard');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-blue-500">
                        Centro de Creación
                    </h1>
                    <p className="text-slate-500 text-xs font-medium">
                        Generación de Inteligencia Táctica
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-[#0a0f1e]/80 border border-[#252b46]/50 px-5 py-3 rounded-2xl backdrop-blur-xl group/status">
                        <div className="w-2.5 h-2.5 bg-[#bef264] rounded-full animate-pulse shadow-[0_0_15px_#bef264]"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[3px] text-slate-300 group-hover/status:text-[#bef264] transition-colors">Sistema de Datos Sincronizado</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Editor Console */}
                <div className="xl:col-span-7 space-y-10">
                    <div className="glass border border-[#252b46] rounded-[48px] p-10 space-y-10 relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <Zap size={300} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-3 ml-1">
                                    <Layout size={14} className="text-blue-500" /> Clasificación de Datos
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['articulo', 'analisis_tactico', 'analisis_jugador', 'promesas'].map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setCategory(cat)}
                                            className={`px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border text-left flex items-center justify-between ${category === cat
                                                ? 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-900/30'
                                                : 'bg-[#0a0f1e] border-[#252b46] text-slate-500 hover:border-slate-600'
                                                }`}
                                        >
                                            {cat.replace('_', ' ')}
                                            {category === cat && <ChevronRight size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-3 ml-1">
                                    <Shield size={14} className="text-[#bef264]" /> Privacidad de Nodo
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsExclusive(!isExclusive)}
                                    className={`w-full px-6 py-5 h-[148px] rounded-[32px] border flex flex-col justify-between items-start transition-all duration-500 text-left relative overflow-hidden group/opt ${isExclusive
                                        ? 'bg-[#bef264] border-[#bef264] text-[#0a0f1e]'
                                        : 'bg-[#0a0f1e] border-[#252b46] text-slate-500 hover:border-slate-600'
                                        }`}
                                >
                                    <div className={`p-2.5 rounded-xl border ${isExclusive ? 'bg-black/10 border-black/20' : 'bg-slate-900 border-slate-800'}`}>
                                        <Zap size={16} className={isExclusive ? 'text-black' : 'text-[#bef264]'} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest block">Acceso Restringido</span>
                                        <p className="text-[9px] font-bold uppercase opacity-60">Solo analistas acreditados</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Descriptivo de Cabecera</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-2xl px-8 py-6 focus:outline-none focus:border-blue-500/50 transition-all text-xl font-bold tracking-tight text-white placeholder:text-slate-900 shadow-inner"
                                placeholder="Escribe el título del informe..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {(category === 'analisis_jugador' || category === 'promesas') && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0a0f1e]/60 p-8 rounded-[32px] border border-[#252b46]/50 shadow-inner">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Activo Digital (Jugador)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#bef264]/40 font-bold placeholder:text-slate-800"
                                        placeholder="Ej: Marc-André ter Stegen"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Sector Operativo (Posición)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#bef264]/40 font-bold placeholder:text-slate-800"
                                        placeholder="Ej: Portero / Líbero"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex justify-between items-center ml-1">
                                <span>Cuerpo de Inteligencia</span>
                                <HelpCircle size={14} className="text-slate-700" />
                            </label>
                            <textarea
                                required
                                rows={10}
                                className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-[32px] px-8 py-8 focus:outline-none focus:border-blue-500/40 resize-none text-slate-400 leading-relaxed font-medium text-sm placeholder:text-slate-900 shadow-inner"
                                placeholder="Desarrolle el análisis técnico, variables predictivas y proyecciones de mercado..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all shadow-2xl shadow-blue-900/40 disabled:opacity-50 flex items-center justify-center gap-4 active:scale-[0.98] group"
                        >
                            {loading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} className="group-hover:rotate-12 transition-transform" />}
                            <span className="tracking-widest uppercase text-xs">Publicar Informe Técnico</span>
                        </button>
                    </div>
                </div>

                {/* Metrics Sidebar */}
                <div className="xl:col-span-5 space-y-8">
                    {(category === 'analisis_jugador' || category === 'promesas') ? (
                        <div className="glass border border-[#252b46] p-10 rounded-[48px] space-y-12 shadow-2xl sticky top-8 bg-gradient-to-b from-blue-900/5 to-transparent overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-[#bef264] to-blue-500"></div>

                            <div className="space-y-2 text-center relative z-10">
                                <h3 className="text-sm font-bold text-white uppercase tracking-[4px]">
                                    Modelado de Rendimiento
                                </h3>
                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Normalización en Tiempo Real</p>
                            </div>

                            <div className="relative group/radar">
                                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[80px] group-hover/radar:bg-blue-500/20 transition-colors"></div>
                                <div className="relative z-10 bg-[#0a0f1e]/40 rounded-[40px] p-6 backdrop-blur-sm border border-[#252b46]/50">
                                    <Radar data={radarData} />
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 relative z-10">
                                {Object.entries(stats).map(([stat, value]) => (
                                    <div key={stat} className="space-y-3 group/stat">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-slate-400 group-hover/stat:text-white transition-colors">{stat}</span>
                                            <span className="text-[#bef264] bg-[#bef264]/10 px-3 py-1 rounded-lg border border-[#bef264]/20 shadow-[0_0_10px_rgba(190,242,100,0.1)]">{value}</span>
                                        </div>
                                        <div className="relative h-2 w-full bg-[#0a0f1e] rounded-full overflow-hidden border border-[#252b46] shadow-inner">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700 ease-out"
                                                style={{ width: `${value}%` }}
                                            ></div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                value={value}
                                                onChange={(e) => handleStatChange(stat, parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="glass border border-dashed border-[#252b46] p-12 rounded-[48px] flex flex-col items-center justify-center text-center space-y-6 bg-gradient-to-br from-[#0a0f1e] to-transparent">
                            <div className="w-20 h-20 bg-[#0a0f1e] border border-[#252b46] rounded-[32px] flex items-center justify-center text-slate-700 shadow-2xl rotate-6">
                                <Target size={32} />
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-[4px] text-slate-300">Editor de Métricas Inactivo</p>
                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed max-w-[240px]">
                                    El nodo de visualización Radar solo es compatible con categorías de <span className="text-blue-500">Análisis Técnico</span>.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="glass border border-[#252b46] rounded-[40px] p-8 space-y-6 bg-blue-900/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="flex items-center gap-4 text-blue-400 relative z-10">
                            <Info size={16} />
                            <h4 className="text-[10px] font-bold uppercase tracking-[4px]">Guía de Optimización</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium relative z-10 italic">
                            Los informes que incluyen <span className="text-white font-bold">Modelado Radar</span> completo presentan un índice de retención de lectores <span className="text-[#bef264] font-bold">+85% superior</span> que los artículos en texto plano.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
