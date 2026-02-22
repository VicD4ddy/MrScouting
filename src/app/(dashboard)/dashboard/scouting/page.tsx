'use client';

import { RadarChart as Radar } from "@/components/charts/RadarChart";
import { Search, Filter, TrendingUp, Shield, Users, Target, ChevronRight, MapPin, FileText } from "lucide-react";

const mockPlayers = [
    {
        id: '1',
        name: 'Gavi',
        age: 19,
        position: 'MC / MCO',
        team: 'FC Barcelona',
        location: 'Barcelona, ES',
        stats: [
            { attribute: 'Presión', value: 92 },
            { attribute: 'Visión', value: 84 },
            { attribute: 'Pase', value: 88 },
            { attribute: 'Defensa', value: 65 },
            { attribute: 'Físico', value: 78 },
        ]
    },
    {
        id: '2',
        name: 'Florian Wirtz',
        age: 20,
        position: 'MCO',
        team: 'Bayer Leverkusen',
        location: 'Leverkusen, DE',
        stats: [
            { attribute: 'Creatividad', value: 95 },
            { attribute: 'Visión', value: 93 },
            { attribute: 'Regate', value: 90 },
            { attribute: 'Finalización', value: 82 },
            { attribute: 'Ritmo', value: 80 },
        ]
    },
    {
        id: '3',
        name: 'Alejandro Balde',
        age: 20,
        position: 'LI',
        team: 'FC Barcelona',
        location: 'Barcelona, ES',
        stats: [
            { attribute: 'Ritmo', value: 94 },
            { attribute: 'Regate', value: 85 },
            { attribute: 'Centros', value: 78 },
            { attribute: 'Defensa', value: 72 },
            { attribute: 'Físico', value: 70 },
        ]
    }
];

export default function ScoutingPage() {
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
                            className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium text-white placeholder:text-slate-800 shadow-inner"
                        />
                    </div>
                    <button className="p-4 bg-slate-900 border border-[#252b46] rounded-2xl text-slate-400 hover:text-[#bef264] hover:bg-[#bef264]/5 transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tactical Pills */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar border-b border-[#252b46]/50">
                {['Todos', 'U21 Promesas', 'La Liga', 'Premier League', 'Serie A', 'Ligue 1'].map((tag, i) => (
                    <button
                        key={tag}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${i === 0
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                            : 'bg-[#0a0f1e] border-[#252b46] text-slate-500 hover:border-slate-600'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {mockPlayers.map((player) => (
                    <div key={player.id} className="group relative glass border border-[#252b46] rounded-[40px] overflow-hidden hover:border-blue-500/30 transition-all duration-500 flex flex-col bg-gradient-to-br from-white/[0.02] to-transparent">
                        <div className="absolute top-6 right-6 z-10">
                            <div className="bg-[#bef264]/10 text-[#bef264] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[2px] border border-[#bef264]/20 backdrop-blur-md">
                                RANK #0{player.id}
                            </div>
                        </div>

                        {/* Player Header */}
                        <div className="p-8 pb-4 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors tracking-tight">
                                    {player.name}
                                </h3>
                                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                    <span className="text-blue-500">{player.position}</span>
                                    <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                    <span>{player.age} años</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500">
                                <MapPin size={12} className="text-slate-700" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{player.location}</span>
                            </div>
                        </div>

                        {/* Visualization */}
                        <div className="px-8 py-2 flex-1">
                            <div className="bg-[#0a0f1e]/60 rounded-[32px] p-4 relative group-hover:bg-[#0a0f1e]/80 transition-colors">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/15"></div>
                                <Radar data={player.stats} />
                            </div>
                        </div>

                        {/* Footer Card */}
                        <div className="p-8 pt-6 space-y-6">
                            <div className="flex items-center justify-between border-t border-[#252b46] pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-[#252b46] flex items-center justify-center">
                                        <TrendingUp size={14} className="text-blue-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{player.team}</span>
                                </div>
                                <ChevronRight className="text-slate-700 group-hover:text-blue-500 transition-colors" size={20} />
                            </div>

                            <button className="w-full py-5 bg-[#162d9c] hover:bg-blue-800 text-white font-bold rounded-2xl text-[10px] uppercase tracking-[3px] transition-all shadow-xl shadow-blue-900/30 active:scale-[0.98] flex items-center justify-center gap-3">
                                <FileText size={14} className="text-[#bef264]" /> Abrir Informe Técnico
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Support / Elite Banner */}
            <div className="relative overflow-hidden glass border border-[#252b46] p-10 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#bef264]"></div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#bef264]">
                        <Users size={20} />
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
