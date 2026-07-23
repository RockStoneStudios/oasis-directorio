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
  ],
  authors: [{ name: 'Ooasys', url: baseUrl }],
  creator: 'Ooasys',
  publisher: 'Ooasys',
  alternates: { canonical: `${baseUrl}/incendios` },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  openGraph: {
    title: '🔴 Mapa de Incendios en el Occidente Antioqueño en Tiempo Real',
    description: 'Monitoreo satelital en vivo de incendios forestales y focos de calor en Santa Fe de Antioquia, Sopetrán, San Jerónimo y municipios cercanos.',
    url: `${baseUrl}/incendios`,
    siteName: 'Ooasys',
    images: [{ url: `${baseUrl}/og-monitoreo-termico.jpg`, width: 1200, height: 630 }],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🔴 Incendios y Focos de Calor en el Occidente Antioqueño Hoy',
    description: 'Detección satelital en vivo con datos de NASA FIRMS para el Occidente Antioqueño.',
    images: [`${baseUrl}/og-monitoreo-termico.jpg`],
  },
};

export default function IncendiosPage() {
  const mapDatasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${baseUrl}/incendios#dataset`,
    "name": "Mapa Satelital de Incendios y Puntos Calientes en el Occidente Antioqueño",
    "description": "Monitoreo satelital en tiempo real de incendios forestales y anomalías térmicas en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina, Olaya y el Cañón del Cauca.",
    "url": `${baseUrl}/incendios`,
    "isAccessibleForFree": true,
    "publisher": { "@type": "Organization", "name": "Ooasys", "url": baseUrl }
  };

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

  return (
    <>
      {/* Schemas SEO */}
      <script id="incendios-dataset-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mapDatasetJsonLd) }} />
      <script id="incendios-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="min-h-screen bg-[#0B0F17] text-stone-200">
        {/* Renderizamos directamente el mapa sin meterle un título duplicado arriba */}
        <section className="container mx-auto px-4 py-6">
          <IncendiosMapClient />
        </section>

        {/* Texto SEO y FAQ al final de la página para que Google lo lea sin ensuciar el diseño */}
        <section className="container mx-auto px-4 py-8 max-w-4xl border-t border-stone-800 my-8">
          <h2 className="text-lg font-bold mb-3 text-white"> Monitoreo de Incendios y Gestión del Riesgo</h2>
          <p className="text-sm text-stone-400 leading-relaxed">
            Esta herramienta recopila alertas térmicas en tiempo real mediante datos satelitales (NASA FIRMS) para los municipios de 
            <strong> Santa Fe de Antioquia, Sopetrán, San Jerónimo, Liborina y Olaya</strong>. Permite identificar posibles conflagraciones y quemas de cobertura vegetal en la subregión del Occidente Antioqueño.
          </p>
        </section>
      </main>
    </>
  );
}