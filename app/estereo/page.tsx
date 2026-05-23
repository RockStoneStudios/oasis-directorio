'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Heart, Share2, SkipBack, SkipForward, Repeat, Music, Headphones, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
// 👇 Importamos las estaciones desde el archivo externo
import { RADIO_STATIONS, STATION_IDS } from '@/components/stations/radioStations'; // Ajusta la ruta según donde guardes el archivo

export default function RadioPlayerPage() {
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

  // Obtenemos la estación actual
  const currentStation = RADIO_STATIONS[selectedStation];
  const currentColors = currentStation.color;

  // Cerrar dropdown al hacer click fuera
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

  // Cambiar URL cuando se selecciona otra emisora
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

  return (
    <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#181926] flex items-center justify-center p-4 transition-colors duration-300">
      
      {/* Contenedor principal */}
      <div className="w-full max-w-md">
        
        {/* Tarjeta principal neumórfica */}
        <div className="bg-[#e0e5ec] dark:bg-[#1a1f26] rounded-[40px] p-9 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] dark:shadow-[9px_9px_16px_rgba(15,18,22,0.7),-9px_-9px_16px_rgba(35,43,53,0.4)] transition-all duration-300">
          
          {/* Selector de emisora - Versión compacta */}
          <div className="mb-4 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 rounded-xl bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] dark:shadow-[5px_5px_10px_rgba(15,18,22,0.7),-5px_-5px_10px_rgba(35,43,53,0.4)] hover:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6)] dark:hover:shadow-[inset_3px_3px_6px_rgba(15,18,22,0.8)] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-slate-400">📻</span>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-gray-800 dark:text-slate-100">
                    {currentStation.name}
                  </span>
                  <span className="text-[10.5px] text-gray-500 dark:text-slate-500">
                    {currentStation.frequency} • {currentStation.location.split(",")[0]}
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown dinámico */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-[#e0e5ec] dark:bg-[#1a1f26] rounded-xl shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] dark:shadow-[9px_9px_16px_rgba(15,18,22,0.7),-9px_-9px_16px_rgba(35,43,53,0.4)] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                {STATION_IDS.map((stationId, index) => (
                  <div key={stationId}>
                    <button
                      onClick={() => handleStationSelect(stationId)}
                      className={`w-full px-3 py-2 text-left transition-all flex items-center gap-2 ${
                        selectedStation === stationId
                          ? `bg-${RADIO_STATIONS[stationId].color.main}/10 dark:bg-${RADIO_STATIONS[stationId].color.main}/20 shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6)] dark:shadow-[inset_3px_3px_6px_rgba(15,18,22,0.8)]`
                          : 'hover:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6)] dark:hover:shadow-[inset_3px_3px_6px_rgba(15,18,22,0.8)]'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${RADIO_STATIONS[stationId].color.gradient} flex items-center justify-center text-white text-[10px] font-bold`}>
                        {RADIO_STATIONS[stationId].frequency.split(' ')[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-[12.5px] font-semibold text-gray-800 dark:text-slate-100">{RADIO_STATIONS[stationId].name}</div>
                        <div className="text-[11px] text-gray-500 dark:text-slate-400">{RADIO_STATIONS[stationId].frequency} • {RADIO_STATIONS[stationId].location.split(',')[0]}</div>
                      </div>
                      {selectedStation === stationId && (
                        <div className={`w-1.5 h-1.5 rounded-full bg-${RADIO_STATIONS[stationId].color.main}`}></div>
                      )}
                    </button>
                    {index < STATION_IDS.length - 1 && (
                      <div className="h-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Header con círculo neumórfico */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] dark:shadow-[9px_9px_16px_rgba(15,18,22,0.7),-9px_-9px_16px_rgba(35,43,53,0.4)] flex items-center justify-center">
              <div className={`w-24 h-24 rounded-full bg-[#e6ebf4] dark:bg-[#151a20] shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4)] flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                <Radio 
                  className={`w-10 h-10 transition-all duration-500 ease-in-out
                    ${isPlaying 
                      ? `text-${currentColors.main} dark:text-white drop-shadow-[0_0_10px_${currentColors.glow}] dark:drop-shadow-[0_0_10px_${currentColors.darkGlow}]` 
                      : 'text-gray-400 dark:text-gray-600 drop-shadow-none'
                    }`} 
                />
              </div>
            </div>
          </div>

          {/* Información de la emisora */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1 tracking-tight">{currentStation.name}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">{currentStation.frequency} • {currentStation.location}</p>
          </div>

          {/* Barra de progreso */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-2">
              <span>{isPlaying ? 'LIVE' : '0:00'}</span>
              <span className={`text-${currentColors.main} font-mono`}>● STREAMING</span>
              <span>3:45</span>
            </div>
            <div className="relative">
              <div className="h-2 bg-[#e0e5ec] dark:bg-[#1a1f26] rounded-full shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_6px_rgba(15,18,22,0.8),inset_-3px_-3px_6px_rgba(35,43,53,0.5)] overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${currentColors.gradient} rounded-full transition-all duration-500`}
                  style={{ width: isPlaying ? '10%' : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Controles principales */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button className="w-12 h-12 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] dark:shadow-[5px_5px_10px_rgba(15,18,22,0.7),-5px_-5px_10px_rgba(35,43,53,0.4)] hover:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6)] dark:hover:shadow-[inset_3px_3px_6px_rgba(15,18,22,0.8)] transition-all flex items-center justify-center group">
              <SkipBack className="w-5 h-5 text-gray-700 dark:text-slate-300 group-hover:scale-105 transition-transform" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] dark:shadow-[9px_9px_16px_rgba(15,18,22,0.7),-9px_-9px_16px_rgba(35,43,53,0.4)] hover:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6)] dark:hover:shadow-[inset_5px_5px_10px_rgba(15,18,22,0.8)] transition-all flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className={`w-8 h-8 transition-all duration-500 ease-in-out text-${currentColors.main} dark:text-white drop-shadow-[0_0_10px_${currentColors.glow}] dark:drop-shadow-[0_0_10px_${currentColors.darkGlow}]`} />
              ) : (
                <Play className="w-8 h-8 ml-1 transition-all duration-500 ease-in-out text-gray-400 dark:text-gray-600 drop-shadow-none" />
              )}
            </button>
            <button className="w-12 h-12 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] dark:shadow-[5px_5px_10px_rgba(15,18,22,0.7),-5px_-5px_10px_rgba(35,43,53,0.4)] hover:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6)] dark:hover:shadow-[inset_3px_3px_6px_rgba(15,18,22,0.8)] transition-all flex items-center justify-center group">
              <SkipForward className="w-5 h-5 text-gray-700 dark:text-slate-300 group-hover:scale-105 transition-transform" />
            </button>
          </div>

          {/* Botones de acción secundarios */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button className="w-10 h-10 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[3px_3px_6px_rgba(15,18,22,0.7),-3px_-3px_6px_rgba(35,43,53,0.4)] transition-all flex items-center justify-center">
              <Repeat className="w-4 h-4 text-gray-600 dark:text-slate-400" />
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="w-10 h-10 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[3px_3px_6px_rgba(15,18,22,0.7),-3px_-3px_6px_rgba(35,43,53,0.4)] transition-all flex items-center justify-center"
            >
              <Heart className={`w-4 h-4 ${isLiked ? `fill-${currentColors.main} text-${currentColors.main}` : 'text-gray-600 dark:text-slate-400'}`} />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[3px_3px_6px_rgba(15,18,22,0.7),-3px_-3px_6px_rgba(35,43,53,0.4)] transition-all flex items-center justify-center">
              <Music className="w-4 h-4 text-gray-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Control de volumen */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[inset_3px_3px_8px_rgba(163,177,198,0.6),inset_-3px_-3px_8px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_8px_rgba(15,18,22,0.8),inset_-3px_-3px_8px_rgba(35,43,53,0.5)]">
            <button onClick={toggleMute}>
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
            <span className="text-xs text-gray-500 dark:text-slate-400 font-mono w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Indicador de canción actual */}
          <div className="mt-6 p-3 rounded-2xl bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[inset_3px_3px_8px_rgba(163,177,198,0.6),inset_-3px_-3px_8px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_8px_rgba(15,18,22,0.8),inset_-3px_-3px_8px_rgba(35,43,53,0.5)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-3 h-3 text-green-500" />
                <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">Escuchando ahora:</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold">{currentStation.currentSong}</span>
            </div>
          </div>

          {/* Botón de compartir */}
          <button
            onClick={handleShare}
            className="w-full mt-6 py-3 rounded-2xl bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] dark:shadow-[5px_5px_10px_rgba(15,18,22,0.7),-5px_-5px_10px_rgba(35,43,53,0.4)] hover:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6)] dark:hover:shadow-[inset_3px_3px_6px_rgba(15,18,22,0.8)] transition-all text-gray-700 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2"
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
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slide-in-from-top-2 0.2s ease-out;
        }
        
        input[type="range"] {
          -webkit-appearance: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: ${currentColors.main === 'orange-500' ? '#f97316' : currentColors.main === 'emerald-500' ? '#10b981' : '#0ea5e9'};
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          border: 2px solid ${resolvedTheme === 'dark' ? '#1a1f26' : '#e0e5ec'};
          transition: transform 0.1s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
}