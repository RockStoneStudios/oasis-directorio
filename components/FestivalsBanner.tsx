"use client";

import Link from "next/link";
import { PartyPopper, Sparkles, ArrowRight } from "lucide-react";

export function FestivalsBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-orange-500/15 border-y border-amber-500/30 dark:border-amber-500/20 py-4 px-4 relative overflow-hidden">
      {/* Efecto decorativo de luz de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1)_0,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25">
            <PartyPopper className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-1">
              <Sparkles className="h-3 w-3" /> ¡Fin de semana de fiestas en el Occidente!
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Vive las Fiestas del Sol, del Fríjol y del Campesino 
            </h2>
          </div>
        </div>

        <Link
          href="/fiestas-del-fin-de-semana"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-emerald-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <span>Ver programación de las 3 fiestas</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}