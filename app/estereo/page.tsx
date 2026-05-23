'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Heart, Share2, SkipBack, SkipForward, Repeat, Music, Headphones } from 'lucide-react';
// 👇 Importamos el hook para leer el tema activo
import { useTheme } from 'next-themes';

export default function RadioPlayerPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 👇 Obtenemos el tema del sistema/usuario
  const { resolvedTheme } = useTheme();

  const streamUrl = "https://server2.ejeserver.com:8444/stream";
  

  const stationInfo = {
    name: "SOPETRAN STEREO",
    frequency: "105.4 FM",
    location: "Sopetrán, Antioquia",
    currentSong: "Música popular colombiana",
    listeners: "127"
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          title: 'SOPETRAN STEREO',
          text: '🎵 Escuchando SOPETRAN STEREO 105.4 FM',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error:', err);
      }
    } else {
      navigator.clipboard.writeText('🎵 Escuchando SOPETRAN STEREO 105.4 FM');
    }
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
        
        {/* Tarjeta principal neumórfica adaptada a Dark Mode */}
        <div className="bg-[#e0e5ec] dark:bg-[#1a1f26] rounded-[40px] p-8 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] dark:shadow-[9px_9px_16px_rgba(15,18,22,0.7),-9px_-9px_16px_rgba(35,43,53,0.4)] transition-all duration-300">
          
          {/* Header con círculo neumórfico */}
          <div className="flex justify-center mb-8">
  <div className="w-32 h-32 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] dark:shadow-[9px_9px_16px_rgba(15,18,22,0.7),-9px_-9px_16px_rgba(35,43,53,0.4)] flex items-center justify-center">
    
    {/* 👇 Quitamos el fondo naranja. Ahora es un contenedor oscuro/claro sutil donde resalta el neón */}
    <div className={`w-24 h-24 rounded-full bg-[#e6ebf4] dark:bg-[#151a20] shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4)] flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
      
      <Radio 
        className={`w-10 h-10 transition-all duration-500 ease-in-out
          ${isPlaying 
            ? 'text-orange-500 dark:text-white drop-shadow-[0_0_10px_rgba(249,115,22,0.85)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]' 
            : 'text-gray-400 dark:text-gray-600 drop-shadow-none'
          }`} 
      />

    </div>
  </div>
</div>

          {/* Información del artista/radio */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1 tracking-tight">{stationInfo.name}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">{stationInfo.frequency} • {stationInfo.location}</p>
          </div>

          {/* Barra de progreso neumórfica */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-2">
              <span>{isPlaying ? 'LIVE' : '0:00'}</span>
              <span className="text-orange-500 font-mono">● STREAMING</span>
              <span>3:45</span>
            </div>
            <div className="relative">
              <div className="h-2 bg-[#e0e5ec] dark:bg-[#1a1f26] rounded-full shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_6px_rgba(15,18,22,0.8),inset_-3px_-3px_6px_rgba(35,43,53,0.5)] overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                  style={{ width: isPlaying ? '10%' : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Controles principales neumórficos */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button className="w-12 h-12 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] dark:shadow-[5px_5px_10px_rgba(15,18,22,0.7),-5px_-5px_10px_rgba(35,43,53,0.4)] hover:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6)] dark:hover:shadow-[inset_3px_3px_6px_rgba(15,18,22,0.8)] transition-all flex items-center justify-center group">
              <SkipBack className="w-5 h-5 text-gray-700 dark:text-slate-300 group-hover:scale-105 transition-transform" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] dark:shadow-[9px_9px_16px_rgba(15,18,22,0.7),-9px_-9px_16px_rgba(35,43,53,0.4)] hover:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6)] dark:hover:shadow-[inset_5px_5px_10px_rgba(15,18,22,0.8)] transition-all flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className={`w-8 h-8 transition-all duration-500 ease-in-out text-orange-500 dark:text-white drop-shadow-[0_0_10px_rgba(249,115,22,0.85)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]`} />
              ) : (
                <Play className={`w-8 h-8 ml-1 transition-all duration-500 ease-in-out text-gray-400 dark:text-gray-600 drop-shadow-none`} />
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
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-orange-500 text-orange-500' : 'text-gray-600 dark:text-slate-400'}`} />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[3px_3px_6px_rgba(15,18,22,0.7),-3px_-3px_6px_rgba(35,43,53,0.4)] transition-all flex items-center justify-center">
              <Music className="w-4 h-4 text-gray-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Control de volumen neumórfico */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#e0e5ec] dark:bg-[#1a1f26] shadow-[inset_3px_3px_8px_rgba(163,177,198,0.6),inset_-3px_-3px_8px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_8px_rgba(15,18,22,0.8),inset_-3px_-3px_8px_rgba(35,43,53,0.5)]">
            <button onClick={toggleMute}>
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-orange-500" />
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
                background: `linear-gradient(to right, #f97316 ${volume * 100}%, ${resolvedTheme === 'dark' ? '#2e3742' : '#cbd5e1'} ${volume * 100}%)`
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
              <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold">{stationInfo.currentSong}</span>
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
              {stationInfo.listeners} oyentes conectados
            </p>
          </div>
        </div>
      </div>

      {/* Elemento de audio */}
      <audio
        ref={audioRef}
        src={streamUrl}
        preload="none"
        onContextMenu={(e) => e.preventDefault()}
      />

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        input[type="range"] {
          -webkit-appearance: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: #f97316;
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