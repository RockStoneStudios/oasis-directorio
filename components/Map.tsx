"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import MapGL, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GeoPoint } from "@/types";

interface MapProps {
  location?: GeoPoint | null;
  title?: string;
  address?: string;
}

export function Map({ location, title = "Ubicacion", address }: MapProps) {
  const [viewState, setViewState] = useState({
    longitude: location?.lng ?? -74.2973,
    latitude: location?.lat ?? 4.5709,
    zoom: 15,
  });

  if (!location?.lat || !location?.lng) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground">
        Ubicacion no disponible
      </div>
    );
  }

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
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          <NavigationControl position="top-right" />
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
