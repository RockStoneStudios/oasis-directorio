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
function getTopMunicipio(businesses: any[]): string {
  return "Occidente Antioqueño";
}

type Niche =
  | "lodging" | "food" | "beauty" | "nightlife" | "shopping" | "transport" | "moving"
  | "health" | "emergency" | "religion" | "tourism" | "agro" | "internet" | "services" | "desserts" | "general";

function detectNiche(categoryName: string): Niche {
  const c = normalize(categoryName);
  const has = (...words: string[]) => words.some((w) => c.includes(w));
  if (has("heladeria", "helado", "postre", "dulce", "salpicon", "waffle", "wafle", "sandwich", "crepes", "malteada", "frappe", "dulceria")) return "desserts";
  if (has("alojamiento", "bienes raices", "finca", "glamping", "inmobiliaria", "arriendo", "hospedaje", "hotel", "cabana", "cabaña")) return "lodging";
  if (has("barberia", "peluqueria", "estetica", "uñas", "unas", "spa", "belleza")) return "beauty";
  if (has("restaurante & bar", "discoteca", "licorera", "rumba") || /\bbares?\b/.test(c)) return "nightlife";
  if (has("restaurante", "comidas rapidas", "comida", "donde comer")) return "food";
  if (has("supermercado", "tienda", "compras", "mercado", "minimercado")) return "shopping";
  if (has("trasteo", "mudanza", "carga", "acarreo")) return "moving";
  if (has("mototaxi", "domicilios", "encomienda", "transporte")) return "transport";
  if (has("farmacia", "drogueria", "odontologia", "salud", "dental", "optica")) return "health";
  if (has("basicos", "policia", "bomberos", "emergencia")) return "emergency";
  if (has("religion", "parroquia", "iglesia")) return "religion";
  if (has("turismo", "viajes", "aventura", "caminata", "cuatrimoto")) return "tourism";
  if (has("agroinsumo", "agricola", "fertilizante", "concentrado", "veterinaria")) return "agro";
  if (has("internet", "wifi", "redes", "tecnologia")) return "internet";
  if (has("servicios", "reparacion", "tecnico", "mantenimiento", "electricista", "plomero")) return "services";
  return "general";
}

function buildCategoryDescription(categoryName: string, count: number, topMunicipio: string): string {
  const n = count > 0 ? `${count} ` : "";
  const byNiche: Record<Niche, string> = {
    food: `${n}restaurantes en ${topMunicipio} con domicilio a fincas. Menus y WhatsApp directo.`,
    nightlife: `${n}licoreras y bares en ${topMunicipio} con domicilio y horarios. Licorera con WhatsApp directo.`,
    shopping: `${n}supermercados y tiendas en ${topMunicipio} con domicilio a casas y fincas. Pide por WhatsApp.`,
    beauty: `${n}barberia y peluqueria en ${topMunicipio}. Cortes, uñas y estetica con citas por WhatsApp.`,
    transport: `${n}mototaxis y domicilios en ${topMunicipio} 24h. Servicio rapido por WhatsApp.`,
    moving: `${n}trasteos y mudanzas en ${topMunicipio}. Cotiza tu trasteo y transporte de carga por WhatsApp.`,
    health: `${n}farmacia y drogueria en ${topMunicipio} con domicilio y WhatsApp. Medicamentos.`,
    emergency: `${n}bomberos y policia en ${topMunicipio}. Numeros de emergencia 24h con contacto directo.`,
    religion: `${n}parroquias e iglesias en ${topMunicipio}. Horarios de misa y ubicacion.`,
    tourism: `${n}turismo y aventura en ${topMunicipio}: cuatrimotos, caminatas y planes turisticos. Reserva directo.`,
    lodging: `${n}hoteles, hospedaje y glamping en ${topMunicipio} con piscina, fincas y cabañas. Hoteles y glamping en Sopetran, San Jeronimo y Santa Fe de Antioquia con reserva por WhatsApp.`,
    agro: `${n}agroinsumos y veterinaria en ${topMunicipio}. Fertilizantes y concentrados con domicilio.`,
    internet: `${n}internet y WiFi en ${topMunicipio} para casas y fincas. Instalacion WiFi por WhatsApp.`,
    services: `${n}servicios tecnicos en ${topMunicipio}: electricistas, plomeros y tecnicos. Cotiza por WhatsApp.`,
    desserts: `${n}heladerias en ${topMunicipio} con helados, salpicones, wafles y sandwiches. Helado artesanal, salpicon de frutas, wafles con helado y sandwiches con domicilio a fincas por WhatsApp.`,
    general: `${n}${categoryName} en ${topMunicipio} cerca del parque. Telefono y WhatsApp directo en Ooasys.`,
  };
  return stripHtmlAndTruncate(byNiche[detectNiche(categoryName)], 155);
}

