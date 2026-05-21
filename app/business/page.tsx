// @/app/business/page.tsx
import {
  LayoutGrid,
  Map as MapIcon,
  SlidersHorizontal,
  Store,
} from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getBusinesses } from "@/actions/getBusinesses";
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessFilters } from "@/components/BusinessFilters";
import { BusinessSearchBar } from "@/components/BusinessSearchBar";
import { DynamicBusinessMapView } from "@/components/map/DynamicBusinessMapView";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sanityFetch } from "@/lib/sanity/live";
import {
  CATEGORIES_LIST_QUERY,
  MUNICIPALITIES_LIST_QUERY,
} from "@/lib/sanity/queries";
import type { BusinessSort } from "@/types/business";
import { SortSelect } from "./sort-select";

const PAGE_SIZE = 12;
const SORT_VALUES: BusinessSort[] = [
  "relevance",
  "rating_desc",
  "rating_asc",
  "name_asc",
  "name_desc",
];

interface BusinessPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

// 🚀 1. SEO METADATA DINÁMICO REFORZADO CONTRA CONTENIDO DUPLICADO
export async function generateMetadata({ searchParams }: BusinessPageProps): Promise<Metadata> {
  const params = await searchParams;
  
  const category = params.category ? decodeURIComponent(params.category) : "";
  const municipality = params.municipality ? decodeURIComponent(params.municipality) : "";
  const searchQuery = params.search ? decodeURIComponent(params.search) : "";
  const page = params.page ? ` - Página ${params.page}` : "";

  // Construcción de títulos comerciales de alto impacto local
  let title = `Directorio de Negocios y Comercios Locales${page} | Oasis`;
  if (category && municipality) {
    title = `${category} en ${municipality} | Guía Comercial${page} | Oasis`;
  } else if (category) {
    title = `${category} Locales | Guía de Comercios${page} | Oasis`;
  } else if (municipality) {
    title = `Negocios, Tiendas y Comercios en ${municipality}${page} | Oasis`;
  } else if (searchQuery) {
    title = `Buscar "${searchQuery}" | Directorio de Negocios | Oasis`;
  }

  let description = "Explora el directorio comercial y turístico más completo. Encuentra restaurantes, servicios profesionales, hospedajes y comercios locales con números de contacto y ubicación.";
  if (category || municipality) {
    description = `¿Buscas ${category || "establecimientos comerciales"} en ${municipality || "la región"}? Consulta los mejores lugares, horarios, teléfonos, WhatsApp y ubicaciones en el mapa interactivo de Oasis.`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oasis-directorio-ccg7.vercel.app";
  
  // 💡 ESTRATEGIA CANÓNICA: Evitamos indexar strings basura generados por ordenamientos o filtros vacíos
  const queryParts = [];
  if (params.category) queryParts.push(`category=${params.category}`);
  if (params.municipality) queryParts.push(`municipality=${params.municipality}`);
  if (params.page && Number(params.page) > 1) queryParts.push(`page=${params.page}`);
  
  const canonicalUrl = `${baseUrl}/business${queryParts.length > 0 ? `?${queryParts.join('&')}` : ""}`;

  // 💡 DIRECTIVA ROBOTS INTELIGENTE: Si el usuario usa filtros pesados de ordenación o búsquedas ultra específicas, 
  // le permitimos rastrear (follow) pero no indexar (noindex) para no ensuciar el índice de Google.
  const shouldIndex = !params.sort && !params.search && !params.minRating && !params.status;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: shouldIndex 
      ? "index, follow" 
      : "noindex, follow", // Evita que páginas clonadas con diferente orden nos quiten prioridad
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Oasis",
      locale: "es_CO",
      images: [
        {
          url: `${baseUrl}/og-directory.png`, 
          width: 1200,
          height: 630,
          alt: `Directorio Comercial Oasis - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-directory.png`],
    },
  };
}

