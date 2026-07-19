'use client';

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";

// Forzar la lectura del token de Mapbox en el cliente
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
mapboxgl.accessToken = MAPBOX_TOKEN;

interface FocoIncendio {
  latitude: number;
  longitude: number;
  acq_time: string;
  acq_date: string;
  confidence: string; // En VIIRS suele ser 'n' (nominal), 'h' (alta), 'l' (baja)
  frp: number;        // Potencia radiativa del fuego en Megavatios
  daynight: string;   // D = Día, N = Noche
}

function IncendiosMapViewComponent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const currentPopupRef = useRef<mapboxgl.Popup | null>(null);
  
  const [focos, setFocos] = useState<FocoIncendio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const ANTIOQUIA_CENTER: [number, number] = [-75.8281, 6.5568];

  const closeAllPopups = () => {
    if (currentPopupRef.current) {
      currentPopupRef.current.remove();
      currentPopupRef.current = null;
    }
  };

  const inject3DBuildings = (map: mapboxgl.Map) => {
    if (map.getLayer('3d-buildings')) return;
    const layers = map.getStyle()?.layers;
    const labelLayer = layers?.find(l => l.type === 'symbol' && (l.layout as any)?.['text-field']);

    map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 13,
      'paint': {
        'fill-extrusion-color': resolvedTheme === 'dark' ? '#1e293b' : '#e2e8f0',
        'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.05, ['get', 'height']],
        'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
        'fill-extrusion-opacity': 0.5
      }
    }, labelLayer?.id);
  };

  // 1. Carga de datos unificada desde el Route Handler seguro
  useEffect(() => {
    async function cargarDatosIncendios() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/nasa-firms');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error local del servidor (${response.status})`);
        }

        const textoCSV = await response.text();
        const lineas = textoCSV.split('\n');
        
        // Mapeo dinámico de cabeceras para asegurar exactitud posicional en VIIRS
        const cabeceras = lineas[0].split(',');
        const idxLat = cabeceras.indexOf('latitude');
        const idxLng = cabeceras.indexOf('longitude');
        const idxDate = cabeceras.indexOf('acq_date');
        const idxTime = cabeceras.indexOf('acq_time');
        const idxConfidence = cabeceras.indexOf('confidence');
        const idxFrp = cabeceras.indexOf('frp');
        const idxDayNight = cabeceras.indexOf('daynight');

        const resultado: FocoIncendio[] = [];

        for (let i = 1; i < lineas.length; i++) {
          const columnas = lineas[i].split(',');
          if (columnas.length > 2 && columnas[idxLat] && columnas[idxLng]) {
            resultado.push({
              latitude: parseFloat(columnas[idxLat]),
              longitude: parseFloat(columnas[idxLng]),
              acq_date: columnas[idxDate] || '',
              acq_time: columnas[idxTime] || '',
              confidence: columnas[idxConfidence] || 'n',
              frp: parseFloat(columnas[idxFrp]) || 0,
              daynight: columnas[idxDayNight] || 'D',
            });
          }
        }

        setFocos(resultado);
      } catch (err: any) {
        console.error("❌ Error procesando telemetría:", err);
        setError(err.message || 'Error al compilar datos térmicos.');
      } finally {
        setLoading(false);
      }
    }

    cargarDatosIncendios();
  }, []);

  // 2. Controladores de renderizado de Mapbox
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Si la variable está vacía, usamos un fallback público temporal para asegurar renderizado visual
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = "pk.eyJ1IjoibWFwYm94Z2wiLCJhIjoiY2N4bW9kZXN0MTE5MmR0MnB4bnd4bnd4Ynd4In0.fallback";
    }

    const mapStyle = resolvedTheme === 'dark' ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11";

    if (!mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: ANTIOQUIA_CENTER,
        zoom: 9.1,
        pitch: 35,  
        bearing: 0,
        antialias: true
      });

      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.on('style.load', () => inject3DBuildings(map));
      map.on('click', () => closeAllPopups());
    } else {
      mapRef.current.setStyle(mapStyle);
      mapRef.current.once('style.load', () => {
        if (mapRef.current) inject3DBuildings(mapRef.current);
      });
    }
  }, [resolvedTheme]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 3. Inyección de Marcadores Enriquecidos con datos VIIRS
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    closeAllPopups();

    if (focos.length === 0) return;

    focos.forEach((foco) => {
      const lng = foco.longitude;
      const lat = foco.latitude;

      const el = document.createElement("div");
      el.className = "relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125";
      el.style.width = "28px";
      el.style.height = "28px";

      // El tamaño del pulso visual ahora depende de la potencia destructiva (FRP) del incendio
      const pulseScale = foco.frp > 10 ? 'h-7 w-7 bg-red-600/40' : 'h-5 w-5 bg-orange-500/30';
      const coreColor = foco.frp > 10 ? 'bg-red-600' : 'bg-amber-500';

      el.innerHTML = `
        <span class="absolute inline-flex rounded-full ${pulseScale} animate-ping"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 ${coreColor} border border-white shadow-md"></span>
      `;

      // Traducción amigable de niveles de confianza VIIRS
      const confLabel = foco.confidence === 'h' ? 'Alta 🚨' : foco.confidence === 'l' ? 'Baja ⚠️' : 'Nominal (Estándar)';

      const popupHTML = `
        <div class="p-0 font-sans min-w-60 text-slate-900 bg-white rounded-xl shadow-xl">
          <div class="bg-slate-900 text-white rounded-t-xl px-4 py-2.5">
            <h3 class="font-bold text-xs tracking-wide uppercase">Detección Satelital VIIRS</h3>
            <p class="text-[10px] text-slate-400">Órbita NOAA — Sensor Activo</p>
          </div>
          <div class="p-4 space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Potencia Térmica</p>
                <p class="font-extrabold text-slate-800 text-sm">${foco.frp.toFixed(1)} MW</p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Horario Captura</p>
                <p class="font-medium text-slate-700">${foco.acq_time} UTC</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2">
              <div>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Confianza</p>
                <p class="font-medium text-slate-700">${confLabel}</p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ambiente</p>
                <p class="font-medium text-slate-700">${foco.daynight === 'D' ? 'Diurno ☀️' : 'Nocturno 🌙'}</p>
              </div>
            </div>

            <div class="border-t border-slate-100 pt-2 text-[10px] text-slate-400 text-center">
              Foco: ${lat.toFixed(4)}, ${lng.toFixed(4)}
            </div>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 14,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '280px',
        className: 'custom-incendio-popup'
      }).setHTML(popupHTML);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPopups();
        popup.setLngLat([lng, lat]).addTo(map);
        currentPopupRef.current = popup;
        
        map.easeTo({
          center: [lng, lat],
          zoom: 13,
          pitch: 55,
          duration: 600
        });
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

  }, [focos]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto mb-8 border-b border-slate-200 dark:border-slate-800 pb-5">
        <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          Ooasys Directorio // Gestión Subregional
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Monitoreo Térmico — Occidente Cercano y Medio
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
          Anomalías térmicas e incendios forestales potenciales en el Cañón del Cauca y municipios del occidente antioqueño detectados en las últimas 24 horas.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
              Alertas en el Cuadrante
            </h2>
            
            {loading ? (
              <div className="flex items-center space-x-2 text-slate-500 text-sm">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Leyendo barrido de órbita espacial...</span>
              </div>
            ) : error ? (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Puntos calientes activos:</span>
                  <span className={`text-lg font-bold ${focos.length > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                    {focos.length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Región de Análisis:</span>
                  <span className="text-xs font-medium text-slate-500 text-right">
                    Occidente Antioqueño
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 h-[550px] w-full bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
        </div>
      </div>

      <style jsx global>{`
        .custom-incendio-popup .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          background: #ffffff !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid #e2e8f0 !important;
        }
        .custom-incendio-popup .mapboxgl-popup-close-button {
          font-size: 16px !important;
          color: #ffffff !important;
          top: 6px !important;
          right: 8px !important;
        }
      `}</style>
    </main>
  );
}

export default dynamic(() => Promise.resolve(IncendiosMapViewComponent), {
  ssr: false,
});