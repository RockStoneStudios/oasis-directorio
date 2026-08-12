'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Music, 
  Utensils, 
  ShoppingBag, 
  Sparkles, 
  ChevronRight,
  Info,
  Heart
} from 'lucide-react';

// --- TIPOS DE DATOS ---
interface EventItem {
  time: string;
  title: string;
  location: string;
  details?: string[];
  category: 'desfile' | 'entretenimiento' | 'concierto' | 'gastronomia' | 'cultura';
}

interface DaySchedule {
  id: string;
  dayName: string;
  dateStr: string;
  events: EventItem[];
}

// --- DATOS EXTRAÍDOS DE LOS AFICHES DE LA FERIA ---
const scheduleData: DaySchedule[] = [
  {
    id: 'viernes',
    dayName: 'Viernes',
    dateStr: '14 de Agosto',
    events: [
      {
        time: '4:30 P.M.',
        title: 'Desfile Inaugural',
        location: 'Recorrido: Parque Zamarra hacia la Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'desfile'
      },
      {
        time: '5:00 P.M.',
        title: 'Feria del Emprendimiento',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'entretenimiento'
      },
      {
        time: '7:30 P.M.',
        title: 'Rumba Aeróbica',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'entretenimiento'
      },
      {
        time: '9:00 P.M.',
        title: 'Gran Noche Artística & Show Urbano',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'concierto',
        details: [
          'Gabiel Berrio',
          'Arcángel Serna',
          'Sabrobanda',
          'Jaime Cano',
          'Show urbano: Yil ZL, Diamond, Milenio Men',
          'Noche de jóvenes DJ\'s'
        ]
      }
    ]
  },
  {
    id: 'sabado',
    dayName: 'Sábado',
    dateStr: '15 de Agosto',
    events: [
      {
        time: '5:00 P.M.',
        title: 'Feria del Emprendimiento',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'entretenimiento'
      },
      {
        time: '5:30 P.M.',
        title: 'Herencia Vallenata',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'concierto'
      },
      {
        time: '8:00 P.M.',
        title: 'Desfile de Moda: "Entre talentos, prendas y tamarindos"',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'desfile'
      },
      {
        time: '9:30 P.M.',
        title: 'Conciertos en Vivo & Parranda',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'concierto',
        details: [
          'Jhon Larrea "Con Puro Corazón"',
          'Andrés Herrera',
          'Andrés Castro y La Agrupación Son de Acá',
          'Crisband',
          'Albeiro García "El Jilguero de Occidente" y Los Elegidos de Colombia'
        ]
      }
    ]
  },
  {
    id: 'domingo',
    dayName: 'Domingo',
    dateStr: '16 de Agosto',
    events: [
      {
        time: '3:00 P.M.',
        title: 'Festival Gastronómico',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'gastronomia'
      },
      {
        time: '5:00 P.M.',
        title: 'Feria del Emprendimiento',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'entretenimiento'
      },
      {
        time: '6:00 P.M.',
        title: 'Papayera',
        location: 'Mercadillo de La Chinca',
        category: 'cultura'
      },
      {
        time: '8:00 P.M.',
        title: 'Muestra Cultural',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'cultura'
      },
      {
        time: '9:00 P.M.',
        title: 'Cierre de Conciertos',
        location: 'Plaza Mayor Simón Bolívar (Parque Principal)',
        category: 'concierto',
        details: [
          'Jimmy Alcaraz y Los Carrileros',
          'El Cartel',
          'Los Hermanos Benítez'
        ]
      }
    ]
  }
];

