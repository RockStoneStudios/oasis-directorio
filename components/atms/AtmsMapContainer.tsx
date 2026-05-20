// src/components/atms/AtmsMapContainer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Configura tu token de Mapbox aquí o desde tus variables de entorno
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface AtmPoint {
  _id: string;
  name: string;
  bankName: string;
  is24Hours: boolean;
  recommendation: string;
  location: { lat: number; lng: number };
  addressLabel: string;
  directionDetails: string;
}

interface AtmsMapContainerProps {
  initialAtms: AtmPoint[];
  currentMunicipality?: string;
}

export function AtmsMapContainer({ initialAtms, currentMunicipality }: AtmsMapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [atms] = useState<AtmPoint[]>(initialAtms);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Coordenadas por defecto iniciales (Sopetrán/Antioquia aprox si no hay puntos)
    const defaultCenter: [number, number] = [-75.7436, 6.5039]; 
    
    // Si hay cajeros, centrar el mapa en el primero de la lista
    const center: [number, number] = atms.length > 0 
      ? [atms[0].location.lng, atms[0].location.lat] 
      : defaultCenter;

    // 1. Inicializar el mapa de Mapbox
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12", // Estilo claro de calles
      center: center,
      zoom: 15,
    });

    // Agregar controles de navegación (zoom +/-)
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [atms]);

  // 2. Renderizar los marcadores de los cajeros en el mapa
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Limpiar marcadores anteriores si existen
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Pintar cada cajero en el mapa
    atms.forEach((atm) => {
      if (!atm.location.lng || !atm.location.lat) return;

      // Crear el elemento HTML del Pin personalizado para el cajero
      const el = document.createElement("div");
      el.className = "atm-custom-marker bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-white rounded-full shadow-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-110";
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.fontSize = "18px";
      el.innerHTML = "🏧"; // Icono representativo de cajero

      // Crear la tarjeta flotante (Popup)
      const popupHTML = `
        <div class="p-3 font-sans min-w-[220px]">
          <div class="flex items-center justify-between gap-2 mb-1">
            <h3 class="font-bold text-sm text-gray-900 leading-tight">${atm.name}</h3>
            ${atm.is24Hours ? `<span class="bg-green-100 text-green-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">24H</span>` : ""}
          </div>
          <p class="text-xs text-gray-500 flex items-start gap-1 mt-1">
            <span>📍</span> 
            <span>${atm.addressLabel}</span>
          </p>
          ${atm.directionDetails ? `<p class="text-[11px] text-gray-400 italic pl-4 mt-0.5">"${atm.directionDetails}"</p>` : ""}
          
          <div class="mt-2.5 border-t border-gray-100 pt-2 bg-amber-50/70 p-2 rounded-lg border border-amber-200/40">
            <p class="text-[11px] text-amber-800 leading-normal">
              <strong>Recomendación:</strong> ${atm.recommendation}
            </p>
          </div>
        </div>
      `;

      // Instanciar el marcador y añadirlo al mapa
      const marker = new mapboxgl.Marker(el)
        .setLngLat([atm.location.lng, atm.location.lat])
        .setPopup(new mapboxgl.Popup({ offset: 30, closeButton: true }).setHTML(popupHTML))
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [atms]);

  return (
    <div className="w-full h-full relative">
      {/* Barra de título superior flotante sobre el mapa */}
      <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur shadow-warm border border-border px-4 py-2.5 rounded-xl max-w-sm">
        <h1 className="font-heading font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
          <span>🏧</span> Puntos de Retiro y Cajeros
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {currentMunicipality ? `Mostrando cajeros en ${currentMunicipality}` : "Explora los cajeros automáticos disponibles"}
        </p>
      </div>

      {/* Si no hay cajeros, mostrar un banner de aviso */}
      {atms.length === 0 && (
        <div className="absolute top-20 left-4 z-10 bg-destructive/10 border border-destructive/20 p-3 rounded-xl max-w-sm text-destructive text-xs font-medium">
          No se encontraron cajeros automáticos registrados en este municipio todavía.
        </div>
      )}

      {/* El contenedor donde Mapbox inyecta el canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}