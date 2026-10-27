import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Store, HelpCircle, MapPin } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { BUSINESS_BY_SUBCATEGORY_QUERY } from "@/lib/sanity/queries";
import { BusinessCard } from "@/components/BusinessCard";

// Ruta: /categorias/[slug]/[municipio]
// Ej: /categorias/restaurantes/sopetran -> Restaurantes en Sopetran
//     /categorias/transportes-and-encomiendas/sopetran -> Mototaxis en Sopetran

interface Props {
  params: Promise<{ slug: string; municipio: string }>;
}

export const revalidate = 3600;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

const MUNICIPIOS: Record<string, string> = {
  "sopetran": "Sopetrán",
  "san-jeronimo": "San Jerónimo",
  "santa-fe-de-antioquia": "Santa Fe de Antioquia",
  "liborina": "Liborina",
  "olaya": "Olaya",
};

const MUNICIPIOS_LIST = ["Sopetrán", "San Jerónimo", "Santa Fe de Antioquia", "Liborina", "Olaya"];
const MUNICIPIOS_SLUG: Record<string, string> = {
  "Sopetrán": "sopetran",
  "San Jerónimo": "san-jeronimo",
  "Santa Fe de Antioquia": "santa-fe-de-antioquia",
  "Liborina": "liborina",
  "Olaya": "olaya",
};

