import type { Metadata, Viewport } from "next";
import { RADIO_STATIONS, STATION_IDS } from "@/components/stations/radioStations";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

// ============================================================
// 🎯 METADATA OPTIMIZADA (SEO 10/10 - OASIS RADIOS)
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "Emisoras del Occidente Antioqueño en Vivo | Radio Online Sopetrán, Santa Fe, San Jerónimo",
  description: "Escucha gratis y en vivo las emisoras de radio del Occidente Antioqueño: Sopetrán Stereo 105.4 FM, Ondas del Tonusco 104.4 FM, Global FM 89.4 y Plazas FM 88.9. Música, noticias y cultura en directo.",
  
  keywords: [
    "emisoras del occidente antioqueño",
    "radio en vivo Sopetrán",
    "radio Santa Fe de Antioquia en vivo",
    "radio San Jerónimo online",
    "radio Liborina gratis",
    "Sopetrán Stereo 105.4 FM",
    "Ondas del Tonusco 104.4 FM",
    "Global FM 89.4 FM",
    "Plazas FM 88.9",
    "escuchar radio antioquia online",
    "emisoras de radio colombianas en vivo",
    "Oasis radio"
  ],
  
  authors: [{ name: "Oasis", url: APP_URL }],
  
  alternates: {
    canonical: `${APP_URL}/estereo`,
    languages: {
      "es-CO": `${APP_URL}/estereo`,
      es: `${APP_URL}/estereo`,
    },
  },
  
  openGraph: {
    title: "Emisoras del Occidente Antioqueño en Vivo | Radio Online | Oasis",
    description: "Sintoniza en directo Sopetrán Stereo, Ondas del Tonusco, Global FM y Plazas FM. La mejor música y noticias de la subregión del Occidente.",
    url: `${APP_URL}/estereo`,
    type: "website",
    siteName: "Oasis",
    locale: "es_CO",
    images: [
      {
        url: `${APP_URL}/emisoras-occidente.png`,
        width: 1200,
        height: 630,
        alt: "Emisoras de Radio en Vivo del Occidente Antioqueño - Oasis",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Emisoras del Occidente Antioqueño en Vivo | Oasis Radio",
    description: "Escucha las mejores estaciones de radio de Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina 24/7.",
    images: [`${APP_URL}/emisoras-occidente.png`],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': 200,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  
  verification: {
    google: "OBYw5lH6K7WSL2FDIJyNnq9oKEsYHJndvLUQmPjZWrc",
  },

  category: "Entretenimiento y Medios",
};

export const viewport: Viewport = {
  themeColor: "#14B8A6",
  width: "device-width",
  initialScale: 1,
};

// ============================================================
// 🚀 SCHEMAS ESTRUCTURADOS (JSON-LD ROBUSTO)
// ============================================================

// Schema 1: ItemList con BroadcastService / RadioStation
const radioStationsListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${APP_URL}/estereo#station-list`,
  "name": "Emisoras de Radio del Occidente Antioqueño",
  "description": "Directorio oficial de estaciones de radio FM en transmisión digital para Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina.",
  "numberOfItems": STATION_IDS.length,
  "itemListElement": STATION_IDS.map((stationId, idx) => {
    const station = RADIO_STATIONS[stationId];
    const freqValue = parseFloat(station.frequency.replace(/[^0-9.]/g, "")) || 0;
    const municipalityName = station.location ? station.location.split(",")[0].trim() : "Occidente Antioqueño";

    return {
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "RadioStation",
        "@id": `${APP_URL}/estereo#${stationId}`,
        "name": station.name,
        "description": `Emisora de radio ${station.name} transmitiendo desde ${municipalityName} en la frecuencia ${station.frequency}.`,
        "url": `${APP_URL}/estereo`,
        ...(station.lat && station.lon && {
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": station.lat,
            "longitude": station.lon
          }
        }),
        "broadcastFrequency": station.frequency,
        "broadcastFrequencyValue": {
          "@type": "QuantitativeValue",
          "value": freqValue,
          "unitText": "MHz"
        },
        "areaServed": {
          "@type": "City",
          "name": municipalityName
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": municipalityName,
          "addressRegion": "Antioquia",
          "addressCountry": "CO"
        },
        "audience": {
          "@type": "Audience",
          "name": "Oyentes del Occidente Antioqueño",
          "geographicArea": "Antioquia, Colombia"
        },
        "logo": `${APP_URL}/radio-logo-${stationId}.png`
      }
    };
  })
};

// Schema 2: SearchAction
const searchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${APP_URL}/#website`,
  "name": "Oasis Radios",
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

// Schema 3: Breadcrumb
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
      "name": "Radio en Vivo",
      "item": `${APP_URL}/estereo`
    }
  ]
};

// Schema 4: Organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${APP_URL}/#organization`,
  "name": "Oasis - Directorio y Guía del Occidente Antioqueño",
  "url": APP_URL,
  "logo": `${APP_URL}/oasis.png`,
  "sameAs": ["https://www.facebook.com/profile.php?id=61582100796538"],
  "description": "Directorio comercial, turístico y plataforma de radio en vivo del Occidente Antioqueño.",
  "areaServed": ["Sopetrán", "Santa Fe de Antioquia", "San Jerónimo", "Liborina", "Olaya"]
};

// ============================================================
// 🎨 LAYOUT PRINCIPAL (OPTIMIZADO PARA SSR & GOOGLEBOT)
// ============================================================

export default function RadioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Schemas JSON-LD inyectados directamente para garantizar indexación instantánea */}
      <script
        id="schema-radio-stations"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(radioStationsListSchema) }}
      />
      <script
        id="schema-search-action"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
      />
      <script
        id="schema-breadcrumb-radio"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        id="schema-organization-radio"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Meta etiquetas geográficas avanzadas */}
      <meta name="geo.region" content="CO-ANT" />
      <meta name="geo.placename" content="Occidente Antioqueño, Colombia" />

      {/* H1 accesible oculto para dar peso jerárquico a la keyword central */}
      <h1 className="sr-only">
        Emisoras de Radio en Vivo del Occidente Antioqueño | Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina
      </h1>

      {/* Contenido principal */}
      {children}
    </>
  );
}