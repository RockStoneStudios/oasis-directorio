"use client";

import { MapPin, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
// 1. Importamos usePathname de Next.js
import { usePathname } from "next/navigation"; 
import Map, { Marker, NavigationControl, Popup, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { RatingStars } from "@/components/RatingStars";
import { formatAddress, getBusinessHref } from "@/lib/formatBusinessData";
import { normalizeColombiaMapPoint, type LatLng } from "@/lib/mapCoordinates";
import type { BusinessCardData } from "@/types/business";
import { formatDistance } from "@/lib/utils-geo/distance"; 

interface BusinessWithPoint {
  business: BusinessCardData & { distance?: number };
  point: LatLng;
}

export function BusinessMapView({ businesses, className }: { businesses: any[], className?: string }) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithPoint | null>(null);
  const mapRef = useRef<any>(null);
  
  // 2. Obtenemos la ruta actual del navegador
  const pathname = usePathname();

  // 3. Determinamos dinámicamente el modo de visualización.
  // Si la ruta es exactamente "/maps", activa "distance". Si no, usa "name".
  const displayMode = pathname === "/mapa" ? "distance" : "name";

  const businessesWithPoints = useMemo(() => 
    businesses
      .map((business) => ({
        business,
        point: normalizeColombiaMapPoint(business.location),
      }))
      .filter((item): item is BusinessWithPoint => item.point !== null),
    [businesses]
  );

  useEffect(() => {
    if (!mapRef.current || businessesWithPoints.length === 0) return;

    const bounds = businessesWithPoints.reduce(
      (acc, { point }) => [
        [Math.min(acc[0][0], point.lng), Math.min(acc[0][1], point.lat)],
        [Math.max(acc[1][0], point.lng), Math.max(acc[1][1], point.lat)],
      ],
      [[businessesWithPoints[0].point.lng, businessesWithPoints[0].point.lat], [businessesWithPoints[0].point.lng, businessesWithPoints[0].point.lat]]
    );

    mapRef.current.fitBounds(bounds, { padding: 60, duration: 2000 });
  }, [businessesWithPoints]);

  return (
    <div className={className ?? "h-150 w-full overflow-hidden rounded-2xl border border-border"}>
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        minZoom={8}   
        initialViewState={{
          longitude: -75.742505,
          latitude: 6.500962,
          zoom: 15,   
          pitch: 48,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <NavigationControl position="top-right" />

        <Layer
          id="3d-buildings"
          source="composite"
          source-layer="building"
          filter={['==', 'extrude', 'true']}
          type="fill-extrusion"
          paint={{
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6
          }}
        />

        {businessesWithPoints.map((item) => (
          <Marker
            key={item.business._id}
            longitude={item.point.lng}
            latitude={item.point.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedBusiness(item);
            }}
          >
            {/* 🌟 AQUÍ CORRE LA MAGIA AUTOMÁTICA SEGÚN LA RUTA */}
            <button className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl hover:scale-110 transition-all whitespace-nowrap border border-background">
              {displayMode === "distance" ? (
                <>
                  <MapPin className="h-3 w-3 fill-white/20" />
                  <span className="font-black block text-center">
                    {item.business.distance !== undefined ? (
                      <>
                        <div>{item.business.name}</div>
                        <div className="text-xs opacity-90">{formatDistance(item.business.distance)} del parque</div>
                      </>
                    ) : "0 m"}
                  </span>
                </>
              ) : (
                <>
                  <Store className="h-3.5 w-3.5" />
                  <span className="max-w-32 truncate">{item.business.name}</span>
                </>
              )}
            </button>
          </Marker>
        ))}

        {selectedBusiness && (
          <Popup
            longitude={selectedBusiness.point.lng}
            latitude={selectedBusiness.point.lat}
            anchor="bottom"
            onClose={() => setSelectedBusiness(null)}
            closeButton={false}
            offset={20}
          >
            <Link href={getBusinessHref(selectedBusiness.business)} className="block p-1">
              <h3 className="text-sm font-bold text-gray-900">{selectedBusiness.business.name}</h3>
              <RatingStars rating={selectedBusiness.business.rating} />
              
              {selectedBusiness.business.distance !== undefined && (
                <p className="mt-1 text-[11px] text-primary font-semibold flex items-center gap-0.5">
                  A {formatDistance(selectedBusiness.business.distance)} de ti
                </p>
              )}

              <p className="mt-0.5 text-[10px] text-gray-500">
                {formatAddress(selectedBusiness.business.address)}
              </p>
            </Link>
          </Popup>
        )}
      </Map>
    </div>
  );
}