import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { RADIO_STATIONS, STATION_IDS } from "@/components/stations/radioStations";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

// ============================================================
// 🎯 METADATA OPTIMIZADA - RADIOS DEL OCCIDENTE ANTIOQUEÑO
// ============================================================

export const metadata: Metadata = {
  title: "📻 Emisoras del Occidente Antioqueño | Radio Online Sopetrán, Santa Fe, San Jerónimo y Liborina | Ooasys",
  
  description: "🎙️ Escucha las mejores emisoras de radio en vivo desde Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina. Radio Stereo 105.4 FM, Ondas del Tonusco 104.4 FM, Global FM 89.4 FM y Plazas FM 88.9 FM. ¡Música, noticias y cultura antioqueña! 📻✨",
  
  keywords: [
    "radio online occidente antioqueño",
    "emisoras Sopetrán",
    "radio Santa Fe de Antioquia",
    "radio San Jerónimo",
    "radio Liborina",
    "Sopetrán Stereo 105.4 FM",
    "Ondas del Tonusco 104.4 FM",
    "Global FM 89.4 FM San Jerónimo",
    "Plazas FM 88.9 Liborina",
    "música popular colombiana",
    "salsa y tropical",
    "vallenato",
    "tropipop",
    "radios antioqueñas online",
    "escuchar radio gratis",
    "Ooasys radio"
  ].join(", "),
  
  authors: [{ name: "Ooasys", url: APP_URL }],
  
  alternates: {
    canonical: `${APP_URL}/estereo`,
  },
  
  openGraph: {
    title: "📻 Emisoras del Occidente Antioqueño | Radio Online en Vivo",
    description: "🎙️ Escucha Sopetrán Stereo, Ondas del Tonusco, Global FM y Plazas FM. La mejor música, noticias y entretenimiento desde Antioquia.",
    url: `${APP_URL}/estereo`,
    type: "website",
    siteName: "Ooasys",
    locale: "es_CO",
    images: [
      {
        url: `${APP_URL}/radio-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Emisoras del Occidente Antioqueño - Radio Online",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "📻 Emisoras del Occidente Antioqueño | Radio Online",
    description: "🎙️ Sopetrán Stereo, Ondas del Tonusco, Global FM y Plazas FM. ¡Música y cultura antioqueña 24/7!",
    images: [`${APP_URL}/radio-og.jpg`],
    creator: "@ooasys",
    site: "@ooasys",
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  
  verification: {
    google: "OBYw5lH6K7WSL2FDIJyNnq9oKEsYHJndvLUQmPjZWrc",
  },

  category: "entretenimiento",
};

export const viewport: Viewport = {
  themeColor: "#14B8A6",
  width: "device-width",
  initialScale: 1,
};

// ============================================================
// 🚀 SCHEMAS PARA RADIOS (ESTRUCTURADOS Y ENRIQUECIDOS)
// ============================================================

// Schema 1: ItemList - Lista de todas las emisoras
const radioStationsListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Emisoras del Occidente Antioqueño",
  "description": "Lista completa de emisoras de radio en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina. Escucha online gratis.",
  "numberOfItems": STATION_IDS.length,
  "itemListElement": STATION_IDS.map((stationId, idx) => {
    const station = RADIO_STATIONS[stationId];
    return {
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "RadioStation",
        "name": station.name,
        "description": `Emisora ${station.name} en ${station.frequency}. ${station.currentSong}.`,
        "url": `${APP_URL}/estereo`,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": station.lat,
          "longitude": station.lon
        },
        "broadcastFrequency": station.frequency,
        "broadcastFrequencyValue": {
          "@type": "QuantitativeValue",
          "value": parseFloat(station.frequency.split(" ")[0]),
          "unitCode": "Megahertz"
        },
        "areaServed": {
          "@type": "City",
          "name": station.location.split(",")[0]
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": station.location.split(",")[0],
          "addressRegion": "Antioquia",
          "addressCountry": "CO"
        },
        "audience": {
          "@type": "Audience",
          "name": "Oyentes del Occidente Antioqueño",
          "geographicArea": "Antioquia, Colombia"
        },
        "logo": `${APP_URL}/radio-logo-${stationId}.png`,
        "sameAs": []
      }
    };
  })
};

// Schema 2: WebSite con SearchAction para radios
const searchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ooasys Radios",
  "url": `${APP_URL}/estereo`,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${APP_URL}/estereo?station={station_name}`
    },
    "query-input": "required name=station_name"
  }
};

// Schema 3: Breadcrumb para radios
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": APP_URL
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Emisoras",
      "item": `${APP_URL}/estereo`
    }
  ]
};

// Schema 4: Organization (autoridad)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ooasys - Directorio del Occidente Antioqueño",
  "url": APP_URL,
  "logo": `${APP_URL}/ooasys.webp`,
  "sameAs": ["https://www.facebook.com/profile.php?id=61582100796538"],
  "description": "Directorio comercial y turístico del Occidente Antioqueño. Incluye guía de emisoras de radio locales.",
  "areaServed": ["Sopetrán", "Santa Fe de Antioquia", "San Jerónimo", "Liborina"]
};

// ============================================================
// 🎨 LAYOUT PRINCIPAL
// ============================================================

export default function RadioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Schemas JSON-LD */}
      <Script
        id="schema-radio-stations"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(radioStationsListSchema) }}
      />
      <Script
        id="schema-search-action"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
      />
      <Script
        id="schema-breadcrumb-radio"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-organization-radio"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Geo metas específicas para radios */}
      <meta name="geo.region" content="CO-ANT" />
      <meta name="geo.placename" content="Occidente Antioqueño" />

      {/* H1 oculto para SEO (refuerza keyword principal) */}
      <h1 className="sr-only">Emisoras de Radio en el Occidente Antioqueño | Sopetrán, Santa Fe, San Jerónimo y Liborina</h1>

      {/* Contenido de la página (tu componente RadioPlayer) */}
      {children}
    </>
  );
}