// @/components/category/CategoryGrid.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/image';
import { Store, ChevronDown, ChevronRight, Check } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  image?: { asset?: { url?: string; _ref?: string } };
  count: number;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
}

interface CategoryWithSubs {
  _id: string;
  name: string;
  slug: { current: string };
  subcategories: Subcategory[];
}

interface CategoryGridProps {
  initialCategories: Category[];
  categoriesWithSubs: CategoryWithSubs[];
}

const CATEGORY_HOOKS: Record<string, string> = {
  "donde-comer": "Los mejores restaurantes, estaderos, cafés y delicias típicas en la ruta del sol.",
  "hospedaje": "Hoteles con piscina, glampings idílicos y fincas de recreo en San Jerónimo, Sopetrán y Santa Fe.",
  "servicios": "Profesionales, corresponsales bancarios, transporte y soluciones en toda la subregión.",
  "salud": "Droguerías, centros médicos y atención de emergencias en los municipios del Occidente.",
  "compras": "Supermercados, tiendas de ropa, artesanías y comercio local para tus días de descanso.",
  "turismo": "Guías locales, centros recreativos, caminatas y planes imperdibles cerca del Río Cauca."
};

const FALLBACK_HOOKS = [
  (name: string) => `Descubre los sitios más recomendados y populares del sector ${name} en la subregión.`,
  (name: string) => `Encuentra contactos, horarios y ubicaciones de comercios dedicados a: ${name}.`,
  (name: string) => `Conoce los mejores negocios y emprendimientos locales especializados en ${name} en la región.`,
  (name: string) => `Todo lo que necesitas saber sobre el gremio de ${name} en los pueblos del Occidente.`,
  (name: string) => `Apoya el comercio local y encuentra las mejores opciones en ${name} cerca de ti.`,
  (name: string) => `Explora establecimientos de confianza y servicios calificados en el sector ${name}.`,
  (name: string) => `Tu guía definitiva para contactar empresas y locales enfocados en ${name}.`
];

function getDeterministicHook(id: string, name: string): string {
  if (!id) return `Explora las mejores opciones de ${name || 'comercio'} en toda la región.`;
  const cleanName = name || "comercio";
  const charCodeSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = charCodeSum % FALLBACK_HOOKS.length;
  return FALLBACK_HOOKS[index](cleanName);
}

export function CategoryGrid({ initialCategories = [], categoriesWithSubs = [] }: CategoryGridProps) {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const validCategories = Array.isArray(initialCategories) ? initialCategories : [];

  const handleCategoryClick = (category: Category, hasSubcategories: boolean) => {
    const targetSlug = category.slug?.current;
    if (!targetSlug) return;

    if (hasSubcategories) {
      setExpandedCategory(expandedCategory === category._id ? null : category._id);
    } else {
      router.push(`/categorias/${targetSlug}`);
    }
  };

  const getSubcategories = (categoryId: string) => {
    if (!categoryId || !Array.isArray(categoriesWithSubs)) return [];
    const category = categoriesWithSubs.find(cat => cat?._id === categoryId);
    return category?.subcategories || [];
  };

  if (validCategories.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-border/40">
        <Store className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-sm text-muted-foreground">No se encontraron categorías disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
      {validCategories.map((category) => {
        if (!category || !category._id) return null;

        const subcategories = getSubcategories(category._id);
        const isExpanded = expandedCategory === category._id;
        const hasSubcategories = subcategories.length > 0;
        const slugStr = category.slug?.current || "";
        const categoryName = category.name || "Categoría sin nombre";
        
        const categoryHook = CATEGORY_HOOKS[slugStr] || getDeterministicHook(category._id, categoryName);
        const hasValidImage = !!(category.image?.asset?._ref || category.image?.asset?.url);

        return (
          <div key={category._id} className="flex flex-col group">
            {/* 💳 TARJETA PRINCIPAL: Ahora tiene un tamaño independiente que no se deforma jamás */}
            <div
              onClick={() => handleCategoryClick(category, hasSubcategories)}
              className={`relative overflow-hidden rounded-2xl border bg-card p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer select-none flex flex-col justify-between aspect-square md:aspect-auto md:min-h-[220px] ${
                isExpanded 
                  ? 'border-primary/50 shadow-lg ring-1 ring-primary/10 bg-accent/5' 
                  : 'border-border/60 hover:border-primary/30 shadow-sm'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-70 group-hover:opacity-100 transition-opacity" />
              
              {/* Contenido Superior */}
              <div className="relative flex flex-col items-center text-center gap-3 md:gap-4 w-full h-full justify-center">
                <div className="relative h-14 w-14 md:h-16 md:w-16 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {hasValidImage ? (
                    <Image
                      src={category.image ? urlFor(category.image).width(112).height(112).url() : ""}
                      alt={`Icono representativo de ${categoryName}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized={process.env.NODE_ENV === 'development'}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5">
                      <Store className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                    </div>
                  )}
                </div>
                
                <div className="min-w-0 w-full">
                  <h2 className="text-sm md:text-lg font-bold text-foreground font-heading group-hover:text-primary transition-colors line-clamp-1">
                    {categoryName}
                  </h2>
                  
                  <p className="text-[11px] md:text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {categoryHook}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2 md:mt-3 justify-center">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] md:text-xs font-semibold text-primary">
                      {category.count || 0} {category.count === 1 ? 'negocio' : 'negocios'}
                    </span>
                  </div>
                </div>
              </div>
              
              {hasSubcategories && (
                <div className="absolute top-3 right-3 md:top-5 md:right-5 text-muted-foreground group-hover:text-foreground transition-colors">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  ) : (
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 opacity-70 group-hover:opacity-100" />
                  )}
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* 🔓 ACORDEÓN: Totalmente exterior al recuadro gris. Crece hacia abajo limpiamente sin alterar a los vecinos */}
            {isExpanded && hasSubcategories && (
              <div className="mt-2 md:mt-3 mx-1 p-2 md:p-3 rounded-2xl bg-muted/30 border border-border/50 space-y-1.5 animate-in fade-in slide-in-from-top-3 duration-300">
                <p className="text-[9px] md:text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/80 px-2 mb-2">
                  Especialidades disponibles:
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {subcategories.map((sub) => {
                    if (!sub || !sub.slug?.current) return null;
                    return (
                      <div
                        key={sub._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/categorias/${sub.slug.current}`);
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl bg-background/60 hover:bg-background border border-border/30 hover:border-primary/30 cursor-pointer transition-all active:scale-98 group/sub shadow-2xs"
                      >
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-md border border-border flex items-center justify-center bg-background shrink-0 group-hover/sub:border-primary group-hover/sub:bg-primary/10 transition-all">
                          <Check className="h-3 w-3 md:h-3.5 md:w-3.5 text-transparent group-hover/sub:text-primary transition-colors" />
                        </div>
                        
                        <span className="text-[11px] md:text-xs text-foreground/90 font-medium flex-1 line-clamp-1 group-hover/sub:text-primary transition-colors">
                          {sub.name || "Subcategoría"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}