function formatMunicipio(slug: string) {
  return MUNICIPIOS[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}
function formatSlugText(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}
function normalize(t: string) { return (t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(); }
function stripHtmlAndTruncate(text: string, max: number) {
  if (!text) return "";
  const c = text.replace(/(<([^>]+)>)/gi,"").replace(/\s+/g," ").trim();
  return c.length > max ? c.substring(0,max-3).trimEnd()+"..." : c;
}
function toJsonLd(d: unknown){ return JSON.stringify(d).replace(/</g,"\\u003c"); }
function getSlugText(s:any){ return !s ? "" : typeof s==="object" ? s.current||"" : s; }

const getBusinessesBySlug = cache(async (slug: string) => {
  const result = await client.fetch(BUSINESS_BY_SUBCATEGORY_QUERY, { slug });
  return (result ?? []) as any[];
});

function resolveCategoryName(slug: string, businesses: any[]): string {
  const fallback = formatSlugText(slug);
  if (!businesses.length) return fallback;
  const first = businesses[0];
  return first.category?.slug?.current === slug ? first.category.name : first.subcategory?.name || first.category?.name || fallback;
}

function filterByMunicipio(businesses: any[], municipioSlug: string) {
  const nombre = formatMunicipio(municipioSlug);
  const target = normalize(nombre);
  return businesses.filter((b:any) => normalize(b.city || b.municipality?.name || "") === target);
}

function detectNiche(c: string) {
  const n = normalize(c);
  const has = (...w:string[]) => w.some(x=>n.includes(x));
  if (has("alojamiento","finca","glamping","hotel","hospedaje")) return "lodging";
  if (has("barberia","peluqueria","estetica")) return "beauty";
  if (has("licorera","discoteca","rumba","bares")) return "nightlife";
  if (has("restaurante","comidas rapidas","comida","donde comer")) return "food";
  if (has("supermercado","tienda")) return "shopping";
  if (has("mototaxi","domicilios","transporte","encomienda")) return "transport";
  if (has("farmacia","drogueria","salud")) return "health";
  return "general";
}

function buildDesc(categoryName:string, count:number, municipio:string) {
  const n = count>0 ? `${count} ` : "";
  const map: Record<string,string> = {
    food: `${n}restaurantes en ${municipio} con domicilio a fincas y veredas. Menus y WhatsApp directo.`,
    nightlife: `${n}licoreras en ${municipio} con domicilio, horarios y WhatsApp directo.`,
    lodging: `${n}fincas y hospedaje en ${municipio} con piscina y BBQ. Reserva directa.`,
    beauty: `${n}barberias en ${municipio} con citas por WhatsApp.`,
    transport: `${n}mototaxis y domicilios en ${municipio} 24h. Servicio rapido por WhatsApp.`,
    health: `${n}farmacias en ${municipio} con domicilio.`,
    shopping: `${n}supermercados en ${municipio} con domicilio.`,
    general: `${n}${categoryName} en ${municipio}. Telefono y WhatsApp directo en Ooasys.`,
  };
  return stripHtmlAndTruncate(map[detectNiche(categoryName)] || map.general, 155);
}

function getFaqs(categoryName:string, municipio:string) {
  if (detectNiche(categoryName) === "transport") {
    return [
      { q: `¿Donde encontrar mototaxi en ${municipio}?`, a: `En Ooasys listamos mototaxis, domicilios y encomiendas en ${municipio} con telefono y WhatsApp directo.` },
      { q: `¿Cuánto vale un mototaxi en ${municipio}?`, a: `El precio depende de la distancia y si es dentro del pueblo o a una finca en ${municipio}. Escribele directo por WhatsApp al mototaxi en Ooasys y cotiza sin intermediarios.` },
      { q: `¿Hay mototaxis 24 horas en ${municipio}?`, a: `Si, varios mototaxis y domicilios en ${municipio} trabajan 24h. Revisa en su ficha su horario y WhatsApp.` },
    ];
  }
  if (detectNiche(categoryName) === "food") {
    return [
      { q: `¿Donde encontrar restaurantes en ${municipio}?`, a: `En Ooasys listamos ${municipio === "Liborina" ? "restaurantes en Liborina" : `restaurantes en ${municipio}`} con menu y WhatsApp directo, cerca del parque y con domicilio a fincas.` },
      { q: `¿Qué restaurantes en ${municipio} tienen domicilio?`, a: `La mayoria de restaurantes en ${municipio} hacen domicilio a fincas y veredas. Entra a su ficha y escribeles por WhatsApp para pedir menu y precios.` },
      { q: `¿Como contactar un restaurante en ${municipio}?`, a: "Usa el boton de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha. Contacto directo, sin intermediarios ni comisiones." },
    ];
  }
  return [
    { q: `¿Donde encontrar ${categoryName} en ${municipio}?`, a: `En Ooasys listamos ${categoryName} en ${municipio} con telefono y WhatsApp directo.` },
    { q: `¿Como contactar ${categoryName} en ${municipio}?`, a: "Usa el boton de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha. Contacto directo, sin intermediarios." },
    { q: `¿Hacen domicilio a fincas en ${municipio}?`, a: "Depende de cada negocio. Entra a su perfil y consultalo por 【entity-WhatsApp¦canonical_name=WhatsApp】." },
  ];
}

// ARREGLO FINAL: MOTOTAXIS + RESTAURANTES + MUNICIPIO
function getSeoTitle(categoryName:string, municipio:string) {
  if (detectNiche(categoryName) === "transport") {
    return `Mototaxis en ${municipio} 24h con WhatsApp | Ooasys`;
  }
  if (detectNiche(categoryName) === "food") {
    return `Restaurantes en ${municipio} con Domicilio y WhatsApp | Ooasys`;
  }
  return `${categoryName} en ${municipio} con WhatsApp | Ooasys`;
}

function getDisplayTitle(categoryName:string, municipio:string) {
  if (detectNiche(categoryName) === "transport") {
    return `Mototaxis, Domicilios y Encomiendas en ${municipio}`;
  }
  if (detectNiche(categoryName) === "food") {
    return `Restaurantes en ${municipio}`;
  }
  return `${categoryName} en ${municipio}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, municipio } = await params;
  const nombreMunicipio = formatMunicipio(municipio);
  const all = await getBusinessesBySlug(slug);
  const categoryName = resolveCategoryName(slug, all);
  const filtered = filterByMunicipio(all, municipio);
  const title = getSeoTitle(categoryName, nombreMunicipio);
  const description = buildDesc(categoryName, filtered.length, nombreMunicipio);
  const url = `${baseUrl}/categorias/${slug}/${municipio}`;
  return {
    metadataBase: new URL(baseUrl),
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: { "es-CO": url, es: url } },
    robots: filtered.length===0 ? { index:false, follow:true } : { index:true, follow:true },
    openGraph: { title, description, url, type:"website", siteName:"Ooasys", locale:"es_CO", images:[{url:`${baseUrl}/og-categories.png`, width:1200, height:630, alt:title}] },
    twitter: { card:"summary_large_image", title, description, images:[`${baseUrl}/og-categories.png`] },
  };
}

export default async function MunicipioPage({ params }: Props) {
  const { slug, municipio } = await params;
  const nombreMunicipio = formatMunicipio(municipio);
  const all = await getBusinessesBySlug(slug);
  const categoryName = resolveCategoryName(slug, all);
  const businesses = filterByMunicipio(all, municipio);
  const url = `${baseUrl}/categorias/${slug}/${municipio}`;
  const faqs = getFaqs(categoryName, nombreMunicipio);
  const displayTitle = getDisplayTitle(categoryName, nombreMunicipio);

  const jsonLd = {
    "@context":"https://schema.org","@type":"CollectionPage","@id":`${url}#webpage`,
    name:`${displayTitle}`, description: buildDesc(categoryName, businesses.length, nombreMunicipio), url,
    isPartOf:{"@type":"WebSite", name:"Ooasys", url: baseUrl},
    areaServed:{"@type":"City", name: nombreMunicipio},
    mainEntity:{"@type":"ItemList", numberOfItems: businesses.length, itemListElement: businesses.slice(0,10).map((b:any,i:number)=>({
      "@type":"ListItem", position:i+1, item:{"@type":"LocalBusiness", name:b.name, url:`${baseUrl}/business/${getSlugText(b.slug)}`, address:{"@type":"PostalAddress", addressLocality: b.city || nombreMunicipio, addressRegion:"Antioquia", addressCountry:"CO"}}
    }))}
  };
  const breadcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList", itemListElement:[
    {"@type":"ListItem", position:1, name:"Inicio", item: baseUrl},
    {"@type":"ListItem", position:2, name:"Categorías", item:`${baseUrl}/categorias`},
    {"@type":"ListItem", position:3, name:`${displayTitle} en Occidente Antioqueño`, item:`${baseUrl}/categorias/${slug}`},
    {"@type":"ListItem", position:4, name:`${displayTitle}`, item: url},
  ]};

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: toJsonLd(jsonLd)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: toJsonLd(breadcrumb)}} />
      <div className="container mx-auto px-4 py-8">
        <Link href={`/categorias/${slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4"/> Volver a {displayTitle} en Occidente
        </Link>
        <h1 className="text-3xl font-extrabold md:text-4xl">{displayTitle} <span className="text-primary text-2xl block md:inline font-normal">con WhatsApp directo</span></h1>
        <p className="mt-4 max-w-3xl text-foreground/80">
          {detectNiche(categoryName) === "transport" ? (
            <>Encuentra <strong>{businesses.length} mototaxis, domicilios y encomiendas en {nombreMunicipio}</strong>. ¿Buscas mototaxi cerca del parque de {nombreMunicipio}? ¿Con domicilio a fincas y veredas? Contacta directo por WhatsApp sin comisiones.</>
          ) : detectNiche(categoryName) === "food" ? (
            <>Encuentra <strong>{businesses.length} restaurantes en {nombreMunicipio}</strong>. ¿Buscas restaurante cerca del parque de {nombreMunicipio}? ¿Con domicilio a fincas y veredas? Mira menús y contacta directo por WhatsApp sin comisiones.</>
          ) : (
            <>Encuentra <strong>{businesses.length} opciones de {categoryName.toLowerCase()} en {nombreMunicipio}</strong>. ¿Buscas cerca del parque de {nombreMunicipio}? ¿Con domicilio a fincas y veredas? Contacta directo por WhatsApp sin comisiones.</>
          )}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {MUNICIPIOS_LIST.map(m=>{
            const s = MUNICIPIOS_SLUG[m];
            const active = s===municipio;
            return <Link key={m} href={`/categorias/${slug}/${s}`} className={active ? "inline-flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full" : "inline-flex items-center gap-1 text-xs border px-3 py-1.5 rounded-full"}><MapPin className="h-3 w-3"/> {m}</Link>
          })}
        </div>
        <p className="text-muted-foreground mt-4 text-sm">{businesses.length} negocios verificados en {nombreMunicipio}.</p>
        {businesses.length===0 ? (
          <div className="text-center py-20 border border-dashed rounded-3xl mt-6"><Store className="h-12 w-12 mx-auto opacity-30"/><p className="mt-4">Aun no hay {displayTitle} en {nombreMunicipio}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">{businesses.map((b:any)=><BusinessCard key={b._id} business={b}/>)}</div>
        )}
        <section className="mt-16 pt-10 border-t">
          <h2 className="text-xl font-bold flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary"/> Preguntas frecuentes sobre {displayTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">{faqs.map((f,i)=><div key={i} className="p-5 rounded-2xl border"><h3 className="font-semibold text-sm">{f.q}</h3><p className="text-xs text-muted-foreground mt-2">{f.a}</p></div>)}</div>
        </section>
      </div>
    </>
  );
}