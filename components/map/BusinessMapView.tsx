"use client";

import { MapPin, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import MapGL, { Marker, NavigationControl, Popup } from "react-map-gl/mapbox";
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
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessCardData | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -74.2973,
    latitude: 4.5709,
    zoom: 5,
  });
  const hasCenteredRef = useRef(false);

  const validBusinesses = useMemo(
    () =>
      businesses.filter(
        (business) => business.location?.lat && business.location?.lng,
      ),
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
      <div className="flex h-full min-h-[480px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center text-muted-foreground">
        No hay negocios con ubicacion disponible para mostrar en el mapa.
      </div>
    );
  }

  return (
    <div className={className ?? "h-full w-full"}>
      <MapGL
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
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
              aria-label={`Ver ${business.name} en el mapa`}
            >
              <Store className="h-3.5 w-3.5" aria-hidden="true" />
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
            closeButton
            closeOnClick={false}
          >
            <Link
              href={getBusinessHref(selectedBusiness)}
              className="block min-w-[220px] rounded-md p-2 transition-colors hover:bg-muted/50"
            >
              <h3 className="line-clamp-2 text-sm font-semibold">
                {selectedBusiness.name}
              </h3>
              <div className="mt-2">
                <RatingStars rating={selectedBusiness.rating} showValue />
              </div>
              {formatAddress(selectedBusiness.address) && (
                <p className="mt-2 flex gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    {formatAddress(selectedBusiness.address)}
                  </span>
                </p>
              )}
            </Link>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}

function getMapCenter(businesses: BusinessCardData[]) {
  const totals = businesses.reduce(
    (accumulator, business) => ({
      lat: accumulator.lat + (business.location?.lat ?? 0),
      lng: accumulator.lng + (business.location?.lng ?? 0),
    }),
    { lat: 0, lng: 0 },
  );

  return {
    lat: totals.lat / businesses.length,
    lng: totals.lng / businesses.length,
  };
}
