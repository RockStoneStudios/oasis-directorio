import { ArrowRight, CalendarDays, Newspaper, Search, Store } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFeaturedBusinesses } from "@/actions/getFeaturedBusinesses";
import { sanityFetch } from "@/lib/sanity/live";
import { RECENT_NEWS_QUERY, UPCOMING_EVENTS_QUERY } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "Oasis | Directorio de negocios locales",
  description:
    "Encuentra negocios, eventos y noticias locales por categoria y municipio.",
};

export default async function HomePage() {
  const [featuredBusinesses, { data: events }, { data: news }] =
    await Promise.all([
      getFeaturedBusinesses(),
      sanityFetch({ query: UPCOMING_EVENTS_QUERY }),
      sanityFetch({ query: RECENT_NEWS_QUERY }),
    ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
                categoria, municipio y disponibilidad.
              </p>

              <form
                action="/business"
                method="GET"
                className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <label htmlFor="home-business-search" className="sr-only">
                    Buscar negocios
                  </label>
                  <Search
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="home-business-search"
                    name="search"
                    placeholder="Que estas buscando?"
                    className="h-14 pl-12 text-base"
                  />
                </div>
                <Button type="submit" size="xl" className="h-14">
                  Buscar
                </Button>
              </form>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold font-heading">
                  Negocios destacados
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Lugares recomendados por la comunidad local.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/business">
                  Ver todos
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {featuredBusinesses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredBusinesses.map((business) => (
                  <BusinessCard key={business._id} business={business} />
                ))}
              </div>
            ) : (
              <EmptyBlock
                icon={<Store className="h-8 w-8" aria-hidden="true" />}
                title="Aun no hay negocios destacados"
                description="Pronto veras recomendaciones locales aqui."
              />
            )}
          </div>
        </section>

        <section className="bg-accent/30 py-16 md:py-24">
          <div className="container grid gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="text-2xl font-bold font-heading">
                  Eventos proximos
                </h2>
              </div>
              {/* <div className="space-y-4">
                {(events || []).length > 0 ? (
                  events.map((event: any) => (
                    <Link
                      key={event._id}
                      href="#"
                      className="flex gap-4 rounded-2xl border border-border/50 bg-background p-4 shadow-warm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-warm-md"
                    >
                      <Thumb image={event.image} title={event.title} />
                      <div>
                        <h3 className="font-semibold font-heading">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatDate(event.date)} · {event.venueName}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyBlock
                    icon={<CalendarDays className="h-8 w-8" aria-hidden="true" />}
                    title="Sin eventos proximos"
                    description="Vuelve pronto para descubrir la agenda local."
                  />
                )}
              </div>
            </div>

            <div>
              <div className="mb-8 flex items-center gap-3">
                <Newspaper className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="text-2xl font-bold font-heading">
                  Noticias recientes
                </h2>
              </div>
              <div className="space-y-4">
                {(news || []).length > 0 ? (
                  news.map((item: any) => (
                    <Link
                      key={item._id}
                      href="#"
                      className="flex gap-4 rounded-2xl border border-border/50 bg-background p-4 shadow-warm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-warm-md"
                    >
                      <Thumb image={item.image} title={item.title} />
                      <div>
                        <h3 className="font-semibold font-heading">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatDate(item.publishedAt)} · {item.category?.name}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyBlock
                    icon={<Newspaper className="h-8 w-8" aria-hidden="true" />}
                    title="Sin noticias por ahora"
                    description="Las novedades locales apareceran en esta seccion."
                  />
                )}
              </div> */}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="rounded-3xl bg-secondary p-8 text-secondary-foreground md:p-12">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold font-heading">
                  Registra tu negocio en Oasis
                </h2>
                <p className="mt-3 text-secondary-foreground/80">
                  Haz que mas personas descubran tus productos, servicios,
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

function Thumb({ image, title }: { image?: any; title: string }) {
  return (
    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
      {image?.asset ? (
        <Image
          src={urlFor(image).width(160).height(120).url()}
          alt={image.alt || title}
          fill
          sizes="96px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Store className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

function EmptyBlock({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
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

function formatDate(value?: string) {
  if (!value) return "Fecha por confirmar";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
