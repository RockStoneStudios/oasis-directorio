import { Metadata } from 'next';
import IncendiosMapClient from '@/components/incendios/IncendiosMapViewComponent';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

// 🚀 METADATOS ENFOCADOS EN BÚSQUEDAS REALES Y DE EMERGENCIA (SEO 9.8/10)
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Incendios y Focos de Calor en el Occidente Antioqueño Hoy | Mapa en Tiempo Real',
  description: 'Consulta el mapa en vivo de incendios forestales y quema de vegetación en el Occidente Antioqueño (Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya). Datos satelitales NASA FIRMS actualizados hoy.',
  
  keywords: [
    'incendios en el occidente antioqueño',
    'incendios Santa Fe de Antioquia hoy',
    'incendios Sopetrán',
    'incendios San Jerónimo',
    'focos de calor Antioquia hoy',
    'mapa de incendios forestales Colombia',
    'quemas forestales occidente antioqueño',
    'incendio hoy en el cañon del cauca',
    'alertas de fuego Liborina',
    'NASA FIRMS Colombia',
    'emergencias ambientales Antioquia',
    'prevención de incendios Oasis'
  ],

  authors: [{ 
    name: 'Oasis',
    url: baseUrl
  }],
  
  creator: 'Oasis',
  publisher: 'Oasis',
  
  alternates: {
    canonical: `${baseUrl}/incendios`,
    languages: {
      'es-CO': `${baseUrl}/incendios`,
      'es': `${baseUrl}/incendios`
    }
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': 200,
    }
  },

  openGraph: {
    title: '🔴 Mapa de Incendios en el Occidente Antioqueño en Tiempo Real | Oasis',
    description: 'Revisa dónde hay incendios o puntos calientes detectados por satélite hoy en Sopetrán, San Jerónimo, Santa Fe de Antioquia y municipios cercanos.',
    url: `${baseUrl}/incendios`,
    siteName: 'Oasis',
    images: [
      {
        url: `${baseUrl}/og-monitoreo-termico.jpg`,
        width: 1200,
        height: 630,
        alt: 'Mapa en tiempo real de incendios y focos de calor en el Occidente Antioqueño - Oasis',
        type: 'image/jpeg'
      }
    ],
    locale: 'es_CO',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: '🔴 Incendios y Focos de Calor en el Occidente Antioqueño Hoy',
    description: 'Detección satelital en vivo de incendios en Santa Fe de Antioquia, Sopetrán, San Jerónimo y zonas aledañas con datos NASA FIRMS.',
    images: [`${baseUrl}/og-monitoreo-termico.jpg`],
  },

  appleWebApp: {
    title: 'Incendios Occidente - Oasis',
    statusBarStyle: 'black-translucent'
  },

  category: 'Emergencias y Medio Ambiente',
  classification: 'Gestión del Riesgo y Prevención de Incendios',
};

export default function IncendiosPage() {
  // 🚀 SCHEMA 1: DATASET (GOOGLE RECONOCE EL MAPA DE LA NASA EN TU SITIO)
  const mapDatasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${baseUrl}/incendios#dataset`,
    "name": "Mapa Satelital de Incendios y Puntos Calientes en el Occidente Antioqueño",
    "description": "Monitoreo y detección satelital en vivo de incendios forestales y anomalías térmicas en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya con datos de NASA FIRMS (VIIRS).",
    "url": `${baseUrl}/incendios`,
    "isAccessibleForFree": true,
    "keywords": [
      "Incendios Occidente Antioqueño",
      "Focos de Calor Santa Fe de Antioquia",
      "Monitoreo de Fuego Sopetrán",
      "NASA FIRMS Colombia"
    ],
    "spatialCoverage": {
      "@type": "Place",
      "geo": {
        "@type": "GeoShape",
        "box": "6.200 -76.000 6.800 -75.500" // Coordenadas aproximadas del Occidente Antioqueño
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Oasis",
      "url": baseUrl
    }
  };

  // 🚀 SCHEMA 2: BREADCRUMBS
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
        "name": "Mapa de Incendios Occidente Antioqueño",
        "item": `${baseUrl}/incendios`,
      },
    ],
  };

  return (
    <>
      {/* Inyección de Schemas SEO para Google */}
      <script
        id="incendios-dataset-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mapDatasetJsonLd) }}
      />
      <script
        id="incendios-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Componente del Mapa */}
      <IncendiosMapClient />
    </>
  );
}