export default async function BusinessPage({ searchParams }: BusinessPageProps) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const sort = getSafeSort(params.sort);

  const [
    { businesses, hasMore },
    { data: categories },
    { data: municipalities },
  ] = await Promise.all([
    getBusinesses({
      search: params.search || "",
      category: params.category || "",
      subcategory: params.subcategory || "",
      municipality: params.municipality || "",
      status: params.status || "",
      minRating: params.minRating || "",
      sort,
      hasWhatsapp: params.hasWhatsapp === "true",
      hasAddress: params.hasAddress === "true",
      page,
      pageSize: PAGE_SIZE,
    }),
    sanityFetch({ query: CATEGORIES_LIST_QUERY }),
    sanityFetch({ query: MUNICIPALITIES_LIST_QUERY }),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oasis-directorio-ccg7.vercel.app";

  // 🚀 2. ESQUEMAS DE DATOS ESTRUCTURADOS (JSON-LD)
  // Esquema 1: Colección de elementos (Lista de comercios indexables)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Listado de Comercios Registrados en Oasis",
    "description": "Lista detallada de los mejores comercios locales indexados",
    "url": `${baseUrl}/business`,
    "numberOfItems": businesses.length,
    "itemListElement": businesses.map((b, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${baseUrl}/business/${typeof b.slug === 'object' && b.slug?.current ? b.slug.current : b.slug || ""}`,
      "name": b.name
    }))
  };

  // Esquema 2: Buscador integrado directo para la caja de Google
  const searchBoxSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/business?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="bg-accent/20">
      {/* Inyección de los dos Scripts JSON-LD en el HEAD semántico */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchBoxSchema) }}
      />

      <header className="border-b border-border/50 bg-background">
        <div className="container py-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <Store className="h-4 w-4" aria-hidden="true" />
            <span>Directorio Oficial</span>
          </div>
          <h1 className="text-3xl font-bold font-heading md:text-4xl text-foreground">
            Negocios locales
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Filtra por categoría, municipio o disponibilidad en tiempo real y encuentra el
            establecimiento o servicio que necesitas hoy mismo.
          </p>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Barra de Filtros Lateral Semántica */}
          <aside className="lg:w-80 lg:shrink-0" aria-label="Filtros de búsqueda">
            <div className="lg:sticky lg:top-24">
              <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
                <BusinessFilters
                  categories={Array.isArray(categories) ? categories : []}
                  municipalities={Array.isArray(municipalities) ? municipalities : []}
                />
              </Suspense>
            </div>
          </aside>

          {/* Sección de resultados */}
          <section className="min-w-0 flex-1" aria-label="Resultados del directorio">
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border/50 bg-background p-4 shadow-warm md:flex-row md:items-center">
              <BusinessSearchBar />
              <div className="flex items-center gap-2 md:w-56">
                <SlidersHorizontal
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <SortSelect value={sort} />
              </div>
            </div>

            {businesses.length > 0 ? (
              <Tabs defaultValue="grid" className="w-full">
                <TabsList className="mb-6 rounded-xl border border-border/50 bg-background p-1">
                  <TabsTrigger
                    value="grid"
                    className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                    <span>Grilla</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="map"
                    className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <MapIcon className="h-4 w-4" aria-hidden="true" />
                    <span>Vista en Mapa</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="mt-0">
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {businesses.map((business) => (
                      <BusinessCard key={business._id} business={business} />
                    ))}
                  </div>
                  <Pagination
                    page={page}
                    hasMore={hasMore}
                    searchParams={params}
                  />
                </TabsContent>

                <TabsContent value="map" className="mt-0">
                  <div className="h-160 overflow-hidden rounded-2xl border border-border/50 bg-background shadow-warm">
                    <DynamicBusinessMapView businesses={businesses} />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="rounded-2xl border border-border/50 bg-background p-12 text-center shadow-warm">
                <Store
                  className="mx-auto mb-4 h-12 w-12 text-muted-foreground"
                  aria-hidden="true"
                />
                <h2 className="text-xl font-semibold font-heading text-foreground">
                  No encontramos negocios
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Ajusta la búsqueda o limpia los filtros para ver más
                  resultados disponibles en la región.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function getSafeSort(value?: string): BusinessSort {
  return SORT_VALUES.includes(value as BusinessSort)
    ? (value as BusinessSort)
    : "relevance";
}