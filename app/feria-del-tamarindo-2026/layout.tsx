import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import React from 'react';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Feria del Tamarindo 2026 Santa Fe de Antioquia | Programación Oficial",
  description: "Consulta la programación oficial de la Feria del Tamarindo 2026 en Santa Fe de Antioquia: conciertos, festivales gastronómicos, desfiles y orquestas del 14 al 16 de agosto.",
  authors: [{ name: "Ooasys - Directorio Occidente" }],
  alternates: {
    canonical: "https://www.ooasys.com/feria-del-tamarindo-2026",
    languages: {
      'es-CO': "https://www.ooasys.com/feria-del-tamarindo-2026",
      'x-default': "https://www.ooasys.com/feria-del-tamarindo-2026",
    },
  },
  openGraph: {
    title: "Feria del Tamarindo 2026 | Santa Fe de Antioquia Programación",
    description: "Del 14 al 16 de agosto: Vive la Feria del Tamarindo 2026. Muestra gastronómica, emprendimientos, desfiles y grandes conciertos en el Parque Principal.",
    url: "https://www.ooasys.com/feria-del-tamarindo-2026",
    type: "website",
    images: [{ 
      url: "https://www.ooasys.com/tamarindo.jpg", 
      alt: "Afiche Oficial Feria del Tamarindo 2026 Santa Fe de Antioquia", 
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

// --- ESTRUCTURA DE EVENTOS DIARIOS (SubEvents Schema) ---
const eventosList = [
  {
    day: "Viernes 14 de Agosto",
    date: "2026-08-14",
    name: "Apertura, Desfile Inaugural y Noche Urbana/DJ's",
    description: "Desfile inaugural desde Parque Zamarra a Plaza Mayor, Feria de Emprendimiento, Rumba Aeróbica y conciertos con Gabiel Berrio, Arcángel Serna, Sabrobanda, Jaime Cano y Show Urbano."
  },
  {
    day: "Sábado 15 de Agosto",
    date: "2026-08-15",
    name: "Desfile de Modas, Vallenato y Gran Parranda",
    description: "Feria de Emprendimiento, Herencia Vallenata, Desfile de Moda 'Entre talentos, prendas y tamarindos', y conciertos en vivo con Jhon Larrea, Andrés Herrera, Crisband, Albeiro García y más."
  },
  {
    day: "Domingo 16 de Agosto",
    date: "2026-08-16",
    name: "Festival Gastronómico y Gran Cierre",
    description: "Festival Gastronómico, Muestra Cultural, Papayera en el Mercadillo de La Chinca y concierto de cierre con Jimmy Alcaraz y Los Carrileros, El Cartel y Los Hermanos Benítez."
  }
];

const LUGAR_PRINCIPAL = {
  "@type": "Place",
  "@id": "https://www.ooasys.com/feria-del-tamarindo-2026#plaza-mayor",
  "name": "Plaza Mayor Simón Bolívar (Parque Principal)",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Parque Principal",
    "addressLocality": "Santa Fe de Antioquia",
    "addressRegion": "Antioquia",
    "postalCode": "057050",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 6.556880,
    "longitude": -75.827720
  }
};

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Festival",
  "name": "Feria del Tamarindo 2026",
  "description": "Programación oficial de la Feria del Tamarindo 2026 en Santa Fe de Antioquia. Del 14 al 16 de agosto. Eventos gastronómicos, conciertos, desfiles de moda, muestras culturales y ferias de emprendimiento.",
  "url": "https://www.ooasys.com/feria-del-tamarindo-2026",
  "inLanguage": "es-CO",
  "startDate": "2026-08-14T16:30:00-05:00",
  "endDate": "2026-08-16T23:59:59-05:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": LUGAR_PRINCIPAL,
  "image": {
    "@type": "ImageObject",
    "url": "https://www.ooasys.com/feria-del-tamarindo-2026.jpg",
    "width": 1200,
    "height": 630
  },

  "subEvent": eventosList.map((e) => ({
    "@type": "Event",
    "name": `Feria del Tamarindo 2026 - ${e.day}: ${e.name}`,
    "description": e.description,
    "startDate": `${e.date}T15:00:00-05:00`,
    "endDate": `${e.date}T23:59:59-05:00`,
    "location": LUGAR_PRINCIPAL,
    "organizer": {
      "@type": "GovernmentOrganization",
      "name": "Alcaldía de Santa Fe de Antioquia",
      "url": "https://www.santafedeantioquia-antioquia.gov.co/"
    },
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "isAccessibleForFree": true
  })),

  "organizer": {
    "@type": "GovernmentOrganization",
    "name": "Alcaldía de Santa Fe de Antioquia",
    "url": "https://www.santafedeantioquia-antioquia.gov.co/"
  },

  "sponsor": [
    { "@type": "Organization", "name": "INDER Santa Fe de Antioquia" },
    { "@type": "Organization", "name": "Provincia Turística y Agroecológica del Occidente Antioqueño" },
    { "@type": "Organization", "name": "Turismo Antioquia" }
  ],

  "offers": {
    "@type": "Offer",
    "name": "Entrada Gratuita",
    "description": "Acceso libre a todos los conciertos, festivales gastronómicos y muestras culturales de la Feria del Tamarindo 2026.",
    "price": "0",
    "priceCurrency": "COP",
    "url": "https://www.ooasys.com/feria-del-tamarindo-2026",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-01-01T00:00:00-05:00",
    "validThrough": "2026-08-16T23:59:59-05:00"
  },
  "doorTime": "2026-08-14T16:30:00-05:00",
  "typicalAgeRange": "0-99",
  "isAccessibleForFree": true,
  "accessibilityInformation": "Eventos realizados en espacios públicos adaptados con acceso peatonal."
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
      "name": "Feria del Tamarindo 2026",
      "item": "https://www.ooasys.com/feria-del-tamarindo-2026"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuándo se celebra la Feria del Tamarindo 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La Feria del Tamarindo 2026 se llevará a cabo del viernes 14 al domingo 16 de agosto de 2026 en Santa Fe de Antioquia."
      }
    },
    {
      "@type": "Question",
      "name": "¿Dónde se realiza la programación de la Feria del Tamarindo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La gran mayoría de los eventos se concentran en la Plaza Mayor Simón Bolívar (Parque Principal de Santa Fe de Antioquia) y sectores icónicos como el Mercadillo de La Chinca y el Parque Zamarra."
      }
    },
    {
      "@type": "Question",
      "name": "¿Los conciertos y actividades son gratuitos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, todos los eventos culturales, conciertos, festivales gastronómicos y desfiles son de acceso público y 100% gratuitos."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué artistas se presentarán en las Fiestas del Tamarindo 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Entre los artistas confirmados destacan Jhon Larrea, Jimmy Alcaraz y Los Carrileros, Herencia Vallenata, Sabrobanda, El Cartel, Los Hermanos Benítez, Albeiro García 'El Jilguero de Occidente' y shows urbanos con DJ's en vivo."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué actividades familiares habrá en la feria?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Se destacan el Festival Gastronómico, la Feria del Emprendimiento local, el Desfile de Modas 'Entre talentos, prendas y tamarindos', la Papayera y muestras culturales tradicionales."
      }
    }
  ]
};

export default function FeriaTamarindoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-event-tamarindo"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <Script
        id="schema-breadcrumb-tamarindo"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Script
        id="schema-faq-tamarindo"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="feria-tamarindo-wrapper">
        {children}
      </div>
    </>
  );
}