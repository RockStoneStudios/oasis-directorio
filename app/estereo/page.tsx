'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Radio, Heart, Share2, SkipBack, SkipForward, Repeat, Music, Headphones, ChevronDown, ArrowLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
// 👇 Importamos las estaciones desde el archivo externo
import { RADIO_STATIONS, STATION_IDS } from '@/components/stations/radioStations'; 

export default function RadioPlayerPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedStation, setSelectedStation] = useState('sopetran');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { resolvedTheme } = useTheme();

  const currentStation = RADIO_STATIONS[selectedStation];
  const currentColors = currentStation.color;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      if (wasPlaying) {
        audioRef.current.pause();
      }
      
      audioRef.current.src = currentStation.url;
      audioRef.current.load();
      
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [selectedStation]);

  useEffect(() => {
    if (!isMounted || !audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, isMounted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentStation.name,
          text: `🎵 Escuchando ${currentStation.name} ${currentStation.frequency}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error:', err);
      }
    } else {
      navigator.clipboard.writeText(`🎵 Escuchando ${currentStation.name} ${currentStation.frequency}`);
    }
  };

  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId);
    setIsDropdownOpen(false);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#1a1f26] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Colores de sombras según tema
  const lightShadow = {
    outer: '20px 20px 40px rgba(163,177,198,0.8), -20px -20px 40px rgba(255,255,255,0.6)',
    outerHover: 'inset 6px 6px 12px rgba(163,177,198,0.7), inset -6px -6px 12px rgba(255,255,255,0.5)',
    inner: 'inset 6px 6px 15px rgba(163,177,198,0.7), inset -6px -6px 15px rgba(255,255,255,0.5)',
    innerLight: 'inset 3px 3px 10px rgba(163,177,198,0.5), inset -3px -3px 10px rgba(255,255,255,0.4)',
    pressed: 'inset 8px 8px 20px rgba(163,177,198,0.8), inset -8px -8px 20px rgba(255,255,255,0.4)',
    small: '5px 5px 12px rgba(163,177,198,0.6), -5px -5px 12px rgba(255,255,255,0.5)',
    smallHover: 'inset 3px 3px 8px rgba(163,177,198,0.6), inset -3px -3px 8px rgba(255,255,255,0.4)',
    progress: 'inset 8px 8px 16px rgba(163,177,198,0.8), inset -8px -8px 16px rgba(255,255,255,0.4)'
  };

  const darkShadow = {
    outer: '18px 18px 36px rgba(10,14,18,0.9), -18px -18px 36px rgba(35,45,55,0.6)',
    outerHover: 'inset 6px 6px 12px rgba(10,14,18,0.9), inset -6px -6px 12px rgba(35,45,55,0.5)',
    inner: 'inset 8px 8px 20px rgba(0,0,0,0.7), inset -8px -8px 20px rgba(50,60,70,0.4)',
    innerLight: 'inset 4px 4px 12px rgba(0,0,0,0.6), inset -4px -4px 12px rgba(45,55,65,0.4)',
    pressed: 'inset 10px 10px 24px rgba(0,0,0,0.8), inset -10px -10px 24px rgba(40,50,60,0.3)',
    small: '5px 5px 12px rgba(10,14,18,0.8), -5px -5px 12px rgba(35,45,55,0.5)',
    smallHover: 'inset 4px 4px 10px rgba(0,0,0,0.7), inset -4px -4px 10px rgba(45,55,65,0.4)',
    progress: 'inset 8px 8px 16px rgba(0,0,0,0.8), inset -8px -8px 16px rgba(45,55,65,0.4)'
  };

  const shadow = resolvedTheme === 'dark' ? darkShadow : lightShadow;

  // 🎯 CORREGIDO: Botón HUNDIDO cuando está REPRODUCIENDO, SALE cuando está PAUSADO
  const isPlayButtonPressed = isPlaying;

  return (
    <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#0f1217] flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {/* Contenedor principal */}
      <div className="w-full max-w-md">
        
        {/* Tarjeta principal neumórfica con relieve profundo */}
        <div 
          className="bg-[#e0e5ec] dark:bg-[#151a20] rounded-[48px] p-8 transition-all duration-300"
          style={{ boxShadow: shadow.outer }}
        >
          
          {/* ⚡ Contenedor en Línea: Botón Atrás + Selector de Emisora */}
          <div className="flex items-center gap-4 mb-6 relative" ref={dropdownRef}>
            
            {/* Botón Atrás con relieve profundo */}
            <button
              onClick={() => router.back()}
              className="w-12 h-12 shrink-0 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] transition-all duration-300 flex items-center justify-center group"
              style={{ boxShadow: shadow.small }}
              onMouseDown={(e) => { e.currentTarget.style.boxShadow = shadow.smallHover; }}
              onMouseUp={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-slate-300 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Selector Desplegable */}
            <div className="flex-1 relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 rounded-2xl bg-[#e0e5ec] dark:bg-[#151a20] transition-all duration-300 flex items-center justify-between group"
                style={{ boxShadow: shadow.small }}
                onMouseDown={(e) => { e.currentTarget.style.boxShadow = shadow.smallHover; }}
                onMouseUp={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${currentColors.gradient} flex items-center justify-center text-white text-[11px] font-bold shadow-lg`}>
                    {currentStation.frequency.split(' ')[0]}
                  </div>
                  <div className="flex flex-col items-start truncate">
                    <span className="text-sm font-bold text-gray-800 dark:text-slate-100 truncate w-full text-left">
                      {currentStation.name}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-slate-500 truncate w-full text-left">
                      {currentStation.frequency} • {currentStation.location.split(",")[0]}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 text-gray-600 dark:text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown con sombra profunda */}
              {isDropdownOpen && (
                <div 
                  className="absolute top-full left-0 right-0 mt-3 z-10 bg-[#e0e5ec] dark:bg-[#151a20] rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200"
                  style={{ boxShadow: shadow.outer }}
                >
                  {STATION_IDS.map((stationId, index) => {
                    const station = RADIO_STATIONS[stationId];
                    const isSelected = selectedStation === stationId;
                    return (
                      <div key={stationId}>
                        <button
                          onClick={() => handleStationSelect(stationId)}
                          className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3 ${
                            isSelected
                              ? `bg-gradient-to-r ${station.color.gradient} bg-opacity-10`
                              : 'hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                          style={isSelected ? { boxShadow: shadow.innerLight } : {}}
                        >
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${station.color.gradient} flex items-center justify-center text-white text-[11px] font-bold shadow-md`}>
                            {station.frequency.split(' ')[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{station.name}</div>
                            <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{station.frequency} • {station.location.split(',')[0]}</div>
                          </div>
                          {isSelected && (
                            <div className={`w-2 h-2 rounded-full bg-${station.color.main} shadow-glow`}></div>
                          )}
                        </button>
                        {index < STATION_IDS.length - 1 && (
                          <div className="h-px bg-gray-300/50 dark:bg-gray-700/50 mx-3"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Header con círculo neumórfico de doble capa */}
          <div className="flex justify-center mb-10">
            <div 
              className="w-36 h-36 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] flex items-center justify-center transition-all duration-300"
              style={{ boxShadow: shadow.outer }}
            >
              <div 
                className={`w-28 h-28 rounded-full bg-[#dce2ec] dark:bg-[#10141a] flex items-center justify-center transition-all duration-500 ${isPlaying ? 'animate-spin-slow' : ''}`}
                style={{ boxShadow: shadow.inner }}
              >
                <Radio 
                  className={`w-12 h-12 transition-all duration-500 ease-in-out
                    ${isPlaying 
                      ? `text-${currentColors.main} dark:text-white drop-shadow-[0_0_15px_${currentColors.glow}]` 
                      : 'text-gray-400 dark:text-gray-600'
                    }`} 
                />
              </div>
            </div>
          </div>

          {/* Información de la emisora */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1 tracking-tight">{currentStation.name}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">{currentStation.frequency} • {currentStation.location}</p>
          </div>

          {/* Barra de progreso con efecto hundido */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-3">
              <span className="font-mono">{isPlaying ? 'LIVE' : '0:00'}</span>
              <span className={`text-${currentColors.main} font-mono text-[10px] tracking-wider`}>● STREAMING</span>
              <span className="font-mono">3:45</span>
            </div>
            <div 
              className="h-2 rounded-full overflow-hidden transition-all duration-300"
              style={{ boxShadow: shadow.progress }}
            >
              <div 
                className={`h-full bg-gradient-to-r ${currentColors.gradient} rounded-full transition-all duration-500 relative`}
                style={{ width: isPlaying ? '12%' : '0%' }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Controles principales */}
          <div className="flex items-center justify-center gap-5 mb-8">
            <button 
              className="w-14 h-14 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] transition-all duration-300 flex items-center justify-center group"
              style={{ boxShadow: shadow.small }}
              onMouseDown={(e) => { e.currentTarget.style.boxShadow = shadow.smallHover; }}
              onMouseUp={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
            >
              <SkipBack className="w-5 h-5 text-gray-700 dark:text-slate-300 group-hover:scale-110 transition-transform" />
            </button>
            
            {/* 🎯 BOTÓN DE PLAY/PAUSA - HUNDIDO cuando REPRODUCE, SALIDO cuando PAUSA */}
            <button
              onClick={togglePlay}
              className="w-24 h-24 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] transition-all duration-300 flex items-center justify-center"
              style={{ 
                boxShadow: isPlayButtonPressed ? shadow.pressed : shadow.outer
              }}
              title={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? (
                <Pause className={`w-10 h-10 transition-all duration-500 ease-in-out text-${currentColors.main} dark:text-white drop-shadow-[0_0_15px_${currentColors.glow}]`} />
              ) : (
                <Play className="w-10 h-10 ml-1 transition-all duration-500 ease-in-out text-gray-500 dark:text-gray-500" />
              )}
            </button>
            
            <button 
              className="w-14 h-14 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] transition-all duration-300 flex items-center justify-center group"
              style={{ boxShadow: shadow.small }}
              onMouseDown={(e) => { e.currentTarget.style.boxShadow = shadow.smallHover; }}
              onMouseUp={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
            >
              <SkipForward className="w-5 h-5 text-gray-700 dark:text-slate-300 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Botones de acción secundarios */}
          <div className="flex items-center justify-center gap-5 mb-8">
            <button 
              className="w-11 h-11 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] transition-all duration-300 flex items-center justify-center"
              style={{ boxShadow: shadow.small }}
              onMouseDown={(e) => { e.currentTarget.style.boxShadow = shadow.smallHover; }}
              onMouseUp={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
            >
              <Repeat className="w-4 h-4 text-gray-600 dark:text-slate-400" />
            </button>
            
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="w-11 h-11 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] transition-all duration-300 flex items-center justify-center"
              style={{ boxShadow: shadow.small }}
              onMouseDown={(e) => { e.currentTarget.style.boxShadow = shadow.smallHover; }}
              onMouseUp={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
            >
              <Heart className={`w-4 h-4 transition-all ${isLiked ? `fill-${currentColors.main} text-${currentColors.main} scale-110` : 'text-gray-600 dark:text-slate-400'}`} />
            </button>
            
            <button 
              className="w-11 h-11 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] transition-all duration-300 flex items-center justify-center"
              style={{ boxShadow: shadow.small }}
              onMouseDown={(e) => { e.currentTarget.style.boxShadow = shadow.smallHover; }}
              onMouseUp={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
            >
              <Music className="w-4 h-4 text-gray-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Control de volumen con efecto hundido */}
          <div 
            className="flex items-center gap-4 p-4 rounded-2xl mb-6 transition-all duration-300"
            style={{ boxShadow: shadow.inner }}
          >
            <button onClick={toggleMute} className="flex-shrink-0">
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              ) : (
                <Volume2 className={`w-4 h-4 text-${currentColors.main}`} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${currentColors.main === 'orange-500' ? '#f97316' : currentColors.main === 'emerald-500' ? '#10b981' : '#0ea5e9'} ${volume * 100}%, ${resolvedTheme === 'dark' ? '#2e3742' : '#cbd5e1'} ${volume * 100}%)`
              }}
            />
            <span className="text-xs text-gray-500 dark:text-slate-400 font-mono w-9">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Indicador de canción actual con efecto hundido */}
          <div 
            className="p-4 rounded-2xl transition-all duration-300"
            style={{ boxShadow: shadow.inner }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">Escuchando ahora:</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold truncate max-w-[180px]">{currentStation.currentSong}</span>
            </div>
          </div>

          {/* Botón de compartir con relieve pronunciado */}
          <button
            onClick={handleShare}
            className="w-full mt-6 py-3 rounded-2xl bg-[#e0e5ec] dark:bg-[#151a20] transition-all duration-300 text-gray-700 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2"
            style={{ boxShadow: shadow.small }}
            onMouseDown={(e) => { e.currentTarget.style.boxShadow = shadow.smallHover; }}
            onMouseUp={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
          >
            <Share2 className="w-4 h-4" />
            Compartir emisora
          </button>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-[10px] text-gray-400 dark:text-slate-500 tracking-wide">
              {currentStation.listeners} oyentes conectados
            </p>
          </div>
        </div>
      </div>

      {/* Elemento de audio */}
      <audio
        ref={audioRef}
        src={currentStation.url}
        preload="none"
        onContextMenu={(e) => e.preventDefault()}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slide-in-from-top-2 0.25s ease-out;
        }
        
        input[type="range"] {
          -webkit-appearance: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid ${resolvedTheme === 'dark' ? '#151a20' : '#e0e5ec'};
          transition: transform 0.15s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        
        .shadow-glow {
          box-shadow: 0 0 8px currentColor;
        }
      `}</style>
    </div>
  );
}