'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const STORAGE_KEY = 'messages_last_seen';

function getLastSeen(): string {
    if (typeof window === 'undefined') return new Date(0).toISOString();
    return localStorage.getItem(STORAGE_KEY) || new Date(0).toISOString();
}

/**
 * Returns the count of unread messages received while the user was away.
 * Also provides a `markAllRead()` function to reset the counter (call on Messages page mount).
 */
export function useUnreadMessages() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const markAllRead = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
        setUnreadCount(0);
    }, []);

    useEffect(() => {
        const supabase = createClient();

        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setCurrentUserId(user.id);

            // Step 1: Get conversations the user is in
            const { data: participations } = await supabase
                .from('conversation_participants')
                .select('conversation_id')
                .eq('user_id', user.id);

            if (!participations || participations.length === 0) return;
            const convoIds = participations.map((p: any) => p.conversation_id);

            // Step 2: Count messages from OTHERS received after last_seen
            const lastSeen = getLastSeen();
            const { count } = await supabase
                .from('messages')
                .select('id', { count: 'exact', head: true })
                .in('conversation_id', convoIds)
                .neq('sender_id', user.id)
                .gt('created_at', lastSeen);

            setUnreadCount(count || 0);

            // Step 3: Subscribe to new incoming messages
            const channel = supabase
                .channel('unread-messages-badge')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'messages',
                    },
                    (payload: { new: any }) => {
                        const msg = payload.new;
                        // Only count messages from others, in our conversations
                        if (
                            msg.sender_id !== user.id &&
                            convoIds.includes(msg.conversation_id)
                        ) {
                            setUnreadCount((prev) => prev + 1);
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        };

        init();
    }, []);

    return { unreadCount, markAllRead };
}
