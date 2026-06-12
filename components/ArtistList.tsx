'use client';

import { Music } from "lucide-react";

interface Artist {
  name: string;
  genre: string;
  schedule?: string;
}

interface ArtistListProps {
  artists?: Artist[];
}

export default function ArtistList({ artists }: ArtistListProps) {
  const defaultArtists = [
    { name: "Arelys Henao", genre: "Música popular", schedule: "Viernes 26 - 10:00 PM" },
    { name: "El Combo de las Estrellas", genre: "Salsa y tropical", schedule: "Sábado 27 - 8:00 PM" },
    { name: "Alex Manga", genre: "Vallenato", schedule: "Domingo 28 - 8:30 PM" },
    { name: "Tropinova", genre: "Tropipop", schedule: "Viernes 26 - 10:00 PM" },
    { name: "Grupo Caneo", genre: "Salsa", schedule: "Domingo 28 - 8:30 PM" },
  ];

  const artistList = artists?.length ? artists : defaultArtists;

  return (
    <section className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center flex items-center justify-center gap-2">
          <Music className="w-6 h-6" /> Artistas Confirmados
        </h2>
      </div>
      <div className="p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-orange-50 dark:bg-orange-900/30">
              <th className="p-3 rounded-l-lg font-semibold text-gray-900 dark:text-white">Artista</th>
              <th className="p-3 font-semibold text-gray-900 dark:text-white">Género</th>
              <th className="p-3 rounded-r-lg font-semibold text-gray-900 dark:text-white">Horario</th>
            </tr>
          </thead>
          <tbody>
            {artistList.map((artist, idx) => (
              <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors">
                <td className="p-3 font-semibold text-gray-900 dark:text-white">{artist.name}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{artist.genre}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300 font-mono text-sm">{artist.schedule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}