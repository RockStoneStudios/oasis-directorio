"use client";

import { MapPin } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import MapGL, { Marker, NavigationControl, Layer } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { urlFor } from "@/lib/sanity/image";

interface MapProps {
  location?: any;
  business?: any;
  title?: string;
  address?: string;
}

export function Map({ location, business, title = "Ubicación", address }: MapProps) {
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const hasAnimated = useRef(false);
  const rotateRef = useRef<number>(0);
  const isInteracting = useRef(false);

  const rawLoc = business?.location || location;
  const finalLocation = rawLoc
  ? {
        lat: (rawLoc as any).lat?? (rawLoc as any).latitude?? 6.501,
        lng: (rawLoc as any).lng?? (rawLoc as any).long?? (rawLoc as any).longitude?? -75.742,
      }
    : null;

  const marker = (business as any)?.marker;

  // 🔥 ENTRADA CINEMATICA - Empieza alto y lejos
  const [viewState, setViewState] = useState({
    longitude: finalLocation?.lng?? -75.742,
    latitude: finalLocation?.lat?? 6.501,
    zoom: 14.2,
    pitch: 8,
    bearing: 0,
  });

  useEffect(() => {
    if (finalLocation?.lat && finalLocation?.lng) {
      setViewState((v) => ({...v, longitude: finalLocation.lng, latitude: finalLocation.lat }));
    }
  }, [finalLocation?.lat, finalLocation?.lng]);

  const startDroneRotation = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const rotate = () => {
      if (!isInteracting.current && map) {
        map.rotateTo(map.getBearing() + 0.12, { duration: 0 });
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

    // 1. VUELO DE CÁMARA CINEMÁTICO
    map.flyTo({
      center: [finalLocation!.lng, finalLocation!.lat],
      zoom: 16.8,
      pitch: 62,
      bearing: -18,
      duration: 3800,
      essential: true,
      easing: (t) => 1 - Math.pow(1 - t, 4), // power4.out igual que tenías
    });

    // 2. CRECIMIENTO DE EDIFICIOS 3D (tu animación original)
    const SCALE = 1.7;
    try {
      map.setPaintProperty("3d-buildings", "fill-extrusion-height", 0);
      map.setPaintProperty("3d-buildings", "fill-extrusion-base", 0);
    } catch {}

    const anim = { p: 0 };
    gsap.to(anim, {
      p: 1,
      duration: 2.4,
      ease: "power4.out",
      delay: 0.5,
      onUpdate: () => {
        try {
          map.setPaintProperty("3d-buildings", "fill-extrusion-height", ["*", ["get", "height"], anim.p * SCALE] as any);
          map.setPaintProperty("3d-buildings", "fill-extrusion-base", ["*", ["get", "min_height"], anim.p * SCALE] as any);
        } catch {}
      },
      onComplete: () => {
        try {
          map.setPaintProperty("3d-buildings", "fill-extrusion-height", ["*", ["get", "height"], SCALE] as any);
          map.setPaintProperty("3d-buildings", "fill-extrusion-base", ["*", ["get", "min_height"], SCALE] as any);
        } catch {}
        // 3. EMPIEZA GIRO DRON
        startDroneRotation();
      },
    });

    map.on("mousedown", () => { isInteracting.current = true; stopDroneRotation(); });
    map.on("mouseup", () => { isInteracting.current = false; startDroneRotation(); });
    map.on("dragstart", () => { isInteracting.current = true; stopDroneRotation(); });
    map.on("dragend", () => { isInteracting.current = false; startDroneRotation(); });
  }, [finalLocation, startDroneRotation, stopDroneRotation]);

  if (!finalLocation?.lat ||!finalLocation?.lng) {
    return <div className="flex h-80 items-center justify-center rounded-2xl border bg-muted">Ubicación no disponible</div>;
  }

  const currentMapStyle = resolvedTheme === "dark"? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12";

  let icon2dUrl = null;
  try {
    if (marker?.icon2d?.asset?.url) icon2dUrl = marker.icon2d.asset.url;
    else if (marker?.icon2d) icon2dUrl = urlFor(marker.icon2d).width(128).height(128).url();
  } catch {
    icon2dUrl = marker?.icon2d?.asset?.url || null;
  }

  const scale = marker?.scale || 1.8;
  const animation = marker?.animation || "float";

  const getAnimationClass = () => {
    switch (animation) {
      case "float": return "animate-[float_3s_ease-in-out_infinite]";
      case "bounce": return "animate-[bounce_2s_ease-in-out_infinite]";
      case "rotate": return "animate-[spin_4s_linear_infinite]";
      default: return "";
    }
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
      <div className="w-full relative" style={{ height: "420px" }}>
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
            <div className="cursor-pointer select-none" style={{ transform: `scale(${scale})` }}>
              {icon2dUrl? (
                <img src={icon2dUrl} alt={title} className={`w-16 h-16 object-contain drop-shadow-xl ${getAnimationClass()}`} style={{ transformOrigin: "bottom center" }} />
              ) : (
                <MapPin className={`h-10 w-10 fill-primary text-primary-foreground drop-shadow-xl ${getAnimationClass()}`} />
              )}
              <div className="w-6 h-2 bg-black/20 rounded-full blur-sm mx-auto -mt-1" />
            </div>
          </Marker>
        </MapGL>
        <style jsx>{`
          @keyframes float { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
          @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
        `}</style>
      </div>
    </section>
  );
}