'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

const ROUTE_TITLES: Record<string, string> = {
    '/dashboard': 'Home',
    '/dashboard/scouting': 'Scouting',
    '/dashboard/reports': 'Reports',
    '/dashboard/tactics': 'Tactics',
    '/dashboard/profile': 'Profile',
    '/dashboard/create': 'New Analysis',
    '/dashboard/admin': 'Admin',
};

function getTitle(pathname: string): string {
    // Exact match first
    if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
    // Match dynamic segments like /dashboard/scouting/[id]
    if (pathname.startsWith('/dashboard/scouting/')) return 'Player Profile';
    if (pathname.startsWith('/dashboard/feed/')) return 'Intelligence';
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
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/30">
                        <TrendingUp size={14} className="text-[#bef264]" />
                    </div>
                    <span className="text-xs font-black tracking-tight text-white uppercase">
                        MR.<span className="text-blue-400">S</span>
                    </span>
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
