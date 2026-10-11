import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { CATEGORIES_WITH_COUNTS_QUERY, CATEGORIES_LIST_QUERY } from "@/lib/sanity/queries";
import { Store, HelpCircle } from "lucide-react";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { ClientBackButton } from "@/components/ui/ClientBackButton";

export const revalidate = 60;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";
const url = `${baseUrl}/categorias`;

const MUNICIPIOS = ["Sopetrán", "San Jerónimo", "Santa Fe de Antioquia", "Liborina", "Olaya"];
const MUNICIPIOS_TEXT = "Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya";

// Las FAQ visibles y las del schema salen de la misma fuente (Google lo exige)
const GENERAL_FAQS = [
  {
    q: "¿Qué tipo de comercios y servicios puedo encontrar en Ooasys?",
    a: "Encuentras restaurantes, alquiler de fincas de recreo, glamping, hoteles, licoreras, droguerías, barberías, agroinsumos, mototaxis y servicios técnicos en el Occidente Antioqueño.",
  },
  {
    q: "¿Qué municipios del Occidente Antioqueño cubre la plataforma?",
    a: `Actualmente listamos negocios de ${MUNICIPIOS_TEXT}.`,
  },
  {
    q: "¿Cómo contacto a un negocio o reservo una finca o glamping?",
    a: "Desde la ficha de cada negocio puedes escribirle por WhatsApp o llamarlo directamente, sin intermediarios. Antes de pagar, confirma disponibilidad y datos del propietario o administrador.",
  },
];

// ============================================================================
// Metadatos (objeto estático: no necesita async)
// ============================================================================
const title = "Categorías de negocios en el Occidente Antioqueño | Ooasys";
const description = `Explora negocios y servicios en ${MUNICIPIOS_TEXT}: fincas, glamping, restaurantes, transporte y más.`;

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
        alt: "Categorías de negocios en el Occidente Antioqueño - Ooasys",
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

// Evita que un "<" dentro de los datos rompa el <script> del JSON-LD
function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function CategoriasPage() {
  const [categoriesData, categoriesWithSubsData] = await Promise.all([
    client.fetch(CATEGORIES_WITH_COUNTS_QUERY),
    client.fetch(CATEGORIES_LIST_QUERY),
  ]);

  // Solo categorías con slug válido (antes se generaban URLs vacías)
  const validCategories = (categoriesData || []).filter((cat: any) => cat?.slug?.current);

  // Schema 1: colección de categorías (tipo reconocido por Google; "Guide" no lo es)
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: "Categorías de negocios en el Occidente Antioqueño",
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

  // Schema 2: migas de pan
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Categorías", item: url },
    ],
  };

  // Schema 3: preguntas frecuentes
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
    <div className="bg-linear-to-b from-accent/10 via-background to-background min-h-screen relative">
      <script id="categories-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(collectionJsonLd) }} />
      <script id="breadcrumb-main-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />
      <script id="faq-general-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }} />

      <header className="relative overflow-hidden border-b border-border/40 bg-background/60 backdrop-blur-md py-12 md:py-16">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

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

          <div className="text-center">
            {/* H1 con la keyword principal de la página */}
            <h1 className="text-4xl font-extrabold tracking-tight font-heading sm:text-5xl md:text-6xl text-foreground">
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Categorías de negocios
              </span>{" "}
              <span className="block text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
                en el Occidente Antioqueño
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              ¿Buscas dónde comer, alquilar una finca de recreo o contratar un servicio en el Occidente Antioqueño?
              Elige una categoría y contacta directamente a los negocios de {MUNICIPIOS_TEXT}.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 md:py-14">
        <CategoryGrid
          initialCategories={categoriesData || []}
          categoriesWithSubs={categoriesWithSubsData || []}
        />

        <section className="mt-16 pt-10 border-t border-border/60">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">
              Preguntas frecuentes sobre el directorio
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
  );
}