// app/directorio/clasico/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { client } from '@/lib/sanity/client';
import { CLASSIC_DIRECTORY_BY_LETTER_QUERY } from '@/lib/sanity/queries';
import { BusinessCard } from '@/components/BusinessCard';
import { ClientBackButton } from '@/components/ui/ClientBackButton';

const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'];

export default function ClassicDirectoryPage() {
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🛡️ Estado crítico para eliminar el error de hidratación de raíz
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadBusinesses() {
      setLoading(true);
      const letter = selectedLetter === '#' ? '[0-9]' : selectedLetter;
      const data = await client.fetch(CLASSIC_DIRECTORY_BY_LETTER_QUERY, { letter });
      setBusinesses(data);
      setLoading(false);
    }
    loadBusinesses();
  }, [selectedLetter]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen text-foreground transition-colors duration-300 max-w-7xl">
      
      {/* 👑 Encabezado Modificado: Alineación Flex limpia y nativa */}
    <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-5 mb-8">
  {/* 📦 Contenedor con tamaño fijo bloqueado para que el botón no se monte sobre el texto */}
  <div className="w-10 h-10 shrink-0 flex items-center justify-center relative">
    {mounted ? (
      <ClientBackButton />
    ) : (
      <div className="w-10 h-10 rounded-xl bg-zinc-800 animate-pulse" />
    )}
  </div>
  
  {/* Título con un margen izquierdo extra por si las moscas (pl-1) */}
  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight font-heading text-foreground pl-1">
    Directorio de la A la Z
  </h1>
</div>
      {/* ⌨️ Grid de letras responsivo: Controla el ancho máximo en pantallas grandes */}
      <div className="max-w-4xl mx-auto mt-10 mb-10">
        <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-14 gap-2 justify-items-center">
          {alphabet.map((letter) => {
            const isActive = selectedLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-full aspect-square max-w-12 h-12 rounded-xl font-bold cursor-pointer transition-all duration-300 active:scale-95 flex items-center justify-center text-base
                  ${isActive 
                    ? `/* 🟠 Estado Activo con Neón Naranja Terracota */
                       bg-orange-400 text-zinc-950 font-black scale-105
                       shadow-[0_0_15px_rgba(251,146,60,0.5)]
                       dark:bg-orange-500 dark:shadow-[0_0_20px_rgba(249,115,22,0.6)]`
                    : `/* 🌗 Estado Inactivo: Perfecto contraste y legibilidad */
                       bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-orange-600
                       dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-orange-400`
                  }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Indicador de resultados */}
      <p className="text-center text-sm text-muted-foreground mb-8 font-medium">
        Mostrando <span className="text-orange-500 font-bold">{businesses.length}</span> negocios que comienzan con "{selectedLetter}"
      </p>

      {/* Resultados con BusinessCard */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground animate-pulse font-medium">Cargando...</div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 max-w-2xl mx-auto">
          <p className="text-muted-foreground font-medium">No hay negocios que empiecen con "{selectedLetter}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}