'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Zap } from 'lucide-react';

const ROUTE_TITLES: Record<string, string> = {
    '/dashboard': 'Inicio',
    '/dashboard/scouting': 'Scouting Central',
    '/dashboard/reports': 'Informes',
    '/dashboard/tactics': 'Táctica',
    '/dashboard/profile': 'Perfil',
    '/dashboard/create': 'Nuevo Análisis',
    '/dashboard/admin': 'Administración',
};

function getTitle(pathname: string): string {
    // Exact match first
    if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
    // Match dynamic segments like /dashboard/scouting/[id]
    if (pathname.startsWith('/dashboard/scouting/')) return 'Perfil de Jugador';
    if (pathname.startsWith('/dashboard/feed/')) return 'Inteligencia';
    return 'MR. SCOUTING';
}

interface MobileHeaderProps {
    userEmail: string | undefined;
}

export function MobileHeader({ userEmail }: MobileHeaderProps) {
    const pathname = usePathname();
    const title = getTitle(pathname);
    const initials = (userEmail?.split('@')[0] || 'U').slice(0, 2).toUpperCase();

    return (
        <header className="sticky top-0 z-40 lg:hidden">
            <div className="bg-[#0a0f1e]/95 backdrop-blur-2xl border-b border-white/[0.06] px-4 h-14 flex items-center justify-between shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
                {/* Left: Brand mark */}
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-[#162d9c] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30 border border-white/10 group-active:scale-95 transition-transform">
                        <Zap size={16} className="text-[#bef264] fill-[#bef264]" />
                    </div>
                </Link>

                {/* Center: Current page title */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <span className="text-sm font-bold text-white tracking-tight">{title}</span>
                </div>

                {/* Right: User avatar */}
                <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 border-2 border-blue-500/30 flex items-center justify-center shadow-lg">
                    <span className="text-[10px] font-black text-white">{initials}</span>
                </Link>
            </div>
        </header>
    );
}
