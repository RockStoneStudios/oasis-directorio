
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Store } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { BUSINESS_BY_SUBCATEGORY_QUERY } from "@/lib/sanity/queries";
import { BusinessCard } from "@/components/BusinessCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Revalida los negocios de esta categoría cada 60 segundos
export const revalidate = 60;

// Helper para poner bonito el texto del slug si Sanity viene vacío
function formatSlugText(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

// 🚀 1. METADATOS DINÁMICOS ENFOCADOS EN INTENCIÓN LOCAL
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Consultamos los negocios en el servidor para saber el nombre real de la categoría
  const businesses = await client.fetch(BUSINESS_BY_SUBCATEGORY_QUERY, { slug });
  
  let categoryName = formatSlugText(slug);
  if (businesses.length > 0) {
    const firstBiz = businesses[0];
    categoryName = firstBiz.category?.slug?.current === slug 
      ? firstBiz.category.name 
      : firstBiz.subcategory?.name || categoryName;
  }

 
  
  // Transformamos títulos planos en anzuelos comerciales del Occidente Antioqueño
  const title = `Los mejores ${categoryName} en el Occidente Antioqueño | Oasis`;
  const description = `¿Buscas ${categoryName.toLowerCase()}? Encuentra el listado más completo de establecimientos en Sopetrán, San Jerónimo y Santa Fe de Antioquia con teléfonos, WhatsApp y ubicación.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/categorias/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/categorias/${slug}`,
      type: "website",
      siteName: "Oasis",
      locale: "es_CO",
      images: [
        {
          url: `${baseUrl}/og-categories.png`, // Imagen general de tus categorías
          width: 1200,
          height: 630,
          alt: `Sección de ${categoryName} - Oasis`,
        },
      ],
    },
  };
}

// 🚀 2. SERVER COMPONENT PRINCIPAL
export default async function CategoryBusinessPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // La petición ocurre directamente en el servidor al cargar la URL
  const businesses = await client.fetch(BUSINESS_BY_SUBCATEGORY_QUERY, { slug });

  // Determinamos el título real
  let title = formatSlugText(slug);
  if (businesses.length > 0) {
    const firstBiz = businesses[0];
    title = firstBiz.category?.slug?.current === slug ? firstBiz.category.name : title;
  }



  // 🚀 3. DATOS ESTRUCTURADOS (JSON-LD)
  // Le dice a Google que esta página es una lista estructurada de comercios de un sector específico
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${title} en el Occidente Antioqueño`,
    "description": `Lista de comercios y locales verificados en la categoría de ${title.toLowerCase()}`,
    "url": `${baseUrl}/categorias/${slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": businesses.length,
      "itemListElement": businesses.map((business: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": business.name,
          "url": `${baseUrl}/business/${typeof business.slug === 'object' && business.slug?.current ? business.slug.current : business.slug || ""}`
        }
      }))
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Inyección del Script en el HTML nativo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reemplazamos el router.back() cliente por un Link semántico de HTML (Mejor para SEO) */}
      <Link
        href="/categorias"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Volver a categorías
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight font-heading md:text-4xl text-foreground">
          {title} <span className="text-primary text-2xl md:text-3xl block md:inline font-normal font-sans">en el Occidente</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          {businesses.length} {businesses.length === 1 ? 'negocio verificado encontrado' : 'negocios verificados encontrados'} en esta sección.
        </p>
      </div>

      {businesses.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-border/50 bg-accent/10">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" aria-hidden="true" />
          <p className="text-lg font-medium text-muted-foreground">Aún no hay negocios registrados en "{title}"</p>
          <Link href="/categorias" className="text-primary hover:underline mt-4 inline-block font-semibold">
            Explorar otras categorías del Occidente
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business: any) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}