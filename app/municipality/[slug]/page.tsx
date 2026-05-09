import { MapPin, Store } from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getBusinesses } from "@/actions/getBusinesses";
import { BusinessCard } from "@/components/BusinessCard";
import { Pagination } from "@/components/Pagination";
import { sanityFetch } from "@/lib/sanity/live";
import { MUNICIPALITIES_LIST_QUERY } from "@/lib/sanity/queries";
import { getSlugValue } from "@/lib/formatBusinessData";
import type { FilterOption } from "@/types/business";

interface MunicipalityPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: MUNICIPALITIES_LIST_QUERY });
  const municipality = (data || []).find(
    (item: FilterOption) => getSlugValue(item.slug) === slug,
  );

  return {
    title: municipality ? `Negocios en ${municipality.name}` : "Municipio",
    description: `Directorio de negocios en ${municipality?.name || slug}.`,
  };
}

export default async function MunicipalityPage({
  params,
  searchParams,
}: MunicipalityPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = Math.max(Number(query.page) || 1, 1);
  const [{ businesses, hasMore }, { data: municipalities }] = await Promise.all([
    getBusinesses({ municipality: slug, page, pageSize: 12 }),
    sanityFetch({ query: MUNICIPALITIES_LIST_QUERY }),
  ]);
  const municipality = (municipalities || []).find(
    (item: FilterOption) => getSlugValue(item.slug) === slug,
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main" className="bg-accent/20">
        <header className="border-b border-border/50 bg-background">
          <div className="container py-10">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">Municipio</span>
            </div>
            <h1 className="text-3xl font-bold font-heading md:text-4xl">
              Negocios en {municipality?.name || slug}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Explora comercios y servicios disponibles en esta zona.
            </p>
          </div>
        </header>

        <section className="container py-10">
          {businesses.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {businesses.map((business) => (
                  <BusinessCard key={business._id} business={business} />
                ))}
              </div>
              <Pagination
                page={page}
                hasMore={hasMore}
                basePath={`/municipality/${slug}`}
                searchParams={query}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-border/50 bg-background p-12 text-center shadow-warm">
              <Store className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-xl font-semibold font-heading">
                No hay negocios en este municipio
              </h2>
              <p className="mt-2 text-muted-foreground">
                Prueba otro municipio o vuelve mas tarde.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
