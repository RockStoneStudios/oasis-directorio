"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import MapGL, { Marker, NavigationControl, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { BusinessCardData } from "@/types/business";

interface MapViewProps {
  businesses: BusinessCardData[];
  onBusinessClick?: (business: BusinessCardData) => void;
  className?: string;
}

export function MapView({
  businesses,
  onBusinessClick,
  className,
}: MapViewProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessCardData | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -75.5849,
    latitude: 6.2442,
    zoom: 12,
  });
  console.log("Token:+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  const hasCenteredRef = useRef(false);

  const validBusinesses = businesses.filter(
    (b) => b.location?.lat && b.location?.lng,
  );

  useEffect(() => {
    if (hasCenteredRef.current) return;
    if (validBusinesses.length > 0) {
      const firstBusiness = validBusinesses[0];
      if (firstBusiness.location) {
        setViewState({
          longitude: firstBusiness.location.lng,
          latitude: firstBusiness.location.lat,
          zoom: 13,
        });
        hasCenteredRef.current = true;
      }
    }
  }, [validBusinesses]);

  const handleMarkerClick = useCallback(
    (business: BusinessCardData) => {
      setSelectedBusiness(business);
      if (onBusinessClick) {
        onBusinessClick(business);
      }
    },
    [onBusinessClick],
  );

  const getSlugString = (slug: BusinessCardData["slug"]) =>
    typeof slug === "string" ? slug : slug.current;

  return (
    <div className={className ?? "w-full h-full"}>
      <MapGL
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
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
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(business);
            }}
          >
            <div className="cursor-pointer">
              <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold shadow-md hover:bg-primary/90 transition-colors">
                {business.name}
              </div>
            </div>
          </Marker>
        ))}

        {selectedBusiness?.location && (
          <Popup
            longitude={selectedBusiness.location.lng}
            latitude={selectedBusiness.location.lat}
            anchor="bottom"
            onClose={() => setSelectedBusiness(null)}
            closeButton={true}
            closeOnClick={false}
            className="business-popup"
          >
            <Link
              href={`/business/${getSlugString(selectedBusiness.slug)}`}
              className="block p-2 min-w-50 hover:bg-muted/50 transition-colors rounded-md cursor-pointer"
            >
              <h3 className="font-semibold text-sm">{selectedBusiness.name}</h3>

              {selectedBusiness.category?.name && (
                <p className="text-xs text-primary font-medium mt-1">
                  {selectedBusiness.category.name}
                </p>
              )}

              {selectedBusiness.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {selectedBusiness.description}
                </p>
              )}

              {selectedBusiness.address && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedBusiness.address.street}
                  {selectedBusiness.address.neighborhood
                    ? `, ${selectedBusiness.address.neighborhood}`
                    : ""}
                </p>
              )}

              {selectedBusiness.phone && (
                <p className="text-xs text-muted-foreground mt-1">
                  📞 {selectedBusiness.phone}
                </p>
              )}
            </Link>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}