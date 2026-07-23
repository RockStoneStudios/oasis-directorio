import { MapPin, Store, Sparkles, Award, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getBusinesses } from "@/actions/getBusinesses";
import { BusinessCard } from "@/components/BusinessCard";
import { Pagination } from "@/components/Pagination";
import { sanityFetch } from "@/lib/sanity/live";
import { MUNICIPALITIES_LIST_QUERY } from "@/lib/sanity/queries";
import { getSlugValue } from "@/lib/formatBusinessData";
import type { FilterOption } from "@/types/business";
import { Button } from "@/components/ui/button";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

interface MunicipalityPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

// ============================================================
// METADATOS METICULOSAMENTE OPTIMIZADOS PARA SEO LOCAL
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: MUNICIPALITIES_LIST_QUERY });
  
  const municipalitiesArray = Array.isArray(data) ? data : [];
  const municipality = municipalitiesArray.find(
    (item: FilterOption) => getSlugValue(item.slug) === slug
  );

  if (!municipality) {
    return {
      title: "Municipio no encontrado | Ooasys",
    };
  }

  const title = `Negocios y Servicios en ${municipality.name} | Guía Comercial Ooasys`;
  const description = `Explora los mejores restaurantes, hoteles, fincas, tiendas y servicios disponibles en ${municipality.name}, Occidente Antioqueño. Contacto directo por WhatsApp.`;
  const canonicalUrl = `${APP_URL}/municipios/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Ooasys",
      locale: "es_CO",
      type: "website",
      images: [
        {
          url: `${APP_URL}/ooasys.webp`,
          width: 1200,
          height: 630,
          alt: `Directorio de negocios en ${municipality.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${APP_URL}/ooasys.webp`],
    },
  };
}

// ============================================================
// COMPONENTE PRINCIPAL DE LA PÁGINA DE MUNICIPIO
// ============================================================
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
  
  const municipalitiesArray = Array.isArray(municipalities) ? municipalities : [];
  const municipality = municipalitiesArray.find(
    (item: FilterOption) => getSlugValue(item.slug) === slug
  );

  // Si el slug no coincide con ningún municipio registrado, mandamos 404
  if (!municipality && businesses.length === 0) {
    notFound();
  }

  const muniName = municipality?.name || slug;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAFAF9] to-[#F5F0E8] dark:from-[#1C1917] dark:to-[#292524]">
      <Navbar municipalities={municipalitiesArray} />
      
      <main id="main">
        {/* Header / Hero del Municipio */}
        <header className="relative overflow-hidden py-12 md:py-20 border-b border-[#E7E5E4] dark:border-[#44403C] bg-white/60 dark:bg-[#1C1917]/60 backdrop-blur-md">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#14B8A6]/10 dark:bg-[#14B8A6]/20 px-3 py-1 text-xs md:text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6]">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Municipio del Occidente Antioqueño
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#1C1917] dark:text-white tracking-tight">
                Negocios y Servicios en{" "}
                <span className="bg-linear-to-r from-[#14B8A6] to-[#0F766E] bg-clip-text text-transparent">
                  {muniName}
                </span>
              </h1>
              
              <p className="mt-4 text-base md:text-lg text-[#44403C] dark:text-[#D6D3D1]">
                Descubre los comercios, hoteles, restaurantes, fincas y profesionales destacados disponibles en {muniName}. Contacta directamente sin intermediarios.
              </p>
            </div>
          </div>
        </header>

        {/* Listado de Negocios */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {businesses.length > 0 ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-[#78716C] dark:text-[#A8A29E]">
                    Mostrando resultados en <strong className="text-[#1C1917] dark:text-white">{muniName}</strong>
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {businesses.map((business) => (
                    <BusinessCard key={business._id} business={business} />
                  ))}
                </div>

                <div className="mt-10">
                  <Pagination
                    page={page}
                    hasMore={hasMore}
                    basePath={`/municipios/${slug}`}
                    searchParams={query}
                  />
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#292524] p-8 md:p-12 text-center shadow-sm">
                <Store className="mx-auto mb-4 h-12 w-12 text-[#14B8A6]" aria-hidden="true" />
                <h2 className="text-xl font-semibold font-heading text-[#1C1917] dark:text-white">
                  Aún no hay comercios registrados en {muniName}
                </h2>
                <p className="mt-2 text-sm text-[#78716C] dark:text-[#A8A29E] max-w-md mx-auto">
                  ¿Tienes un establecimiento o prestas un servicio aquí? ¡Sé el primero en aparecer!
                </p>
                <Button size="lg" className="mt-6 bg-[#14B8A6] hover:bg-[#0F766E] text-white" asChild>
                  <Link href="/dashboard">
                    Registrar negocio en {muniName}
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}