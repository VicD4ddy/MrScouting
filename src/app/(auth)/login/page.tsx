'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Zap, TrendingUp, Key } from "lucide-react";

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const msg = searchParams.get('message');
        if (msg) setMessage(msg);
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 tactical-pattern opacity-20"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md relative">
                <div className="glass border border-[#252b46] p-10 rounded-[40px] shadow-2xl space-y-8 backdrop-blur-2xl">
                    <div className="text-center space-y-3">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-[#162d9c] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20 -rotate-3 transition-transform hover:rotate-0">
                                <TrendingUp className="text-[#bef264] w-8 h-8" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter uppercase leading-none">
                            MR. <span className="text-blue-500">SCOUTING</span>
                        </h1>
                        <p className="text-slate-500 text-xs font-medium">Inicia sesión en tu Centro de Inteligencia</p>
                    </div>

                    {message && (
                        <div className="bg-[#bef264]/10 border border-[#bef264]/20 p-4 rounded-xl flex items-center gap-3">
                            <Zap className="text-[#bef264] w-4 h-4 flex-shrink-0" />
                            <p className="text-[#bef264] text-[10px] font-bold uppercase tracking-widest">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email / Usuario</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-800"
                                placeholder="analista@mrscouting.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contraseña</label>
                                <Link href="#" className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400">¿Olvidaste tu acceso?</Link>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-800"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                                <Shield className="text-red-500 w-4 h-4 flex-shrink-0" />
                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/30 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-[2px] text-sm"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>Entrar al Sistema <Key size={16} className="text-[#bef264]" /></>
                            )}
                        </button>
                    </form>

                    <div className="text-center space-y-4 pt-4">
                        <p className="text-sm text-slate-500">
                            ¿Nuevo analista?{' '}
                            <Link href="/signup" className="text-[#bef264] font-bold hover:text-[#d9ff93] transition-colors ml-1">Crea tus credenciales</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
