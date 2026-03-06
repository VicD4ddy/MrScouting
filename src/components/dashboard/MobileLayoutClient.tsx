'use client';

import { usePathname } from 'next/navigation';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { MobileNav } from '@/components/dashboard/MobileNav';
import { MobileSwipeWrapper } from '@/components/dashboard/MobileSwipeWrapper';

// Routes that should render as full-screen (no header/nav/swipe chrome)
const FULLSCREEN_ROUTES = /^\/dashboard\/messages\/[^/]+$/;

interface MobileLayoutClientProps {
    children: React.ReactNode;
    userEmail?: string;
    isAdmin: boolean;
}

export function MobileLayoutClient({ children, userEmail, isAdmin }: MobileLayoutClientProps) {
    const pathname = usePathname();
    const isFullscreen = FULLSCREEN_ROUTES.test(pathname);

    if (isFullscreen) {
        // Chat thread: full-screen, no header/nav/swipe chrome
        return (
            <div className="flex flex-col h-dvh">
                {children}
            </div>
        );
    }

    // Normal layout: header + swipeable main content + bottom nav
    return (
        <>
            <MobileHeader userEmail={userEmail} />
            <main className="flex-1 relative z-10 px-4 py-5 pb-28 overflow-x-hidden">
                <MobileSwipeWrapper>
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </MobileSwipeWrapper>
            </main>
            <MobileNav isAdmin={isAdmin} />
        </>
    );
}