function getCategoryFaqs(categoryName: string, topMunicipio: string) {
  const niche = detectNiche(categoryName);
  if (niche === "lodging") {
    return [
      { q: `¿Dónde encontrar hoteles en ${topMunicipio}?`, a: `En Ooasys listamos hoteles, hospedaje y glamping en ${topMunicipio} con piscina, fotos y WhatsApp directo, cerca del parque de Sopetrán, San Jerónimo y Santa Fe de Antioquia.` },
      { q: `¿Hay hospedaje y glamping con piscina en ${topMunicipio}?`, a: "Sí, la mayoría de hoteles, fincas, cabañas y glamping en el Occidente tienen piscina, BBQ y parqueadero. Revisa cada ficha en Ooasys." },
      { q: `¿Cómo reservar un hotel o glamping en ${topMunicipio}?`, a: "Usa el botón de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha. Reserva directa sin intermediarios ni comisiones." },
    ];
  }
  if (niche === "desserts") {
    return [
      { q: `¿Dónde encontrar helados en ${topMunicipio}?`, a: `En Ooasys listamos heladerías en ${topMunicipio} con helados, salpicones, wafles y sandwiches con domicilio y WhatsApp directo.` },
      { q: `¿Qué heladerías en ${topMunicipio} tienen salpicón, wafles y sandwiches?`, a: `La mayoría de heladerías en ${topMunicipio} tienen salpicón de frutas, wafles con helado, malteadas y sandwiches. Revisa cada ficha en Ooasys.` },
      { q: `¿Cómo pedir helado a domicilio en ${topMunicipio}?`, a: "Usa el botón de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha. Pide helados, salpicones, wafles y sandwiches directo sin intermediarios." },
    ];
  }
  if (niche === "beauty") {
    return [
      { q: `¿Dónde encontrar barbería en ${topMunicipio}?`, a: `En Ooasys listamos barbería y peluquería en ${topMunicipio} con citas por WhatsApp.` },
      { q: `¿Dónde hacer uñas en ${topMunicipio}?`, a: `En Ooasys encuentras peluquerías y estética en ${topMunicipio} con servicio de uñas y corte.` },
      { q: `¿Cómo agendar en una peluquería en ${topMunicipio}?`, a: "Usa el botón de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha. Agenda directa." },
    ];
  }
  if (niche === "nightlife") {
    return [
      { q: `¿Dónde encontrar licorera en ${topMunicipio}?`, a: `En Ooasys listamos licoreras y bares en ${topMunicipio} con domicilio y WhatsApp directo.` },
      { q: `¿Qué licoreras en ${topMunicipio} tienen domicilio?`, a: `La mayoría de licoreras en ${topMunicipio} hacen domicilio a fincas y veredas.` },
      { q: `¿Cómo contactar una licorera en ${topMunicipio}?`, a: "Usa el botón de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha. Contacto directo." },
    ];
  }
  if (niche === "shopping") {
    return [
      { q: `¿Dónde encontrar supermercado en ${topMunicipio}?`, a: `En Ooasys listamos supermercados y tiendas en ${topMunicipio} con domicilio y WhatsApp directo.` },
      { q: `¿Qué tiendas en ${topMunicipio} tienen domicilio?`, a: `La mayoría de supermercados en ${topMunicipio} hacen domicilio a fincas y veredas.` },
      { q: `¿Cómo pedir domicilio en ${topMunicipio}?`, a: "Usa el botón de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha." },
    ];
  }
  if (niche === "health") {
    return [
      { q: `¿Dónde encontrar farmacia en ${topMunicipio}?`, a: `En Ooasys listamos farmacia y droguería en ${topMunicipio} con domicilio y WhatsApp directo.` },
      { q: `¿Hay droguería con domicilio en ${topMunicipio}?`, a: `Sí, varias droguerías en ${topMunicipio} hacen domicilio a fincas y veredas.` },
      { q: `¿Cómo pedir medicamentos en ${topMunicipio}?`, a: "Usa el botón de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha." },
    ];
  }
  if (niche === "tourism") {
    return [
      { q: `¿Qué hacer en ${topMunicipio}?`, a: `En Ooasys encuentras turismo y aventura en ${topMunicipio}: cuatrimotos, caminatas y planes turisticos.` },
      { q: `¿Dónde alquilar cuatrimotos en ${topMunicipio}?`, a: `En Ooasys listamos cuatrimotos y aventura en ${topMunicipio} con reserva por WhatsApp.` },
      { q: `¿Cómo reservar un plan turistico en ${topMunicipio}?`, a: "Usa el botón de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha. Reserva directa." },
    ];
  }
  if (niche === "transport") {
    return [
      { q: `¿Donde encontrar mototaxi en ${topMunicipio}?`, a: `En Ooasys listamos mototaxis, domicilios y encomiendas en ${topMunicipio} con telefono y WhatsApp directo.` },
      { q: `¿Cuánto vale un mototaxi en ${topMunicipio}?`, a: `El precio depende de la distancia y si es dentro del pueblo o a una finca. Escribele directo por WhatsApp al mototaxi en Ooasys y cotiza sin intermediarios.` },
      { q: `¿Hay mototaxis 24 horas en ${topMunicipio}?`, a: `Si, varios mototaxis y domicilios en ${topMunicipio} trabajan 24h, sobre todo en Sopetran y San Jeronimo. Revisa en su ficha su horario y WhatsApp.` },
    ];
  }
  return [
    { q: `¿Donde encontrar ${categoryName} en ${topMunicipio}?`, a: `En Ooasys listamos ${categoryName} en ${topMunicipio} con telefono y WhatsApp directo.` },
    { q: `¿Como contactar ${categoryName} en ${topMunicipio}?`, a: "Usa el boton de WhatsApp en la ficha. El contacto es directo con el negocio, sin intermediarios." },
    { q: `¿Hacen domicilio de ${categoryName} a fincas en ${topMunicipio}?`, a: "Depende de cada negocio. Entra a su perfil y consultalo por WhatsApp, muchos atienden veredas y fincas." },
  ];
}

