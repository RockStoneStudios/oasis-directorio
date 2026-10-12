"use client";

import { MapPin } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import MapGL, { Marker, NavigationControl, Layer, Source } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GeoPoint } from "@/types";
import { useTheme } from "next-themes";
import gsap from "gsap";

interface MapProps {
  location?: GeoPoint | null;
  title?: string;
  address?: string;
}

export function Map({ location, title = "Ubicacion", address }: MapProps) {
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const hasAnimated = useRef(false);

  const [viewState, setViewState] = useState({
    longitude: location?.lng?? -75.742, // Sopetrán
    latitude: location?.lat?? 6.501,
    zoom: 16.5,
    pitch: 52,
    bearing: -10,
  });

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map || hasAnimated.current) return;
    hasAnimated.current = true;

    // 1. Fondo y agua en oscuro (tu código)
    if (resolvedTheme === "dark") {
      if (map.getLayer("background")) {
        map.setPaintProperty("background", "background-color", "#0a0a0a");
      }
      if (map.getLayer("water")) {
        map.setPaintProperty("water", "fill-color", "#0a1428");
      }
    }

    // 2. INICIO: edificios en 0
    map.setPaintProperty("3d-buildings", "fill-extrusion-height", 0);

    // 3. ANIMACIÓN: Sopetrán crece
    const animObj = { h: 0 };
    gsap.to(animObj, {
      h: 1,
      duration: 2.2,
      ease: "power4.out",
      delay: 0.3,
      onUpdate: () => {
        // Esta fórmula hace que la altura real sea: height * progreso
        map.setPaintProperty("3d-buildings", "fill-extrusion-height", [
          "interpolate",
          ["linear"],
          ["*", animObj.h, 1],
          0, 0,
          1, ["get", "height"]
        ] as any);
      }
    });

    // 4. BONUS: Vuelo cinematográfico leve
    gsap.to(viewState, {
      bearing: 15,
      pitch: 62,
      duration: 4,
      ease: "power1.inOut",
      onUpdate: () => setViewState(v => ({...v, bearing: viewState.bearing, pitch: viewState.pitch }))
    });

  }, [resolvedTheme]);

  if (!location?.lat ||!location?.lng) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground">
        Ubicacion no disponible
      </div>
    );
  }

  const currentMapStyle = resolvedTheme === "dark"
   ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/streets-v12";

  return (
    <section className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-warm">
      <div className="flex flex-col gap-3 border-b border-border/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <MapPin className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold font-heading">{title}</h2>
            {address && <p className="text-sm text-muted-foreground">{address}</p>}
          </div>
        </div>
      </div>
      <div className="h-80 w-full">
        <MapGL
          ref={mapRef}
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle={currentMapStyle}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          onLoad={onMapLoad}
        >
          {/* Fuente DEM necesaria para terrain */}
          <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />

          <NavigationControl position="top-right" />

          {resolvedTheme === "dark" && (
            <Layer id="dark-overlay" type="background" paint={{ 'background-color': '#000000', 'background-opacity': 0.35 }} />
          )}

          <Layer
            id="3d-buildings"
            source="composite"
            source-layer="building"
            filter={['==', 'extrude', 'true']}
            type="fill-extrusion"
            paint={{
              'fill-extrusion-color': resolvedTheme === "dark"? "#ffffff" : "#aaa",
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': resolvedTheme === "dark"? 0.79 : 0.6
            }}
          />

          <Marker longitude={location.lng} latitude={location.lat} anchor="bottom">
            <div className="pin-ricuras">
              <MapPin className="h-9 w-9 fill-primary text-primary-foreground drop-shadow-lg" />
            </div>
          </Marker>
        </MapGL>
      </div>
    </section>
  );
}