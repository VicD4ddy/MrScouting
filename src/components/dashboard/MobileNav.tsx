'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, FileText, User, ShieldAlert } from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Home', icon: Home, exact: true },
    { href: '/dashboard/scouting', label: 'Scouting', icon: Target, exact: false },
    { href: '/dashboard/reports', label: 'Reports', icon: FileText, exact: false },
    { href: '/dashboard/profile', label: 'Profile', icon: User, exact: false },
];

interface MobileNavProps {
    isAdmin: boolean;
}

export function MobileNav({ isAdmin }: MobileNavProps) {
    const pathname = usePathname();

    const isActive = (href: string, exact: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    const allItems = isAdmin
        ? [...NAV_ITEMS, { href: '/dashboard/admin', label: 'Admin', icon: ShieldAlert, exact: false }]
        : NAV_ITEMS;

    return (
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            {/* Gradient fade to blend with content above */}
            <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-[#0a0f1e] to-transparent pointer-events-none" />
            <div className="bg-[#0a0f1e]/98 backdrop-blur-2xl border-t border-white/[0.06] shadow-[0_-8px_32px_rgba(0,0,0,0.6)]">
                <div className="flex justify-around items-center h-[68px] px-1">
                    {allItems.map(({ href, label, icon: Icon, exact }) => {
                        const active = isActive(href, exact);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative"
                            >
                                {/* Active pill glow */}
                                {active && (
                                    <div className="absolute top-3 w-10 h-10 bg-blue-600/20 rounded-2xl blur-sm" />
                                )}
                                <div className={`relative z-10 p-2 rounded-xl transition-all duration-200 ${active ? 'bg-blue-600/20 text-white' : 'text-slate-600'}`}>
                                    <Icon
                                        className={`w-[18px] h-[18px] transition-all duration-200 ${active ? (label === 'Admin' ? 'text-red-400' : 'text-blue-400') : ''}`}
                                        strokeWidth={active ? 2.5 : 1.8}
                                    />
                                </div>
                                <span className={`text-[8px] font-bold uppercase tracking-wider transition-colors duration-200 ${active ? 'text-blue-400' : 'text-slate-600'}`}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