function getSeoTitle(categoryName: string, topMunicipio: string): string {
  const niche = detectNiche(categoryName);
  if (niche === "desserts") return `Helados, Salpicones, Wafles y Sandwiches en ${topMunicipio} | Ooasys`;
  if (niche === "transport") return `Mototaxis, Domicilios y Encomiendas en ${topMunicipio} | Ooasys`;
  if (niche === "lodging") return `Hoteles, Hospedaje y Glamping en ${topMunicipio} con Piscina | Ooasys`;
  if (niche === "food") return `Restaurantes en ${topMunicipio} con Domicilio y 【entity-WhatsApp¦canonical_name=WhatsApp】 | Ooasys`;
  if (niche === "beauty") return `Barbería y Peluquería en ${topMunicipio} con 【entity-WhatsApp¦canonical_name=WhatsApp】 | Ooasys`;
  if (niche === "nightlife") return `Licoreras y Bares en ${topMunicipio} con Domicilio | Ooasys`;
  if (niche === "shopping") return `Supermercados y Tiendas en ${topMunicipio} con Domicilio | Ooasys`;
  if (niche === "health") return `Farmacia y Droguería en ${topMunicipio} con Domicilio | Ooasys`;
  if (niche === "moving") return `Trasteos y Mudanzas en ${topMunicipio} | Ooasys`;
  if (niche === "tourism") return `Turismo y Aventura en ${topMunicipio} Cuatrimotos | Ooasys`;
  if (niche === "agro") return `Agroinsumos y Veterinaria en ${topMunicipio} | Ooasys`;
  if (niche === "internet") return `Internet y WiFi en ${topMunicipio} para Fincas | Ooasys`;
  if (niche === "services") return `Servicios Técnicos en ${topMunicipio} Electricista y Plomero | Ooasys`;
  if (niche === "emergency") return `Bomberos y Policía en ${topMunicipio} Emergencia 24h | Ooasys`;
  if (niche === "religion") return `Parroquias e Iglesias en ${topMunicipio} Horario de Misa | Ooasys`;
  return `${categoryName} en ${topMunicipio} con WhatsApp y Domicilio | Ooasys`;
}

