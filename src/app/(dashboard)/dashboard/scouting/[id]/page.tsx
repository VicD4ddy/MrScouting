'use client';

import { useState } from 'react';
import { RadarChart as Radar } from '@/components/charts/RadarChart';
import { ArrowLeft, Star, TrendingUp, Shield, Zap, MessageCircle, ThumbsUp, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// --- Mock player data (replace with Supabase fetch by id) ---
const PLAYER_DATA: Record<string, any> = {
    '1': {
        name: 'João Neves',
        age: 19,
        position: 'Mediocampista',
        club: 'SL Benfica',
        ovr: 88,
        trend: '+4.2%',
        trendLabel: 'puntuación de temporada',
        badge: 'TALENTO ÉLITE',
        value: 'Valor: €55M',
        badgeColor: '#ef4444',
        stats: [
            { attribute: 'Pase', value: 88 },
            { attribute: 'Visión', value: 82 },
            { attribute: 'Esfuerzo', value: 91 },
            { attribute: 'Entrada', value: 74 },
            { attribute: 'Resistencia', value: 79 },
            { attribute: 'Intercepciones', value: 85 },
        ],
        strengths: [
            { title: 'Elite Press Resistance', desc: 'Highly composed under pressure. Neves excels at receiving the ball in tight spaces and finding progressive outlets through his short passing game.' },
            { title: 'Exceptional Work Rate', desc: 'Possesses an engine that allows him to cover massive ground. Equally effective in the build-up phase and during defensive transitions.' },
        ],
        weaknesses: [
            { title: 'Aerial Duels', desc: 'At 1.72m, Neves can be physically dominated in aerial situations, particularly on set pieces and long-ball scenarios.' },
            { title: 'Long-Range Shooting', desc: 'While technically sound, he rarely attempts shots from outside the area, limiting his direct goal threat.' },
        ],
        tactical: [
            { title: 'Best Role: Box-to-Box Midfielder', desc: 'His combination of pressing intensity and positional discipline makes him an ideal central player in a 4-3-3 or 4-2-3-1 shape.' },
            { title: 'Pressing Trigger: Ball to Feet', desc: 'Neves initiates his press when the ball is played into a central defender with no immediate outlet. High success rate in winning possession in the final third.' },
        ],
        ratings: [
            {
                id: '1',
                author: 'FootyManager88',
                avatar: 'F',
                ago: '2h ago',
                rating: 5,
                text: 'Perfect fit for a possession-based side like Manchester City. His defensive numbers are surprisingly high for his size.',
                likes: 142,
                replies: [
                    { id: 'r1', author: 'LuisTactics', avatar: 'L', ago: '11h ago', text: "Agreed. The only concern is how he'd handle the physical nature of the PL. But Verratti proved that's not always an issue.", likes: 24 },
                ]
            },
        ],
        aggregateRating: 4.7,
    },
};

// Default fallback for any player id not in mock
const DEFAULT_PLAYER = {
    name: 'Jugador Desconocido',
    age: 0,
    position: 'N/A',
    club: 'N/A',
    ovr: 70,
    trend: '+0%',
    trendLabel: 'season score',
    badge: 'PROSPECT',
    value: 'Valor: €0M',
    badgeColor: '#3b82f6',
    stats: [
        { attribute: 'Passing', value: 70 },
        { attribute: 'Vision', value: 70 },
        { attribute: 'Work Rate', value: 70 },
        { attribute: 'Tackling', value: 70 },
        { attribute: 'Resistance', value: 70 },
        { attribute: 'Interceptions', value: 70 },
    ],
    strengths: [],
    weaknesses: [],
    tactical: [],
    ratings: [],
    aggregateRating: 0,
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}
                />
            ))}
        </div>
    );
}

const TABS = ['Fortalezas', 'Debilidades', 'Contexto Táctico'] as const;
type Tab = typeof TABS[number];

