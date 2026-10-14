"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/mapbox";
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

const MUNICIPALITY_CENTERS: Record<string, LatLng & { zoom: number }> = {
  sopetran: { lat: 6.5015, lng: -75.7405, zoom: 16.8 },
  san_jeronimo: { lat: 6.4430, lng: -75.7320, zoom: 16.5 },
  santa_fe: { lat: 6.5572, lng: -75.8274, zoom: 16.5 },
  default: { lat: 6.5015, lng: -75.7405, zoom: 16.8 },
};

export function BusinessMapView({ businesses, className }: { businesses: any[], className?: string }) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithPoint | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const { resolvedTheme } = useTheme();

  // Usa estilo directo para evitar error de theme
  const currentMapStyle = "mapbox://styles/mapbox/dark-v11";

  const businessesWithPoints = useMemo(() =>
    businesses.map((b) => ({
        business: b,
        point: normalizeColombiaMapPoint(b.location),
      }))
  .filter((item): item is BusinessWithPoint => item.point!== null),
    [businesses]
  );

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const cinematicEntry = useCallback(() => {
    if (!mapRef.current ||!isMapLoaded) return;
    const map = mapRef.current.getMap();
    if (!map) return;

    const center = MUNICIPALITY_CENTERS.sopetran;

    // 1. Añadir edificios 3D AQUÍ, DESPUÉS de que cargó - no antes
    try {
      if (!map.getLayer('3d-buildings')) {
        map.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': '#ffffff',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.75
          }
        });
      }
    } catch (e) {
      console.log("Edificios 3D no disponibles aún", e);
    }

    // 2. Entrada cinemática
    map.flyTo({
      center: [center.lng, center.lat],
      zoom: center.zoom,
      pitch: 60,
      bearing: -15,
      duration: 2800,
      essential: true,
    });
  }, [isMapLoaded]);

  useEffect(() => {
    if (isMapLoaded) {
      const timer = setTimeout(() => cinematicEntry(), 300);
      return () => clearTimeout(timer);
    }
  }, [isMapLoaded, cinematicEntry, userLocation]);

  return (
    <div className={className?? "h- min-h- w-full overflow-hidden rounded-2xl border border-border bg-[#111]"}>
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: -75.7405,
          latitude: 6.498,
          zoom: 14.5,
          pitch: 30,
          bearing: 0,
        }}
        onLoad={() => setIsMapLoaded(true)}
        style={{ width: "100%", height: "100%" }}
        mapStyle={currentMapStyle}
        // QUITÉ terrain y Layer de aquí - esa era la causa del negro
      >
        <NavigationControl position="top-right" />

        {userLocation && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="center">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
          </Marker>
        )}

        {businessesWithPoints.map((item) => {
          let iconUrl = null;
          try {
            if (item.business.marker?.icon2d?.asset?.url) iconUrl = item.business.marker.icon2d.asset.url;
            else if (item.business.marker?.icon2d) iconUrl = urlFor(item.business.marker.icon2d).width(120).url();
          } catch {}

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
              <div className="cursor-pointer hover:scale-125 transition-transform">
                {iconUrl? (
                  <img src={iconUrl} alt={item.business.name} className="w-10 h-10 object-contain drop-shadow-xl" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#e07a5f] border-2 border-white flex items-center justify-center text-white font-bold text-xs">
                    {item.business.name?.[0]}
                  </div>
                )}
              </div>
            </Marker>
          );
        })}

        {selectedBusiness && (
          <Popup longitude={selectedBusiness.point.lng} latitude={selectedBusiness.point.lat} anchor="bottom" onClose={() => setSelectedBusiness(null)} closeButton={false} offset={20}>
            <Link href={getBusinessHref(selectedBusiness.business)} className="block p-1 min-w-">
              <h3 className="text-sm font-bold text-slate-900">{selectedBusiness.business.name}</h3>
              <RatingStars rating={selectedBusiness.business.rating} />
              <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedBusiness.business.distance? formatDistance(selectedBusiness.business.distance) : ''}</p>
            </Link>
          </Popup>
        )}
      </Map>
    </div>
  );
}