// components/MapClient.tsx
'use client';

import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import { normalizeColombiaMapPoint } from "@/lib/mapCoordinates";
import type { GeoPoint } from "@/types";

// Soluciona el problema de los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapClientProps {
  location?: GeoPoint | null;
  title?: string;
  address?: string;
  className?: string;
}

export function MapClient({ location, title = "Ubicacion", address, className }: MapClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const point = normalizeColombiaMapPoint(location);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`flex items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground ${className || "h-80"}`}>
        Cargando mapa...
      </div>
    );
  }

  if (!point) {
    return (
      <div className={`flex items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground ${className || "h-80"}`}>
        Ubicación no disponible
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border/50 bg-background shadow-warm ${className || "h-80"}`}>
      {/* Header del mapa */}
      <div className="flex flex-col gap-3 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
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
      
      {/* Contenedor del mapa */}
      <div className="relative w-full" style={{ height: "calc(100% - 73px)", minHeight: "300px" }}>
        <MapContainer
          center={[point.lat, point.lng]}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[point.lat, point.lng]}>
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold text-sm">{title}</h3>
                {address && (
                  <p className="text-xs text-muted-foreground mt-1">{address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
