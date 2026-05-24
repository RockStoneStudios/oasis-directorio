"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
// 👇 Importamos Layer para los edificios y el overlay
import MapGL, { Marker, NavigationControl, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GeoPoint } from "@/types";
import { useTheme } from "next-themes";

interface MapProps {
  location?: GeoPoint | null;
  title?: string;
  address?: string;
}

export function Map({ location, title = "Ubicacion", address }: MapProps) {
  const { resolvedTheme } = useTheme();

  // Configuración de cámara en 3D: pitch alto e inclinación de ángulo (bearing)
  const [viewState, setViewState] = useState({
    longitude: location?.lng ?? -74.2973,
    latitude: location?.lat ?? 4.5709,
    zoom: 16.5,
    pitch: 52,     // 3D Tilt
    bearing: -10,  // Rotación de ángulo
  });

  if (!location?.lat || !location?.lng) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground">
        Ubicacion no disponible
      </div>
    );
  }

  // Estilo dinámico adaptado al tema activo
  const currentMapStyle = resolvedTheme === "dark" 
    ? "mapbox://styles/mapbox/dark-v11" 
    : "mapbox://styles/mapbox/streets-v12";

  // 🌟 Inyección imperativa sobre capas nativas de Mapbox para neutralizar tonos en modo oscuro
  const onMapLoad = (e: any) => {
    const mapInstance = e.target;
    if (resolvedTheme === "dark") {
      // Forzar fondo asfalto profundo libre de tonos rojizos
      if (mapInstance.getLayer("background")) {
        mapInstance.setPaintProperty("background", "background-color", "#0a0a0a");
      }
      // Oscurecer el agua
      if (mapInstance.getLayer("water")) {
        mapInstance.setPaintProperty("water", "fill-color", "#0a1428");
      }
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-warm">
      <div className="flex flex-col gap-3 border-b border-border/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <MapPin className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-semibold font-heading">{title}</h2>
            {address && (
              <p className="text-sm text-muted-foreground">{address}</p>
            )}
          </div>
        </div>
      </div>
      <div className="h-80 w-full">
        <MapGL
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle={currentMapStyle}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }} // Relieve topográfico 3D
          onLoad={onMapLoad}
        >
          <NavigationControl position="top-right" />

          {/* 🌑 CAPA OVERLAY OSCURA - Homogeneiza el mapa oscuro */}
          {resolvedTheme === "dark" && (
            <Layer
              id="dark-overlay"
              type="background"
              paint={{
                'background-color': '#000000',
                'background-opacity': 0.35
              }}
            />
          )}

          {/* 🏢 EXTRUSIÓN DE EDIFICIOS EN 3D */}
          <Layer
            id="3d-buildings"
            source="composite"
            source-layer="building"
            filter={['==', 'extrude', 'true']}
            type="fill-extrusion"
            paint={{
              'fill-extrusion-color': resolvedTheme === "dark" ? "#ffffff" : "#aaa",
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': resolvedTheme === "dark" ? 0.79 : 0.6
            }}
          />

          <Marker
            longitude={location.lng}
            latitude={location.lat}
            anchor="bottom"
          >
            <MapPin
              className="h-9 w-9 fill-primary text-primary-foreground drop-shadow-lg"
              aria-label={title}
            />
          </Marker>
        </MapGL>
      </div>
    </section>
  );
}