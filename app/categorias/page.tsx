import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { CATEGORIES_WITH_COUNTS_QUERY, CATEGORIES_LIST_QUERY } from "@/lib/sanity/queries";
import { Store, HelpCircle } from "lucide-react";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { ClientBackButton } from "@/components/ui/ClientBackButton";

// Revalida los datos de Sanity automáticamente cada 60 segundos
export const revalidate = 60;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

// Preguntas frecuentes generales del directorio para Rich Snippets y Alta Conversión
const GENERAL_FAQS = [
  {
    q: "¿Qué tipo de comercios y servicios puedo encontrar en Ooasys?",
    a: "En Ooasys encuentras un directorio verificado con opciones de restaurantes, alquiler de fincas de recreo, glamping, hoteles, licoreras, droguerías, barberías, agroinsumos, mototaxis y servicios técnicos en el Occidente Antioqueño."
  },
  {
    q: "¿Qué municipios del Occidente Antioqueño cubre la plataforma?",
    a: "Cubrimos con información verificada los municipios de Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya."
  },
  {
    q: "¿Es seguro reservar fincas, glampings o contratar servicios en Ooasys?",
    a: "Sí. Ooasys valida la existencia de los negocios listados. Te conectamos directamente a través de WhatsApp o llamada telefónica con el propietario o administrador, evitando intermediarios dudosos y reduciendo el riesgo de estafas."
  }
];

// 🚀 METADATOS ULTRA OPTIMIZADOS PARA EL OCCIDENTE ANTIOQUEÑO (SEO & CTR)
export async function generateMetadata(): Promise<Metadata> {
  const title = "✅ Directorio de Categorías en el Occidente Antioqueño | Ooasys";
  const description =
    "Explora negocios y servicios verificados en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya. Encuentra fincas de recreo, glamping, restaurantes, transporte y más.";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: [
      // Búsquedas generales
      "directorio comercial occidente antioqueño",
      "negocios en Sopetrán",
      "servicios en San Jerónimo",
      "comercio Santa Fe de Antioquia",
      "turismo Liborina",
      "negocios en Olaya",
      "categorías de negocios Antioquia",
      "directorio empresarial Ooasys",

      // Intenciones transaccionales de alto valor
      "alquiler de fincas en San Jerónimo",
      "fincas de recreo Sopetrán",
      "glamping en Santa Fe de Antioquia",
      "dónde comer occidente antioqueño",
      "restaurantes con piscina San Jerónimo",
      "hoteles en Santa Fe de Antioquia",
      "domicilios y mototaxis Sopetrán",
      "servicios técnicos en San Jerónimo"
    ],
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
      userScalable: true,
    },
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
      date: false,
      url: false,
    },
    applicationName: "Ooasys",
    appleWebApp: {
      capable: true,
      title: "Ooasys Direct",
      statusBarStyle: "black-translucent",
    },
    alternates: {
      canonical: `${baseUrl}/categorias`,
      languages: {
        "es-CO": `${baseUrl}/categorias`,
        es: `${baseUrl}/categorias`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": 200,
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
      url: `${baseUrl}/categorias`,
      type: "website",
      siteName: "Ooasys",
      locale: "es_CO",
      images: [
        {
          url: `${baseUrl}/og-categories.png`,
          width: 1200,
          height: 630,
          alt: "Directorio General de Categorías en el Occidente Antioqueño - Ooasys",
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

export default async function CategoriasPage() {
  // Peticiones en paralelo directo en el servidor (Carga instantánea)
  const [categoriesData, categoriesWithSubsData] = await Promise.all([
    client.fetch(CATEGORIES_WITH_COUNTS_QUERY),
    client.fetch(CATEGORIES_LIST_QUERY),
  ]);

  // 🚀 SCHEMA 1: GUÍA DE BÚSQUEDA Y COLECCIÓN
  const guideJsonLd = {
    "@context": "https://schema.org",
    "@type": "Guide",
    "@id": `${baseUrl}/categorias#guide`,
    "name": "Guía Comercial y Turística del Occidente Antioqueño - Ooasys",
    "description":
      "Clasificación oficial de establecimientos comerciales, gastronómicos, hospedajes, fincas de recreo y servicios en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya.",
    "url": `${baseUrl}/categorias`,
    "inLanguage": "es-CO",
    "areaServed": [
      { "@type": "City", "name": "Sopetrán" },
      { "@type": "City", "name": "San Jerónimo" },
      { "@type": "City", "name": "Santa Fe de Antioquia" },
      { "@type": "City", "name": "Liborina" },
      { "@type": "City", "name": "Olaya" },
      { "@type": "AdministrativeArea", "name": "Occidente Antioqueño" }
    ],
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": categoriesData?.length || 0,
      "itemListElement": (categoriesData || []).map((cat: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": `${cat.name} en el Occidente Antioqueño`,
        "url": `${baseUrl}/categorias/${cat.slug?.current || ""}`
      }))
    }
  };

  // 🚀 SCHEMA 2: MIGA DE PAN (BREADCRUMB LIST)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categorías",
        "item": `${baseUrl}/categorias`,
      },
    ],
  };

  // 🚀 SCHEMA 3: PREGUNTAS FRECUENTES (FAQ PAGE)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": GENERAL_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <div className="bg-linear-to-b from-accent/10 via-background to-background min-h-screen relative">
      {/* Inyección Semántica en el Head para los robots de Google */}
      <script
        id="guide-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }}
      />
      <script
        id="breadcrumb-main-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        id="faq-general-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Header Atractivo y Regional */}
      <header className="relative overflow-hidden border-b border-border/40 bg-background/60 backdrop-blur-md py-12 md:py-16">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        <div className="container mx-auto px-4">
          
          {/* 👑 Top Bar del Header: Distribución limpia de 3 columnas para el botón y el icono */}
          <div className="grid grid-cols-3 items-center mb-6 w-full max-w-2xl mx-auto">
            {/* Columna Izquierda: Espacio exacto controlado para el botón de regreso */}
            <div className="flex items-center justify-start">
              <div className="w-10 h-10 shrink-0">
                <ClientBackButton />
              </div>
            </div>

            {/* Columna Central: Icono de la Tienda perfectamente alineado */}
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm flex">
                <Store className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>

            {/* Columna Derecha: Bloque espaciador para equilibrar el centrado exacto */}
            <div className="w-10 h-10 pointer-events-none invisible justify-self-end" />
          </div>

          {/* Textos del Hero */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight font-heading sm:text-5xl md:text-6xl text-foreground">
              Explora por <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">Categorías</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              ¿Buscas dónde comer, alquilar una finca de recreo sin estafas o un servicio confiable en el Occidente Antioqueño? Selecciona un sector y contacta directamente a locales verificados en Sopetrán, San Jerónimo, Santa Fe, Liborina y Olaya.
            </p>
          </div>

        </div>
      </header>

      {/* Grilla interactiva del lado del cliente */}
      <main className="container mx-auto px-4 py-10 md:py-14">
        <CategoryGrid 
          initialCategories={categoriesData || []} 
          categoriesWithSubs={categoriesWithSubsData || []} 
        />

        {/* 🚀 Sección Visual de Preguntas Frecuentes */}
        <section className="mt-16 pt-10 border-t border-border/60">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">
              Preguntas Frecuentes sobre el Directorio
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GENERAL_FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm">
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