function getDisplayTitle(categoryName: string, topMunicipio: string): string {
  const niche = detectNiche(categoryName);
  if (niche === "desserts") return `Heladerías y Postres en ${topMunicipio}`;
  if (niche === "transport") return `Mototaxis, Domicilios y Encomiendas en ${topMunicipio}`;
  if (niche === "lodging") return `Hoteles, Hospedaje y Glamping en ${topMunicipio}`;
  if (niche === "food") return `Restaurantes en ${topMunicipio}`;
  if (niche === "beauty") return `Barbería y Peluquería en ${topMunicipio}`;
  if (niche === "nightlife") return `Licoreras y Bares en ${topMunicipio}`;
  if (niche === "shopping") return `Supermercados y Tiendas en ${topMunicipio}`;
  if (niche === "health") return `Farmacia y Droguería en ${topMunicipio}`;
  if (niche === "moving") return `Trasteos y Mudanzas en ${topMunicipio}`;
  if (niche === "tourism") return `Turismo y Aventura en ${topMunicipio}`;
  if (niche === "agro") return `Agroinsumos y Veterinaria en ${topMunicipio}`;
  if (niche === "internet") return `Internet y WiFi en ${topMunicipio}`;
  if (niche === "services") return `Servicios Técnicos en ${topMunicipio}`;
  if (niche === "emergency") return `Bomberos y Policía en ${topMunicipio}`;
  if (niche === "religion") return `Parroquias e Iglesias en ${topMunicipio}`;
  return `${categoryName} en ${topMunicipio}`;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const businesses = await getBusinessesBySlug(slug);
  const categoryName = resolveCategoryName(slug, businesses);
  const count = businesses.length;
  const topMunicipio = getTopMunicipio(businesses);
  const title = getSeoTitle(categoryName, topMunicipio);
  const description = buildCategoryDescription(categoryName, count, topMunicipio);
  const url = `${baseUrl}/categorias/${slug}`;
  return {
    metadataBase: new URL(baseUrl),
    title: { absolute: title },
    description,
    applicationName: "Ooasys",
    alternates: { canonical: url, languages: { "es-CO": url, es: url } },
    robots: count === 0 ? { index: false, follow: true } : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    other: { "geo.region": "CO-ANT", "geo.placename": topMunicipio },
    openGraph: { title, description, url, type: "website", siteName: "Ooasys", locale: "es_CO", images: [{ url: `${baseUrl}/og-categories.png`, width: 1200, height: 630, alt: `${categoryName} en ${topMunicipio} - Ooasys` }] },
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
  const displayTitle = getDisplayTitle(title, topMunicipio);
  const niche = detectNiche(title);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: `${displayTitle} - Occidente Antioqueño`,
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
            address: { "@type": "PostalAddress", streetAddress: business.address || topMunicipio, addressLocality: locality, addressRegion: "Antioquia", addressCountry: "CO" },
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
      { "@type": "ListItem", position: 3, name: `${displayTitle}`, item: url },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categoryFaqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
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
            {displayTitle}
            <span className="text-primary text-2xl md:text-3xl block md:inline font-normal font-sans"> con WhatsApp directo</span>
          </h1>
          <div className="mt-4 max-w-3xl">
            <p className="text-foreground/80 leading-relaxed">
              {niche === "desserts" ? (
                <>Encuentra <strong>{businesses.length} heladerías en {topMunicipio}</strong> y todo el Occidente Antioqueño. ¿Buscas helados, salpicones, wafles y sandwiches en Sopetrán, San Jerónimo o Santa Fe de Antioquia? ¿Helado artesanal, salpicón de frutas, wafles con helado y sandwiches con domicilio a fincas y veredas? Aquí los pides directo por WhatsApp sin comisiones ni intermediarios. Revisa fotos, ubicación y horarios.</>
              ) : niche === "transport" ? (
                <>Encuentra <strong>{businesses.length} mototaxis, domicilios y encomiendas en {topMunicipio}</strong> y todo el Occidente Antioqueño. ¿Buscas mototaxi cerca del parque de Sopetrán, San Jerónimo o Santa Fe de Antioquia? ¿Con domicilio a fincas y veredas? Aquí los contactas directo por WhatsApp sin comisiones ni intermediarios. Revisa fotos, ubicación y horarios.</>
              ) : niche === "lodging" ? (
                <>Encuentra <strong>{businesses.length} hoteles, hospedaje y glamping en {topMunicipio}</strong> y todo el Occidente Antioqueño. ¿Buscas hotel en Sopetrán, San Jerónimo o Santa Fe de Antioquia? ¿Hospedaje y glamping con piscina en {topMunicipio} para fin de semana? Mira fotos, ubicación y reserva directo por WhatsApp sin comisiones.</>
              ) : niche === "beauty" ? (
                <>Encuentra <strong>{businesses.length} barbería y peluquería en {topMunicipio}</strong>. ¿Buscas barbería cerca del parque de Sopetrán, San Jerónimo o Santa Fe de Antioquia? ¿Peluquería y uñas en {topMunicipio}? Agenda directo por WhatsApp sin comisiones.</>
              ) : niche === "nightlife" ? (
                <>Encuentra <strong>{businesses.length} licoreras y bares en {topMunicipio}</strong>. ¿Buscas licorera con domicilio en Sopetrán, San Jerónimo o Santa Fe de Antioquia? ¿Bar con música en vivo? Contacta directo por WhatsApp sin comisiones.</>
              ) : niche === "shopping" ? (
                <>Encuentra <strong>{businesses.length} supermercados y tiendas en {topMunicipio}</strong>. ¿Buscas supermercado cerca del parque? ¿Con domicilio a fincas y veredas? Contacta directo por WhatsApp.</>
              ) : niche === "health" ? (
                <>Encuentra <strong>{businesses.length} farmacia y droguería en {topMunicipio}</strong>. ¿Buscas droguería con domicilio en Sopetrán, San Jerónimo o Santa Fe de Antioquia? Pide medicamentos directo por WhatsApp.</>
              ) : niche === "tourism" ? (
                <>Encuentra <strong>{businesses.length} planes de turismo y aventura en {topMunicipio}</strong>. ¿Buscas cuatrimotos, caminatas y aventura en Sopetrán, San Jerónimo o Santa Fe de Antioquia? Reserva directo por WhatsApp.</>
              ) : niche === "moving" ? (
                <>Encuentra <strong>{businesses.length} trasteos y mudanzas en {topMunicipio}</strong>. ¿Buscas trasteo y transporte de carga en Sopetrán, San Jerónimo o Santa Fe de Antioquia? Cotiza directo por WhatsApp.</>
              ) : (
                <>Encuentra <strong>{businesses.length} opciones de {title.toLowerCase()} en {topMunicipio}</strong> y todo el Occidente Antioqueño. ¿Buscas {title.toLowerCase()} cerca del parque de Sopetrán, San Jerónimo o Santa Fe de Antioquia? ¿Con domicilio a fincas y veredas? Aquí los contactas directo por WhatsApp sin comisiones ni intermediarios. Revisa fotos, ubicación y horarios.</>
              )}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {MUNICIPIOS.map((m) => {
                const municipioSlug = MUNICIPIOS_SLUG[m];
                return (
                  <Link key={m} href={`/categorias/${slug}/${municipioSlug}`} className="inline-flex items-center gap-1 text-xs border border-border bg-card hover:bg-accent px-3 py-1.5 rounded-full transition-colors">
                    <MapPin className="h-3 w-3" /> {m}
                  </Link>
                );
              })}
              <Link href="/mapa" className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full">Ver mapa del Occidente</Link>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 text-sm">{businesses.length} {businesses.length === 1 ? "negocio verificado" : "negocios verificados"} en {topMunicipio} y alrededores.</p>
        </div>
        {businesses.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-border/50 bg-accent/10">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" aria-hidden="true" />
            <p className="text-lg font-medium text-muted-foreground">Aún no hay negocios en &quot;{displayTitle}&quot; en {topMunicipio}</p>
            <p className="text-sm text-muted-foreground mt-1">Prueba en otro municipio del Occidente</p>
            <div className="flex gap-2 justify-center mt-4">
              {MUNICIPIOS.map(m => {
                const municipioSlug = MUNICIPIOS_SLUG[m];
                return (<Link key={m} href={`/categorias/${slug}/${municipioSlug}`} className="text-xs underline">{m}</Link>);
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business: any) => (<BusinessCard key={business._id} business={business} />))}
          </div>
        )}
        <section className="mt-16 pt-10 border-t border-border/60">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">Preguntas frecuentes sobre {displayTitle}</h2>
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