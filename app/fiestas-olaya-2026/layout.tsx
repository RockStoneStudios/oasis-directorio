import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import React from 'react';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Fiestas Tradicionales de Olaya 2026 | Programación Oficial, Cultura y Música | 14-16 de Agosto",
  description: "Vive las Fiestas Tradicionales de Olaya 2026 del 14 al 16 de agosto. Programación oficial: Festival del Sancocho, Orquestas, Concursos de Talento y actividades culturales en el Parque Principal.",
  authors: [{ name: "Ooasys - Directorio Occidente" }],
  alternates: {
    canonical: "https://www.ooasys.com/fiestas-olaya-2026",
    languages: {
      'es-CO': "https://www.ooasys.com/fiestas-olaya-2026",
      'x-default': "https://www.ooasys.com/fiestas-olaya-2026",
    },
  },
  openGraph: {
    title: "Fiestas Tradicionales de Olaya 2026 | Programación Oficial",
    description: "Del 14 al 16 de agosto: Festival del Sancocho, Orquestas en vivo, Juegos Callejeros y más en el Parque Principal de Olaya.",
    url: "https://www.ooasys.com/fiestas-olaya-2026",
    type: "website",
    images: [{
      url: "https://www.ooasys.com/olaya_fiestas.png",
      alt: "Afiche oficial Fiestas de Olaya 2026",
      width: 1200,
      height: 630
    }],
    siteName: "Ooasys - Directorio Occidente",
    locale: "es_CO",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': 200,
      'max-image-preview': 'large',
    },
  },
};

const LUGAR_PRINCIPAL = {
  "@type": "Place",
  "@id": "https://www.ooasys.com/fiestas-olaya-2026#lugar-principal",
  "name": "Parque Principal de Olaya",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Parque Principal",
    "addressLocality": "Olaya",
    "addressRegion": "Antioquia",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 6.6271,
    "longitude": -75.8256
  }
};

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Fiestas Tradicionales de Olaya 2026",
  "description": "Programación oficial de las Fiestas Tradicionales de Olaya 2026. Festival del Sancocho, Orquestas en vivo, Concursos de Talento, Juegos Callejeros y actividades culturales en el Parque Principal.",
  "url": "https://www.ooasys.com/fiestas-olaya-2026",
  "inLanguage": "es-CO",
  "startDate": "2026-08-14T09:00:00-05:00",
  "endDate": "2026-08-16T23:59:00-05:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": LUGAR_PRINCIPAL,
  "image": {
    "@type": "ImageObject",
    "url": "https://www.ooasys.com/olaya/afiche-general.jpg",
    "width": 1200,
    "height": 630
  },
  "organizer": {
    "@type": "Organization",
    "name": "Alcaldía de Olaya",
    "url": "https://www.olaya-antioquia.gov.co/",
    "sameAs": [
      "https://www.facebook.com/alcaldia.olaya?locale=es_LA"
    ]
  },
  "offers": {
    "@type": "Offer",
    "name": "Evento 100% gratuito",
    "description": "Todas las actividades de las Fiestas Tradicionales de Olaya son GRATUITAS y abiertas al público.",
    "price": "0",
    "priceCurrency": "COP",
    "url": "https://www.ooasys.com/fiestas-olaya-2026",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-01-01T00:00:00-05:00"
  },
  "isAccessibleForFree": true,
  "typicalAgeRange": "0-99",

  // Sub-eventos
  "subEvent": [
    {
      "@type": "Event",
      "name": "Festival del Sancocho",
      "startDate": "2026-08-14T11:00:00-05:00",
      "endDate": "2026-08-14T15:00:00-05:00",
      "location": LUGAR_PRINCIPAL,
      "isAccessibleForFree": true,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
    },
    {
      "@type": "Event",
      "name": "Orquestas en Vivo",
      "startDate": "2026-08-14T20:00:00-05:00",
      "endDate": "2026-08-15T01:00:00-05:00",
      "location": LUGAR_PRINCIPAL,
      "isAccessibleForFree": true,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
    },
    {
      "@type": "Event",
      "name": "Concursos de Talento",
      "startDate": "2026-08-15T16:00:00-05:00",
      "endDate": "2026-08-15T19:00:00-05:00",
      "location": LUGAR_PRINCIPAL,
      "isAccessibleForFree": true,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
    },
    {
      "@type": "Event",
      "name": "Juegos Callejeros y Actividades Culturales",
      "startDate": "2026-08-16T10:00:00-05:00",
      "endDate": "2026-08-16T18:00:00-05:00",
      "location": LUGAR_PRINCIPAL,
      "isAccessibleForFree": true,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://www.ooasys.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Fiestas Olaya 2026",
      "item": "https://www.ooasys.com/fiestas-olaya-2026"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuándo son las Fiestas Tradicionales de Olaya 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las Fiestas Tradicionales de Olaya 2026 se realizan del 14 al 16 de agosto en el municipio de Olaya, Antioquia."
      }
    },
    {
      "@type": "Question",
      "name": "¿Dónde se realizan las Fiestas de Olaya?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las actividades principales se realizan en el Parque Principal de la Cabecera Municipal de Olaya, Antioquia."
      }
    },
    {
      "@type": "Question",
      "name": "¿Las Fiestas de Olaya 2026 son gratuitas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Todas las actividades de las Fiestas Tradicionales de Olaya son completamente gratuitas y abiertas al público."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué actividades hay en las Fiestas de Olaya 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La programación incluye Festival del Sancocho, Orquestas en vivo, Concursos de Talento, Juegos Callejeros y diversas actividades culturales."
      }
    },
    {
      "@type": "Question",
      "name": "¿Quién organiza las Fiestas Tradicionales de Olaya?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las fiestas son organizadas por la Alcaldía de Olaya, Antioquia."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo llegar a Olaya, Antioquia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Olaya se encuentra en el Occidente Antioqueño. Se puede llegar desde Medellín por vía terrestre pasando por Santa Fe de Antioquia o San Jerónimo."
      }
    }
  ]
};

export default function OlayaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-olaya-event"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <Script
        id="schema-olaya-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-olaya-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="fiestas-olaya-wrapper">
        {children}
      </div>
    </>
  );
}