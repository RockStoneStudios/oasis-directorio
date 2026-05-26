// @/components/ui/ClientBackButton.tsx
'use client';

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function ClientBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="w-full h-full flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 cursor-pointer active:scale-95
        /* ☀️ Modo Claro: Neón naranja suave */
        bg-white/80 border border-orange-100 text-zinc-800 shadow-[0_0_10px_rgba(251,146,60,0.1)] 
        hover:bg-white hover:text-orange-600 hover:border-orange-400 hover:shadow-[0_0_15px_rgba(251,146,60,0.4)]
        
        /* 🌙 Modo Oscuro: Neón naranja vibrante */
        dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-200 dark:shadow-[0_0_15px_rgba(249,115,22,0.05)]
        dark:hover:bg-zinc-900 dark:hover:text-orange-400 dark:hover:border-orange-500 dark:hover:shadow-[0_0_20px_rgba(249,115,22,0.6)]"
      title="Volver atrás"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}