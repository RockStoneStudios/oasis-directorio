"use client";

import { MapPin, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
// AJUSTE 1: Importar Map directamente de react-map-gl/mapbox para evitar conflictos
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/mapbox"; 
import "mapbox-gl/dist/mapbox-gl.css";
import { RatingStars } from "@/components/RatingStars";
import { formatAddress, getBusinessHref } from "@/lib/formatBusinessData";
import type { BusinessCardData } from "@/types/business";

interface BusinessMapViewProps {
  businesses: BusinessCardData[];
  className?: string;
}

export function BusinessMapView({
  businesses,
  className,
}: BusinessMapViewProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessCardData | null>(null);
  
  // AJUSTE 2: Coordenadas iniciales más precisas para Antioquia (evita que empiece en el océano)
  const [viewState, setViewState] = useState({
    longitude: -75.5849, 
    latitude: 6.2442,
    zoom: 11,
  });
  
  const hasCenteredRef = useRef(false);

  const validBusinesses = useMemo(
    () => businesses.filter((b) => b.location?.lat && b.location?.lng),
    [businesses],
  );

  useEffect(() => {
    if (hasCenteredRef.current || validBusinesses.length === 0) return;

    const center = getMapCenter(validBusinesses);
    setViewState({
      longitude: center.lng,
      latitude: center.lat,
      zoom: validBusinesses.length === 1 ? 14 : 11,
    });
    hasCenteredRef.current = true;
  }, [validBusinesses]);

  if (validBusinesses.length === 0) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center text-muted-foreground">
        No hay negocios con ubicación disponible para mostrar en el mapa.
      </div>
    );
  }

  return (
    // AJUSTE 3: Forzar una altura mínima si el className no viene definido
    <div className={className || "h-[500px] w-full rounded-2xl overflow-hidden"}>
      <Map
        {...viewState}
        onMove={(event) => setViewState(event.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {validBusinesses.map((business) => (
          <Marker
            key={business._id}
            longitude={business.location?.lng ?? 0}
            latitude={business.location?.lat ?? 0}
            anchor="bottom"
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              setSelectedBusiness(business);
            }}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              <Store className="h-3.5 w-3.5" />
              <span className="max-w-32 truncate">{business.name}</span>
            </button>
          </Marker>
        ))}

        {selectedBusiness?.location && (
          <Popup
            longitude={selectedBusiness.location.lng}
            latitude={selectedBusiness.location.lat}
            anchor="bottom"
            onClose={() => setSelectedBusiness(null)}
            closeOnClick={false}
            offset={15}
          >
            <Link
              href={getBusinessHref(selectedBusiness)}
              className="block min-w-[200px] rounded-md p-1"
            >
              <h3 className="text-sm font-bold">{selectedBusiness.name}</h3>
              <div className="mt-1">
                <RatingStars rating={selectedBusiness.rating} />
              </div>
              {selectedBusiness.address && (
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {formatAddress(selectedBusiness.address)}
                </p>
              )}
            </Link>
          </Popup>
        )}
      </Map>
    </div>
  );
}

function getMapCenter(businesses: BusinessCardData[]) {
  const totals = businesses.reduce(
    (acc, b) => ({
      lat: acc.lat + (b.location?.lat ?? 0),
      lng: acc.lng + (b.location?.lng ?? 0),
    }),
    { lat: 0, lng: 0 },
  );

  return {
    lat: totals.lat / businesses.length,
    lng: totals.lng / businesses.length,
  };
}