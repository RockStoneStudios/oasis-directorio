// radioStations.ts

export interface RadioStation {
  name: string;
  frequency: string;
  location: string;
  url: string;
  currentSong: string;
  listeners: string;
  color: {
    main: string;
    gradient: string;
    glow: string;
    darkGlow: string;
  };
}

export const RADIO_STATIONS: Record<string, RadioStation> = {
  sopetran: {
    name: "SOPETRAN STEREO",
    frequency: "105.4 FM",
    location: "Sopetrán, Antioquia",
    url: "https://radio25.virtualtronics.com:20029/;",
    currentSong: "Música popular colombiana",
    listeners: "127",
    color: {
      main: "orange-500",
      gradient: "from-orange-500 to-orange-600",
      glow: "rgba(249,115,22,0.85)",
      darkGlow: "rgba(255,255,255,0.9)"
    }
  },
  ondas: {
    name: "ONDAS DEL TONUSCO",
    frequency: "104.4 FM",
    location: "Santa Fe de Antioquia",
    url: "https://server2.ejeserver.com:8444/stream",
    currentSong: "Música y cultura antioqueña",
    listeners: "489",
    color: {
      main: "emerald-500",
      gradient: "from-emerald-500 to-teal-600",
      glow: "rgba(16,185,129,0.85)",
      darkGlow: "rgba(255,255,255,0.9)"
    }
  },
  global: {
    name: "GLOBAL FM",
    frequency: "89.4 FM",
    location: "San Jerónimo, Antioquia",
    url: "https://live.asoredes.com:8230/GlobalFm.mp3;", 
    currentSong: "Éxitos internacionales",
    listeners: "234",
    color: {
      main: "sky-500",
      gradient: "from-sky-500 to-cyan-600",
      glow: "rgba(14,165,233,0.85)",
      darkGlow: "rgba(255,255,255,0.9)"
    }
  },
  // 🆕 NUEVA ESTACIÓN: PLAZAS FM
  plazas: {
    name: "PLAZAS FM",
    frequency: "88.9 FM",
    location: "Liborina, Antioquia",
    url: "https://stream.zeno.fm/wnt7nx3saxquv",
    currentSong: "Música variada y compañía",
    listeners: "87",
    color: {
      main: "yellow-500",
      gradient: "from-yellow-500 to-amber-600",
      glow: "rgba(234,179,8,0.85)",
      darkGlow: "rgba(255,255,255,0.9)"
    }
  }
};

// Opcional: Array con los IDs de las estaciones para iterar fácilmente
export const STATION_IDS = Object.keys(RADIO_STATIONS);

// Opcional: Función para obtener una estación por ID
export const getStationById = (id: string): RadioStation | undefined => {
  return RADIO_STATIONS[id];
};