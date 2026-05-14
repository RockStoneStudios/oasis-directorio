// app/directorio/clasico/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { client } from '@/lib/sanity/client';
import { CLASSIC_DIRECTORY_BY_LETTER_QUERY } from '@/lib/sanity/queries';
import { BusinessCard } from '@/components/BusinessCard';

const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'];

export default function ClassicDirectoryPage() {
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Directorio Clásico</h1>
      
      {/* Selector de letras */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`w-12 h-12 rounded-lg font-semibold cursor-pointer transition-all ${
              selectedLetter === letter 
                ? 'bg-blue-600 text-white scale-105' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Indicador */}
      <p className="text-center text-sm text-gray-500 mb-6">
        Mostrando {businesses.length} negocios que comienzan con "{selectedLetter}"
      </p>

      {/* Resultados con BusinessCard */}
      {loading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay negocios que empiecen con "{selectedLetter}"</p>
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