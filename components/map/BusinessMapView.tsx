"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Map, { Marker, NavigationControl, Popup, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";
import { RatingStars } from "@/components/RatingStars";
import { formatAddress, getBusinessHref } from "@/lib/formatBusinessData";
import { normalizeColombiaMapPoint, type LatLng } from "@/lib/mapCoordinates";
import type { BusinessCardData } from "@/types/business";
import { formatDistance } from "@/lib/utils-geo/distance";
import { urlFor } from "@/lib/sanity/image";

interface BusinessWithPoint {
  business: BusinessCardData & { distance?: number; marker?: any; slug?: any };
  point: LatLng;
}

const PARQUES: Record<string, { lat: number; lng: number }> = {
  sopetran: { lat: 6.5025, lng: -75.74281 },
  san_jeronimo: { lat: 6.443, lng: -75.732 },
  santa_fe: { lat: 6.5572, lng: -75.8274 },
  olaya: { lat: 6.6269, lng: -75.6843 },
};

export function BusinessMapView({ businesses, className }: { businesses: any[], className?: string }) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithPoint | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const mapRef = useRef<any>(null);
  const { resolvedTheme } = useTheme();

  const currentMapStyle = resolvedTheme === "dark"
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/light-v11";

  const businessesWithPoints = useMemo(() =>
    businesses
      .map((business) => ({
        business,
        point: normalizeColombiaMapPoint(business.location),
      }))
      .filter((item): item is BusinessWithPoint => item.point !== null),
    [businesses]
  );

  // --- LEER UBICACIÓN ---
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false }
    );
  }, []);

  // --- VUELO CINEMATOGRÁFICO SUAVIZADO ---
  const doCinematicFly = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    if (!map) return;

    let center = PARQUES.sopetran;
    if (userLocation) {
      let minDist = Infinity;
      for (const key in PARQUES) {
        const p = PARQUES[key];
        const d = Math.hypot(p.lat - userLocation.lat, p.lng - userLocation.lng);
        if (d < minDist && d < 0.12) {
          minDist = d;
          center = p;
        }
      }
    }

    // Usamos easeTo o un flyTo con mayor duración para evitar tirones bruscos
    map.flyTo({
      center: [center.lng, center.lat],
      zoom: 17.1,
      pitch: 61,
      bearing: -15,
      duration: 2850, // Aumentado a 3.5s para que la transición sea mantequilla
      essential: true,
      curve: 1.4,     // Controla la aceleración parabólica del vuelo para que sea más natural
    });
  }, [userLocation]);

  useEffect(() => {
    // Aumentamos ligeramente el tiempo de espera inicial para que el DOM y el motor 3D carguen limpios
    const t = setTimeout(() => {
      doCinematicFly();
    }, 900);
    return () => clearTimeout(t);
  }, [doCinematicFly]);

  return (
    <div className={className ?? "h-[600px] w-full overflow-hidden rounded-2xl border border-border"}>
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        minZoom={8}
        initialViewState={{
          longitude: -75.742505,
          latitude: 6.500962,
          zoom: 13,
          pitch: 15,
          bearing: 0,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={currentMapStyle}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
        maxTileCacheSize={50}
      >
        <NavigationControl position="top-right" />

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
            'fill-extrusion-opacity': resolvedTheme === "dark" ? 0.7 : 0.5
          }}
        />

        {businessesWithPoints.map((item) => {
          let iconUrl = null;
          try {
            if (item.business.marker?.icon2d?.asset?.url) iconUrl = item.business.marker.icon2d.asset.url;
            else if (item.business.marker?.icon2d) iconUrl = urlFor(item.business.marker.icon2d).width(120).url();
          } catch {}

          const scale = item.business.marker?.scale || 1;

          return (
            <Marker
              key={item.business._id}
              longitude={item.point.lng}
              latitude={item.point.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent?.stopPropagation();
                setSelectedBusiness(item);
              }}
            >
              <div
                className="group cursor-pointer flex flex-col items-center hover:z-50 transition-transform duration-300 hover:scale-[1.3] animate-[float_3s_ease-in-out_infinite]"
                style={{ animationDelay: `${Math.random() * 3}s`, transform: `scale(${scale * 1.04})` }}
              >
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={item.business.name}
                    className="w-11 h-11 object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.7)]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#e07a5f] border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-sm">
                    {item.business.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="w-4 h-1 bg-black/40 rounded-full blur-[2px] mt-1" />
              </div>
            </Marker>
          );
        })}

        {selectedBusiness && (
          <Popup
            longitude={selectedBusiness.point.lng}
            latitude={selectedBusiness.point.lat}
            anchor="bottom"
            onClose={() => setSelectedBusiness(null)}
            closeButton={false}
            offset={25}
          >
            <Link href={getBusinessHref(selectedBusiness.business)} className="block p-1 min-w-[140px]">
              <h3 className="text-sm font-bold text-slate-900">{selectedBusiness.business.name}</h3>
              <RatingStars rating={selectedBusiness.business.rating} />
              {selectedBusiness.business.distance !== undefined && (
                <p className="mt-1 text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {formatDistance(selectedBusiness.business.distance)} del parque
                </p>
              )}
              <p className="mt-0.5 text-xs text-slate-500">{formatAddress(selectedBusiness.business.address)}</p>
            </Link>
          </Popup>
        )}
      </Map>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) }
          50% { transform: translateY(-8px) }
        }
      `}</style>
    </div>
  );
}