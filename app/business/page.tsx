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

export const metadata: Metadata = {
  title: "Negocios",
  description: "Busca negocios por categoria, municipio, estado y calificacion.",
};

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

  return (
    <div className="bg-accent/20">
      <header className="border-b border-border/50 bg-background">
        <div className="container py-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <Store className="h-4 w-4" aria-hidden="true" />
            Directorio
          </div>
          <h1 className="text-3xl font-bold font-heading md:text-4xl">
            Negocios locales
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Filtra por categoria, municipio o disponibilidad y encuentra el
            lugar que necesitas.
          </p>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-24">
              <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
               categories={Array.isArray(categories) ? categories : []}
            municipalities={Array.isArray(municipalities) ? municipalities : []}
              </Suspense>
            </div>
          </div>

          <section className="min-w-0 flex-1">
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
                    Grilla
                  </TabsTrigger>
                  <TabsTrigger
                    value="map"
                    className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <MapIcon className="h-4 w-4" aria-hidden="true" />
                    Mapa
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
                <h2 className="text-xl font-semibold font-heading">
                  No encontramos negocios
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Ajusta la busqueda o limpia los filtros para ver mas
                  resultados.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function getSafeSort(value?: string): BusinessSort {
  return SORT_VALUES.includes(value as BusinessSort)
    ? (value as BusinessSort)
    : "relevance";
}
