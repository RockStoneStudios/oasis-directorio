import { ArrowRight, Store, Sparkles, MapPin, Star, Users, Clock, Award, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { MUNICIPALITIES_LIST_QUERY } from "@/lib/sanity/queries";
import { HomeSearch } from "@/components/HomeSearch";
import { Pagination } from "@/components/Pagination";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    municipality?: string;
    page?: string;
  }>;
}

// ============================================================
// GENERACIÓN DINÁMICA DE METADATOS SEO DE ALTO IMPACTO (9.7+/10)
// ============================================================
export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const params = await searchParams;
  const selectedMuniSlug = params.municipality || "";
  const page = Number(params.page) || 1;

  const municipalitiesResult = await sanityFetch({ query: MUNICIPALITIES_LIST_QUERY });
  const municipalitiesList = Array.isArray(municipalitiesResult?.data) ? municipalitiesResult.data : [];

  const currentMunicipality = municipalitiesList.find((m: any) => {
    const slugStr = typeof m.slug === 'string' ? m.slug : m.slug?.current || "";
    return slugStr === selectedMuniSlug;
  });

  const muniName = currentMunicipality?.name;

  // Título conversacional optimizado para intención de búsqueda transaccional/local
  const pageTitle = muniName
    ? `Negocios y Servicios en ${muniName} | Guía Comercial Ooasys`
    : "Directorio de Negocios y Turismo en el Occidente Antioqueño | Ooasys";

  // Descripción optimizada para CTR y palabras clave locales
  const pageDescription = muniName
    ? `Encuentra los mejores restaurantes, hoteles, fincas, tiendas y servicios en ${muniName}, Antioquia. Teléfonos, horarios y ubicación exacta en Ooasys.`
    : "Guía comercial interactiva del Occidente Antioqueño. Descubre restaurantes, alojamientos y comercios en Sopetrán, Santa Fe de Antioquia, San Jerónimo y municipios cercanos.";

  // Construcción limpia de la URL Canónica
  const canonicalParams = new URLSearchParams();
  if (selectedMuniSlug) canonicalParams.set("municipality", selectedMuniSlug);
  if (page > 1) canonicalParams.set("page", page.toString());

  const canonicalPath = canonicalParams.toString() ? `/?${canonicalParams.toString()}` : "/";

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `${APP_URL}${canonicalPath}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${APP_URL}${canonicalPath}`,
      siteName: "Ooasys",
      locale: "es_CO",
      type: "website",
      images: [
        {
          url: `${APP_URL}/ooasys.webp`,
          width: 1200,
          height: 630,
          alt: `Guía comercial de negocios en ${muniName || "el Occidente Antioqueño"}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [`${APP_URL}/ooasys.webp`],
    },
  };
}

// ============================================================
// COMPONENTE DE PÁGINA PRINCIPAL
// ============================================================
export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const selectedMuniSlug = params.municipality || "";
  const currentPage = Math.max(Number(params.page) || 1, 1);
  const PAGE_SIZE = 9;

  const municipalitiesResult = await sanityFetch({ query: MUNICIPALITIES_LIST_QUERY });
  const municipalitiesList = Array.isArray(municipalitiesResult?.data) ? municipalitiesResult.data : [];

  const currentMunicipality = municipalitiesList.find((m: any) => {
    const slugStr = typeof m.slug === 'string' ? m.slug : m.slug?.current || "";
    return slugStr === selectedMuniSlug;
  });
  const currentMuniName = currentMunicipality?.name || "";

  let featuredBusinesses = [];
  let hasMore = false;

  try {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    if (selectedMuniSlug) {
      const allBusinesses = await client.fetch(
        `*[_type == "business" && isFeatured == true && municipality->slug.current == $muniSlug] | order(createdAt desc) {
          _id,
          _type,
          name,
          "slug": slug,
          "logo": logo { asset, alt },
          description,
          status,
          rating,
          address,
          municipality->{ _id, name, "slug": slug },
          category->{ _id, name, "slug": slug, icon },
          isFeatured,
          createdAt
        }`,
        { muniSlug: selectedMuniSlug }
      );
      featuredBusinesses = allBusinesses.slice(start, end);
      hasMore = end < allBusinesses.length;
    } else {
      const allBusinesses = await client.fetch(
        `*[_type == "business" && isFeatured == true] | order(createdAt desc) {
          _id,
          _type,
          name,
          "slug": slug,
          "logo": logo { asset, alt },
          description,
          status,
          rating,
          address,
          municipality->{ _id, name, "slug": slug },
          category->{ _id, name, "slug": slug, icon },
          isFeatured,
          createdAt
        }`
      );
      featuredBusinesses = allBusinesses.slice(start, end);
      hasMore = end < allBusinesses.length;
    }
  } catch (error) {
    console.error("Error al consultar negocios en Sanity:", error);
  }

  const features = [
    { icon: <MapPin className="h-5 w-5" aria-hidden="true" />, title: "Cobertura Local Verificada", description: "Comercios y servicios validados en municipios del Occidente Antioqueño." },
    { icon: <Star className="h-5 w-5" aria-hidden="true" />, title: "Opiniones y Calificaciones", description: "Reseñas reales para tomar mejores decisiones de compra y turismo." },
    { icon: <Clock className="h-5 w-5" aria-hidden="true" />, title: "Información al Día", description: "Horarios, canales de atención e itinerarios siempre actualizados." },
    { icon: <Users className="h-5 w-5" aria-hidden="true" />, title: "Conexión Directa", description: "Contacta sin intermediarios con comercios locales por WhatsApp o llamada." },
  ];

  const currentSearchParams: Record<string, string | undefined> = {};
  if (selectedMuniSlug) currentSearchParams.municipality = selectedMuniSlug;

  return (
    <div 
      className="min-h-screen bg-linear-to-b from-[#FAFAF9] to-[#F5F0E8] dark:from-[#1C1917] dark:to-[#292524]"
      suppressHydrationWarning
    >
      <Navbar municipalities={municipalitiesList} />
      
      <main id="main">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24 lg:py-32" aria-labelledby="hero-heading">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#14B8A6]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 hidden lg:block" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F59E0B]/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 hidden lg:block" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-[#10B981]/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full bg-[#14B8A6]/10 dark:bg-[#14B8A6]/20 px-4 py-2 text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6] shadow-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Guía Comercial y Turística — Occidente Antioqueño
              </div>
              
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading tracking-tight text-[#1C1917] dark:text-white">
                {selectedMuniSlug && currentMuniName ? (
                  <>
                    Encuentra negocios en{" "}
                    <span className="bg-linear-to-r from-[#14B8A6] to-[#0F766E] bg-clip-text text-transparent">
                      {currentMuniName}
                    </span>
                  </>
                ) : (
                  <>
                    Directorio comercial de negocios{" "}
                    <span className="bg-linear-to-r from-[#14B8A6] to-[#0F766E] bg-clip-text text-transparent">
                      cerca de ti
                    </span>
                  </>
                )}
              </h1>
              
              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-[#44403C] dark:text-[#D6D3D1]">
                {selectedMuniSlug && currentMuniName
                  ? `Explora los comercios, hoteles, restaurantes y servicios destacados en ${currentMuniName}.`
                  : "Explora servicios, restaurantes, fincas, hoteles y comercios en Sopetrán, Santa Fe de Antioquia, San Jerónimo, Liborina y Olaya."}
              </p>

              <div className="mt-8 md:mt-10 max-w-3xl mx-auto">
                <HomeSearch municipalities={municipalitiesList} />
              </div>

              <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 text-center">
                <div className="group cursor-default min-w-25">
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#14B8A6] transition-all group-hover:scale-105">+110</p>
                  <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E]">Comercios Registrados</p>
                </div>
                <div className="group cursor-default min-w-25">
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F59E0B] transition-all group-hover:scale-105">+5</p>
                  <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E]">Municipios Activos</p>
                </div>
                <div className="group cursor-default min-w-25">
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#10B981] transition-all group-hover:scale-105">+8k</p>
                  <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E]">Búsquedas Mensuales</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white/50 dark:bg-[#1C1917]/50" aria-labelledby="features-heading">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12 lg:mb-16">
              <h2 id="features-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-[#1C1917] dark:text-white">
                ¿Por qué consultar tus compras en Ooasys?
              </h2>
              <p className="mt-3 text-base text-[#78716C] dark:text-[#A8A29E] max-w-2xl mx-auto">
                La plataforma digital que facilita el contacto entre clientes y establecimientos locales.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, idx) => (
                <article key={idx} className="group rounded-2xl border border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#292524] p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#14B8A6]/30">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#14B8A6] transition-all duration-300 group-hover:bg-[#14B8A6] group-hover:text-white">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold font-heading text-[#1C1917] dark:text-white text-lg">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[#78716C] dark:text-[#A8A29E]">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de Negocios Destacados */}
        <section className="py-12 md:py-16 lg:py-20 bg-linear-to-br from-[#F5F0E8] to-white dark:from-[#292524] dark:to-[#1C1917]" aria-labelledby="featured-heading">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 md:mb-10 lg:mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 px-3 py-1 text-xs font-medium text-[#D97706] dark:text-[#FBBF24] mb-4">
                  <Award className="h-3 w-3" aria-hidden="true" /> Lo mejor de la región
                </div>
                <h2 id="featured-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-[#1C1917] dark:text-white">
                  {selectedMuniSlug 
                    ? `Negocios destacados en ${currentMuniName || 'la zona'}`
                    : "Negocios y Comercios Destacados"
                  }
                </h2>
                <p className="mt-2 text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] max-w-2xl">
                  {selectedMuniSlug 
                    ? `Descubre los sitios más recomendados en ${currentMuniName} según la comunidad.`
                    : "Los establecimientos comerciales y turísticos más calificados del Occidente Antioqueño."
                  }
                </p>
              </div>
              <Button variant="outline" asChild className="group border-[#14B8A6]/30 text-[#14B8A6] hover:bg-[#14B8A6]/10 hover:border-[#14B8A6] w-fit">
                <Link href={selectedMuniSlug ? `/business?municipality=${selectedMuniSlug}` : "/business"}>
                  Ver todos los comercios
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {featuredBusinesses.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {featuredBusinesses.map((business: any) => (
                    <BusinessCard key={business._id} business={business} />
                  ))}
                </div>
                
                <div className="mt-10">
                  <Pagination
                    page={currentPage}
                    hasMore={hasMore}
                    basePath="/"
                    searchParams={currentSearchParams}
                  />
                </div>
              </>
            ) : (
              <EmptyBlock
                icon={<Store className="h-8 w-8" aria-hidden="true" />}
                title={selectedMuniSlug && currentMuniName 
                  ? `No hay comercios inscritos aún en ${currentMuniName}`
                  : "No se encontraron comercios registrados"
                }
                description="Muy pronto verás nuevas recomendaciones locales publicadas para esta zona."
              />
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 lg:py-24" aria-labelledby="cta-heading">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-linear-to-br from-[#14B8A6] via-[#0F766E] to-[#0D5A54] p-8 md:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#F59E0B]/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-[#10B981]/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 max-w-2xl lg:max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B]/20 backdrop-blur-sm px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-[#FDE68A] mb-4 md:mb-6">
                  <Zap className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" /> Inscribe tu empresa o local
                </div>
                <h2 id="cta-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-white">
                  ¿Tienes un negocio o prestas un servicio en la región?
                </h2>
                <p className="mt-3 md:mt-4 text-base md:text-lg text-[#CCFBF1]">
                  Aumenta tus clientes publicando tus productos, servicios, ubicación y WhatsApp directo en Ooasys.
                </p>
                <Button size="lg" className="mt-6 md:mt-8 shadow-lg bg-[#F59E0B] hover:bg-[#D97706] text-white" asChild>
                  <Link href="/dashboard">
                    Registrar negocio gratis
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

function EmptyBlock({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#292524] p-8 md:p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F0E8] dark:bg-[#44403C] text-[#14B8A6]">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-semibold font-heading text-[#1C1917] dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-[#78716C] dark:text-[#A8A29E] max-w-md mx-auto">{description}</p>
    </div>
  );
}