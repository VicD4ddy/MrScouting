'use client';

import { createClient } from '@/lib/supabase/client';
import { User, Mail, Shield, Globe, Camera, Save, ExternalLink, Zap, Award, Activity, FileText } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        <div className="flex items-center justify-center min-vh-[60vh]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="text-blue-500 w-6 h-6 animate-pulse" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl space-y-12 pb-20">
            {/* Page Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-blue-500">
                    Configuración de Perfil
                </h1>
                <p className="text-slate-500 text-xs font-medium">
                    Identidad Digital y Parámetros del Sistema
                </p>
            </div>

            {/* Profile Header Card */}
            <div className="relative group">
                <div className="h-64 bg-[#162d9c] rounded-[48px] overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 tactical-pattern opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] to-transparent"></div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-[#bef264]/10 rounded-full blur-[60px]"></div>
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px]"></div>
                </div>

                <div className="absolute -bottom-6 left-12 flex items-end gap-8">
                    <div className="relative group/avatar">
                        <div className="w-32 h-32 bg-slate-950 border-[6px] border-[#0a0f1e] rounded-[40px] flex items-center justify-center text-4xl shadow-2xl relative overflow-hidden transition-transform group-hover/avatar:scale-105 duration-500">
                            <div className="absolute inset-0 bg-blue-600/5 group-hover/avatar:bg-blue-600/10 transition-colors"></div>
                            <User className="text-slate-700 relative z-10" size={56} />
                        </div>
                        <button className="absolute bottom-2 right-2 bg-[#bef264] text-[#0a0f1e] p-2.5 rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-[#0a0f1e] group-hover/avatar:rotate-12">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="pb-8 space-y-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                {user?.email?.split('@')[0] || 'Agente'}
                            </h2>
                            <div className="bg-[#bef264] text-[#0a0f1e] px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">VERIFICADO</div>
                        </div>
                        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-[4px]">
                            <Award size={12} /> Analista Senior de Scouting
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Settings Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass border border-[#252b46] rounded-[40px] p-10 space-y-8 bg-gradient-to-br from-white/[0.02] to-transparent">
                        <h3 className="text-sm font-bold uppercase tracking-[3px] flex items-center gap-4 text-white">
                            <div className="p-2 bg-blue-600/10 rounded-lg"><User className="w-4 h-4 text-blue-500" /></div>
                            Datos de Perfil
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nombre Operativo</label>
                                <input
                                    type="text"
                                    placeholder="Victor Reyes"
                                    className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-800 shadow-inner"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Enlace de Comunicación</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="w-full bg-[#0a0f1e]/40 border border-[#252b46] rounded-2xl px-6 py-4 text-sm text-slate-600 cursor-not-allowed italic"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Manifiesto Táctico</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe tu metodología de análisis..."
                                    className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none text-white placeholder:text-slate-800 shadow-inner"
                                ></textarea>
                            </div>
                        </div>

                        <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-xs tracking-widest uppercase transition-all shadow-xl shadow-blue-900/40 active:scale-95">
                            <Save className="w-4 h-4" /> Guardar Cambios
                        </button>
                    </div>

                    <div className="glass border border-[#252b46] rounded-[40px] p-10 space-y-8">
                        <h3 className="text-sm font-bold uppercase tracking-[3px] flex items-center gap-4 text-white">
                            <div className="p-2 bg-blue-600/10 rounded-lg"><Globe className="w-4 h-4 text-blue-500" /></div>
                            Nodos Externos
                        </h3>

                        <div className="space-y-4">
                            {[
                                { label: 'X / TWITTER', platform: '@usuario', icon: 'X' },
                                { label: 'LINKEDIN', platform: 'linkedin.com/in/usuario', icon: 'LI' }
                            ].map((net) => (
                                <div key={net.label} className="flex items-center gap-6 bg-[#0a0f1e] border border-[#252b46] rounded-2xl px-6 py-4 group focus-within:border-blue-500/40 transition-all">
                                    <span className="text-slate-600 font-bold text-[10px] tracking-widest w-20">{net.label}</span>
                                    <input type="text" placeholder={net.platform} className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 p-0 placeholder:text-slate-800 font-bold" />
                                    <ExternalLink className="w-4 h-4 text-slate-800 group-hover:text-blue-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-8">
                    <div className="p-10 rounded-[48px] bg-[#bef264] text-[#0a0f1e] space-y-8 shadow-2xl shadow-[#bef264]/20 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 text-[#0a0f1e]/5 rotate-12 transition-transform group-hover:rotate-0 duration-700">
                            <Shield size={160} />
                        </div>
                        <div className="flex justify-between items-start relative z-10">
                            <Shield className="w-12 h-12" />
                            <div className="bg-[#0a0f1e] text-white px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-[3px]">SISTEMA PRO</div>
                        </div>
                        <div className="space-y-2 relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-[4px] opacity-60">Status de Licencia</p>
                            <h4 className="text-3xl font-bold uppercase italic leading-none tracking-tighter">AGENTE ÉLITE</h4>
                        </div>
                        <ul className="space-y-4 relative z-10">
                            {['Análisis Ilimitados', 'Acceso Base de Datos Pro', 'Pizarra Táctica 4K', 'Soporte Prioritario'].map((feat) => (
                                <li key={feat} className="text-xs font-bold flex items-center gap-3 uppercase tracking-tight">
                                    <div className="w-1.5 h-1.5 bg-[#0a0f1e] rounded-full"></div> {feat}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-5 bg-[#0a0f1e] text-white rounded-[24px] font-bold text-[10px] uppercase tracking-[3px] hover:bg-slate-900 transition-all shadow-xl shadow-black/20 relative z-10 active:scale-95">
                            Optimizar Suscripción
                        </button>
                    </div>

                    <div className="glass border border-[#252b46] rounded-[40px] p-10 space-y-8 bg-gradient-to-b from-blue-900/10 to-transparent">
                        <h4 className="text-[10px] font-bold uppercase tracking-[4px] text-slate-500 pb-4 border-b border-[#252b46]/50">Rendimiento Operativo</h4>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-[#0a0f1e]/60 p-6 rounded-3xl border border-[#252b46] flex items-center justify-between group hover:border-blue-500/30 transition-all">
                                <div>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Informes</p>
                                    <p className="text-3xl font-bold italic tracking-tighter text-white">42</p>
                                </div>
                                <FileText className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                            </div>
                            <div className="bg-[#0a0f1e]/60 p-6 rounded-3xl border border-[#252b46] flex items-center justify-between group hover:border-[#bef264]/30 transition-all">
                                <div>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Impacto</p>
                                    <p className="text-3xl font-bold italic tracking-tighter text-white">18.4K</p>
                                </div>
                                <Activity className="text-[#bef264] group-hover:scale-110 transition-transform" size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