export default function PlayerDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const player = PLAYER_DATA[id] ?? DEFAULT_PLAYER;
    const [activeTab, setActiveTab] = useState<Tab>('Fortalezas');
    const [comment, setComment] = useState('');

    const tabContent = activeTab === 'Fortalezas' ? player.strengths
        : activeTab === 'Debilidades' ? player.weaknesses
            : player.tactical;

    return (
        <div className="max-w-xl mx-auto space-y-0 pb-28">
            {/* Back */}
            <div className="pb-4">
                <Link href="/dashboard/scouting" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                    <ArrowLeft size={14} /> Scouting
                </Link>
            </div>

            {/* Player Header */}
            <div className="glass border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                        {player.name[0]}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl font-bold text-white tracking-tight">{player.name}</h1>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest" style={{ backgroundColor: `${player.badgeColor}20`, color: player.badgeColor, border: `1px solid ${player.badgeColor}40` }}>
                                {player.badge}
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5">{player.age} · {player.position} · {player.club}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="bg-[#bef264]/10 border border-[#bef264]/20 text-[#bef264] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest">
                                <Zap size={8} className="inline mr-1" />{player.value}
                            </div>
                        </div>
                    </div>
                </div>

                {/* OVR + Radar */}
                <div className="flex items-start gap-6">
                    <div className="text-center">
                        <div className="text-5xl font-black text-white tracking-tight leading-none">{player.ovr}</div>
                        <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-1">OVR</div>
                        <div className="flex items-center gap-1 mt-2 justify-center">
                            <TrendingUp size={10} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-400">{player.trend}</span>
                        </div>
                        <div className="text-[8px] text-slate-600 uppercase tracking-wider">{player.trendLabel}</div>
                    </div>
                    <div className="flex-1">
                        <Radar data={player.stats} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="pt-4">
                <div className="flex border-b border-white/10">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === tab
                                ? 'text-white border-b-2 border-blue-500 -mb-[1px]'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="py-4 space-y-4">
                    {tabContent.length > 0 ? tabContent.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Shield size={14} className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">{item.title}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed mt-1">{item.desc}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-slate-600 text-xs text-center py-4">Sin datos disponibles</p>
                    )}
                </div>
            </div>

            {/* Scout Ratings */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-white text-sm uppercase tracking-widest">Scout Ratings</h2>
                    <div className="flex items-center gap-2">
                        <StarRating rating={player.aggregateRating} />
                        <span className="text-white font-black text-lg">{player.aggregateRating.toFixed(1)}</span>
                    </div>
                </div>

                {player.ratings.map((r: any) => (
                    <div key={r.id} className="glass border border-white/5 rounded-2xl p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {r.avatar}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-xs font-bold">{r.author}</span>
                                        <span className="text-slate-600 text-[10px]">{r.ago}</span>
                                    </div>
                                    <StarRating rating={r.rating} size={10} />
                                </div>
                                <p className="text-slate-300 text-xs leading-relaxed mt-1">{r.text}</p>
                                <button className="flex items-center gap-1.5 mt-2 text-slate-500 hover:text-blue-400 transition-colors text-[10px] font-bold">
                                    <ThumbsUp size={10} /> {r.likes}
                                </button>
                            </div>
                        </div>

                        {/* Replies */}
                        {r.replies?.map((reply: any) => (
                            <div key={reply.id} className="flex items-start gap-3 pl-4 border-l border-white/10">
                                <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                                    {reply.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-xs font-bold">{reply.author}</span>
                                        <span className="text-slate-600 text-[10px]">{reply.ago}</span>
                                    </div>
                                    <p className="text-slate-400 text-xs leading-relaxed mt-0.5">{reply.text}</p>
                                    <button className="flex items-center gap-1.5 mt-1.5 text-slate-500 hover:text-blue-400 transition-colors text-[10px] font-bold">
                                        <ThumbsUp size={9} /> {reply.likes}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {/* Write review */}
                <div className="glass border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                    <MessageCircle size={14} className="text-slate-500 flex-shrink-0" />
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Escribe una reseña de scout..."
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-700 focus:outline-none"
                    />
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
