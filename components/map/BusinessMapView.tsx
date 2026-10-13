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

export function BusinessMapView({ businesses, className }: { businesses: any[], className?: string }) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithPoint | null>(null);
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

  const fitBoundsToMarkers = useCallback(() => {
    if (!mapRef.current || businessesWithPoints.length === 0) return;
    requestAnimationFrame(() => {
      const bounds = businessesWithPoints.reduce(
        (acc, { point }) => [
          [Math.min(acc[0][0], point.lng), Math.min(acc[0][1], point.lat)],
          [Math.max(acc[1][0], point.lng), Math.max(acc[1][1], point.lat)],
        ],
        [[businessesWithPoints[0].point.lng, businessesWithPoints[0].point.lat], [businessesWithPoints[0].point.lng, businessesWithPoints[0].point.lat]]
      );
      mapRef.current.fitBounds(bounds, { padding: 60, duration: 1500 });
    });
  }, [businessesWithPoints]);

  useEffect(() => {
    const t = setTimeout(() => fitBoundsToMarkers(), 200);
    return () => clearTimeout(t);
  }, [fitBoundsToMarkers]);

  return (
    <div className={className?? "h-150 w-full overflow-hidden rounded-2xl border border-border"}>
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        minZoom={8}
        initialViewState={{
          longitude: -75.742505,
          latitude: 6.500962,
          zoom: 12,
          pitch: 55,
          bearing: -10,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={currentMapStyle}
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
            'fill-extrusion-color': resolvedTheme === "dark"? "#ffffff" : "#aaa",
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': resolvedTheme === "dark"? 0.7 : 0.5
          }}
        />

        {businessesWithPoints.map((item) => {
          // --- AQUÍ ESTÁ EL CAMBIO DE PILDORAS A ICONOS ---
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
                    className="w-11 h-11 object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.7)]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#e07a5f] border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-sm">
                    {item.business.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="w-4 h-1 bg-black/40 rounded-full blur- mt-" />
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
            <Link href={getBusinessHref(selectedBusiness.business)} className="block p-1 min-w-">
              <h3 className="text-sm font-bold text-slate-900">{selectedBusiness.business.name}</h3>
              <RatingStars rating={selectedBusiness.business.rating} />
              {selectedBusiness.business.distance!== undefined && (
                <p className="mt-1 text- text-emerald-600 font-bold flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {formatDistance(selectedBusiness.business.distance)} del parque
                </p>
              )}
              <p className="mt-0.5 text- text-slate-500">{formatAddress(selectedBusiness.business.address)}</p>
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