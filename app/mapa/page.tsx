'use client';

import { useState, useEffect } from 'react';
import { getBusinesses } from "@/actions/getBusinesses";
import { DynamicBusinessMapView } from "@/components/map/DynamicBusinessMapView";
import { Store, Utensils, Syringe, Bed, Car, ShoppingBag } from "lucide-react";

// Mapeo de íconos para que las píldoras se vean profesionales
const CATEGORY_ICONS: Record<string, any> = {
  "restaurantes": Utensils,
  "salud": Syringe,
  "hospedaje": Bed,
  "vehiculos": Car,
  "compras": ShoppingBag,
};

export default function MapaPage() {
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar todos los negocios al montar el componente
  useEffect(() => {
    async function fetchMapData() {
      try {
        const { businesses } = await getBusinesses({
          search: "",
          category: "",
          subcategory: "",
          municipality: "",
          status: "",
          minRating: "",
          sort: "name_asc",
          hasWhatsapp: false,
          hasAddress: false,
          page: 1,
          pageSize: 200, 
        });
        setAllBusinesses(businesses);
        setFilteredBusinesses(businesses);
      } catch (error) {
        console.error("Error cargando negocios para el mapa:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMapData();
  }, []);

  // 2. Extraer categorías únicas que realmente tienen negocios
  const categoriesAvailable = Array.from(
    new Set(
      allBusinesses
        .map((b) => b.category?.name)
        .filter(Boolean)
    )
  ) as string[];

  // 3. Función manejadora del filtro rápido
  const handleCategorySelect = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
      setFilteredBusinesses(allBusinesses);
    } else {
      setSelectedCategory(categoryName);
      const filtered = allBusinesses.filter(
        (b) => b.category?.name?.toLowerCase() === categoryName.toLowerCase()
      );
      setFilteredBusinesses(filtered);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header Minimalista */}
      <header className="border-b border-border/50 bg-background px-4 py-3 shrink-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Store className="h-5 w-5" />
            <h1 className="text-base font-bold font-heading text-foreground">
              Oasis | Mapa Local
            </h1>
          </div>
          <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full transition-all">
            {filteredBusinesses.length} marcados
          </span>
        </div>
      </header>

      {/* Contenedor del Mapa y Elementos Flotantes */}
      <main className="flex-1 relative w-full h-full min-h-0">
        
        {/* PÍLDORAS FLOTANTES (Filtros Rápidos sin barra de scroll) */}
        {!loading && categoriesAvailable.length > 0 && (
          <div className="absolute top-4 inset-x-0 z-10 flex justify-center px-4 pointer-events-none">
            <div className="flex gap-2 overflow-x-auto pb-0 max-w-full pointer-events-auto bg-background/60 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-border/40 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Botón de "Todos" */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setFilteredBusinesses(allBusinesses);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Todos
              </button>

              {/* Botones dinámicos de categorías */}
              {categoriesAvailable.map((category) => {
                const isSelected = selectedCategory === category;
                const IconComponent = CATEGORY_ICONS[category.toLowerCase()] || Store;

                return (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MAPA */}
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
              <h2 className="text-lg font-semibold">No hay negocios en esta categoría</h2>
              <button 
                onClick={() => { setSelectedCategory(null); setFilteredBusinesses(allBusinesses); }}
                className="mt-2 text-xs text-primary font-bold underline"
              >
                Ver todos los negocios
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}