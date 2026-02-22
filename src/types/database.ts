export type UserRole = 'beginner' | 'semi-pro' | 'pro';

export interface UserProfile {
    id: string;
    role: UserRole;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    external_links: Record<string, any> | null;
    created_at: string;
}

export interface Post {
    id: string;
    author_id: string;
    title: string;
    content: string;
    category: 'articulo' | 'analisis_partido' | 'analisis_equipo' | 'analisis_jugador' | 'promesas';
    is_exclusive: boolean;
    thumbnail_url: string | null;
    created_at: string;
}

export interface PlayerMetadata {
    post_id: string;
    player_name: string;
    age: number;
    position: string;
    current_team: string;
    nationality: string;
    radar_data: Record<string, number>;
}

export interface Rating {
    id: string;
    post_id: string;
    user_id: string;
    stars: number;
    created_at: string;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    parent_id: string | null;
    created_at: string;
}
