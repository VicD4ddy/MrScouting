import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MR. SCOUTING | Análisis Táctico & Scouting",
  description: "La plataforma definitiva para analistas y scouts de fútbol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${spaceGrotesk.className} bg-[#0a0f1e] text-slate-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
