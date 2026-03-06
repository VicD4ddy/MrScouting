import { createClient } from '@/lib/supabase/client';

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    profiles?: {
        full_name: string | null;
    };
}

export interface Conversation {
    id: string;
    created_at: string;
    otherUser: {
        id: string;
        full_name: string | null;
        email?: string;
    };
    lastMessage?: string;
}

/**
 * Finds an existing direct conversation between two users, or creates one.
 */
export async function getOrCreateConversation(currentUserId: string, otherUserId: string): Promise<string | null> {
    const supabase = createClient();

    // Look for an existing conversation that has BOTH users
    const { data: existing } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId);

    if (existing && existing.length > 0) {
        const myConvoIds = existing.map((r: any) => r.conversation_id);

        const { data: shared } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', otherUserId)
            .in('conversation_id', myConvoIds);

        if (shared && shared.length > 0) {
            // Found an existing conversation
            return shared[0].conversation_id;
        }
    }

    // No existing conversation found — create one
    // We generate the UUID client-side to avoid the RLS SELECT-after-INSERT conflict.
    // (The SELECT policy requires the user to already be in conversation_participants,
    //  but at insertion time they aren't yet.)
    const newConvoId = crypto.randomUUID();

    const { error: convoError } = await supabase
        .from('conversations')
        .insert({ id: newConvoId });

    if (convoError) {
        console.error('Error creating conversation:', convoError.message, convoError.details);
        return null;
    }

    // Add both participants now that the conversation exists
    const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
            { conversation_id: newConvoId, user_id: currentUserId },
            { conversation_id: newConvoId, user_id: otherUserId },
        ]);

    if (participantsError) {
        console.error('Error adding participants:', participantsError.message);
        return null;
    }

    return newConvoId;
}

/**
 * Fetches all messages in a conversation.
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error.message, error.details);
        return [];
    }

    return data || [];
}

/**
 * Sends a message in a conversation.
 */
export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender_id: senderId, content });

    if (error) {
        console.error('Error sending message:', error);
        return false;
    }

    return true;
}

/**
 * Fetches all conversations for a user, with last message preview.
 * Derives the "other user" from message senders to avoid RLS policy constraints.
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
    const supabase = createClient();

    // Step 1: Get conversation IDs the user is in (own rows only — matches RLS policy)
    const { data: participations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);

    if (!participations || participations.length === 0) return [];

    const convoIds: string[] = participations.map((p: any) => p.conversation_id);

    // Step 2: Get all messages in those conversations to derive other senders
    // The messages RLS policy allows this (participant can read their conversation messages)
    const { data: allMessages } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, content, created_at')
        .in('conversation_id', convoIds)
        .order('created_at', { ascending: false });

    if (!allMessages) return [];

    // Step 3: For each conversation, find the latest message and the other user's ID
    const convoMap = new Map<string, { otherUserId: string | null; lastMessage: string; lastAt: string }>();

    for (const convoId of convoIds) {
        const msgs = allMessages.filter((m: any) => m.conversation_id === convoId);
        const lastMsg = msgs[0]; // already sorted by desc
        const otherSender = msgs.find((m: any) => m.sender_id !== userId);

        convoMap.set(convoId, {
            otherUserId: otherSender?.sender_id || null,
            lastMessage: lastMsg?.content || 'Sin mensajes aún',
            lastAt: lastMsg?.created_at || '',
        });
    }

    // Step 4: Fetch profiles for all other users in one batch
    const otherUserIds = [...new Set(
        [...convoMap.values()]
            .map((v) => v.otherUserId)
            .filter(Boolean) as string[]
    )];

    const profilesMap = new Map<string, string>();
    if (otherUserIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', otherUserIds);

        (profiles || []).forEach((p: any) => {
            profilesMap.set(p.id, p.full_name || 'Analista');
        });
    }

    // Step 5: Build list and DEDUPLICATE by otherUserId
    //   Multiple conversation records with same user (from retried creation) → merge into one,
    //   keeping the conversation with the most recent/any message.
    const byOtherUser = new Map<string, Conversation>();

    for (const convoId of convoIds) {
        const info = convoMap.get(convoId);
        if (!info) continue;

        const otherUid = info.otherUserId || '__unknown__';
        const fullName = info.otherUserId
            ? (profilesMap.get(info.otherUserId) || 'Analista')
            : 'Analista';

        const entry: Conversation = {
            id: convoId,
            created_at: info.lastAt,
            otherUser: { id: info.otherUserId || '', full_name: fullName },
            lastMessage: info.lastMessage,
        };

        const existing = byOtherUser.get(otherUid);
        // Prefer the entry that has a real message, or the most recent one
        if (!existing) {
            byOtherUser.set(otherUid, entry);
        } else {
            const existingHasMsg = existing.lastMessage !== 'Sin mensajes aún';
            const newHasMsg = entry.lastMessage !== 'Sin mensajes aún';
            // Pick entry with real message; if both have one, pick the newest
            if (!existingHasMsg && newHasMsg) {
                byOtherUser.set(otherUid, entry);
            } else if (existingHasMsg && newHasMsg && info.lastAt > existing.created_at) {
                byOtherUser.set(otherUid, entry);
            }
        }
    }

    // Sort by most recent message first
    const results = [...byOtherUser.values()].sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
    );

    return results;
}


/**
 * Fetches a user's public profile data from the profiles table.
 */
export async function getPublicProfile(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, bio')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}

/**
 * Gets posts published by a specific user
 */
export async function getUserPosts(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('posts')
        .select('id, title, category, created_at, is_exclusive')
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user posts:', error);
        return [];
    }

    return data || [];
}
