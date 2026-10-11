import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Store, HelpCircle } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { BUSINESS_BY_SUBCATEGORY_QUERY } from "@/lib/sanity/queries";
import { BusinessCard } from "@/components/BusinessCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

const MUNICIPIOS = ["Sopetrán", "San Jerónimo", "Santa Fe de Antioquia", "Liborina", "Olaya"];
const MUNICIPIOS_TEXT = "Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya";

// Evita consultar Sanity dos veces (metadata + página)
const getBusinessesBySlug = cache(async (slug: string) => {
  const result = await client.fetch(BUSINESS_BY_SUBCATEGORY_QUERY, { slug });
  return (result ?? []) as any[];
});

// ============================================================================
// Utilidades
// ============================================================================
function formatSlugText(slug: string): string {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

function stripHtmlAndTruncate(text: string, maxLength: number): string {
  if (!text) return "";
  const cleaned = text.replace(/(<([^>]+)>)/gi, "").replace(/\s+/g, " ").trim();
  return cleaned.length > maxLength ? cleaned.substring(0, maxLength - 3).trimEnd() + "..." : cleaned;
}

// Minúsculas y sin tildes para comparar categorías sin errores
function normalize(text: string): string {
  return (text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Evita que un "<" dentro de los datos rompa el <script> del JSON-LD
function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getSlugText(slug: any): string {
  if (!slug) return "";
  return typeof slug === "object" ? slug.current || "" : slug;
}

// Mismo nombre de categoría en metadata y en la página
function resolveCategoryName(slug: string, businesses: any[]): string {
  const fallback = formatSlugText(slug);
  if (businesses.length === 0) return fallback;
  const first = businesses[0];
  return first.category?.slug?.current === slug
    ? first.category.name
    : first.subcategory?.name || first.category?.name || fallback;
}

// ============================================================================
// Detección de nicho (el orden importa: lo más específico primero)
// ============================================================================
type Niche =
  | "lodging" | "food" | "beauty" | "nightlife" | "shopping" | "transport" | "moving"
  | "health" | "emergency" | "religion" | "tourism" | "agro" | "internet" | "services" | "general";

function detectNiche(categoryName: string): Niche {
  const c = normalize(categoryName);
  const has = (...words: string[]) => words.some((w) => c.includes(w));

  if (has("alojamiento", "bienes raices", "finca", "glamping", "inmobiliaria", "arriendo", "hospedaje", "hotel")) return "lodging";
  if (has("barberia", "peluqueria", "estetica")) return "beauty"; // antes de "bar" para no confundir
  if (has("restaurante & bar", "discoteca", "licorera", "rumba") || /\bbares?\b/.test(c)) return "nightlife";
  if (has("restaurante", "comidas rapidas", "comida", "donde comer")) return "food";
  if (has("supermercado", "tienda", "compras")) return "shopping";
  if (has("trasteo", "mudanza", "carga")) return "moving";
  if (has("mototaxi", "domicilios", "encomienda", "transporte")) return "transport";
  if (has("farmacia", "drogueria", "odontologia", "salud")) return "health";
  if (has("basicos", "policia", "bomberos", "emergencia")) return "emergency";
  if (has("religion", "parroquia", "iglesia")) return "religion";
  if (has("turismo", "viajes", "aventura", "caminata")) return "tourism";
  if (has("agroinsumo", "agricola", "fertilizante", "concentrado")) return "agro";
  if (has("internet", "wifi", "redes", "tecnologia")) return "internet";
  if (has("servicios", "reparacion", "tecnico", "mantenimiento")) return "services";
  return "general";
}

// ============================================================================
// Descripciones (sin emojis, sin promesas absolutas, ~155 caracteres)
// ============================================================================
function buildCategoryDescription(categoryName: string, count: number): string {
  const n = count > 0 ? `${count} ` : "";
  const m = MUNICIPIOS_TEXT;

  const byNiche: Record<Niche, string> = {
    food: `${n}restaurantes y comidas rápidas en ${m}. Menús, domicilios y contacto directo por WhatsApp.`,
    nightlife: `${n}bares, discotecas y licoreras en ${m}. Horarios, ubicación y contacto directo por WhatsApp.`,
    shopping: `${n}supermercados y tiendas en ${m}. Domicilios a casas y fincas con contacto directo por WhatsApp.`,
    beauty: `${n}barberías y peluquerías en ${m}. Cortes, barba y citas por WhatsApp.`,
    transport: `${n}mototaxis, transporte y domicilios en ${m}. Contacto directo por WhatsApp.`,
    moving: `${n}servicios de trasteos, mudanzas y transporte de carga en ${m}. Cotiza por WhatsApp.`,
    health: `${n}farmacias, droguerías y servicios de salud en ${m}. Teléfonos, horarios y ubicación.`,
    emergency: `Números de emergencia, policía y bomberos en ${m}. Contacto directo de instituciones esenciales.`,
    religion: `${n}parroquias e iglesias en ${m}. Horarios de misa, contacto y ubicación.`,
    tourism: `${n}planes turísticos, cuatrimotos y aventura en ${m}. Reserva directo con el anfitrión.`,
    lodging: `${n}fincas, glampings y alojamientos en ${m}. Fotos, comodidades y reserva directa por WhatsApp.`,
    agro: `${n}agroinsumos, fertilizantes y concentrados en ${m}. Teléfonos y ubicación.`,
    internet: `${n}proveedores de internet e instalación de redes WiFi para casas y fincas en ${m}.`,
    services: `${n}servicios técnicos y mantenimiento en ${m}. Electricistas, plomeros y reparaciones. Cotiza por WhatsApp.`,
    general: `${n}${categoryName} en ${m}. Teléfonos, WhatsApp y ubicación en el directorio Ooasys.`,
  };

  return stripHtmlAndTruncate(byNiche[detectNiche(categoryName)], 160);
}

// ============================================================================
// Preguntas frecuentes (el mismo contenido se muestra y va en el schema)
// ============================================================================
function getCategoryFaqs(categoryName: string) {
  if (detectNiche(categoryName) === "lodging") {
    return [
      {
        q: "¿Cómo alquilar una finca o glamping de forma segura en San Jerónimo, Sopetrán o Santa Fe?",
        a: "Contacta directamente al propietario o administrador por WhatsApp desde su ficha. Antes de pagar, confirma la disponibilidad, pide fotos recientes y evita consignar a terceros que no puedas identificar.",
      },
      {
        q: "¿Qué comodidades incluyen los alojamientos en el Occidente Antioqueño?",
        a: "Muchas opciones cuentan con piscina, zonas verdes, parrilla BBQ, aire acondicionado y WiFi. Cada ficha detalla los servicios e instalaciones de ese alojamiento.",
      },
      {
        q: "¿Con cuánta anticipación debo reservar para un puente festivo?",
        a: "Por la alta demanda turística, lo recomendable es consultar la disponibilidad y reservar con 2 a 4 semanas de anticipación.",
      },
    ];
  }

  return [
    {
      q: `¿Dónde encontrar ${categoryName} en el Occidente Antioqueño?`,
      a: `En Ooasys reunimos opciones de ${categoryName} en ${MUNICIPIOS_TEXT}, con teléfono, ubicación y contacto directo.`,
    },
    {
      q: `¿Cómo contactar un servicio de ${categoryName}?`,
      a: "Entra a la ficha del negocio y usa el botón de WhatsApp o el de llamada. El contacto es directo, sin intermediarios.",
    },
    {
      q: "¿Atienden en fincas o zonas rurales?",
      a: "Depende de cada negocio. Revisa su perfil o consúltalo por WhatsApp para confirmar cobertura y tiempos.",
    },
  ];
}

// ============================================================================
// Metadatos
// ============================================================================
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const businesses = await getBusinessesBySlug(slug);

  const categoryName = resolveCategoryName(slug, businesses);
  const count = businesses.length;

  const title =
    count > 0
      ? `${categoryName} en el Occidente Antioqueño (${count}) | Ooasys`
      : `${categoryName} en el Occidente Antioqueño | Ooasys`;
  const description = buildCategoryDescription(categoryName, count);
  const url = `${baseUrl}/categorias/${slug}`;

  return {
    metadataBase: new URL(baseUrl),
    title: { absolute: title },
    description,
    applicationName: "Ooasys",
    alternates: {
      canonical: url,
      languages: { "es-CO": url, es: url },
    },
    // Categorías vacías = contenido pobre: mejor no indexarlas
    robots:
      count === 0
        ? { index: false, follow: true }
        : {
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
          alt: `${categoryName} en el Occidente Antioqueño - Ooasys`,
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
}

// ============================================================================
// Página
// ============================================================================
export default async function CategoryBusinessPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const businesses = await getBusinessesBySlug(slug);

  const title = resolveCategoryName(slug, businesses);
  const url = `${baseUrl}/categorias/${slug}`;
  const categoryFaqs = getCategoryFaqs(title);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: `${title} en el Occidente Antioqueño`,
    description: buildCategoryDescription(title, businesses.length),
    url,
    inLanguage: "es-CO",
    areaServed: [
      ...MUNICIPIOS.map((name) => ({ "@type": "City", name })),
      { "@type": "AdministrativeArea", name: "Occidente Antioqueño" },
    ],
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: businesses.length,
      itemListElement: businesses.map((business: any, index: number) => {
        const businessSlug = getSlugText(business.slug);
        const locality =
          business.city || business.municipality?.name || "Occidente Antioqueño";
        const description = stripHtmlAndTruncate(business.description || "", 150);

        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "LocalBusiness",
            name: business.name,
            ...(description && { description }),
            url: `${baseUrl}/business/${businessSlug}`,
            image:
              typeof business.logo === "string" && business.logo
                ? business.logo
                : `${baseUrl}/og-categories.png`,
            ...(business.phone && { telephone: business.phone }),
            address: {
              "@type": "PostalAddress",
              streetAddress: business.address || "Occidente Antioqueño",
              addressLocality: locality,
              addressRegion: "Antioquia",
              addressCountry: "CO",
            },
          },
        };
      }),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Categorías", item: `${baseUrl}/categorias` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categoryFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script id="category-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(collectionJsonLd) }} />
      <script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }} />

      <Link
        href="/categorias"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
        Volver a categorías
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight font-heading md:text-4xl text-foreground">
          {title}{" "}
          <span className="text-primary text-2xl md:text-3xl block md:inline font-normal font-sans">
            en el Occidente Antioqueño
          </span>
        </h1>
        <p className="text-muted-foreground mt-2">
          {businesses.length}{" "}
          {businesses.length === 1 ? "negocio encontrado" : "negocios encontrados"} en {MUNICIPIOS_TEXT}.
        </p>
      </div>

      {businesses.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-border/50 bg-accent/10">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" aria-hidden="true" />
          <p className="text-lg font-medium text-muted-foreground">
            Aún no hay negocios registrados en &quot;{title}&quot;
          </p>
          <Link href="/categorias" className="text-primary hover:underline mt-4 inline-block font-semibold">
            Explorar otras categorías del Occidente Antioqueño
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business: any) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>
      )}

      <section className="mt-16 pt-10 border-t border-border/60">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Preguntas frecuentes sobre {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryFaqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm">
              <h3 className="font-semibold text-foreground text-sm mb-2">{faq.q}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}