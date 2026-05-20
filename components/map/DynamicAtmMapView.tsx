// @/components/map/DynamicAtmMapView.tsx
'use client';

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface DynamicAtmMapViewProps {
  atms: any[];
}

function AtmMapViewComponent({ atms }: DynamicAtmMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // 1. Inicialización del Mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Coordenadas fijas por defecto de Sopetrán para asegurar que no se descuadre [Lng, Lat]
    const defaultCenter: [number, number] = [-75.742505, 6.500962];

    console.log("🗺️ MAP LOG 1 - Inicializando mapa en Sopetrán:", defaultCenter);

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: defaultCenter,
        zoom: 15,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    } catch (err) {
      console.error("❌ MAP ERROR - Error creando el objeto Mapbox:", err);
    }

    return () => {
      if (mapRef.current) {
        console.log("🗑️ MAP LOG - Destruyendo instancia del mapa");
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Renderizado de Marcadores (Se ejecuta cada vez que 'atms' cambia)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      console.log("⚠️ MAP LOG 2 - El mapa aún no está listo para recibir marcadores.");
      return;
    }

    console.log("🗺️ MAP LOG 3 - Recibiendo cajeros filtrados para pintar en el mapa:", atms);

    // Limpiamos marcadores previos
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (atms.length === 0) {
      console.log("⚠️ MAP LOG 4 - No llegaron cajeros a este useEffect. Arreglo vacío.");
      return;
    }

    atms.forEach((atm, index) => {
      const lng = atm.location?.lng;
      const lat = atm.location?.lat;

      console.log(`📍 MAP LOG 5 [Cajero ${index}] - Evaluando coordenadas:`, { name: atm.name, lng, lat });

      if (!lng || !lat) {
        console.warn(`❌ MAP LOG 6 - El cajero "${atm.name}" no tiene coordenadas válidas de longitud o latitud.`);
        return;
      }

      try {
        // Crear el elemento HTML del pin
        const el = document.createElement("div");
        el.className = "bg-emerald-600 text-white border-2 border-white rounded-full shadow-lg p-2 cursor-pointer flex items-center justify-center transition-transform hover:scale-110 z-50";
        el.style.width = "38px";
        el.style.height = "38px";
        el.style.fontSize = "18px";
        el.innerHTML = "🏧";

        const popupHTML = `
          <div class="p-2.5 font-sans min-w-[210px]">
            <div class="flex items-center justify-between gap-2 mb-1">
              <h3 class="font-bold text-sm text-gray-900">${atm.name}</h3>
              ${atm.is24Hours ? `<span class="bg-green-100 text-green-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">24H</span>` : ""}
            </div>
            <p class="text-xs text-gray-500">📍 ${atm.addressLabel || 'Dirección'}</p>
            ${atm.address?.directionDetails ? `<p class="text-[10px] text-gray-400 italic mt-0.5">"${atm.address.directionDetails}"</p>` : ""}
            ${atm.recommendation ? `
              <div class="mt-2 text-[11px] bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-100 italic">
                <strong>Nota:</strong> ${atm.recommendation}
              </div>
            ` : ""}
          </div>
        `;

        // Crear e inyectar el marcador en las coordenadas [longitud, latitud]
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
          .addTo(map);

        markersRef.current.push(marker);
        console.log(`✅ MAP LOG 7 - ¡Marcador añadido con éxito para: ${atm.name}!`);
      } catch (markerError) {
        console.error(`❌ MAP ERROR - Falló la creación del pin para ${atm.name}:`, markerError);
      }
    });

    // Si hay marcadores válidos, forzar a la cámara del mapa a moverse al primer punto disponible
    if (atms.length > 0 && atms[0].location?.lng && atms[0].location?.lat) {
      console.log("🎥 MAP LOG 8 - Moviendo la cámara del mapa hacia el primer cajero.");
      map.flyTo({
        center: [atms[0].location.lng, atms[0].location.lat],
        zoom: 16,
        essential: true
      });
    }

  }, [atms]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full min-h-[400px]" />
    </div>
  );
}

export const DynamicAtmMapView = dynamic(() => Promise.resolve(AtmMapViewComponent), {
  ssr: false,
});