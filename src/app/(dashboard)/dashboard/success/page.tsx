'use client';

import Link from "next/link";
import { CheckCircle2, LayoutDashboard, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function SuccessPage() {
    useEffect(() => {
        // Celebration!
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
            <div className="relative">
                <div className="absolute -inset-4 bg-[#bef264] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <CheckCircle2 className="w-24 h-24 text-[#bef264] relative z-10" />
            </div>

            <div className="space-y-4 max-w-lg">
                <h1 className="text-3xl font-bold tracking-tight text-white uppercase">
                    ¡Bienvenido al <span className="text-blue-500">Siguiente Nivel</span>!
                </h1>
                <p className="text-slate-400 text-lg">
                    Tu suscripción se ha procesado correctamente. Ya tienes acceso total a las herramientas de élite de MR. SCOUTING.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md pt-8">
                <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 p-4 bg-[#162d9c] hover:bg-blue-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/40"
                >
                    <LayoutDashboard className="w-5 h-5" /> Ir al Dashboard
                </Link>
                <Link
                    href="/dashboard/tactics"
                    className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all"
                >
                    <Rocket className="w-5 h-5" /> Probar Tácticas
                </Link>
            </div>

            <p className="text-[10px] text-slate-500 uppercase tracking-[3px] pt-12">
                MR. SCOUTING | ANÁLISIS DE ÉLITE
            </p>
        </div>
    );
}
