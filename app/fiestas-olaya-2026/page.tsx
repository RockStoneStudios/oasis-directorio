'use client';

import { Calendar, MapPin, Music, Trophy, Users, Utensils } from 'lucide-react';

export default function OlayaPage() {
  return (
    <main className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-[#ffcc00] selection:text-black">
      
      {/* --- HERO SECTION (Ahora con Verde y Amarillo neón) --- */}
      <section className="relative py-24 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-[#0d2c1b] to-[#0b0e14] border-b border-[#ffcc00]/30">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffcc00]/20 border border-[#ffcc00]/40 text-[#ffcc00] text-xs font-bold uppercase tracking-wider mb-6">
            <Calendar className="w-3.5 h-3.5" />
            Evento Oficial 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffcc00] via-[#a8e063] to-[#56ab2f] mb-4 drop-shadow-lg">
            Fiestas de Olaya
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-200 mb-2">
            Tradicionales 2026
          </p>
          
          <div className="flex justify-center flex-wrap gap-4 mt-4 text-gray-300">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#ffcc00]" /> 14 al 16 de Agosto</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#ffcc00]" /> Cabecera Municipal, Olaya</span>
          </div>

          <p className="max-w-2xl mx-auto mt-6 text-gray-400 text-lg leading-relaxed">
            ¡Vive las Fiestas Tradicionales en la Cabecera! Disfruta del Festival del Sancocho, 
            orquestas en vivo, talento local y mucho más. Una celebración llena de cultura y alegría.
          </p>
        </div>
      </section>

      {/* --- CULTURAL & INTRO SECTION --- */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-[#161b22] p-8 rounded-2xl border border-[#ffcc00]/20 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4 border-l-4 border-[#ffcc00] pl-4">
            Una tradición que nos une
          </h2>
          <div className="prose prose-lg prose-invert text-gray-300 space-y-4">
            <p>
              Las <strong>Fiestas Tradicionales de Olaya 2026</strong> son el evento cultural 
              más importante del municipio. Del <strong>14 al 16 de agosto</strong>, la 
              Cabecera Municipal se llenará de color, música y sabor para celebrar nuestras raíces.
            </p>
            <p>
              Este año contamos con una programación variada que incluye el <strong>Festival 
              del Sancocho</strong>, encuentros deportivos, orquestas de renombre y el 
              <strong>Gran Concurso de Talento Local</strong>. ¡Te esperamos para disfrutar 
              en familia!
            </p>
          </div>
        </div>
      </section>

      {/* --- SCHEDULE BY DAY --- */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-[#ffcc00] pl-4">
          Programación día por día
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Viernes 14 */}
          <div className="bg-[#161b22] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#ffcc00]/40 transition-all shadow-lg group">
            <div className="h-48 bg-gradient-to-br from-[#ffcc00] to-[#ff9900] flex items-center justify-center">
              <Calendar className="w-16 h-16 text-white/80 group-hover:text-white/50 transition-colors" />
            </div>
            <div className="p-6 bg-[#0b0e14] border-t border-[#ffcc00]/20">
              <h3 className="text-2xl font-bold text-[#ffcc00] mb-4">Viernes 14</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#ffcc00] mt-0.5">9:00a.m.</span>
                  <span>Antioqueñidad <br/><span className="text-xs text-gray-500">(Concursos de Poesía y Dibujo)</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#ffcc00] mt-0.5">7:00p.m.</span>
                  <span>Compartir Comunitario</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#ffcc00] mt-0.5">8:00p.m.</span>
                  <span>Gran Concurso de Talento</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sábado 15 */}
          <div className="bg-[#161b22] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#ffcc00]/40 transition-all shadow-lg group">
            <div className="h-48 bg-gradient-to-br from-[#56ab2f] to-[#a8e063] flex items-center justify-center">
              <Music className="w-16 h-16 text-white/80 group-hover:text-white/50 transition-colors" />
            </div>
            <div className="p-6 bg-[#0b0e14] border-t border-[#ffcc00]/20">
              <h3 className="text-2xl font-bold text-[#ffcc00] mb-4">Sábado 15</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#ffcc00] mt-0.5">7:00a.m.</span>
                  <span>Caminata</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#ffcc00] mt-0.5">3:00p.m.</span>
                  <span>Olaya vs Colonia <br/><span className="text-xs text-gray-500">(Encuentro Deportivo)</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#ffcc00] mt-0.5">10:00p.m.</span>
                  <span>Orquesta Los Federales</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Domingo 16 */}
          <div className="bg-[#161b22] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#ffcc00]/40 transition-all shadow-lg group">
            <div className="h-48 bg-gradient-to-br from-[#1e8b3c] to-[#56ab2f] flex items-center justify-center">
              <Users className="w-16 h-16 text-white/80 group-hover:text-white/50 transition-colors" />
            </div>
            <div className="p-6 bg-[#0b0e14] border-t border-[#ffcc00]/20">
              <h3 className="text-2xl font-bold text-[#ffcc00] mb-4">Domingo 16</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#ffcc00] mt-0.5">9:00a.m.</span>
                  <span>Festival del Sancocho</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#ffcc00] mt-0.5">3:00p.m.</span>
                  <span>Juegos Callejeros</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#ffcc00] mt-0.5">9:00p.m.</span>
                  <span>Orquesta Los del Pueblo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Programación Detallada en Texto */}
        <div className="mt-8 p-6 bg-[#0a071e] rounded-2xl border border-[#ffcc00]/20">
          <h3 className="text-center text-[#ffcc00] font-bold mb-4">📋 Detalles de la Programación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-bold text-white mb-2">Viernes 14</h4>
              <ul className="space-y-1 list-disc pl-4">
                <li><strong>9:00 a.m.</strong> Antioqueñidad: Poesía, Dibujo y Puntos Culturales</li>
                <li><strong>7:00 p.m.</strong> Compartir Comunitario</li>
                <li><strong>7:30 p.m.</strong> Presentaciones Artísticas</li>
                <li><strong>8:00 p.m.</strong> Gran Concurso de Talento Local</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Sábado 15</h4>
              <ul className="space-y-1 list-disc pl-4">
                <li><strong>7:00 a.m.</strong> Caminata</li>
                <li><strong>3:00 p.m.</strong> Encuentro Deportivo Olaya vs Colonia</li>
                <li><strong>8:30 p.m.</strong> Presentaciones Artísticas Talento Local</li>
                <li><strong>10:00 p.m.</strong> Orquesta Los Federales de Colombia</li>
                <li><strong>11:40 p.m.</strong> Orquesta Bailable</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Domingo 16</h4>
              <ul className="space-y-1 list-disc pl-4">
                <li><strong>9:00 a.m.</strong> Inicio Festival del Sancocho</li>
                <li><strong>3:00 p.m.</strong> Entrega de Reconocimientos</li>
                <li><strong>3:00 p.m.</strong> Juegos Callejeros Tradicionales</li>
                <li><strong>9:00 p.m.</strong> Orquesta Los del Pueblo</li>
                <li><strong>11:00 p.m.</strong> Orquesta Julio el Emperador</li>
                <li><strong>12:30 a.m.</strong> Orquesta Grupo Los Mágicos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-800 bg-[#0b0e14] text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-[#ffcc00]">🎊</span>
          <span className="text-gray-400 font-serif italic text-sm">Fiestas Tradicionales de Olaya</span>
        </div>
        <p className="text-gray-600 text-xs">
          Desarrollado por directorio <span className="text-emerald-400">Ooasys</span> - Occidente Antioqueño
        </p>
      </footer>
    </main>
  );
}