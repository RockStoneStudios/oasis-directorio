"use client";

import { MapPin, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, NavigationControl, Popup, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { RatingStars } from "@/components/RatingStars";
import { formatAddress, getBusinessHref } from "@/lib/formatBusinessData";
import { normalizeColombiaMapPoint, type LatLng } from "@/lib/mapCoordinates";
import type { BusinessCardData } from "@/types/business";

interface BusinessWithPoint {
  business: BusinessCardData;
  point: LatLng;
}

export function BusinessMapView({ businesses, className }: { businesses: BusinessCardData[], className?: string }) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithPoint | null>(null);
  const mapRef = useRef<any>(null);

  const businessesWithPoints = useMemo(() => 
    businesses
      .map((business) => ({
        business,
        point: normalizeColombiaMapPoint(business.location),
      }))
      .filter((item): item is BusinessWithPoint => item.point !== null),
    [businesses]
  );

  // Efecto para ajustar el mapa a los marcadores (Auto-zoom)
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
  
  // Aumenta el minZoom para que el usuario no pueda alejarse hasta ver todo el planeta
  minZoom={8}   
  
  initialViewState={{
    longitude: -75.742,
    latitude: 6.500,
    zoom: 15,   // Cambia de 5 a 14 para estar a nivel de calle/barrio
    pitch: 48,
  }}
  style={{ width: "100%", height: "100%" }}
  mapStyle="mapbox://styles/mapbox/light-v11"
  terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
>
        <NavigationControl position="top-right" />

        {/* Capa de Edificios 3D */}
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
            <button className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-xl hover:scale-110 transition-transform">
              <Store className="h-3.5 w-3.5" />
              <span className="max-w-32 truncate">{item.business.name}</span>
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
              <p className="mt-1 text-[10px] text-gray-500">
                {formatAddress(selectedBusiness.business.address)}
              </p>
            </Link>
          </Popup>
        )}
      </Map>
    </div>
  );
}