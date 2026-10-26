import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Store, HelpCircle, MapPin } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { BUSINESS_BY_SUBCATEGORY_QUERY } from "@/lib/sanity/queries";
import { BusinessCard } from "@/components/BusinessCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

const MUNICIPIOS = ["Sopetrán", "San Jerónimo", "Santa Fe de Antioquia", "Liborina", "Olaya"];
const MUNICIPIOS_SLUG: Record<string, string> = {
  "Sopetrán": "sopetran",
  "San Jerónimo": "san-jeronimo",
  "Santa Fe de Antioquia": "santa-fe-de-antioquia",
  "Liborina": "liborina",
  "Olaya": "olaya"
};

const getBusinessesBySlug = cache(async (slug: string) => {
  const result = await client.fetch(BUSINESS_BY_SUBCATEGORY_QUERY, { slug });
  return (result ?? []) as any[];
});

function formatSlugText(slug: string): string {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

function stripHtmlAndTruncate(text: string, maxLength: number): string {
  if (!text) return "";
  const cleaned = text.replace(/(<([^>]+)>)/gi, "").replace(/\s+/g, " ").trim();
  return cleaned.length > maxLength ? cleaned.substring(0, maxLength - 3).trimEnd() + "..." : cleaned;
}

function normalize(text: string): string {
  return (text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getSlugText(slug: any): string {
  if (!slug) return "";
  return typeof slug === "object" ? slug.current || "" : slug;
}

function resolveCategoryName(slug: string, businesses: any[]): string {
  const fallback = formatSlugText(slug);
  if (businesses.length === 0) return fallback;
  const first = businesses[0];
  return first.category?.slug?.current === slug
    ? first.category.name
    : first.subcategory?.name || first.category?.name || fallback;
}

// CORREGIDO: Esta pagina es GENERAL del Occidente, no de un solo municipio.
// Antes retornaba Sopetran porque era el que mas negocios tenia y por eso el titulo mentia.
function getTopMunicipio(businesses: any[]): string {
  return "Occidente Antioqueño";
}

type Niche =
  | "lodging" | "food" | "beauty" | "nightlife" | "shopping" | "transport" | "moving"
  | "health" | "emergency" | "religion" | "tourism" | "agro" | "internet" | "services" | "general";

function detectNiche(categoryName: string): Niche {
  const c = normalize(categoryName);
  const has = (...words: string[]) => words.some((w) => c.includes(w));
  if (has("alojamiento", "bienes raices", "finca", "glamping", "inmobiliaria", "arriendo", "hospedaje", "hotel")) return "lodging";
  if (has("barberia", "peluqueria", "estetica")) return "beauty";
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

function buildCategoryDescription(categoryName: string, count: number, topMunicipio: string): string {
  const n = count > 0 ? `${count} ` : "";
  const byNiche: Record<Niche, string> = {
    food: `${n}restaurantes en ${topMunicipio} con domicilio a fincas. Menus y WhatsApp directo.`,
    nightlife: `${n}bares y discotecas en ${topMunicipio} con horarios y ubicacion. Contacto directo por WhatsApp.`,
    shopping: `${n}supermercados en ${topMunicipio} con domicilio a casas y fincas. Pide por WhatsApp.`,
    beauty: `${n}barberias en ${topMunicipio}. Cortes, barba y citas por WhatsApp.`,
    transport: `${n}mototaxis y domicilios en ${topMunicipio} 24h. Servicio rapido por WhatsApp.`,
    moving: `${n}trasteos y mudanzas en ${topMunicipio}. Cotiza tu transporte de carga por WhatsApp.`,
    health: `${n}farmacias y droguerias en ${topMunicipio} con telefono y domicilio.`,
    emergency: `Numeros de bomberos y policia en ${topMunicipio}. Contacto directo 24h.`,
    religion: `${n}parroquias en ${topMunicipio}. Horarios de misa y ubicacion.`,
    tourism: `${n}planes turisticos en ${topMunicipio}: cuatrimotos y aventura. Reserva directo.`,
    lodging: `${n}fincas y glampings en ${topMunicipio} con piscina y BBQ. Reserva directa por WhatsApp.`,
    agro: `${n}agroinsumos en ${topMunicipio}. Fertilizantes y concentrados con domicilio.`,
    internet: `${n}proveedores de internet en ${topMunicipio} para casas y fincas. Instalacion WiFi.`,
    services: `${n}servicios tecnicos en ${topMunicipio}: electricistas y plomeros. Cotiza por WhatsApp.`,
    general: `${n}${categoryName} en ${topMunicipio}. Telefono y WhatsApp directo en Ooasys.`,
  };
  return stripHtmlAndTruncate(byNiche[detectNiche(categoryName)], 155);
}

function getCategoryFaqs(categoryName: string, topMunicipio: string) {
  if (detectNiche(categoryName) === "lodging") {
    return [
      { q: `¿Como alquilar una finca segura en ${topMunicipio}?`, a: `Contacta directo al propietario por WhatsApp desde su ficha en Ooasys. Confirma fotos recientes y evita consignar a terceros no verificados en ${topMunicipio}.` },
      { q: `¿Que incluyen las fincas en ${topMunicipio}?`, a: "La mayoria incluye piscina, zona BBQ, aire acondicionado y WiFi. Revisa cada ficha para ver fotos y comodidades exactas." },
      { q: "¿Con cuanto tiempo reservar en puente?", a: "En el Occidente Antioqueño se recomienda reservar con 2 a 4 semanas de anticipacion por la alta demanda." },
    ];
  }
  return [
    { q: `¿Donde encontrar ${categoryName} en ${topMunicipio}?`, a: `En Ooasys listamos ${categoryName} en ${topMunicipio} con telefono y WhatsApp directo.` },
    { q: `¿Como contactar ${categoryName} en ${topMunicipio}?`, a: "Usa el boton de WhatsApp en la ficha. El contacto es directo con el negocio, sin intermediarios." },
    { q: `¿Hacen domicilio de ${categoryName} a fincas en ${topMunicipio}?`, a: "Depende de cada negocio. Entra a su perfil y consultalo por WhatsApp, muchos atienden veredas y fincas." },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const businesses = await getBusinessesBySlug(slug);
  const categoryName = resolveCategoryName(slug, businesses);
  const count = businesses.length;
  const topMunicipio = getTopMunicipio(businesses);

  // CORREGIDO: titulo general, no dice Sopetran
  const title = `${categoryName} en ${topMunicipio} con WhatsApp y Domicilio | Ooasys`;
  const description = buildCategoryDescription(categoryName, count, topMunicipio);
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
    robots: count === 0 ? { index: false, follow: true } : {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    other: { "geo.region": "CO-ANT", "geo.placename": topMunicipio },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Ooasys",
      locale: "es_CO",
      images: [{ url: `${baseUrl}/og-categories.png`, width: 1200, height: 630, alt: `${categoryName} en ${topMunicipio} - Ooasys` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${baseUrl}/og-categories.png`] },
  };
}

export default async function CategoryBusinessPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const businesses = await getBusinessesBySlug(slug);
  const title = resolveCategoryName(slug, businesses);
  const url = `${baseUrl}/categorias/${slug}`;
  const topMunicipio = getTopMunicipio(businesses);
  const categoryFaqs = getCategoryFaqs(title, topMunicipio);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: `${title} en ${topMunicipio} - Occidente Antioqueño`,
    description: buildCategoryDescription(title, businesses.length, topMunicipio),
    url,
    inLanguage: "es-CO",
    isPartOf: { "@type": "WebSite", name: "Ooasys", url: baseUrl },
    areaServed: [...MUNICIPIOS.map((name) => ({ "@type": "City", name })), { "@type": "AdministrativeArea", name: "Occidente Antioqueño" }],
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: businesses.length,
      itemListElement: businesses.slice(0, 10).map((business: any, index: number) => {
        const businessSlug = getSlugText(business.slug);
        const locality = business.city || business.municipality?.name || topMunicipio;
        const description = stripHtmlAndTruncate(business.description || "", 150);
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "LocalBusiness",
            name: business.name,
            ...(description && { description }),
            url: `${baseUrl}/business/${businessSlug}`,
            image: typeof business.logo === "string" && business.logo ? business.logo : `${baseUrl}/og-categories.png`,
            ...(business.phone && { telephone: business.phone }),
            address: {
              "@type": "PostalAddress",
              streetAddress: business.address || topMunicipio,
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
      { "@type": "ListItem", position: 3, name: `${title} en ${topMunicipio}`, item: url },
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
    <>
      <script id="category-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(collectionJsonLd) }} />
      <script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }} />

      <div className="container mx-auto px-4 py-8">
        <Link href="/categorias" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          Volver a categorías
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight font-heading md:text-4xl text-foreground">
            {title} en {topMunicipio}
            <span className="text-primary text-2xl md:text-3xl block md:inline font-normal font-sans"> con WhatsApp directo</span>
          </h1>
          
          <div className="mt-4 max-w-3xl">
            <p className="text-foreground/80 leading-relaxed">
              Encuentra <strong>{businesses.length} opciones de {title.toLowerCase()} en {topMunicipio}</strong> y todo el Occidente Antioqueño. 
              ¿Buscas {title.toLowerCase()} cerca del parque de Sopetrán, San Jerónimo o Santa Fe de Antioquia? ¿Con domicilio a fincas y veredas? 
              Aquí los contactas directo por WhatsApp sin comisiones ni intermediarios. Revisa fotos, ubicación y horarios.
            </p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {MUNICIPIOS.map((m) => {
                const municipioSlug = MUNICIPIOS_SLUG[m];
                return (
                  <Link 
                    key={m} 
                    href={`/categorias/${slug}/${municipioSlug}`}
                    className="inline-flex items-center gap-1 text-xs border border-border bg-card hover:bg-accent px-3 py-1.5 rounded-full transition-colors"
                  >
                    <MapPin className="h-3 w-3" /> {m}
                  </Link>
                );
              })}
              <Link href="/mapa" className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full">Ver mapa del Occidente</Link>
            </div>
          </div>

          <p className="text-muted-foreground mt-4 text-sm">
            {businesses.length} {businesses.length === 1 ? "negocio verificado" : "negocios verificados"} en {topMunicipio} y alrededores.
          </p>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-border/50 bg-accent/10">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" aria-hidden="true" />
            <p className="text-lg font-medium text-muted-foreground">Aún no hay negocios en &quot;{title}&quot; en {topMunicipio}</p>
            <p className="text-sm text-muted-foreground mt-1">Prueba en otro municipio del Occidente</p>
            <div className="flex gap-2 justify-center mt-4">
              {MUNICIPIOS.map(m => {
                const municipioSlug = MUNICIPIOS_SLUG[m];
                return (
                  <Link key={m} href={`/categorias/${slug}/${municipioSlug}`} className="text-xs underline">{m}</Link>
                );
              })}
            </div>
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
            <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">Preguntas frecuentes sobre {title} en {topMunicipio}</h2>
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
    </>
  );
}