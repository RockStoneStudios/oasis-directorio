"use client";

import { MapPin } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import MapGL, { Marker, NavigationControl, Layer } from "react-map-gl/mapbox";
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
  business?: BusinessForMap | null;
  title?: string;
  address?: string;
}

export function Map({ location, business, title = "Ubicación", address }: MapProps) {
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const hasAnimated = useRef(false);
  const rotateRef = useRef<number>(0);
  const isInteracting = useRef(false);

  // Fix para geopoint de Sanity que a veces viene como lat/lng o latitude/longitude
  const rawLoc = business?.location || location;
  const finalLocation = rawLoc? {
    lat: (rawLoc as any).lat?? (rawLoc as any).latitude?? 6.501,
    lng: (rawLoc as any).lng?? (rawLoc as any).long?? (rawLoc as any).longitude?? -75.742,
  } : null;

  const marker = business?.marker;

  const [viewState, setViewState] = useState({
    longitude: finalLocation?.lng?? -75.742,
    latitude: finalLocation?.lat?? 6.501,
    zoom: 16.5,
    pitch: 52,
    bearing: -10,
  });

  // Actualiza el viewState si cambia la ubicación de Sanity
  useEffect(() => {
    if (finalLocation?.lat && finalLocation?.lng) {
      setViewState(v => ({
       ...v,
        longitude: finalLocation.lng,
        latitude: finalLocation.lat,
      }));
    }
  }, [finalLocation?.lat, finalLocation?.lng]);

  const startDroneRotation = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const rotate = () => {
      if (!isInteracting.current && map) {
        map.rotateTo(map.getBearing() + 0.15, { duration: 0 });
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

    if (resolvedTheme === "dark") {
      if (map.getLayer("background")) {
        map.setPaintProperty("background", "background-color", "#0a0a0a");
      }
      if (map.getLayer("water")) {
        map.setPaintProperty("water", "fill-color", "#0a1428");
      }
    }

    map.setPaintProperty("3d-buildings", "fill-extrusion-height", 0);
    map.setPaintProperty("3d-buildings", "fill-extrusion-base", 0);

    const anim = { p: 0 };
    gsap.to(anim, {
      p: 1,
      duration: 2.2,
      ease: "power4.out",
      delay: 0.3,
      onUpdate: () => {
        map.setPaintProperty("3d-buildings", "fill-extrusion-height", ["*", ["get", "height"], anim.p * SCALE] as any);
        map.setPaintProperty("3d-buildings", "fill-extrusion-base", ["*", ["get", "min_height"], anim.p * SCALE] as any);
      },
      onComplete: () => {
        map.setPaintProperty("3d-buildings", "fill-extrusion-height", ["*", ["get", "height"], SCALE] as any);
        map.setPaintProperty("3d-buildings", "fill-extrusion-base", ["*", ["get", "min_height"], SCALE] as any);
        startDroneRotation();
      },
    });

    map.on('mousedown', () => { isInteracting.current = true; stopDroneRotation(); });
    map.on('mouseup', () => { isInteracting.current = false; startDroneRotation(); });
    map.on('dragstart', () => { isInteracting.current = true; stopDroneRotation(); });
    map.on('dragend', () => { isInteracting.current = false; startDroneRotation(); });
  }, [resolvedTheme, startDroneRotation, stopDroneRotation]);

  if (!finalLocation?.lat ||!finalLocation?.lng) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground">
        Ubicación no disponible
      </div>
    );
  }

  const currentMapStyle = resolvedTheme === "dark"? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12";
  const icon2dUrl = marker?.icon2d?.asset?.url?? null;
  const scale = marker?.scale || 1.8;
  const animation = marker?.animation || 'float';

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
    if (!map) return;
    isInteracting.current = true;
    stopDroneRotation();
    map.flyTo({
      center: [finalLocation.lng, finalLocation.lat],
      zoom: 18,
      pitch: 70,
      bearing: 20,
      duration: 1800,
      essential: true,
    });
    setTimeout(() => { isInteracting.current = false; startDroneRotation(); }, 2000);
  };

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

      {/* ACA ESTABA EL ERROR - AHORA CON ALTURA FIJA INLINE */}
      <div className="w-full relative" style={{ height: '420px' }}>
        <MapGL
          ref={mapRef}
          {...viewState}
          onMove={(e) => setViewState(e.viewState)}
          style={{ width: "100%", height: "420px" }}
          mapStyle={currentMapStyle}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          onLoad={onMapLoad}
        >
          <NavigationControl position="top-right" />

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
            <div onClick={handleMarkerClick} className="cursor-pointer select-none" style={{ transform: `scale(${scale})` }}>
              {icon2dUrl? (
                <img
                  src={icon2dUrl}
                  alt={title}
                  className={`w-16 h-16 object-contain drop-shadow-xl ${getAnimationClass()}`}
                  style={{ transformOrigin: 'bottom center' }}
                />
              ) : (
                <MapPin className={`h-10 w-10 fill-primary text-primary-foreground drop-shadow-xl ${getAnimationClass()}`} />
              )}
              <div className="w-6 h-2 bg-black/20 rounded-full blur-sm mx-auto -mt-1" />
            </div>
          </Marker>
        </MapGL>

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