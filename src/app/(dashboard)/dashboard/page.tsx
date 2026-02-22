import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TrendingUp, Users, Star, Activity, PlusSquare, ArrowUpRight } from "lucide-react";
import Link from 'next/link';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="relative group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-blue-500">
                        Centro de Mando
                    </h1>
                    <div className="flex items-center gap-3">
                        <p className="text-slate-500 text-xs font-medium">
                            Bienvenido de nuevo, <span className="text-white">{user.email?.split('@')[0]}</span>
                        </p>
                        <div className="h-3 w-[1px] bg-slate-800"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#bef264]">Cuenta Pro</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass border border-[#252b46] p-8 rounded-3xl space-y-4 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="absolute -right-4 -top-4 text-blue-500/10 pointer-events-none group-hover:scale-110 transition-transform">
                        <TrendingUp size={120} />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tus Análisis</p>
                        <Activity size={14} className="text-blue-500" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-5xl font-bold italic tracking-tighter">04</p>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">+12%</span>
                    </div>
                </div>

                <div className="glass border border-[#252b46] p-8 rounded-3xl space-y-4 relative overflow-hidden group hover:border-[#bef264]/30 transition-all">
                    <div className="absolute -right-4 -top-4 text-[#bef264]/5 pointer-events-none group-hover:scale-110 transition-transform">
                        <Star size={120} />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Valoración Media</p>
                        <Star size={14} className="text-[#bef264]" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-5xl font-bold italic tracking-tighter">4.8</p>
                        <span className="text-[10px] font-bold text-slate-500">SCORE</span>
                    </div>
                </div>

                <div className="glass border border-[#252b46] p-8 rounded-3xl space-y-4 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="absolute -right-4 -top-4 text-blue-500/10 pointer-events-none group-hover:scale-110 transition-transform">
                        <Users size={120} />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alcance Total</p>
                        <Users size={14} className="text-blue-500" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-5xl font-bold italic tracking-tighter text-nowrap">2.4K</p>
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">VISTAS</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass border border-[#252b46] rounded-[32px] overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-[#252b46] flex justify-between items-center bg-white/5">
                        <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                            <Activity size={16} className="text-blue-500" /> Actividad del Sistema
                        </h2>
                        <button className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-1 transition-all">
                            Registro Completo <ArrowUpRight size={12} />
                        </button>
                    </div>
                    <div className="flex-1 p-20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-600/20 blur-[40px] rounded-full group-hover:bg-blue-600/30 transition-all"></div>
                            <div className="w-20 h-20 bg-slate-900 border border-[#252b46] rounded-2xl flex items-center justify-center relative z-10">
                                <PlusSquare size={32} className="text-slate-700" />
                            </div>
                        </div>
                        <div className="space-y-2 max-w-xs">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No hay informes</p>
                            <p className="text-slate-500 text-xs leading-relaxed">Inicia tu carrera publicando tu primer informe técnico.</p>
                        </div>
                        <Link href="/dashboard/create" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 active:scale-95">
                            + Registrar Análisis
                        </Link>
                    </div>
                </div>

                <div className="glass border border-[#252b46] rounded-[32px] p-8 space-y-6 bg-gradient-to-b from-blue-900/10 to-transparent">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-[#252b46] pb-4">
                        Consejos de Inteligencia
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-[#bef264] uppercase tracking-widest">Scouting de Élite</p>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Usa la pizarra táctica para exportar clips en 4K y adjuntarlos a tus informes.</p>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-[#252b46]/50">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Paywall Estratégico</p>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Los informes exclusivos atraen un 30% más de suscriptores.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
