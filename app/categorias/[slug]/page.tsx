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

function formatSlugText(slug: string): string {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

function stripHtmlAndTruncate(text: string, maxLength: number): string {
  if (!text) return "";
  const strippedText = text.replace(/(<([^>]+)>)/gi, "");
  const cleanedText = strippedText.replace(/\s+/g, " ").trim();
  return cleanedText.length > maxLength
    ? cleanedText.substring(0, maxLength) + "..."
    : cleanedText;
}

// Lista maestra de municipios atendidos
const MUNICIPIOS = [
  "Sopetrán",
  "San Jerónimo",
  "Santa Fe de Antioquia",
  "Liborina",
  "Olaya"
];

// ============================================================================
// 🎯 KEYWORDS ADAPTADAS Y OPTIMIZADAS POR CATEGORÍA
// ============================================================================
function getKeywordsByCategory(categoryName: string, slug: string): string[] {
  const cat = categoryName || "";
  const keywords: string[] = [];

  // 1. COMIDAS Y RESTAURANTES
  if (cat.includes("Restaurante") || cat.includes("Comidas rapidas") || cat.includes("comida")) {
    keywords.push(
      "restaurantes en Sopetrán", "restaurantes en San Jerónimo", "restaurantes en Santa Fe de Antioquia", "dónde comer en Liborina", "comidas rápidas en Olaya",
      "dónde comer en el occidente antioqueño", "comidas rápidas a domicilio", "hamburguesas a domicilio occidente antioqueño",
      "mejores restaurantes San Jerónimo", "almuerzos económicos Santa Fe de Antioquia", "restaurantes Liborina"
    );
  }
  // 2. RUMBA Y DIVERSIÓN
  else if (cat.includes("Discoteca") || cat.includes("Licoreras") || cat.includes("Restaurante & Bar") || cat.includes("bar")) {
    keywords.push(
      "discotecas en Sopetrán", "bares en San Jerónimo", "rumba en Santa Fe de Antioquia", "dónde tomar en Liborina", "licoreras en Olaya",
      "vida nocturna occidente antioqueño", "licoreras 24 horas San Jerónimo", "mejores discotecas Santa Fe de Antioquia", "rumba fin de semana Sopetrán"
    );
  }
  // 3. COMPRAS Y SUPERMERCADOS
  else if (cat.includes("Supermercado & Domicilios") || cat.includes("Tienda") || cat.includes("compras")) {
    keywords.push(
      "supermercados en Sopetrán", "supermercados en San Jerónimo", "tiendas en Santa Fe de Antioquia", "abarrotes Liborina", "supermercados Olaya",
      "dónde comprar en el occidente antioqueño", "tiendas 24 horas Sopetrán", "minimercados San Jerónimo"
    );
  }
  // 4. BARBERÍA Y ESTÉTICA
  else if (cat.includes("Barberia") || cat.includes("Peluqueria")) {
    keywords.push(
      "barberías en Sopetrán", "barberías en San Jerónimo", "peluquerías en Santa Fe de Antioquia", "corte de cabello Liborina", "barberías Olaya",
      "mejor barbero occidente antioqueño", "corte de barba Santa Fe de Antioquia"
    );
  }
  // 5. TRANSPORTE Y DOMICILIOS
  else if (cat.includes("Mototaxista") || cat.includes("Domicilios & Encomiendas") || cat.includes("Transporte")) {
    keywords.push(
      "mototaxis Sopetrán", "mototaxis San Jerónimo", "domicilios Santa Fe de Antioquia", "transporte Liborina", "moto taxi Olaya",
      "domicilios occidente antioqueño", "mandados y encomiendas Sopetrán", "transporte intermunicipal occidente antioqueño"
    );
  }
  // 6. TRASTEOS Y MUDANZAS
  else if (cat.includes("Trasteos & Transporte de Carga") || cat.includes("Mudanzas")) {
    keywords.push(
      "trasteos en Sopetrán", "mudanzas en San Jerónimo", "fletes Santa Fe de Antioquia", "trasteos Liborina", "mudanzas Olaya",
      "transporte de carga occidente antioqueño", "trasteos económicos San Jerónimo", "camión de mudanza Santa Fe"
    );
  }
  // 7. SALUD Y FARMACIAS
  else if (cat.includes("Farmacias") || cat.includes("Odontologia") || cat.includes("Salud")) {
    keywords.push(
      "farmacias en Sopetrán", "droguerías en San Jerónimo", "dentista Santa Fe de Antioquia", "farmacias Liborina", "droguerías Olaya",
      "farmacias de turno occidente antioqueño", "odontología San Jerónimo", "atención médica Santa Fe de Antioquia"
    );
  }
  // 8. BÁSICOS Y EMERGENCIAS
  else if (cat.includes("Basicos") || cat.includes("Policia") || cat.includes("Bomberos")) {
    keywords.push(
      "policía Sopetrán", "bomberos San Jerónimo", "emergencias Santa Fe de Antioquia", "números de emergencia Liborina", "estación de policía Olaya",
      "líneas de emergencia occidente antioqueño", "comisaría de familia Sopetrán"
    );
  }
  // 9. RELIGIÓN
  else if (cat.includes("Religion") || cat.includes("Parroquia") || cat.includes("Iglesia")) {
    keywords.push(
      "parroquia Sopetrán", "iglesia San Jerónimo", "catedral Santa Fe de Antioquia", "horarios de misa Liborina", "parroquia Olaya",
      "misa occidente antioqueño", "eucaristía Santa Fe de Antioquia"
    );
  }
  // 10. TURISMO, VIAJES Y AVENTURA
  else if (cat.includes("Turismo") || cat.includes("Viajes") || cat.includes("Aventura") || cat.includes("Caminata")) {
    keywords.push(
      "turismo en Sopetrán", "planes en San Jerónimo", "qué hacer en Santa Fe de Antioquia", "turismo en Liborina", "sitios turísticos Olaya",
      "turismo de aventura occidente antioqueño", "alquiler de cuatrimotos San Jerónimo", "senderismo Liborina", "puente de occidente Olaya",
      "charcos y ríos en occidente antioqueño", "cabalgatas Santa Fe de Antioquia"
    );
  }
  // 11. INMOBILIARIA, HOSPEDAJE, FINCAS Y GLAMPING
  else if (
    cat.includes("Alojamiento") || 
    cat.includes("bienes raíces") || 
    cat.includes("Finca") || 
    cat.includes("Glamping") || 
    cat.includes("Inmobiliaria") || 
    cat.includes("Arriendo")
  ) {
    keywords.push(
      "alquiler de fincas en San Jerónimo", "fincas en arriendo Sopetrán", "alquiler de fincas en Santa Fe de Antioquia",
      "fincas con piscina privada en San Jerónimo", "fincas económicas Santa Fe de Antioquia", "fincas de recreo Liborina",
      "alquiler de fincas en Olaya", "fincas para eventos Occidente Antioqueño", "fincas baratas en San Jerónimo",
      "glamping en San Jerónimo", "glamping en Santa Fe de Antioquia", "glamping con jacuzzi Sopetrán",
      "cabañas boutique Occidente Antioqueño", "glamping romántico San Jerónimo", "glamping económico Santa Fe de Antioquia",
      "glamping Liborina", "glamping cerca a Medellín",
      "alquiler de fincas seguro sin estafas", "fincas verificadas Occidente Antioqueño", "reserva directa fincas San Jerónimo",
      "lotes en venta San Jerónimo", "fincas en venta Sopetrán", "inmobiliarias en Santa Fe de Antioquia",
      "casas campestres en arriendo Occidente Antioqueño"
    );
  }
  // 12. AGROINSUMOS Y ALIMENTOS ANIMALES
  else if (cat.includes("Agroinsumos") || cat.includes("Agricola") || cat.includes("Fertilizantes") || cat.includes("Concentrado")) {
    keywords.push(
      "agroinsumos en Sopetrán", "tienda agrícola San Jerónimo", "concentrados Santa Fe de Antioquia", "fertilizantes Liborina", "agroveterinaria Olaya",
      "alimento para ganado occidente antioqueño", "concentrado para mascotas San Jerónimo", "abonos agrícolas Liborina"
    );
  }
  // 13. SERVICIOS TÉCNICOS Y MANTENIMIENTO
  else if (cat.includes("Servicios") || cat.includes("Reparacion") || cat.includes("Tecnico") || cat.includes("Mantenimiento")) {
    keywords.push(
      "mantenimiento de aires Sopetrán", "técnicos en San Jerónimo", "reparación de neveras Santa Fe de Antioquia", "electricista Liborina", "plomero Olaya",
      "servicios técnicos occidente antioqueño", "instalación de gas San Jerónimo"
    );
  }
  // 14. INTERNET Y TECNOLOGÍA
  else if (cat.includes("Instalación redes WIFI") || cat.includes("Internet") || cat.includes("Wifi") || cat.includes("Tecnología")) {
    keywords.push(
      "internet para fincas Sopetrán", "instalación wifi San Jerónimo", "proveedores de internet Santa Fe de Antioquia", "redes en Liborina", "wifi rural Olaya",
      "internet occidente antioqueño", "configuración de routers fincas San Jerónimo"
    );
  }
  // CATEGORÍA GENERAL DEFAULT
  else {
    keywords.push(
      "directorio empresarial occidente antioqueño", "negocios en Sopetrán", "locales en San Jerónimo", "comercio Santa Fe de Antioquia", "guía comercial Liborina", "servicios en Olaya"
    );
  }

  // Generación automática de combinaciones por municipio
  MUNICIPIOS.forEach((muni) => {
    keywords.push(`${categoryName} en ${muni}`, `${categoryName} ${muni}`);
  });
  keywords.push(`${categoryName} Occidente Antioqueño`);

  return Array.from(new Set(keywords.filter((k) => k && k.length > 3)));
}

// ============================================================================
// 🎯 DESCRIPCIONES DE ALTO CTR ADAPTADAS
// ============================================================================
function buildCategoryDescription(categoryName: string, count: number): string {
  const cat = categoryName || "";

  if (cat.includes("Restaurante") || cat.includes("Comidas rapidas") || cat.includes("comida")) {
    return `🍔 Descubre los mejores restaurantes y comidas rápidas en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya (${count} opciones). 🚀 Menús, WhatsApp y domicilios. ¡El mejor sabor del Occidente!`;
  }
  if (cat.includes("Discoteca") || cat.includes("Licoreras") || cat.includes("Restaurante & Bar") || cat.includes("bar")) {
    return `💃 Rumba, bares y licoreras en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya. 🍻 Licores, música, horarios y ubicación exacta para tu parche en el Occidente.`;
  }
  if (cat.includes("Supermercado & Domicilios") || cat.includes("Tienda")) {
    return `🛒 Encuentra supermercados, tiendas y abarrotes en Sopetrán, San Jerónimo, Santa Fe, Liborina y Olaya (${count} disponibles). 📦 Domicilios rápidos a tu casa o finca.`;
  }
  if (cat.includes("Barberia") || cat.includes("Peluqueria")) {
    return `💇‍♂️ Barberías y peluquerías en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya. ✂️ Cortes modernos, barba y citas directas con los mejores estilistas del Occidente.`;
  }
  if (cat.includes("Mototaxista") || cat.includes("Domicilios & Encomiendas") || cat.includes("Transporte")) {
    return `🏍️ Mototaxis, transporte y domicilios en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya. 🚀 Envíos y desplazamientos seguros en todo el Occidente Antioqueño.`;
  }
  if (cat.includes("Trasteos & Transporte de Carga") || cat.includes("Mudanzas")) {
    return `🚛 Mudanzas y fletes en Sopetrán, San Jerónimo, Santa Fe, Liborina y Olaya. Transporte de carga seguro y económico en todo el Occidente Antioqueño. 📦 Cotiza hoy.`;
  }
  if (cat.includes("Farmacias") || cat.includes("Odontologia") || cat.includes("Salud")) {
    return `🦷 Farmacias 24h, odontología y atención médica en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya. 💊 Cuida tu salud con profesionales capacitados.`;
  }
  if (cat.includes("Basicos") || cat.includes("Policia") || cat.includes("Bomberos")) {
    return `🚨 Números de emergencia, policía y bomberos en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya. 📞 Información y contacto directo de instituciones esenciales.`;
  }
  if (cat.includes("Religion") || cat.includes("Parroquia") || cat.includes("Iglesia")) {
    return `⛪ Parroquias e iglesias en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya. 🙏 Horarios de misas, confesiones y actividades parroquiales del Occidente.`;
  }
  if (cat.includes("Turismo") || cat.includes("Viajes") || cat.includes("Aventura")) {
    return `🚵 Planes turísticos, cuatrimotos y aventura en Sopetrán, San Jerónimo, Santa Fe, Liborina y Olaya. 🌲 Explora los mejores destinos del Occidente Antioqueño. 🔥`;
  }
  if (
    cat.includes("Alojamiento") || 
    cat.includes("bienes raíces") || 
    cat.includes("Finca") || 
    cat.includes("Glamping") ||
    cat.includes("Inmobiliaria")
  ) {
    return `🏡 Alquiler de fincas, glamping y hospedajes verificados en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya (${count} opciones). 🏊‍♂️ Jacuzzi, piscina y reserva 100% segura sin intermediarios.`;
  }
  if (cat.includes("Agroinsumos") || cat.includes("Agricola") || cat.includes("Concentrado")) {
    return `🌱 Agroinsumos y concentrados en Sopetrán, San Jerónimo, Santa Fe, Liborina y Olaya. 🐔 Fertilizantes, semillas y alimento para mascotas y ganado en el Occidente Antioqueño.`;
  }
  if (cat.includes("Servicios") || cat.includes("Reparacion") || cat.includes("Tecnico")) {
    return `🔧 Servicios técnicos y mantenimiento en Sopetrán, San Jerónimo, Santa Fe, Liborina y Olaya. Aires acondicionados, refrigeración, plomería y electricidad. ⚡ ¡Cotiza ahora!`;
  }
  if (cat.includes("Instalación redes WIFI") || cat.includes("Internet") || cat.includes("Wifi") || cat.includes("Tecnología")) {
    return `🌐 Instalación de internet y wifi para fincas en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya. 📶 Conectividad garantizada en zonas rurales. 💻`;
  }

  return `📍 Encuentra ${categoryName} en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya (${count} opciones verificadas). 📞 Teléfonos, WhatsApp y ubicación exacta en Ooasys.`;
}

// ============================================================================
// 🎯 PREGUNTAS FRECUENTES DINÁMICAS (SEO Y ANTI-ESTAFAS)
// ============================================================================
function getCategoryFaqs(categoryName: string) {
  const cat = categoryName.toLowerCase();

  if (
    cat.includes("finca") || 
    cat.includes("glamping") || 
    cat.includes("alojamiento") || 
    cat.includes("bienes raíces") ||
    cat.includes("hospedaje")
  ) {
    return [
      {
        q: `¿Cómo alquilar una finca o glamping de forma segura en San Jerónimo, Sopetrán o Santa Fe?`,
        a: `En Ooasys todos los alojamientos, fincas de recreo y glampings listados son negocios verificados localmente. Puedes contactar directamente al propietario o administrador vía WhatsApp, evitando intermediarios dudosos y riesgos de estafa.`
      },
      {
        q: `¿Qué comodidades incluyen los alojamientos en el Occidente Antioqueño?`,
        a: `La mayoría de opciones en San Jerónimo, Sopetrán y Santa Fe de Antioquia cuentan con piscina privada, jacuzzi, zonas verdes, aire acondicionado, parrilla BBQ y conectividad WiFi para trabajo remoto.`
      },
      {
        q: `¿Hay disponibilidad de alquiler de fincas y glamping para fines de semana con puente festivo?`,
        a: `Sí, pero debido a la alta demanda turística en la subregión, te recomendamos consultar la disponibilidad y reservar directamente con el anfitrión con 2 a 4 semanas de anticipación.`
      }
    ];
  }

  return [
    {
      q: `¿Dónde encontrar establecimientos de ${categoryName} en el Occidente Antioqueño?`,
      a: `En Ooasys disponemos del directorio comercial verificado más completo con opciones de ${categoryName} distribuidos en los municipios de Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya.`
    },
    {
      q: `¿Cómo contactar directamente con un servicio de ${categoryName}?`,
      a: `Puedes hacer clic en cualquiera de los negocios listados arriba para abrir su perfil, desde donde podrás contactar por WhatsApp sin intermediarios, llamar directamente o ver su ubicación exacta.`
    },
    {
      q: `¿Ofrecen servicio a domicilio o atención en fincas de recreo?`,
      a: `La mayoría de los negocios de ${categoryName} registrados en San Jerónimo, Sopetrán y Santa Fe de Antioquia cuentan con atención directa en zona urbana y despachos a zonas rurales o fincas de descanso.`
    }
  ];
}

// ============================================================================
// 🚀 1. GENERACIÓN DE METADATOS DINÁMICOS OPTIMIZADOS
// ============================================================================
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const businesses = await client.fetch(BUSINESS_BY_SUBCATEGORY_QUERY, { slug });

  let categoryName = formatSlugText(slug);
  if (businesses.length > 0) {
    const firstBiz = businesses[0];
    categoryName =
      firstBiz.category?.slug?.current === slug
        ? firstBiz.category.name
        : firstBiz.subcategory?.name || categoryName;
  }

  const title = `✅ Los Mejores ${categoryName} en el Occidente Antioqueño | Ooasys`;
  const description = buildCategoryDescription(categoryName, businesses.length);
  const keywords = getKeywordsByCategory(categoryName, slug);
  
  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
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
      canonical: `${baseUrl}/categorias/${slug}`,
      languages: {
        "es-CO": `${baseUrl}/categorias/${slug}`,
        es: `${baseUrl}/categorias/${slug}`,
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
      url: `${baseUrl}/categorias/${slug}`,
      type: "website",
      siteName: "Ooasys",
      locale: "es_CO",
      images: [
        {
          url: `${baseUrl}/og-categories.png`,
          width: 1200,
          height: 630,
          alt: `Sección de ${categoryName} en Occidente Antioqueño - Ooasys`,
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
// 🚀 2. COMPONENTE DE PÁGINA CON SCHEMA.ORG Y SECCIÓN DE FAQ
// ============================================================================
export default async function CategoryBusinessPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const businesses = await client.fetch(BUSINESS_BY_SUBCATEGORY_QUERY, { slug });

  let title = formatSlugText(slug);
  if (businesses.length > 0) {
    const firstBiz = businesses[0];
    title =
      firstBiz.category?.slug?.current === slug ? firstBiz.category.name : title;
  }

  const categoryFaqs = getCategoryFaqs(title);

  // 🚀 Esquema de Colección
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/categorias/${slug}#webpage`,
    "name": `${title} en el Occidente Antioqueño`,
    "description": buildCategoryDescription(title, businesses.length),
    "url": `${baseUrl}/categorias/${slug}`,
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
      "numberOfItems": businesses.length,
      "itemListElement": businesses.map((business: any, index: number) => {
        const businessSlug =
          typeof business.slug === "object" && business.slug?.current
            ? business.slug.current
            : business.slug || "";

        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "LocalBusiness",
            "name": business.name,
            "description": stripHtmlAndTruncate(business.description || "", 150),
            "url": `${baseUrl}/business/${businessSlug}`,
            "image": business.logo || `${baseUrl}/og-categories.png`,
            "telephone": business.phone || undefined,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": business.address || "Occidente Antioqueño",
              "addressLocality": business.city || "Sopetrán",
              "addressRegion": "Antioquia",
              "addressCountry": "CO"
            }
          }
        };
      }),
    },
  };

  // 🚀 Esquema de Breadcrumbs
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
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `${baseUrl}/categorias/${slug}`,
      },
    ],
  };

  // 🚀 Esquema Estructurado de Preguntas Frecuentes (FAQSchema)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": categoryFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Inyección de Datos Estructurados JSON-LD */}
      <script
        id="category-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Link
        href="/categorias"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
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
          {businesses.length === 1
            ? "negocio verificado encontrado"
            : "negocios verificados encontrados"}{" "}
          en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya.
        </p>
      </div>

      {businesses.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-border/50 bg-accent/10">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" aria-hidden="true" />
          <p className="text-lg font-medium text-muted-foreground">
            Aún no hay negocios registrados en "{title}"
          </p>
          <Link
            href="/categorias"
            className="text-primary hover:underline mt-4 inline-block font-semibold"
          >
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

      {/* 🚀 Sección visual de Preguntas Frecuentes (SEO & CTR) */}
      <section className="mt-16 pt-10 border-t border-border/60">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Preguntas Frecuentes sobre {title}
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