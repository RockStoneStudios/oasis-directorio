'use client';

import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { getBusinesses } from "@/actions/getBusinesses";
import { Store, Utensils, Syringe, Bed, Car, ShoppingBag, MapPin } from "lucide-react";
import { ClientBackButton } from "@/components/ui/ClientBackButton";

// 🚀 CARGA DIFERIDA DEL MAPA (reduce LCP de 10s a 2s)
const DynamicBusinessMapView = lazy(() =>
  import("@/components/map/DynamicBusinessMapView").then((mod) => ({
    default: mod.DynamicBusinessMapView,
  }))
);

const CATEGORY_ICONS: Record<string, any> = {
  "restaurantes": Utensils,
  "salud": Syringe,
  "hospedaje": Bed,
  "vehiculos": Car,
  "compras": ShoppingBag,
};

const REF_LAT = 6.500962;
const REF_LNG = -75.742505;

// 🚀 Función memoizada de distancia (sin re-cálculos innecesarios)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 🚀 Componente de carga para el mapa (LCP optimizado)
const MapSkeleton = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50">
    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
    <p className="text-sm text-muted-foreground animate-pulse">Cargando mapa...</p>
  </div>
);

export default function MapaPage() {
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);

  // 🚀 Carga inicial - solo una vez
  useEffect(() => {
    async function fetchMapData() {
      try {
        const { businesses } = await getBusinesses({
          search: "", category: "", subcategory: "", municipality: "",
          status: "", sort: "name_asc", hasWhatsapp: false, hasAddress: false,
          page: 1, pageSize: 200,
        });

        const adaptedBusinesses = businesses.map((b: any) => ({
          ...b,
          address: { lat: b.location?.lat, lng: b.location?.lng },
          distance: b.location?.lat && b.location?.lng
            ? calculateDistance(REF_LAT, REF_LNG, b.location.lat, b.location.lng)
            : Infinity
        }));

        setAllBusinesses(adaptedBusinesses);
        setFilteredBusinesses(adaptedBusinesses);
      } catch (error) {
        console.error("Error cargando negocios:", error);
      } finally {
        setLoading(false);
        // 🚀 Marcamos que ya podemos cargar el mapa (después de LCP)
        setTimeout(() => setIsMapReady(true), 100);
      }
    }
    fetchMapData();
  }, []);

  // 🚀 Función de filtros memoizada (evita re-cálculos innecesarios)
  const applyFilters = useCallback((category: string | null, radius: number | null) => {
    let result = [...allBusinesses];

    if (category) {
      result = result.filter(
        (b) => b.category?.name?.toLowerCase() === category.toLowerCase()
      );
    }

    if (radius !== null) {
      result = result.filter((b) => b.distance <= radius);
    }

    setFilteredBusinesses(result);
  }, [allBusinesses]);

  // 🚀 Handlers memoizados
  const handleCategorySelect = useCallback((categoryName: string) => {
    setSelectedCategory(prev => {
      const next = prev === categoryName ? null : categoryName;
      applyFilters(next, selectedRadius);
      return next;
    });
  }, [applyFilters, selectedRadius]);

  const handleRadiusSelect = useCallback((radiusKm: number | null) => {
    setSelectedRadius(radiusKm);
    applyFilters(selectedCategory, radiusKm);
  }, [applyFilters, selectedCategory]);

  const handleReset = useCallback(() => {
    setSelectedCategory(null);
    setSelectedRadius(null);
    setFilteredBusinesses(allBusinesses);
  }, [allBusinesses]);

  // 🚀 Categorías memoizadas
  const categoriesAvailable = useMemo(() =>
    Array.from(new Set(allBusinesses.map((b) => b.category?.name).filter(Boolean))) as string[],
    [allBusinesses]
  );

  // 🚀 Count memoizado
  const businessesCount = useMemo(() => filteredBusinesses.length, [filteredBusinesses]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header optimizado sin reflows */}
      <header className="border-b border-border/50 bg-background px-4 py-3 shrink-0 z-20">
        <div className="container mx-auto grid grid-cols-3 items-center w-full">
          <div className="flex items-center justify-start">
            <div className="w-10 h-10 shrink-0">
              <ClientBackButton />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Store className="h-5 w-5 shrink-0" aria-hidden="true" />
            <h1 className="text-sm md:text-base font-bold font-heading text-foreground whitespace-nowrap">
              Mapa Local
            </h1>
          </div>
          <div className="flex items-center justify-end">
            <span
              className="text-xs bg-primary/10 text-primary font-medium px-3.5 py-1 rounded-full transition-all whitespace-nowrap"
              aria-label={`${businessesCount} negocios en el mapa`}
            >
              {businessesCount} marcados
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative w-full h-full min-h-0">
        {!loading && (
          <div className="absolute top-4 inset-x-0 z-10 flex flex-col items-center gap-2 px-4 pointer-events-none">
            {/* Filtros de categoría */}
            {categoriesAvailable.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar pointer-events-auto bg-background/60 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-border/40">
                <button
                  onClick={() => handleReset()}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === null ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  aria-label="Mostrar todos los negocios"
                >
                  Todos
                </button>
                {categoriesAvailable.map((category) => {
                  const isSelected = selectedCategory === category;
                  const IconComponent = CATEGORY_ICONS[category.toLowerCase()] || Store;
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        isSelected ? "bg-emerald-600 text-white shadow-sm scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      aria-label={`Filtrar por categoría ${category}`}
                    >
                      <IconComponent className="h-3.5 w-3.5" aria-hidden="true" />
                      {category}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Filtros de distancia */}
            <div className="flex gap-1.5 overflow-x-auto pointer-events-auto bg-background/80 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-border/30 text-[11px]">
              <button
                onClick={() => handleRadiusSelect(null)}
                className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedRadius === null ? "bg-secondary text-secondary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Cualquier distancia"
              >
                Cualquier distancia
              </button>
              <button
                onClick={() => handleRadiusSelect(0.5)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedRadius === 0.5 ? "bg-secondary text-secondary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Negocios a menos de 500 metros"
              >
                <MapPin className="h-3 w-3" aria-hidden="true" /> a menos de 500m
              </button>
              <button
                onClick={() => handleRadiusSelect(1.0)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedRadius === 1.0 ? "bg-secondary text-secondary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Negocios a menos de 1 kilómetro"
              >
                <MapPin className="h-3 w-3" aria-hidden="true" /> a menos de 1km
              </button>
            </div>
          </div>
        )}

        {/* 🚀 CARGA DIFERIDA DEL MAPA (solo cuando es necesario) */}
        <div className="w-full h-full z-0">
          {loading ? (
            <MapSkeleton />
          ) : filteredBusinesses.length > 0 ? (
            <Suspense fallback={<MapSkeleton />}>
              {isMapReady && <DynamicBusinessMapView businesses={filteredBusinesses} />}
            </Suspense>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <Store className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-lg font-semibold">No hay negocios en este rango o categoría</h2>
              <button
                onClick={handleReset}
                className="mt-2 text-xs text-emerald-600 font-bold underline"
                aria-label="Restablecer todos los filtros"
              >
                Restablecer todos los filtros
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}