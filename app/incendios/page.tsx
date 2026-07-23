import { Metadata } from 'next';
import IncendiosMapClient from '@/components/incendios/IncendiosMapViewComponent';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Incendios en el Occidente Antioqueño Hoy | Mapa en Tiempo Real y Alertas',
  description: 'Consulta en vivo el mapa de incendios forestales, quemas y focos de calor en el Occidente Antioqueño. Monitoreo satelital NASA FIRMS en Santa Fe de Antioquia, Sopetrán, San Jerónimo y Olaya.',
  
  keywords: [
    'incendios occidente antioqueño',
    'incendios en el occidente antioqueño hoy',
    'incendio Santa Fe de Antioquia',
    'incendios Sopetran',
    'incendio San Jeronimo hoy',
    'focos de calor Antioquia',
    'mapa de incendios forestales Colombia',
    'quemas forestales occidente antioqueño',
    'emergencias ambientales Antioquia',
    'reporte incendios Dapard Antioquia'
  ],

  authors: [{ name: 'Ooasys', url: baseUrl }],
  creator: 'Ooasys',
  publisher: 'Ooasys',
  
  alternates: {
    canonical: `${baseUrl}/incendios`,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },

  openGraph: {
    title: '🔴 Mapa de Incendios en el Occidente Antioqueño en Tiempo Real',
    description: 'Monitoreo satelital en vivo de incendios forestales y focos de calor en Santa Fe de Antioquia, Sopetrán, San Jerónimo y municipios cercanos.',
    url: `${baseUrl}/incendios`,
    siteName: 'Ooasys',
    images: [
      {
        url: `${baseUrl}/og-monitoreo-termico.jpg`,
        width: 1200,
        height: 630,
        alt: 'Mapa en tiempo real de incendios en el Occidente Antioqueño',
        type: 'image/jpeg'
      }
    ],
    locale: 'es_CO',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: '🔴 Incendios y Focos de Calor en el Occidente Antioqueño Hoy',
    description: 'Detección satelital en vivo con datos de NASA FIRMS para la subregión del Occidente Antioqueño.',
    images: [`${baseUrl}/og-monitoreo-termico.jpg`],
  },
};

export default function IncendiosPage() {
  // 🚀 SCHEMA 1: DATASET (Google Dataset Search)
  const mapDatasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${baseUrl}/incendios#dataset`,
    "name": "Mapa Satelital de Incendios y Puntos Calientes en el Occidente Antioqueño",
    "description": "Monitoreo satelital en tiempo real de incendios forestales y anomalías térmicas en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina, Olaya y el Cañón del Cauca.",
    "url": `${baseUrl}/incendios`,
    "isAccessibleForFree": true,
    "keywords": [
      "Incendios Occidente Antioqueño",
      "Focos de calor Santa Fe de Antioquia",
      "Monitoreo satelital incendios Colombia"
    ],
    "spatialCoverage": {
      "@type": "Place",
      "geo": {
        "@type": "GeoShape",
        "box": "6.200 -76.000 6.800 -75.500"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ooasys",
      "url": baseUrl
    }
  };

  // 🚀 SCHEMA 2: FAQPAGE (Clave para aparecer en paneles de respuestas de Google)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Dónde hay incendios hoy en el Occidente Antioqueño?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Puedes consultar nuestro mapa en tiempo real que recopila anomalías térmicas y focos de calor detectados por los satélites VIIRS/MODIS de la NASA FIRMS en municipios como Santa Fe de Antioquia, Sopetrán, San Jerónimo, Liborina y Olaya."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo se reporta un incendio en el Occidente Antioqueño?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "En caso de emergencia o quema fuera de control, comunícate de inmediato con la línea 123, los Bomberos de tu municipio o la Gestión del Riesgo de Antioquia (DAGRAN)."
        }
      }
    ]
  };

  // 🚀 SCHEMA 3: BREADCRUMBS
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
        "name": "Incendios en el Occidente Antioqueño",
        "item": `${baseUrl}/incendios`,
      },
    ],
  };

  return (
    <>
      {/* Schemas SEO */}
      <script
        id="incendios-dataset-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mapDatasetJsonLd) }}
      />
      <script
        id="incendios-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        id="incendios-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="min-h-screen bg-[#1C1917] text-stone-200">
        <section className="container mx-auto px-4 pt-8 pb-2">
          {/* Tag/Miga superior */}
          <span className="text-xs font-bold tracking-widest text-[#14B8A6] uppercase">
            Ooasys Directorio // Gestión Subregional
          </span>

          {/* Un solo H1 fuerte para SEO y UX */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-2">
            Incendios y Monitoreo Térmico en el Occidente Antioqueño
          </h1>

          <p className="mt-3 text-sm md:text-base text-stone-400 max-w-3xl leading-relaxed">
            Detección satelital en tiempo real de incendios forestales, quemas de vegetación y puntos calientes en
            <strong className="text-stone-200"> Santa Fe de Antioquia, Sopetrán, San Jerónimo, Liborina, Olaya</strong> y el Cañón del Cauca mediante datos de NASA FIRMS.
          </p>
        </section>

        {/* Componente del Mapa */}
        <section className="container mx-auto px-4 py-4">
          <IncendiosMapClient />
        </section>
      </main>
    </>
  );
}