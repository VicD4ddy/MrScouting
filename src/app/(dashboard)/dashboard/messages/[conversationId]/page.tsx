'use client';

import { createClient } from '@/lib/supabase/client';
import { getMessages, sendMessage } from '@/lib/services/chat';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ChatThreadPage() {
    const params = useParams();
    const router = useRouter();
    const conversationId = params.conversationId as string;

    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/login'); return; }
            setCurrentUserId(user.id);

            const msgs = await getMessages(conversationId);
            setMessages(msgs);
            setLoading(false);
            setTimeout(scrollToBottom, 100);
        };
        load();
    }, [conversationId, router, scrollToBottom]);

    // Real-time subscription
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload: { new: any }) => {
                    // Replace optimistic message (if it's our own) or just append
                    if (payload.new) {
                        setMessages((prev) => {
                            // Remove the temporary optimistic entry for own messages
                            const withoutOptimistic = prev.filter(
                                (m) => !m.id.startsWith('optimistic-')
                            );
                            // Avoid duplicates (message might already be there)
                            if (withoutOptimistic.some((m) => m.id === payload.new.id)) {
                                return withoutOptimistic;
                            }
                            return [...withoutOptimistic, payload.new];
                        });
                        setTimeout(scrollToBottom, 50);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, scrollToBottom]);

    const handleSend = async () => {
        if (!newMessage.trim() || !currentUserId || sending) return;
        setSending(true);
        const content = newMessage.trim();
        setNewMessage('');

        // Optimistic update — show the message immediately before DB confirmation
        const optimisticMsg = {
            id: `optimistic-${Date.now()}`,
            conversation_id: conversationId,
            sender_id: currentUserId,
            content,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticMsg]);
        setTimeout(scrollToBottom, 50);

        const success = await sendMessage(conversationId, currentUserId, content);
        if (!success) {
            // Revert optimistic update on failure
            setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
            setNewMessage(content);
        }
        setSending(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-dvh bg-[#0a0f1e] text-slate-50">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0a0f1e]/90 backdrop-blur-xl shrink-0" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}>
                <button
                    onClick={() => router.push('/dashboard/messages')}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-500/30 flex items-center justify-center text-xs font-black text-white">
                    A
                </div>
                <div>
                    <p className="text-white text-sm font-bold">Conversación</p>
                    <p className="text-emerald-400 text-[10px] font-bold">• En línea</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-600 text-sm">Inicia la conversación enviando un mensaje</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwn = msg.sender_id === currentUserId;
                        // Use first 2 chars of sender_id as fallback initials (profiles join not available)
                        const initials = isOwn ? 'YO' : (msg.sender_id || 'AN').slice(0, 2).toUpperCase();

                        return (
                            <div
                                key={msg.id}
                                className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {!isOwn && (
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-500/30 flex items-center justify-center text-[9px] font-black text-white shrink-0">
                                        {initials}
                                    </div>
                                )}
                                <div className={`max-w-[70%] group`}>
                                    <div
                                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isOwn
                                            ? 'bg-[#0081ff] text-white rounded-br-sm'
                                            : 'bg-[#1a1f2e] border border-white/5 text-slate-100 rounded-bl-sm'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                    <p className={`text-[10px] text-slate-600 mt-1 ${isOwn ? 'text-right' : 'text-left'} px-1`}>
                                        {formatTime(msg.created_at)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Message Input */}
            <div
                className="px-4 py-3 border-t border-white/[0.06] bg-[#0a0f1e]/90 backdrop-blur-xl shrink-0"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
            >
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-[#161b2e] border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || sending}
                        className="w-11 h-11 bg-[#0081ff] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-90"
                    >
                        {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
