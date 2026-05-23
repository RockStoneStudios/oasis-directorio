// @/app/mapa/page.tsx (Tu archivo actual modificado en applyFilters)
'use client';

import { useState, useEffect } from 'react';
import { getBusinesses } from "@/actions/getBusinesses";
import { DynamicBusinessMapView } from "@/components/map/DynamicBusinessMapView";
import { filterVenuesByDistance } from "@/lib/utils-geo/distance"; 
import { Store, Utensils, Syringe, Bed, Car, ShoppingBag, MapPin } from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  "restaurantes": Utensils,
  "salud": Syringe,
  "hospedaje": Bed,
  "vehiculos": Car,
  "compras": ShoppingBag,
};

const REF_LAT = 6.500962;
const REF_LNG = -75.742505;

export default function MapaPage() {
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null); 
  const [loading, setLoading] = useState(true);

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
          address: {
            lat: b.location?.lat,
            lng: b.location?.lng,
          }
        }));

        setAllBusinesses(adaptedBusinesses);
        
        // 🚀 Inicializamos calculando las distancias base desde el arranque
        const withInitialDistance = filterVenuesByDistance(adaptedBusinesses, REF_LAT, REF_LNG, 1000);
        setFilteredBusinesses(withInitialDistance);
      } catch (error) {
        console.error("Error cargando negocios para el mapa:", error);
      } finally {
        loading && setLoading(false);
      }
    }
    fetchMapData();
  }, []);

  // ✨ FUNCIÓN OPTIMIZADA: Siempre garantiza que exista b.distance
  const applyFilters = (category: string | null, radius: number | null) => {
    let result = [...allBusinesses];

    if (category) {
      result = result.filter(
        (b) => b.category?.name?.toLowerCase() === category.toLowerCase()
      );
    }

    // Si hay radio filtramos estricto, si no, calculamos distancia para todos sin omitir ninguno
    const activeRadius = radius !== null ? radius : 1000;
    result = filterVenuesByDistance(result, REF_LAT, REF_LNG, activeRadius);

    setFilteredBusinesses(result);
  };

  const handleCategorySelect = (categoryName: string) => {
    const nextCategory = selectedCategory === categoryName ? null : categoryName;
    setSelectedCategory(nextCategory);
    applyFilters(nextCategory, selectedRadius);
  };

  const handleRadiusSelect = (radiusKm: number | null) => {
    setSelectedRadius(radiusKm);
    applyFilters(selectedCategory, radiusKm);
  };

  const categoriesAvailable = Array.from(
    new Set(allBusinesses.map((b) => b.category?.name).filter(Boolean))
  ) as string[];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <header className="border-b border-border/50 bg-background px-4 py-3 shrink-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Store className="h-5 w-5" />
            <h1 className="text-base font-bold font-heading text-foreground">Oasis | Mapa Local</h1>
          </div>
          <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full transition-all">
            {filteredBusinesses.length} marcados
          </span>
        </div>
      </header>

      <main className="flex-1 relative w-full h-full min-h-0">
        {!loading && (
          <div className="absolute top-4 inset-x-0 z-10 flex flex-col items-center gap-2 px-4 pointer-events-none">
            {categoriesAvailable.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar pointer-events-auto bg-background/60 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-border/40">
                <button
                  onClick={() => { setSelectedCategory(null); applyFilters(null, selectedRadius); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === null ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
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
                        isSelected ? "bg-primary text-primary-foreground shadow-sm scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                      {category}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex gap-1.5 overflow-x-auto pointer-events-auto bg-background/80 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-border/30 text-[11px]">
              <button
                onClick={() => handleRadiusSelect(null)}
                className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedRadius === null ? "bg-secondary text-secondary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cualquier distancia
              </button>
              <button
                onClick={() => handleRadiusSelect(0.5)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedRadius === 0.5 ? "bg-secondary text-secondary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
              <MapPin className="h-3 w-3" /> a menos de 500m
              </button>
              <button
                onClick={() => handleRadiusSelect(1.0)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedRadius === 1.0 ? "bg-secondary text-secondary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapPin className="h-3 w-3" /> a menos de 1km
              </button>
            </div>
          </div>
        )}

        <div className="w-full h-full z-0">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50">
              <Store className="h-10 w-10 text-primary animate-pulse mb-2" />
              <p className="text-sm text-muted-foreground animate-pulse">Cargando mapa Oasis...</p>
            </div>
          ) : filteredBusinesses.length > 0 ? (
            <DynamicBusinessMapView businesses={filteredBusinesses} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <Store className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-lg font-semibold">No hay negocios en este rango o categoría</h2>
              <button 
                onClick={() => { setSelectedCategory(null); setSelectedRadius(null); applyFilters(null, null); }}
                className="mt-2 text-xs text-primary font-bold underline"
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