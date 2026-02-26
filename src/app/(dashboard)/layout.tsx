import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Home,
    Target,
    FileText,
    Layout,
    User,
    PlusSquare,
    LogOut,
    TrendingUp,
    Zap,
    ShieldAlert
} from "lucide-react";
import { MobileNav } from '@/components/dashboard/MobileNav';
import { MobileHeader } from '@/components/dashboard/MobileHeader';

// Define navigation items for mobile and potentially desktop
const navItems = [
    { href: '/dashboard', label: 'Inicio', icon: Home, exact: true },
    { href: '/dashboard/scouting', label: 'Scouting', icon: Target, exact: false },
    { href: '/dashboard/reports', label: 'Informes', icon: FileText, exact: false },
    { href: '/dashboard/profile', label: 'Perfil', icon: User, exact: false },
];

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const isAdmin = user?.email === process.env.ADMIN_EMAIL;

    return (
        <>
            {/* ── MOBILE LAYOUT ── */}
            <div className="lg:hidden flex flex-col min-h-dvh bg-[#0a0f1e] text-slate-50 relative">
                {/* Global Tactical Background */}
                <div className="fixed inset-0 tactical-pattern opacity-5 pointer-events-none z-0" />

                {/* Mobile Header */}
                <MobileHeader userEmail={user.email ?? undefined} />

                {/* Scrollable content */}
                <main className="flex-1 relative z-10 px-4 py-5 pb-28">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Nav */}
                <MobileNav isAdmin={isAdmin} />
            </div>

            {/* ── DESKTOP LAYOUT ── */}
            <div className="hidden lg:flex h-dvh bg-[#0a0f1e] text-slate-50 relative overflow-hidden">
                {/* Global Tactical Background */}
                <div className="fixed inset-0 tactical-pattern opacity-5 pointer-events-none z-0" />

                {/* Sidebar */}
                <aside className="w-72 border-r border-[#252b46] flex flex-col p-8 space-y-10 bg-[#0a0f1e]/80 backdrop-blur-xl z-20 relative shrink-0">
                    <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
                        <div className="w-10 h-10 bg-[#162d9c] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 rotate-3">
                            <TrendingUp className="text-[#bef264] w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase">
                            MR. <span className="text-blue-500">SCOUTING</span>
                        </span>
                    </Link>

                    <nav className="flex-1 space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-4">Terminal de Mando</p>

                        <Link href="/dashboard" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-slate-400 hover:text-white transition-all group font-bold text-sm tracking-tight border border-transparent hover:border-blue-500/20">
                            <Home size={18} className="group-hover:text-blue-500" /> Inicio
                        </Link>

                        <Link href="/dashboard/scouting" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-slate-400 hover:text-white transition-all group font-bold text-sm tracking-tight border border-transparent hover:border-blue-500/20">
                            <Target size={18} className="group-hover:text-blue-500" /> Scouting Central
                        </Link>

                        <Link href="/dashboard/reports" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-slate-400 hover:text-white transition-all group font-bold text-sm tracking-tight border border-transparent hover:border-blue-500/20">
                            <FileText size={18} className="group-hover:text-blue-500" /> Archivo de Informes
                        </Link>

                        <Link href="/dashboard/tactics" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-slate-400 hover:text-white transition-all group font-bold text-sm tracking-tight border border-transparent hover:border-blue-500/20">
                            <Layout size={18} className="group-hover:text-blue-500" /> Laboratorio Táctico
                        </Link>

                        <hr className="border-[#252b46] my-6" />

                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-4">Agente Elite</p>

                        <Link href="/dashboard/profile" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-[#bef264]/5 text-slate-400 hover:text-[#bef264] transition-all group font-bold text-sm tracking-tight border border-transparent hover:border-[#bef264]/20">
                            <User size={18} className="group-hover:text-[#bef264]" /> Perfil de Analista
                        </Link>

                        <Link href="/dashboard/create" className="mt-8 flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xl shadow-blue-900/30 active:scale-95 group uppercase tracking-widest text-[10px]">
                            <PlusSquare size={16} className="text-[#bef264]" /> Nuevo Análisis
                        </Link>

                        {isAdmin && (
                            <Link href="/dashboard/admin" className="mt-4 flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-red-600/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 font-bold transition-all shadow-xl shadow-red-900/10 active:scale-95 group uppercase tracking-widest text-[10px]">
                                <ShieldAlert size={16} /> Panel Admin
                            </Link>
                        )}
                    </nav>

                    <div className="pt-6 border-t border-[#252b46]">
                        <form action="/auth/signout" method="post">
                            <button className="w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-red-500/5 text-slate-500 hover:text-red-500 transition-all font-bold text-xs uppercase tracking-widest border border-transparent hover:border-red-500/20">
                                <LogOut size={16} /> Cerrar Conexión
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main content column */}
                <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                    {/* Desktop top bar */}
                    <header className="h-16 border-b border-[#252b46] flex items-center justify-between px-10 bg-[#0a0f1e]/50 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">SISTEMA v1.0 • EN LÍNEA</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-[#161b2e] px-3 py-1.5 rounded-lg border border-[#252b46] flex items-center gap-2">
                                <Zap size={10} className="text-[#bef264]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{user.email?.split('@')[0]}</span>
                            </div>
                        </div>
                    </header>

                    {/* Scrollable content */}
                    <main className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar relative">
                        <div className="px-10 py-10">
                            <div className="max-w-7xl mx-auto">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

