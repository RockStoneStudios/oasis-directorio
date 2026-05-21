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

// 🚀 Ganchos ultra específicos para las categorías principales
const CATEGORY_HOOKS: Record<string, string> = {
  "donde-comer": "Los mejores restaurantes, estaderos, cafés y delicias típicas en la ruta del sol.",
  "hospedaje": "Hoteles con piscina, glampings idílicos y fincas de recreo en San Jerónimo, Sopetrán y Santa Fe.",
  "servicios": "Profesionales, corresponsales bancarios, transporte y soluciones en toda la subregión.",
  "salud": "Droguerías, centros médicos y atención de emergencias en los municipios del Occidente.",
  "compras": "Supermercados, tiendas de ropa, artesanías y comercio local para tus días de descanso.",
  "turismo": "Guías locales, centros recreativos, caminatas y planes imperdibles cerca del Río Cauca."
};

// 🚀 Variantes dinámicas de seguridad
const FALLBACK_HOOKS = [
  (name: string) => `Descubre los sitios más recomendados y populares del sector ${name} en la subregión.`,
  (name: string) => `Encuentra contactos, horarios y ubicaciones de comercios dedicados a: ${name}.`,
   (name: string) => `Conoce los mejores negocios y emprendimientos locales especializados en ${name} en la región.`,
  (name: string) => `Todo lo que necesitas saber sobre el gremio de ${name} en los pueblos del Occidente.`,
  (name: string) => `Apoya el comercio local y encuentra las mejores opciones en ${name} cerca de ti.`,
  (name: string) => `Explora establecimientos de confianza y servicios calificados en el sector ${name}.`,
  (name: string) => `Tu guía definitiva para contactar empresas y locales enfocados en ${name}.`
];

// 🚀 Función a prueba de fallos con validación de nulidad
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

  // Control preventivo por si las propiedades llegan como null o undefined
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {validCategories.map((category) => {
        // Validación individual: Si la categoría no tiene datos mínimos obligatorios, nos saltamos su renderizado
        if (!category || !category._id) return null;

        const subcategories = getSubcategories(category._id);
        const isExpanded = expandedCategory === category._id;
        const hasSubcategories = subcategories.length > 0;
        const slugStr = category.slug?.current || "";
        const categoryName = category.name || "Categoría sin nombre";
        
        const categoryHook = CATEGORY_HOOKS[slugStr] || getDeterministicHook(category._id, categoryName);

        // Control de renderizado seguro de imágenes de Sanity
        const hasValidImage = !!(category.image?.asset?._ref || category.image?.asset?.url);

        return (
          <div key={category._id} className="flex flex-col h-full group">
            <div
              onClick={() => handleCategoryClick(category, hasSubcategories)}
              className={`relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer h-full select-none flex flex-col justify-between ${
                isExpanded 
                  ? 'border-primary/50 shadow-lg ring-1 ring-primary/10 bg-accent/5' 
                  : 'border-border/60 hover:border-primary/30 shadow-sm'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-70 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex items-start gap-4">
                {/* Imagen con fallback blindado */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {hasValidImage ? (
                    <Image
                    src={category.image ? urlFor(category.image).width(112).height(112).url() : ""}
                      alt={ `Icono representativo de ${categoryName}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized={process.env.NODE_ENV === 'development'}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5">
                      <Store className="h-7 w-7 text-primary" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 pr-4">
                  <h2 className="text-lg font-bold text-foreground font-heading group-hover:text-primary transition-colors line-clamp-1">
                    {categoryName}
                  </h2>
                  
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {categoryHook}
                  </p>

                  <div className="flex items-center gap-1.5 mt-3">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {category.count || 0} {(category.count === 1) ? 'negocio' : 'negocios'}
                    </span>
                  </div>
                </div>
              </div>
              
              {hasSubcategories && (
                <div className="absolute top-5 right-5 text-muted-foreground group-hover:text-foreground transition-colors">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 opacity-70 group-hover:opacity-100" />
                  )}
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {isExpanded && hasSubcategories && (
              <div className="mt-3 mx-1 p-3 rounded-2xl bg-muted/30 border border-border/50 space-y-1.5 animate-in fade-in slide-in-from-top-3 duration-300">
                <p className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/80 px-2 mb-2">
                  Especialidades disponibles:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {subcategories.map((sub) => {
                    if (!sub || !sub.slug?.current) return null;
                    return (
                      <div
                        key={sub._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/categorias/${sub.slug.current}`);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-background/60 hover:bg-background border border-border/30 hover:border-primary/30 cursor-pointer transition-all active:scale-98 group/sub shadow-2xs"
                      >
                        <div className="w-5 h-5 rounded-md border border-border flex items-center justify-center bg-background shrink-0 group-hover/sub:border-primary group-hover/sub:bg-primary/10 transition-all">
                          <Check className="h-3.5 w-3.5 text-transparent group-hover/sub:text-primary transition-colors" />
                        </div>
                        
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium flex-1 line-clamp-1 group-hover/sub:text-primary transition-colors">
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