export default function FeriaTamarindoPage() {
  const [activeTab, setActiveTab] = useState<string>('todos');

  const getCategoryBadge = (category: EventItem['category']) => {
    switch (category) {
      case 'concierto':
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400"><Music className="w-3 h-3"/> Concierto</span>;
      case 'gastronomia':
        return <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 text-xs font-semibold text-orange-400"><Utensils className="w-3 h-3"/> Gastronomía</span>;
      case 'desfile':
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400"><Sparkles className="w-3 h-3"/> Desfile</span>;
      case 'cultura':
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-400"><Heart className="w-3 h-3"/> Cultural</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 text-xs font-semibold text-yellow-400"><ShoppingBag className="w-3 h-3"/> Actividad</span>;
    }
  };

  const filteredData = activeTab === 'todos' 
    ? scheduleData 
    : scheduleData.filter(d => d.id === activeTab);

  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* --- HERO HEADER --- */}
      <header className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-stone-900 to-zinc-950 text-amber-50 py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-zinc-800/80 shadow-2xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="relative max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Santa Fe de Antioquia, Colombia
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-md text-zinc-100">
            Feria del <span className="text-amber-500 underline decoration-emerald-500 underline-offset-8">Tamarindo</span>
          </h1>

          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-widest">
            2026
          </p>

          <p className="text-lg sm:text-xl font-medium text-zinc-300 max-w-xl mx-auto">
            Del <span className="font-bold text-white">14 al 16 de Agosto</span> • Programación Oficial
          </p>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* FILTROS / PESTAÑAS */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm ${
              activeTab === 'todos'
                ? 'bg-amber-500 text-zinc-950 shadow-amber-500/20 font-bold scale-105'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            Ver Todo
          </button>
          {scheduleData.map((day) => (
            <button
              key={day.id}
              onClick={() => setActiveTab(day.id)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm ${
                activeTab === day.id
                  ? 'bg-amber-500 text-zinc-950 shadow-amber-500/20 font-bold scale-105'
                  : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {day.dayName} {day.dateStr.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* AGENDA TIMELINE */}
        <div className="space-y-12">
          {filteredData.map((day) => (
            <section key={day.id} className="bg-zinc-900/90 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-800/80 backdrop-blur-sm">
              
              {/* Encabezado del Día */}
              <div className="flex items-center gap-3 pb-6 border-b border-zinc-800 mb-6">
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl shadow">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-amber-400">
                    {day.dayName}, {day.dateStr}
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium">Eventos y Presentaciones</p>
                </div>
              </div>

              {/* Lista de Eventos */}
              <div className="relative pl-3 sm:pl-6 space-y-8 before:absolute before:left-3 sm:before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-800">
                {day.events.map((event, idx) => (
                  <div key={idx} className="relative pl-6 sm:pl-8 group">
                    
                    {/* Indicador de Timeline */}
                    <div className="absolute -left-[5px] top-1.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-zinc-900 group-hover:scale-125 group-hover:bg-amber-400 transition-all" />

                    <div className="bg-zinc-950/60 p-4 sm:p-5 rounded-xl border border-zinc-800/70 hover:border-amber-500/40 transition-all shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          <span>{event.time}</span>
                        </div>
                        {getCategoryBadge(event.category)}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-1">
                        {event.title}
                      </h3>

                      <div className="flex items-start gap-1.5 text-xs sm:text-sm text-zinc-400 mb-3">
                        <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{event.location}</span>
                      </div>

                      {/* Lista de Artistas / Detalles si aplica */}
                      {event.details && event.details.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-zinc-800 bg-zinc-900/50 p-3 rounded-lg border">
                          <p className="text-xs font-semibold text-amber-400 mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Artistas & Presentaciones:
                          </p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-zinc-300">
                            {event.details.map((artist, aIdx) => (
                              <li key={aIdx} className="flex items-center gap-1.5">
                                <ChevronRight className="w-3 h-3 text-amber-500 shrink-0" />
                                <span>{artist}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* NOTA ACLARATORIA */}
        <div className="mt-10 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs sm:text-sm text-amber-200">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            *La programación está sujeta a cambios sin previo aviso o sufrir modificaciones por motivos de fuerza mayor.
          </p>
        </div>

      </main>

      {/* --- FOOTER / ORGANIZADORES & ALIADOS --- */}
      <footer className="bg-zinc-900 text-zinc-400 py-10 px-4 mt-16 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div>
            <h4 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-2">
              Organiza & Invita
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300">
              Alcaldía de Santa Fe de Antioquia • Santa Fe de Antioquia ¡Para Ti!
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500 flex flex-wrap justify-center gap-4">
            <span>Aliados: INDER Santa Fe</span>
            <span>•</span>
            <span>Provincia Turística y Agroecológica del Occidente Antioqueño</span>
            <span>•</span>
            <span>Turismo Antioquia</span>
            <span>•</span>
            <span>Santa Fe de Antioquia es Guía</span>
          </div>

          <p className="text-[10px] text-zinc-600">
            © 2026 Feria del Tamarindo — Santa Fe de Antioquia
          </p>
        </div>
      </footer>
    </div>
  );
}