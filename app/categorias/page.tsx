// @/app/categorias/page.tsx
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { CATEGORIES_WITH_COUNTS_QUERY, CATEGORIES_LIST_QUERY } from "@/lib/sanity/queries";
import { Store } from "lucide-react";
import { CategoryGrid } from "@/components/category/CategoryGrid";

// Revalida los datos de Sanity automáticamente cada 60 segundos
export const revalidate = 60;

// 🚀 METADATOS ULTRA ENFOCADOS EN EL OCCIDENTE ANTIOQUEÑO PARA GOOGLE
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oasis-directorio-ccg7.vercel.app";
  const title = "Categorías de Negocios en el Occidente Antioqueño | Oasis";
  const description = "Descubre los mejores comercios y servicios del Occidente Antioqueño. Encuentra dónde comer, hoteles, fincas de recreo, salud y turismo en Sopetrán, San Jerónimo, Santa Fe de Antioquia y más.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/categorias`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/categorias`,
      type: "website",
      siteName: "Oasis",
      locale: "es_CO",
      images: [
        {
          url: `${baseUrl}/oasis.png`,
          width: 1200,
          height: 630,
          alt: "Directorio de Negocios en el Occidente Antioqueño - Oasis",
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

// 🟢 Componente Cliente interno rápido para no romper la renderización del servidor de la página
import { ClientBackButton } from "@/components/ui/ClientBackButton";

export default async function CategoriasPage() {
  // Peticiones en paralelo directo en el servidor (Carga instantánea)
  const [categoriesData, categoriesWithSubsData] = await Promise.all([
    client.fetch(CATEGORIES_WITH_COUNTS_QUERY),
    client.fetch(CATEGORIES_LIST_QUERY),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oasis-directorio-ccg7.vercel.app";

  // 🚀 DATOS ESTRUCTURADOS (JSON-LD) PARA POSICIONAR LA GUÍA REGIONAL
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Guide",
    "name": "Guía Comercial y Turística del Occidente Antioqueño - Oasis",
    "description": "Clasificación oficial de establecimientos comerciales, gastronómicos, hoteles y servicios en la subregión del Occidente.",
    "url": `${baseUrl}/categorias`,
    "inLanguage": "es-CO",
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

  return (
    <div className="bg-linear-to-b from-accent/10 via-background to-background min-h-screen relative">
      {/* Inyección Semántica en el Head para los robots de Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              ¿Buscas dónde comer, un hotel con piscina o un servicio confiable en el Occidente? Selecciona un sector y descubre locales recomendados en la región.
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
      </main>
    </div>
  );
}