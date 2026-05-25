// @/components/map/DynamicAtmMapView.tsx
'use client';

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";

// 🧮 Tu utilidad unificada de Oasis
import { calculateDistance, formatDistance } from "@/lib/utils-geo/distance";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface DynamicAtmMapViewProps {
  atms: any[];
}

const BANK_COLORS: Record<string, any> = {
  "bancolombia": {
    marker: "bg-yellow-600",
    headerGradient: "from-yellow-600 to-yellow-700",
    accent: "text-yellow-600",
    border: "border-yellow-200",
    hintBg: "bg-yellow-50",
    hintText: "text-yellow-800",
    hintBorder: "border-yellow-100"
  },
  "gana": {
    marker: "bg-green-600",
    headerGradient: "from-green-600 to-green-700",
    accent: "text-green-600",
    border: "border-green-200",
    hintBg: "bg-green-50",
    hintText: "text-green-800",
    hintBorder: "border-green-100"
  },
  "default": {
    marker: "bg-emerald-600",
    headerGradient: "from-emerald-600 to-emerald-700",
    accent: "text-emerald-600",
    border: "border-emerald-200",
    hintBg: "bg-emerald-50",
    hintText: "text-emerald-800",
    hintBorder: "border-emerald-100"
  }
};

function AtmMapViewComponent({ atms }: DynamicAtmMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const currentPopupRef = useRef<mapboxgl.Popup | null>(null);
  
  const { resolvedTheme } = useTheme();

  // 🎯 COORDENADAS MAESTRAS (Eje del Parque Principal de Sopetrán)
  const SOPETRAN_PARQUE_LAT = 6.50208;
  const SOPETRAN_PARQUE_LNG = -75.74246;
  
  // Coordenada de cámara calibrada para perspectiva 3D (Pitch: 68)
const SOPETRAN_PARQUE_CENTER: [number, number] = [-75.74295, 6.50215];

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
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': resolvedTheme === 'dark' ? '#343434' : '#e0e0e0',
        'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.05, ['get', 'height']],
        'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
        'fill-extrusion-opacity': 0.5
      }
    }, labelLayer?.id);
  };

  // 1. Inicialización de la Vista Cinemática Estática
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapStyle = resolvedTheme === 'dark' ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12";

    if (!mapRef.current) {
      try {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: mapStyle,
          center: SOPETRAN_PARQUE_CENTER,
          zoom: 15.9,
          pitch: 68,  
          bearing: -8,
          antialias: true
        });

        mapRef.current = map;
        map.on('style.load', () => inject3DBuildings(map));
        map.on('click', () => closeAllPopups());
      } catch (err) {
        console.error("❌ MAP ERROR:", err);
      }
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

  // 2. Renderizado de Pines (Escucha fielmente los cambios del arreglo 'atms')
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Limpiamos los pines anteriores de inmediato al cambiar el filtro superior
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    closeAllPopups();

    if (!atms || atms.length === 0) return;

    atms.forEach((atm) => {
      const lng = atm.location?.lng;
      const lat = atm.location?.lat;

      if (!lng || !lat) return;

      // Calcular la distancia real usando tu función
      const distanceInKm = calculateDistance(
        SOPETRAN_PARQUE_LAT,
        SOPETRAN_PARQUE_LNG,
        lat,
        lng
      );

      try {
        const bankKey = atm.bankName?.toLowerCase();
        const colors = BANK_COLORS[bankKey] || BANK_COLORS.default;
        const distanceText = formatDistance(distanceInKm);

        const el = document.createElement("div");
        el.className = `${colors.marker} text-white border-2 border-white rounded-full shadow-lg p-2 cursor-pointer flex items-center justify-center transition-transform duration-200 hover:scale-110`;
        el.style.width = "38px";
        el.style.height = "38px";
        el.style.fontSize = "18px";
        el.innerHTML = "🏧";

        const popupHTML = `
          <div class="p-0 font-sans min-w-60 max-w-70 text-gray-900">
            <div class="bg-linear-to-r ${colors.headerGradient} text-white rounded-t-lg px-3 py-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">🏧</span>
                <div>
                  <h3 class="font-bold text-sm leading-tight">${atm.name}</h3>
                  <p class="text-[11px] text-white/90 opacity-90 font-medium">A ${distanceText} del parque</p>
                </div>
              </div>
            </div>
            <div class="p-3 bg-white rounded-b-lg">
              <div class="mb-1">
                <p class="text-[12px] font-semibold text-gray-800 mb-0.5">📍 Ubicación</p>
                <p class="text-[12.5px] text-gray-700">${atm.addressLabel || 'Dirección no especificada'}</p>
              </div>
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '280px',
          className: 'custom-atm-popup'
        }).setHTML(popupHTML);

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          closeAllPopups();
          popup.setLngLat([lng, lat]).addTo(map);
          currentPopupRef.current = popup;
          
          map.easeTo({
            center: [lng, lat],
            zoom: 17.2,
            duration: 600
          });
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      } catch (markerError) {
        console.error(markerError);
      }
    });

    // 💡 IMPORTANTE: Eliminé el flyTo repetitivo para que Mapbox no interrumpa el estado visual al filtrar

  }, [atms]); // Solo re-renderiza pines cuando el arreglo 'atms' muta desde el componente padre

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full min-h-100 rounded-2xl overflow-hidden shadow-inner" />
      
      <style jsx global>{`
        .custom-atm-popup .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2) !important;
        }
        .custom-atm-popup .mapboxgl-popup-close-button {
          font-size: 16px !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}

export const DynamicAtmMapView = dynamic(() => Promise.resolve(AtmMapViewComponent), {
  ssr: false,
});