// @/app/business/page.tsx
import {
  LayoutGrid,
  Map as MapIcon,
  SlidersHorizontal,
  Store,
} from "lucide-react";
import type { Metadata } from "next";
import { lazy, Suspense } from "react";
import { getBusinesses } from "@/actions/getBusinesses";
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessFilters } from "@/components/BusinessFilters";
import { BusinessSearchBar } from "@/components/BusinessSearchBar";
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

const DynamicBusinessMapView = lazy(() =>
  import("@/components/map/DynamicBusinessMapView").then((mod) => ({
    default: mod.DynamicBusinessMapView,
  }))
);

const PAGE_SIZE = 12;
const SORT_VALUES: BusinessSort[] = [
  "relevance",
  "rating_desc",
  "rating_asc",
  "name_asc",
  "name_desc",
];

// ===== FIX PARA TU CAPTURA image_7b2700.png =====
const MUNICIPIOS_MAP: Record<string, string> = {
  sopetran: "Sopetrán",
  "san-jeronimo": "San Jerónimo",
  "santa-fe-de-antioquia": "Santa Fe de Antioquia",
  liborina: "Liborina",
  olaya: "Olaya",
};

const CATEGORIAS_MAP: Record<string, string> = {
  "salud-and-bienestar": "Salud y Bienestar",
  "salud-y-bienestar": "Salud y Bienestar",
  "donde-comer": "Dónde Comer",
  restaurantes: "Restaurantes",
  alojamiento: "Alojamiento",
  "belleza-y-cuidado-personal": "Belleza y Cuidado Personal",
  "belleza-and-cuidado-personal": "Belleza y Cuidado Personal",
};

function prettyMunicipio(slug?: string) {
  if (!slug) return "";
  const s = slug.toLowerCase();
  if (MUNICIPIOS_MAP[s]) return MUNICIPIOS_MAP[s];
  return s.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function prettyCategoria(slug?: string) {
  if (!slug) return "";
  const s = slug.toLowerCase();
  if (CATEGORIAS_MAP[s]) return CATEGORIAS_MAP[s];
  return s.replace(/-and-/g, " y ").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

interface BusinessPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ searchParams }: BusinessPageProps): Promise<Metadata> {
  const params = await searchParams;
  
  const rawCategory = params.category ? decodeURIComponent(params.category) : "";
  const rawMunicipality = params.municipality ? decodeURIComponent(params.municipality) : "";
  const searchQuery = params.search ? decodeURIComponent(params.search) : "";

  const category = prettyCategoria(rawCategory);
  const municipality = prettyMunicipio(rawMunicipality);

  const page = params.page && Number(params.page) > 1 ? ` - Página ${params.page}` : "";

  let title = `Directorio de Negocios en el Occidente Antioqueño${page} | Ooasys`;
  let description = `Directorio de más de 200 negocios en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya. Filtra por categoría y contacta por WhatsApp directo.`;

