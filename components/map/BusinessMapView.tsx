"use client";

import { MapPin, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Map, { Marker, NavigationControl, Popup, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";
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
  const fitBoundsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const displayMode = pathname === "/mapa" ? "distance" : "name";

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

  // ✅ Optimizado: fitBounds con requestAnimationFrame para evitar reflows
  const fitBoundsToMarkers = useCallback(() => {
    if (!mapRef.current || businessesWithPoints.length === 0) return;

    // Usar requestAnimationFrame para evitar reflows forzados
    requestAnimationFrame(() => {
      if (!mapRef.current || businessesWithPoints.length === 0) return;

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

  // ✅ Optimizado: Debounce para evitar múltiples llamadas
  useEffect(() => {
    if (fitBoundsTimeoutRef.current) {
      clearTimeout(fitBoundsTimeoutRef.current);
    }
    
    fitBoundsTimeoutRef.current = setTimeout(() => {
      fitBoundsToMarkers();
    }, 100);

    return () => {
      if (fitBoundsTimeoutRef.current) {
        clearTimeout(fitBoundsTimeoutRef.current);
      }
    };
  }, [fitBoundsToMarkers]);

  // ✅ Optimizado: Manejo de resize sin reflows
  useEffect(() => {
    if (!mapRef.current) return;

    const handleResize = () => {
      requestAnimationFrame(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
    };

    // Usar ResizeObserver en lugar de event listener de window
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current = new ResizeObserver(handleResize);
      const container = mapRef.current?.getContainer?.();
      if (container) {
        resizeObserverRef.current.observe(container);
      }
    }

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // ✅ Optimizado: Manejo de selección de marcador
  const handleMarkerClick = useCallback((item: BusinessWithPoint, e: any) => {
    e.originalEvent?.stopPropagation();
    requestAnimationFrame(() => {
      setSelectedBusiness(item);
    });
  }, []);

  // ✅ Optimizado: Cierre del popup
  const handlePopupClose = useCallback(() => {
    requestAnimationFrame(() => {
      setSelectedBusiness(null);
    });
  }, []);

  // 🌟 Inyectamos estilos con requestAnimationFrame
  const onMapLoad = useCallback((e: any) => {
    const mapInstance = e.target;
    if (resolvedTheme === "dark") {
      requestAnimationFrame(() => {
        if (mapInstance.getLayer("background")) {
          mapInstance.setPaintProperty("background", "background-color", "#0a0a0a");
        }
        if (mapInstance.getLayer("water")) {
          mapInstance.setPaintProperty("water", "fill-color", "#0a1428");
        }
      });
    }
  }, [resolvedTheme]);

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
        mapStyle={currentMapStyle}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
        onLoad={onMapLoad}
        onRender={() => {
          // ✅ Evita reflows forzados en cada render
          requestAnimationFrame(() => {
            if (mapRef.current && !mapRef.current.isMoving()) {
              mapRef.current.resize();
            }
          });
        }}
      >
        <NavigationControl position="top-right" />

        {resolvedTheme === "dark" && (
          <Layer
            id="dark-overlay"
            type="background"
            paint={{
              'background-color': '#000000',
              'background-opacity': 0.35
            }}
          />
        )}

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
            'fill-extrusion-opacity': resolvedTheme === "dark" ? 0.79 : 0.6
          }}
        />

        {businessesWithPoints.map((item) => (
          <Marker
            key={item.business._id}
            longitude={item.point.lng}
            latitude={item.point.lat}
            anchor="bottom"
            onClick={(e) => handleMarkerClick(item, e)}
          >
            <button 
              className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1.5 text-xs font-semibold text-black dark:text-white shadow-xl hover:scale-110 transition-all whitespace-nowrap border border-border"
              aria-label={`Ver ${item.business.name}`}
            >
              {displayMode === "distance" ? (
                <>
                  <MapPin className="h-3 w-3 fill-black/20 dark:fill-white/20" aria-hidden="true" />
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
                  <Store className="h-3.5 w-3.5" aria-hidden="true" />
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
            onClose={handlePopupClose}
            closeButton={false}
            offset={20}
          >
            <Link href={getBusinessHref(selectedBusiness.business)} className="block p-1" aria-label={`Ver detalles de ${selectedBusiness.business.name}`}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-800">{selectedBusiness.business.name}</h3>
              <RatingStars rating={selectedBusiness.business.rating} />
              
              {selectedBusiness.business.distance !== undefined && (
                <p className="mt-1 text-[11px] text-primary font-semibold flex items-center gap-0.5">
                  A {formatDistance(selectedBusiness.business.distance)} de ti
                </p>
              )}

              <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                {formatAddress(selectedBusiness.business.address)}
              </p>
            </Link>
          </Popup>
        )}
      </Map>
    </div>
  );
}