import { createClient } from '@/lib/supabase/client';

export interface FeedPost {
    id: string;
    created_at: string;
    title: string;
    content: string;
    category: string;
    is_exclusive: boolean;
    author_id: string;
    profiles?: {
        full_name: string;
        avatar_url: string;
        username: string;
    };
    player_metadata?: {
        player_name: string;
        age: number;
        position: string;
        current_team: string;
        radar_data: any;
    };
}

export const getFeedPosts = async (categoryFilter?: string) => {
    const supabase = createClient();

    let query = supabase
        .from('posts')
        .select(`
            *,
            profiles:author_id (
                full_name,
                avatar_url
            )
        `)
        .order('created_at', { ascending: false });

    if (categoryFilter && categoryFilter !== 'Todo') {
        // Map Spanish UI tabs to database categories if needed, 
        // but for now we assume they match or are handled in the UI.
        const catMap: Record<string, string> = {
            'Artículos': 'articulo',
            'Tácticas': 'analisis_tactico',
            'Jugadores': 'analisis_jugador',
        };
        const dbCat = catMap[categoryFilter] || categoryFilter;
        query = query.eq('category', dbCat);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching feed posts:', error);
        return [];
    }

    return data as any[];
};

export const getPostById = async (id: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles:author_id (
                full_name,
                avatar_url
            ),
            player_metadata (
                *
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching post detail:', error);
        return null;
    }

    return data as any;
};
export const getUserPosts = async (userId: string, filter?: 'Todos' | 'Borradores' | 'Publicados' | 'Exclusivos') => {
    const supabase = createClient();

    let query = supabase
        .from('posts')
        .select(`
            *,
            profiles:author_id (
                full_name,
                avatar_url
            )
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

    if (filter === 'Exclusivos') {
        query = query.eq('is_exclusive', true);
    }

    // Note: 'Borradores' and 'Publicados' would require a status column.
    // For now, we return all posts for 'Todos' and 'Publicados'.

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching user posts:', error);
        return [];
    }

    return data as any[];
};