  if (rawCategory && rawMunicipality) {
    title = `${category} en ${municipality}: Teléfonos, Horarios y Domicilio a Fincas${page} | Ooasys`;
    description = `¿Buscas ${category.toLowerCase()} en ${municipality}? Encuentra ${rawCategory === 'salud-and-bienestar' ? 'droguerías' : category.toLowerCase()} con teléfono, WhatsApp, horarios y ubicación. Domicilio a fincas y veredas en ${municipality}.`;
  } else if (rawCategory) {
    title = `${category} en el Occidente Antioqueño: Guía Completa con WhatsApp${page} | Ooasys`;
    description = `Directorio de ${category.toLowerCase()} en Sopetrán, San Jerónimo y Santa Fe de Antioquia. Contacto directo por WhatsApp.`;
  } else if (rawMunicipality) {
    title = `Negocios en ${municipality}: Restaurantes, Fincas y Servicios${page} | Ooasys`;
    description = `Todos los negocios verificados en ${municipality}: dónde comer, alojamiento, transporte y más con WhatsApp directo.`;
  } else if (searchQuery) {
    title = `Resultados para "${searchQuery}" en Occidente Antioqueño${page} | Ooasys`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";
  const queryParts = [];
  if (params.category) queryParts.push(`category=${params.category}`);
  if (params.municipality) queryParts.push(`municipality=${params.municipality}`);
  if (params.search) queryParts.push(`search=${params.search}`);
  if (params.page && Number(params.page) > 1) queryParts.push(`page=${params.page}`);
  
  const canonicalUrl = `${baseUrl}/business${queryParts.length > 0 ? `?${queryParts.join('&')}` : ""}`;
  const shouldIndex = !params.sort && !params.minRating && !params.status && !params.subcategory;

  return {
    title,
    description,
    authors: [{ name: "Ooasys", url: baseUrl }],
    alternates: { canonical: canonicalUrl },
    robots: shouldIndex ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Ooasys",
      locale: "es_CO",
      images: [{ url: `${baseUrl}/ooasys.webp`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/ooasys.webp`],
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";
  const categoryName = prettyCategoria(params.category);
  const municipalityName = prettyMunicipio(params.municipality);
  const rawCategory = params.category || "";

  const collectionPageSchema = page === 1 ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoryName && municipalityName ? `${categoryName} en ${municipalityName}` : "Directorio Ooasys",
    "description": `Directorio de ${categoryName || "negocios"} en ${municipalityName || "Occidente Antioqueño"}`,
    "url": `${baseUrl}/business`,
    "hasPart": businesses.slice(0, 12).map((b: any, idx: number) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${baseUrl}/business/${typeof b.slug === 'object' && b.slug?.current ? b.slug.current : b.slug || ""}`,
      "name": b.name
    }))
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Negocios", "item": `${baseUrl}/business` },
      ...(municipalityName ? [{ "@type": "ListItem", "position": 3, "name": municipalityName, "item": `${baseUrl}/business?municipality=${params.municipality}` }] : []),
      ...(categoryName ? [{ "@type": "ListItem", "position": municipalityName ? 4 : 3, "name": categoryName, "item": `${baseUrl}/business?category=${params.category}` }] : [])
    ]
  };

  return (
    <div className="bg-accent/20">
      {collectionPageSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema).replace(/</g, "\\u003c") }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />

      <header className="border-b border-border/50 bg-background">
        <div className="container py-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
            <Store className="h-4 w-4" aria-hidden="true" />
            <span>Directorio Oficial del Occidente Antioqueño</span>
          </div>
          <h1 className="text-3xl font-bold font-heading md:text-4xl text-foreground capitalize">
            {categoryName || municipalityName 
              ? `${categoryName ? `${categoryName} en ` : ""}${municipalityName || "Antioquia"}`
              : "Directorio de Negocios Locales"}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {rawCategory === 'salud-and-bienestar' && municipalityName
              ? `Encuentra las mejores droguerías y farmacias en ${municipalityName}. Teléfonos, horarios, ubicación y domicilio a fincas y veredas.`
              : categoryName || municipalityName 
              ? `Encuentra los mejores ${categoryName.toLowerCase() || "negocios"} en ${municipalityName || "Antioquia"}. Teléfonos, horarios, ubicación y contacto directo por WhatsApp.`
              : "Filtra por categoría, municipio o disponibilidad y encuentra el establecimiento o servicio que necesitas hoy mismo."}
          </p>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-80 lg:shrink-0" aria-label="Filtros">
            <div className="lg:sticky lg:top-24">
              <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
                <BusinessFilters
                  categories={Array.isArray(categories) ? categories : []}
                  municipalities={Array.isArray(municipalities) ? municipalities : []}
                />
              </Suspense>
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border/50 bg-background p-4 shadow-warm md:flex-row md:items-center">
              <BusinessSearchBar />
              <div className="flex items-center gap-2 md:w-56">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <SortSelect value={sort} />
              </div>
            </div>

            {businesses.length > 0 ? (
              <Tabs defaultValue="grid" className="w-full">
                <TabsList className="mb-6 rounded-xl border border-border/50 bg-background p-1">
                  <TabsTrigger value="grid" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                    <LayoutGrid className="h-4 w-4" />
                    <span>Grilla</span>
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                    <MapIcon className="h-4 w-4" />
                    <span>Vista en Mapa</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="mt-0">
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {businesses.map((business) => (
                      <BusinessCard key={business._id} business={business} />
                    ))}
                  </div>
                  <Pagination page={page} hasMore={hasMore} basePath="/business" searchParams={params} />
                </TabsContent>

                <TabsContent value="map" className="mt-0">
                  <div className="h-160 overflow-hidden rounded-2xl border border-border/50 bg-background shadow-warm">
                    <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-800 flex items-center justify-center">Cargando mapa...</div>}>
                      <DynamicBusinessMapView businesses={businesses} />
                    </Suspense>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="rounded-2xl border border-border/50 bg-background p-12 text-center shadow-warm">
                <Store className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">No encontramos negocios</h2>
                <p className="mt-2 text-muted-foreground">Ajusta la búsqueda o limpia los filtros.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function getSafeSort(value?: string): BusinessSort {
  return SORT_VALUES.includes(value as BusinessSort) ? (value as BusinessSort) : "relevance";
}