import { ArrowRight, Store } from "lucide-react";
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
  title: "Oasis | Directorio de negocios locales",
  description: "Encuentra negocios, eventos y noticias locales por categoria y municipio.",
};

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    municipality?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // 1. Resolvemos los parámetros de búsqueda del servidor
  const params = await searchParams;
  const selectedMuniSlug = params.municipality || "";

  // 2. Traemos la lista de municipios para la Navbar y el Buscador
  const municipalitiesResult = await sanityFetch({ query: MUNICIPALITIES_LIST_QUERY });
  const municipalitiesList = Array.isArray(municipalitiesResult?.data) 
    ? municipalitiesResult.data 
    : [];

  // 3. Buscamos el objeto del municipio seleccionado para extraer su nombre real
  const currentMunicipality = municipalitiesList.find((m: any) => {
    const slugStr = typeof m.slug === 'string' ? m.slug : m.slug?.current || "";
    return slugStr === selectedMuniSlug;
  });
  const currentMuniName = currentMunicipality?.name || "";

  // 4. Ejecutamos la Query nativa con tu esquema exacto de propiedades filtrando en servidor
  let featuredBusinesses = [];
  try {
    if (selectedMuniSlug) {
      // Filtramos dinámicamente comparando el slug del municipio de referencia
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
      // Carga inicial sin filtros (Todo el Occidente)
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar municipalities={municipalitiesList} />
      <main id="main">
        <section className="bg-accent/40 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Store className="h-4 w-4" aria-hidden="true" />
                Directorio local
              </div>
              <h1 className="text-4xl font-bold font-heading tracking-tight md:text-6xl">
                Encuentra negocios cerca de ti
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
                Explora servicios, comercios, restaurantes y experiencias por
                categoría, municipio y disponibilidad.
              </p>

              <HomeSearch municipalities={municipalitiesList} />
            </div>
          </div>
        </section>

        {/* Sección de Negocios Destacados */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold font-heading">
                  {selectedMuniSlug 
                    ? `Destacados en ${currentMuniName || 'la zona'}`
                    : "Negocios destacados"
                  }
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Lugares recomendados por la comunidad local.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href={selectedMuniSlug ? `/business?municipality=${selectedMuniSlug}` : "/business"}>
                  Ver todos
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
                  ? `No hay negocios en ${currentMuniName} inscritos a Oasis`
                  : "No hay negocios para este municipio"
                }
                description="Pronto verás recomendaciones locales aquí para esta zona."
              />
            )}
          </div>
        </section>

        {/* Formulario de registro base */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="rounded-3xl bg-secondary p-8 text-secondary-foreground md:p-12">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold font-heading">
                  Registra tu negocio en Oasis
                </h2>
                <p className="mt-3 text-secondary-foreground/80">
                  Haz que más personas descubran tus productos, servicios,
                  horarios y canales de contacto.
                </p>
                <Button className="mt-8" asChild>
                  <Link href="/dashboard">
                    Registrar negocio
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
    <div className="rounded-2xl border border-border/50 bg-background p-8 text-center shadow-warm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        {icon}
      </div>
      <h3 className="font-semibold font-heading">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}