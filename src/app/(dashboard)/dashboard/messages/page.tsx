'use client';

import { createClient } from '@/lib/supabase/client';
import { getConversations, getOrCreateConversation } from '@/lib/services/chat';
import { MessageSquare, Loader2, ArrowRight, Send, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';

export default function MessagesPage() {
    const router = useRouter();
    const [conversations, setConversations] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [startingChat, setStartingChat] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const { markAllRead } = useUnreadMessages();

    // Clear badge when the messages page is opened
    useEffect(() => { markAllRead(); }, [markAllRead]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }
            setUserId(user.id);

            // Load conversations and all other users in parallel
            const [convos, { data: allUsers }] = await Promise.all([
                getConversations(user.id),
                supabase
                    .from('profiles')
                    .select('id, full_name')
                    .neq('id', user.id)
                    .limit(20)
            ]);

            setConversations(convos);
            // Show ALL other platform users (the send button re-opens existing conversations)
            setSuggestions(allUsers || []);
            setLoading(false);
        };
        load();
    }, []);

    const handleStartChat = async (otherUserId: string) => {
        if (!userId || startingChat) return;
        setStartingChat(otherUserId);
        const conversationId = await getOrCreateConversation(userId, otherUserId);
        if (conversationId) {
            router.push(`/dashboard/messages/${conversationId}`);
        }
        setStartingChat(null);
    };

    return (
        <div className="max-w-xl mx-auto pb-28">
            {/* Header */}
            <div className="flex items-center justify-between py-4 mb-4">
                <div>
                    <h1 className="text-xl font-black text-white tracking-tight uppercase">Mensajes</h1>
                    <p className="text-slate-500 text-xs font-medium">Conversaciones directas</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">En línea</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-2">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar analistas..."
                    className="w-full bg-[#161b2e] border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 transition-all"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Active Conversations */}
                    {conversations.length > 0 && (
                        <div className="space-y-2">
                            <h2 className="text-[9px] font-bold uppercase tracking-[3px] text-slate-500 px-1">Conversaciones</h2>
                            {conversations.map((convo) => {
                                const name = convo.otherUser.full_name || 'Analista';
                                const initials = name.slice(0, 2).toUpperCase();
                                return (
                                    <Link
                                        key={convo.id}
                                        href={`/dashboard/messages/${convo.id}`}
                                        className="flex items-center gap-4 p-4 glass border border-white/5 hover:border-white/15 rounded-2xl transition-all active:scale-[0.98] group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-slate-900 border-2 border-blue-500/30 flex items-center justify-center text-sm font-black text-white shrink-0">
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold text-sm">{name}</p>
                                            <p className="text-slate-500 text-xs truncate mt-0.5">{convo.lastMessage}</p>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-600 group-hover:text-blue-400 transition-colors shrink-0" />
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* People Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-[9px] font-bold uppercase tracking-[3px] text-slate-500 px-1">
                                Analistas en la plataforma
                            </h2>



                            <div className="space-y-2">
                                {suggestions
                                    .filter((u: any) =>
                                        !search ||
                                        (u.full_name || 'Analista').toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((user: any) => {
                                        const name = user.full_name || 'Analista';
                                        const initials = name.slice(0, 2).toUpperCase();
                                        const isStarting = startingChat === user.id;
                                        return (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-4 p-4 glass border border-white/5 hover:border-white/10 rounded-2xl transition-all"
                                            >
                                                {/* Avatar - link to profile */}
                                                <Link href={`/dashboard/profile/${user.id}`} className="shrink-0">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/10 flex items-center justify-center text-sm font-black text-white">
                                                        {initials}
                                                    </div>
                                                </Link>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/dashboard/profile/${user.id}`}>
                                                        <p className="text-white font-bold text-sm hover:text-blue-300 transition-colors">{name}</p>
                                                    </Link>
                                                    <p className="text-slate-600 text-xs">Talent Analyst</p>
                                                </div>

                                                {/* Message button */}
                                                <button
                                                    onClick={() => handleStartChat(user.id)}
                                                    disabled={isStarting}
                                                    className="w-9 h-9 bg-[#0081ff]/10 border border-[#0081ff]/20 hover:bg-[#0081ff] rounded-full flex items-center justify-center text-[#0081ff] hover:text-white transition-all active:scale-90 disabled:opacity-50 group"
                                                >
                                                    {isStarting
                                                        ? <Loader2 size={15} className="animate-spin" />
                                                        : <Send size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                    }
                                                </button>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Truly empty state */}
                    {conversations.length === 0 && suggestions.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-[#1a1f2e] border border-white/5 flex items-center justify-center">
                                <MessageSquare className="w-10 h-10 text-slate-700" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-white font-bold text-lg uppercase tracking-tighter">Sin usuarios</h3>
                                <p className="text-slate-500 text-xs uppercase font-bold tracking-[3px]">Aún no hay otros analistas registrados</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
