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

export const metadata: Metadata = {
  title: "Ooasys | Directorio de negocios locales en el Occidente Antioqueño",
  description: "Encuentra negocios, eventos y noticias locales por categoría y municipio. Tu guía comercial en Sopetrán, Santa Fe, San Jerónimo y más.",
};

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    municipality?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const selectedMuniSlug = params.municipality || "";

  const municipalitiesResult = await sanityFetch({ query: MUNICIPALITIES_LIST_QUERY });
  const municipalitiesList = Array.isArray(municipalitiesResult?.data) 
    ? municipalitiesResult.data 
    : [];

  const currentMunicipality = municipalitiesList.find((m: any) => {
    const slugStr = typeof m.slug === 'string' ? m.slug : m.slug?.current || "";
    return slugStr === selectedMuniSlug;
  });
  const currentMuniName = currentMunicipality?.name || "";

  let featuredBusinesses = [];
  try {
    if (selectedMuniSlug) {
      featuredBusinesses = await client.fetch(
        `*[_type == "business" && isFeatured == true && municipality->slug.current == $muniSlug] | order(createdAt desc)[0...6] {
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
    } else {
      featuredBusinesses = await client.fetch(
        `*[_type == "business" && isFeatured == true] | order(createdAt desc)[0...6] {
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
    }
  } catch (error) {
    console.error("Error al consultar negocios en Sanity:", error);
  }

  const features = [
    { icon: <MapPin className="h-5 w-5" />, title: "Cobertura Local", description: "Negocios verificados en tu municipio" },
    { icon: <Star className="h-5 w-5" />, title: "Opiniones Reales", description: "Calificaciones de la comunidad" },
    { icon: <Clock className="h-5 w-5" />, title: "Horario Actualizado", description: "Información siempre al día" },
    { icon: <Users className="h-5 w-5" />, title: "Comunidad Activa", description: "Miles de usuarios confían en Ooasys" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] dark:from-[#1C1917] dark:to-[#292524]">
      <Navbar municipalities={municipalitiesList} />
      <main id="main">
        {/* Hero Section - Ooasys Style */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Elementos decorativos con colores Ooasys */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#14B8A6]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F59E0B]/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#10B981]/5 rounded-full blur-3xl" />
          
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge Ooasys */}
              <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full bg-[#14B8A6]/10 dark:bg-[#14B8A6]/20 px-4 py-2 text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6] shadow-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Bienvenido a Ooasys — Tu Oasis Digital
              </div>
              
              {/* Título principal */}
              <h1 className="text-4xl font-bold font-heading tracking-tight text-[#1C1917] dark:text-white md:text-7xl">
                Encuentra negocios
                <br />
                <span className="bg-gradient-to-r from-[#14B8A6] to-[#0F766E] bg-clip-text text-transparent">cerca de ti</span>
              </h1>
              
              {/* Descripción */}
              <p className="mx-auto mt-6 max-w-2xl text-lg text-[#44403C] dark:text-[#D6D3D1] md:text-xl">
                Explora servicios, comercios, restaurantes y experiencias. La guía más completa del Occidente Antioqueño.
              </p>

              <div className="mt-10">
                <HomeSearch municipalities={municipalitiesList} />
              </div>

              {/* Stats Ooasys */}
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
                <div className="group cursor-default">
                  <p className="text-2xl font-bold text-[#14B8A6] transition-all group-hover:scale-105">+500</p>
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">Negocios Registrados</p>
                </div>
                <div className="group cursor-default">
                  <p className="text-2xl font-bold text-[#F59E0B] transition-all group-hover:scale-105">+15</p>
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">Municipios</p>
                </div>
                <div className="group cursor-default">
                  <p className="text-2xl font-bold text-[#10B981] transition-all group-hover:scale-105">+10k</p>
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">Usuarios Mensuales</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Ooasys Style */}
        <section className="py-16 bg-white/50 dark:bg-[#1C1917]/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold font-heading text-[#1C1917] dark:text-white md:text-3xl">¿Por qué usar Ooasys?</h2>
              <p className="mt-3 text-[#78716C] dark:text-[#A8A29E]">La plataforma que conecta tu negocio con la comunidad</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, idx) => (
                <div key={idx} className="group rounded-2xl border border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#292524] p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#14B8A6]/30">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#14B8A6] transition-all duration-300 group-hover:bg-[#14B8A6] group-hover:text-white">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold font-heading text-[#1C1917] dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[#78716C] dark:text-[#A8A29E]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de Negocios Destacados */}
        <section className="py-16 bg-gradient-to-br from-[#F5F0E8] to-white dark:from-[#292524] dark:to-[#1C1917]">
          <div className="container">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 px-3 py-1 text-xs font-medium text-[#D97706] dark:text-[#FBBF24] mb-4">
                  <Award className="h-3 w-3" /> Lo mejor de la región
                </div>
                <h2 className="text-2xl font-bold font-heading text-[#1C1917] dark:text-white md:text-3xl">
                  {selectedMuniSlug 
                    ? `Destacados en ${currentMuniName || 'la zona'}`
                    : "Negocios Destacados"
                  }
                </h2>
                <p className="mt-2 text-[#78716C] dark:text-[#A8A29E]">
                  {selectedMuniSlug 
                    ? `Los lugares más recomendados en ${currentMuniName}`
                    : "Los lugares más recomendados por la comunidad local"
                  }
                </p>
              </div>
              <Button variant="outline" asChild className="group border-[#14B8A6]/30 text-[#14B8A6] hover:bg-[#14B8A6]/10 hover:border-[#14B8A6]">
                <Link href={selectedMuniSlug ? `/business?municipality=${selectedMuniSlug}` : "/business"}>
                  Ver todos
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {featuredBusinesses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredBusinesses.map((business: any) => (
                  <BusinessCard key={business._id} business={business} />
                ))}
              </div>
            ) : (
              <EmptyBlock
                icon={<Store className="h-8 w-8" aria-hidden="true" />}
                title={selectedMuniSlug && currentMuniName 
                  ? `No hay negocios en ${currentMuniName} inscritos a Ooasys`
                  : "No hay negocios para este municipio"
                }
                description="Pronto verás recomendaciones locales aquí para esta zona."
              />
            )}
          </div>
        </section>

        {/* CTA Section - Ooasys Style */}
        <section className="py-20">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#14B8A6] via-[#0F766E] to-[#0D5A54] p-10 md:p-16">
              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10B981]/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B]/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-[#FDE68A] mb-6">
                  <Zap className="h-4 w-4" /> ¡Es tu momento!
                </div>
                <h2 className="text-3xl font-bold font-heading text-white md:text-4xl">
                  ¿Tienes un negocio?
                </h2>
                <p className="mt-4 text-lg text-[#CCFBF1]">
                  Haz que más personas descubran tus productos, servicios, horarios y canales de contacto. 
                  Llega a miles de usuarios activos en el Occidente Antioqueño.
                </p>
                <Button size="lg" className="mt-8 shadow-lg bg-[#F59E0B] hover:bg-[#D97706] text-white" asChild>
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
    <div className="rounded-2xl border border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#292524] p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F0E8] dark:bg-[#44403C] text-[#14B8A6]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold font-heading text-[#1C1917] dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-[#78716C] dark:text-[#A8A29E]">{description}</p>
    </div>
  );
}