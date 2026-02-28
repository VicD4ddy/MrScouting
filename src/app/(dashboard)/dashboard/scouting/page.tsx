'use client';

import { useState, useEffect } from 'react';
import { RadarChart as Radar } from "@/components/charts/RadarChart";
import { Search, TrendingUp, Target, ChevronRight, MapPin, FileText, Loader2, Zap } from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ScoutingPage() {
    const [players, setPlayers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTag, setActiveTag] = useState('Todos');
    const supabase = createClient();

    useEffect(() => {
        const fetchPlayers = async () => {
            setIsLoading(true);
            let query = supabase
                .from('players')
                .select('*')
                .order('created_at', { ascending: false });

            // Apply category filter if not 'Todos'
            if (activeTag === 'U21 Promesas') {
                query = query.lte('age', 21);
            } else if (activeTag !== 'Todos') {
                query = query.ilike('team', `%${activeTag}%`);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching players:", error);
            } else if (data) {
                // Client-side search for name/club/id
                const filtered = data.filter((p: any) =>
                    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.id.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setPlayers(filtered);
            }
            setIsLoading(false);
        };
        fetchPlayers();
    }, [searchTerm, activeTag]);

    const resetFilters = () => {
        setSearchTerm('');
        setActiveTag('Todos');
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-blue-500">
                        Base de Datos Scouting
                    </h1>
                    <p className="text-slate-500 text-xs font-medium">
                        Normalización de Datos & Análisis Predictivo
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group/search flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover/search:text-[#bef264] transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, club o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium text-white placeholder:text-slate-800 shadow-inner"
                        />
                    </div>
                </div>
            </div>

            {/* Tactical Pills */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar border-b border-[#252b46]/50">
                {['Todos', 'U21 Promesas', 'La Liga', 'Premier League', 'Serie A', 'Ligue 1'].map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${activeTag === tag
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                            : 'bg-[#0a0f1e] border-[#252b46] text-slate-500 hover:border-slate-600'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Loading State or Players Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Cargando Base de Datos...</p>
                </div>
            ) : players.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 glass border border-[#252b46] rounded-[40px] text-center space-y-6 bg-gradient-to-b from-white/[0.02] to-transparent">
                    <div className="w-20 h-20 bg-slate-900/50 rounded-3xl flex items-center justify-center border border-white/5">
                        <Target className="w-10 h-10 text-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Sin registros encontrados</h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] max-w-xs mx-auto">
                            Ajusta los parámetros de búsqueda o limpia los filtros para reintentar.
                        </p>
                    </div>
                    <button
                        onClick={resetFilters}
                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#bef264] hover:bg-[#bef264] hover:text-[#0a0f1e] transition-all"
                    >
                        Limpiar Todos los Filtros
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {players.map((player, index) => {
                        const dynamicStats = [
                            { attribute: 'Ritmo', value: Math.min(99, (player.overall_rating || 80) + 4) },
                            { attribute: 'Tiro', value: Math.max(50, (player.overall_rating || 80) - 5) },
                            { attribute: 'Pase', value: Math.min(99, (player.overall_rating || 80) + 2) },
                            { attribute: 'Regate', value: Math.min(99, (player.potential_rating || 85) - 2) },
                            { attribute: 'Físico', value: Math.max(50, (player.overall_rating || 80) - 8) },
                        ];

                        return (
                            <Link href={`/dashboard/scouting/${player.id}`} key={player.id} className="group relative glass border border-[#252b46] rounded-[40px] overflow-hidden hover:border-blue-500/30 transition-all duration-500 flex flex-col bg-gradient-to-br from-white/[0.02] to-transparent">
                                <div className="absolute top-6 right-6 z-10">
                                    <div className="bg-[#bef264]/10 text-[#bef264] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[2px] border border-[#bef264]/20 backdrop-blur-md">
                                        RANK #{String(index + 1).padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Player Header */}
                                <div className="p-8 pb-4 space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors tracking-tight">
                                            {player.name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                            <span className="text-blue-500">{player.position || 'Desconocido'}</span>
                                            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                            <span>{player.age || '--'} años</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MapPin size={12} className="text-slate-700" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{player.nationality || 'Internacional'}</span>
                                    </div>
                                </div>

                                <div className="px-8 py-2 flex-1">
                                    <div className="bg-[#0a0f1e]/60 rounded-[32px] p-4 relative group-hover:bg-[#0a0f1e]/80 transition-colors">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/15"></div>
                                        <Radar data={dynamicStats} />
                                    </div>
                                </div>

                                <div className="p-8 pt-6 space-y-6">
                                    <div className="flex items-center justify-between border-t border-[#252b46] pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-[#252b46] flex items-center justify-center">
                                                <TrendingUp size={14} className="text-blue-500" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{player.team || 'Agente Libre'}</span>
                                        </div>
                                        <ChevronRight className="text-slate-700 group-hover:text-blue-500 transition-colors" size={20} />
                                    </div>

                                    <div className="w-full py-5 bg-[#162d9c]/10 text-blue-400 border border-blue-600/20 font-bold rounded-2xl text-[10px] uppercase tracking-[3px] transition-all flex items-center justify-center gap-3">
                                        <FileText size={14} className="text-blue-400" /> Ver Perfil Élite
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Support / Elite Banner */}
            <div className="relative overflow-hidden glass border border-[#252b46] p-10 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#bef264]"></div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#bef264]">
                        <Zap size={20} />
                        <h3 className="text-sm font-bold uppercase tracking-[4px]">Servicio de Scouting Bajo Demanda</h3>
                    </div>
                    <p className="text-slate-400 max-w-lg text-xs leading-relaxed font-medium">
                        ¿Requieres un análisis profundo de un mercado o jugador específico? Envía una solicitud de informe a nuestra red de analistas Pro.
                    </p>
                </div>
                <button className="whitespace-nowrap bg-[#bef264] text-[#0a0f1e] px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-[3px] shadow-2xl shadow-[#bef264]/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                    <Target size={16} /> Encargar Scouting
                </button>
            </div>
        </div>
    );
}
