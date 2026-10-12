"use client";

import { MapPin } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import MapGL, { Marker, NavigationControl, Layer, Source } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GeoPoint } from "@/types";
import { useTheme } from "next-themes";
import gsap from "gsap";

interface MapMarkerData {
  businessType?: string;
  scale?: number;
  animation?: 'float' | 'rotate' | 'bounce' | 'static';
  icon2d?: any;
  model3d?: { asset?: { url?: string } } | null;
}

interface BusinessForMap {
  name?: string;
  location?: GeoPoint;
  marker?: MapMarkerData | null;
}

interface MapProps {
  location?: GeoPoint | null;
  business?: BusinessForMap | null; // Nuevo: pasale el business completo de Sanity
  title?: string;
  address?: string;
}

export function Map({ location, business, title = "Ubicación", address }: MapProps) {
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const hasAnimated = useRef(false);
  const rotateRef = useRef<number>(0);
  const isInteracting = useRef(false);

  // Usa business.location si existe, si no el location viejo
  const finalLocation = business?.location || location;
  const marker = business?.marker;

  const [viewState, setViewState] = useState({
    longitude: finalLocation?.lng?? -75.742,
    latitude: finalLocation?.lat?? 6.501,
    zoom: 16.5,
    pitch: 52,
    bearing: -10,
  });

  // ===== CAMARA DRONE QUE SE MOVIA GENIAL =====
  const startDroneRotation = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const rotate = () => {
      if (!isInteracting.current && map) {
        const bearing = map.getBearing();
        map.rotateTo(bearing + 0.15, { duration: 0 });
        rotateRef.current = requestAnimationFrame(rotate);
      }
    };
    rotateRef.current = requestAnimationFrame(rotate);
  }, []);

  const stopDroneRotation = useCallback(() => {
    if (rotateRef.current) cancelAnimationFrame(rotateRef.current);
  }, []);

  useEffect(() => {
    return () => stopDroneRotation();
  }, [stopDroneRotation]);

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map || hasAnimated.current) return;
    hasAnimated.current = true;

    const SCALE = 1.7;

    // Fondo oscuro
    if (resolvedTheme === "dark") {
      if (map.getLayer("background")) {
        map.setPaintProperty("background", "background-color", "#0a0a0a");
      }
      if (map.getLayer("water")) {
        map.setPaintProperty("water", "fill-color", "#0a1428");
      }
    }

    // Inicio edificios en 0
    map.setPaintProperty("3d-buildings", "fill-extrusion-height", 0);
    map.setPaintProperty("3d-buildings", "fill-extrusion-base", 0);

    // Animación Sopetrán crece
    const anim = { p: 0 };
    gsap.to(anim, {
      p: 1,
      duration: 2.2,
      ease: "power4.out",
      delay: 0.3,
      onUpdate: () => {
        map.setPaintProperty("3d-buildings", "fill-extrusion-height", [
          "*",
          ["get", "height"],
          anim.p * SCALE,
        ] as any);
        map.setPaintProperty("3d-buildings", "fill-extrusion-base", [
          "*",
          ["get", "min_height"],
          anim.p * SCALE,
        ] as any);
      },
      onComplete: () => {
        map.setPaintProperty("3d-buildings", "fill-extrusion-height", [
          "*",
          ["get", "height"],
          SCALE,
        ] as any);
        map.setPaintProperty("3d-buildings", "fill-extrusion-base", [
          "*",
          ["get", "min_height"],
          SCALE,
        ] as any);

        // Inicia rotación drone después de crecer
        startDroneRotation();
      },
    });

    // Pausa rotación al interactuar
    map.on('mousedown', () => { isInteracting.current = true; stopDroneRotation(); });
    map.on('mouseup', () => { isInteracting.current = false; startDroneRotation(); });
    map.on('dragstart', () => { isInteracting.current = true; stopDroneRotation(); });
    map.on('dragend', () => { isInteracting.current = false; startDroneRotation(); });
    map.on('zoomstart', () => { isInteracting.current = true; stopDroneRotation(); });
    map.on('zoomend', () => { isInteracting.current = false; startDroneRotation(); });

  }, [resolvedTheme, startDroneRotation, stopDroneRotation]);

  if (!finalLocation?.lat ||!finalLocation?.lng) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground">
        Ubicación no disponible
      </div>
    );
  }

  const currentMapStyle =
    resolvedTheme === "dark"
     ? "mapbox://styles/mapbox/dark-v11"
      : "mapbox://styles/mapbox/streets-v12";

  // Icono 2D desde Sanity
  const icon2dUrl = marker?.icon2d?.asset?.url ?? null;
  const scale = marker?.scale || 1.5;
  const animation = marker?.animation || 'float';

  // Clases de animación según tipo
  const getAnimationClass = () => {
    switch (animation) {
      case 'float': return 'animate-[float_3s_ease-in-out_infinite]';
      case 'bounce': return 'animate-[bounce_2s_ease-in-out_infinite]';
      case 'rotate': return 'animate-[spin_4s_linear_infinite]';
      default: return '';
    }
  };

  const handleMarkerClick = () => {
    const map = mapRef.current?.getMap();
    if (!map ||!finalLocation) return;

    isInteracting.current = true;
    stopDroneRotation();

    map.flyTo({
      center: [finalLocation.lng, finalLocation.lat],
      zoom: 18,
      pitch: 70,
      bearing: 20,
      duration: 1800,
      essential: true,
      curve: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 3)
    });

    setTimeout(() => {
      isInteracting.current = false;
      startDroneRotation();
    }, 2000);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-warm">
      <div className="flex flex-col gap-3 border-b border-border/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <MapPin className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold font-heading">{title}</h2>
            {address && <p className="text-sm text-muted-foreground">{address}</p>}
            {marker?.businessType && (
              <p className="text-xs text-muted-foreground capitalize mt-1">
                {marker.businessType.replace('restaurant_', '').replace('_', ' ')}
                {marker.model3d?.asset?.url? ' • 3D' : ' • 2D'}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="h- w-full relative">
        <MapGL
          ref={mapRef}
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle={currentMapStyle}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          onLoad={onMapLoad}
        >
          <Source
            id="mapbox-dem"
            type="raster-dem"
            url="mapbox://mapbox.mapbox-terrain-dem-v1"
            tileSize={512}
            maxzoom={14}
          />
          <NavigationControl position="top-right" />

          {resolvedTheme === "dark" && (
            <Layer
              id="dark-overlay"
              type="background"
              paint={{
                "background-color": "#000000",
                "background-opacity": 0.35,
              }}
            />
          )}

          <Layer
            id="3d-buildings"
            source="composite"
            source-layer="building"
            filter={["==", "extrude", "true"]}
            type="fill-extrusion"
            paint={{
              "fill-extrusion-color": resolvedTheme === "dark"? "#ffffff" : "#aaa",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": resolvedTheme === "dark"? 0.79 : 0.6,
            }}
          />

          <Marker longitude={finalLocation.lng} latitude={finalLocation.lat} anchor="bottom">
            <div
              onClick={handleMarkerClick}
              className="cursor-pointer select-none"
              style={{ transform: `scale(${scale})` }}
            >
              {icon2dUrl? (
                <img
                  src={icon2dUrl}
                  alt={title}
                  className={`w-16 h-16 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] ${getAnimationClass()}`}
                  style={{
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                    transformOrigin: 'bottom center'
                  }}
                />
              ) : (
                <MapPin className={`h-10 w-10 fill-primary text-primary-foreground drop-shadow-xl ${getAnimationClass()}`} />
              )}
              {/* Sombra en el suelo */}
              <div className="w-6 h-2 bg-black/20 rounded-full blur- mx-auto -mt-1" />
            </div>
          </Marker>
        </MapGL>

        {/* Animaciones CSS */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
        `}</style>
      </div>
    </section>
  );
}