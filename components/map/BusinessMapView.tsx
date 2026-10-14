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

// CENTROS DE MUNICIPIOS - EL PARQUE PRINCIPAL DE CADA UNO
const MUNICIPALITY_CENTERS: Record<string, LatLng & { zoom: number }> = {
  sopetran: { lat: 6.5015, lng: -75.7405, zoom: 16.8 }, // Parque Principal Sopetrán - tu captura
  san_jeronimo: { lat: 6.4430, lng: -75.7320, zoom: 16.5 },
  santa_fe: { lat: 6.5572, lng: -75.8274, zoom: 16.5 }, // Santa Fe de Antioquia
  olaya: { lat: 6.6269, lng: -75.6843, zoom: 16.5 },
  liborina: { lat: 6.6786, lng: -75.8135, zoom: 16.5 },
  // Agrega los demás del Occidente
  default: { lat: 6.500962, lng: -75.742505, zoom: 15.5 },
};

function getClosestCenter(userLat: number, userLng: number) {
  // Si está a menos de 15km de un municipio, centra ahí. Si no, Sopetrán
  let closest = MUNICIPALITY_CENTERS.sopetran;
  let minDist = Infinity;
  for (const key in MUNICIPALITY_CENTERS) {
    if (key === 'default') continue;
    const c = MUNICIPALITY_CENTERS[key];
    const d = Math.hypot(c.lat - userLat, c.lng - userLng);
    if (d < minDist) {
      minDist = d;
      closest = c;
    }
  }
  // 0.15 grados ~ 16km. Si está muy lejos, usa default general
  if (minDist > 0.15) return MUNICIPALITY_CENTERS.default;
  return closest;
}

export function BusinessMapView({ businesses, className }: { businesses: any[], className?: string }) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithPoint | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
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
   .filter((item): item is BusinessWithPoint => item.point!== null),
    [businesses]
  );

  // 1. LEER UBICACIÓN DEL USUARIO
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => console.log("No se pudo obtener ubicación, usando centro por defecto"),
      { enableHighAccuracy: true }
    );
  }, []);

  // 2. ENTRADA CINEMATOGRÁFICA - EL EFECTO QUE QUIERES
  const cinematicEntry = useCallback((center: LatLng, zoom: number) => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    // Posición inicial cinematográfica: alto y con pitch
    map.jumpTo({
      center: [center.lng, center.lat - 0.002], // un poquito al sur para que entre desde abajo
      zoom: 14,
      pitch: 25,
      bearing: -30,
    });

    // Vuelo cinemático a la posición final que es tu captura
    setTimeout(() => {
      map.flyTo({
        center: [center.lng, center.lat],
        zoom: zoom,
        pitch: 60, // ESTE ES TU ÁNGULO DE LA FOTO - no lo quites
        bearing: -15, // Leve giro para que se vea 3D
        duration: 2800,
        essential: true,
        curve: 1.4,
        speed: 0.8,
      });
    }, 200);
  }, []);

  useEffect(() => {
    if (!isMapLoaded) return;
    if (userLocation) {
      const center = getClosestCenter(userLocation.lat, userLocation.lng);
      cinematicEntry(center, center.zoom);
    } else {
      // Si no hay ubicación, entrada en Parque Principal Sopetrán
      cinematicEntry(MUNICIPALITY_CENTERS.sopetran, MUNICIPALITY_CENTERS.sopetran.zoom);
    }
  }, [isMapLoaded, userLocation, cinematicEntry]);

  return (
    <div className={className?? "h- w-full overflow-hidden rounded-2xl border border-border relative"}>
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        minZoom={12}
        maxZoom={19}
        initialViewState={{
          longitude: -75.7405,
          latitude: 6.5015,
          zoom: 14,
          pitch: 25,
          bearing: -30,
        }}
        onLoad={() => setIsMapLoaded(true)}
        style={{ width: "100%", height: "100%" }}
        mapStyle={currentMapStyle}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={true} />

        <Layer
          id="3d-buildings"
          source="composite"
          source-layer="building"
          filter={['==', 'extrude', 'true']}
          type="fill-extrusion"
          paint={{
            'fill-extrusion-color': resolvedTheme === "dark"? "#d1d5db" : "#aaa",
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': resolvedTheme === "dark"? 0.85 : 0.6
          }}
        />

        {/* PUNTO AZUL DEL USUARIO */}
        {userLocation && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="center">
            <div className="relative">
              <div className="w-5 h-5 bg-blue-500 rounded-full border- border-white shadow-xl" />
              <div className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping" />
            </div>
          </Marker>
        )}

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
                style={{ animationDelay: `${Math.random() * 3}s`, transform: `scale(${scale})` }}
              >
                {iconUrl? (
                  <img
                    src={iconUrl}
                    alt={item.business.name}
                    className="w-11 h-11 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.8)]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#e07a5f] border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-sm">
                    {item.business.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="w-3 h- bg-black/50 rounded-full blur- mt-1" />
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
            offset={28}
            className="z-50"
          >
            <Link href={getBusinessHref(selectedBusiness.business)} className="block p-1 min-w-">
              <h3 className="text-sm font-bold text-slate-900">{selectedBusiness.business.name}</h3>
              <RatingStars rating={selectedBusiness.business.rating} />
              {selectedBusiness.business.distance!== undefined && (
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
          50% { transform: translateY(-7px) }
        }
      `}</style>
    </div>
  );
}