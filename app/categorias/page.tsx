import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { CATEGORIES_WITH_COUNTS_QUERY, CATEGORIES_LIST_QUERY } from "@/lib/sanity/queries";
import { Store, HelpCircle, MapPin } from "lucide-react";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { ClientBackButton } from "@/components/ui/ClientBackButton";

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";
const url = `${baseUrl}/categorias`;

const MUNICIPIOS = ["Sopetrán", "San Jerónimo", "Santa Fe de Antioquia", "Liborina", "Olaya"];
const MUNICIPIOS_SLUG: Record<string, string> = {
  "Sopetrán": "sopetran",
  "San Jerónimo": "san-jeronimo",
  "Santa Fe de Antioquia": "santa-fe-de-antioquia",
  "Liborina": "liborina",
  "Olaya": "olaya"
};
const MUNICIPIOS_TEXT = "Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya";

const GENERAL_FAQS = [
  {
    q: "¿Qué negocios hay en Sopetrán y San Jerónimo?",
    a: "En Ooasys encuentras restaurantes, fincas de recreo, glamping, hoteles, mototaxis, droguerías, barberías y servicios técnicos con WhatsApp directo en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya.",
  },
  {
    q: "¿Cómo contacto un negocio en el Occidente Antioqueño?",
    a: "Entra a la categoría, elige el negocio y dale al botón de WhatsApp. El contacto es directo con el dueño, sin comisiones. Revisa su ficha para ver teléfono, ubicación y fotos.",
  },
  {
    q: "¿Hacen domicilios a fincas y veredas?",
    a: "Sí, la mayoría de restaurantes, supermercados y droguerías en el Occidente hacen domicilio a fincas. Confírmalo por 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha del negocio.",
  },
];

const title = "Directorio de Negocios en el Occidente Antioqueño: Fincas, Restaurantes y Servicios con WhatsApp | Ooasys";
const description = `Directorio de más de 200 negocios en ${MUNICIPIOS_TEXT}. Fincas de recreo, glamping, donde comer, mototaxis y domicilios a fincas con WhatsApp directo.`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { absolute: title },
  description,
  applicationName: "Ooasys",
  alternates: {
    canonical: url,
    languages: { "es-CO": url, es: url },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "CO-ANT",
    "geo.placename": "Occidente Antioqueño",
  },
  openGraph: {
    title,
    description,
    url,
    type: "website",
    siteName: "Ooasys",
    locale: "es_CO",
    images: [
      {
        url: `${baseUrl}/og-categories.png`,
        width: 1200,
        height: 630,
        alt: "Directorio de negocios en el Occidente Antioqueño - Ooasys",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${baseUrl}/og-categories.png`],
  },
};

function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function CategoriasPage() {
  const [categoriesData, categoriesWithSubsData] = await Promise.all([
    client.fetch(CATEGORIES_WITH_COUNTS_QUERY),
    client.fetch(CATEGORIES_LIST_QUERY),
  ]);

  const validCategories = (categoriesData || []).filter((cat: any) => cat?.slug?.current);
  const topCategories = validCategories.slice(0, 12);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: "Directorio de negocios en el Occidente Antioqueño",
    description,
    url,
    inLanguage: "es-CO",
    areaServed: [
      ...MUNICIPIOS.map((name) => ({ "@type": "City", name })),
      { "@type": "AdministrativeArea", name: "Occidente Antioqueño" },
    ],
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: validCategories.length,
      itemListElement: validCategories.map((cat: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        name: cat.name,
        url: `${baseUrl}/categorias/${cat.slug.current}`,
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Categorías", item: url },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GENERAL_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script id="categories-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(collectionJsonLd) }} />
      <script id="breadcrumb-main-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />
      <script id="faq-general-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }} />

      <div className="bg-linear-to-b from-accent/10 via-background to-background min-h-screen relative">
        <header className="relative overflow-hidden border-b border-border/40 bg-background/60 backdrop-blur-md py-12 md:py-16">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] bg-[size:14px_24px]" />

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 items-center mb-6 w-full max-w-2xl mx-auto">
              <div className="flex items-center justify-start">
                <div className="w-10 h-10 shrink-0">
                  <ClientBackButton />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm flex">
                  <Store className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="w-10 h-10 pointer-events-none invisible justify-self-end" aria-hidden="true" />
            </div>

            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight font-heading sm:text-5xl md:text-6xl text-foreground">
                <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Directorio de negocios
                </span>{" "}
                <span className="block text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
                  en el Occidente Antioqueño
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                ¿Buscas donde comer en Sopetrán, una finca en San Jerónimo o un hotel en Santa Fe de Antioquia? 
                Explora {validCategories.length} categorías con más de 200 negocios verificados en {MUNICIPIOS_TEXT}. 
                Todos con teléfono y WhatsApp directo, sin intermediarios.
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {MUNICIPIOS.map((m) => (
                  <Link
                    key={m}
                    href={`/business?municipality=${MUNICIPIOS_SLUG[m]}`}
                    className="inline-flex items-center gap-1 text-xs border border-border bg-card hover:bg-accent px-3 py-1.5 rounded-full transition-colors"
                  >
                    <MapPin className="h-3 w-3" /> {m}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10 md:py-14">
          <CategoryGrid
            initialCategories={categoriesData || []}
            categoriesWithSubs={categoriesWithSubsData || []}
          />

          <div className="mt-10 text-xs text-muted-foreground">
            <p>Categorías populares: {topCategories.map((c: any) => c.name).join(", ")} y más en el Occidente Antioqueño.</p>
          </div>

          <section className="mt-16 pt-10 border-t border-border/60">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">
                Preguntas frecuentes sobre negocios en el Occidente
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {GENERAL_FAQS.map((faq) => (
                <div key={faq.q} className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm">
                  <h3 className="font-semibold text-foreground text-sm mb-2">{faq.q}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}