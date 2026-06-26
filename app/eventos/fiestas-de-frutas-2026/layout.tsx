import { Metadata } from 'next';
import Script from 'next/script';

// ============================================================
// 🎯 METADATA OPTIMIZADA PARA POSICIONAR #1 - OOASYS
// ============================================================

export const metadata: Metadata = {
  // Title optimizado con keywords principales y power words
  title: "Fiestas de las Frutas Sopetrán 2026: Programación Oficial | Conciertos, Desfiles y Eventos GRATIS | Ooasys",
  
  // Description con CTA y keywords clave (máximo 155-160 caracteres)
  description: "📅 Programación COMPLETA de las Fiestas de las Frutas Sopetrán 2026. Conciertos de Arelys Henao, El Combo de las Estrellas, desfile de silleteros y más. ¡TODO GRATIS! Del 23 al 29 de junio. Guía oficial de Ooasys.",
  
  // Keywords expandidas (densidad semántica controlada)
  keywords: [
    "Fiestas de las Frutas Sopetrán 2026",
    "programación fiestas de las frutas",
    "conciertos Sopetrán 2026",
    "Arelys Henao Sopetrán",
    "desfile de silleteros Sopetrán",
    "eventos Sopetrán junio 2026",
    "qué hacer en Sopetrán",
    "fiestas tradicionales Antioquia",
    "Sopetrán turismo",
    "occidente antioqueño eventos",
    "festival del sancocho Sopetrán",
    "Fiestas de las Frutas programación día por día",
    "Ooasys eventos",
    "directorio occidente antioqueño"
  ].join(", "),
  
  authors: [{ name: "Ooasys", url: "https://www.ooasys.com" }],
  
  // Canonical actualizada con URL correcta
  alternates: {
    canonical: "https://www.ooasys.com/eventos/fiestas-de-las-frutas-2026",
    languages: {
      'es-CO': 'https://www.ooasys.com/eventos/fiestas-de-las-frutas-2026',
      'es': 'https://www.ooasys.com/eventos/fiestas-de-las-frutas-2026',
    },
  },
  
  // OpenGraph optimizado
  openGraph: {
    title: "🎉 Fiestas de las Frutas Sopetrán 2026 | Programación Oficial GRATIS | Ooasys",
    description: "La guía DEFINITIVA del evento más esperado en Sopetrán: 7 días de conciertos, desfiles, bailes y frutas tropicales. ¡Agenda 2026!",
    url: "https://www.ooasys.com/eventos/fiestas-de-las-frutas-2026",
    type: "website",
    images: [
      { 
        url: "https://www.ooasys.com/fiestas-frutas-og.png", 
        alt: "Fiestas de las Frutas Sopetrán 2026 - Programación Oficial Ooasys",
        width: 1200,
        height: 630
      }
    ],
    siteName: "Ooasys",
    locale: "es_CO",
    determiner: "auto",
  },
  
  // Twitter Card optimizada
  twitter: {
    card: "summary_large_image",
    title: "🎶 Fiestas de las Frutas Sopetrán 2026: Programación y Conciertos | Ooasys",
    description: "Del 23 al 29 de junio: Arelys Henao, El Combo de las Estrellas, desfile de silleteros y mucho más. ¡TODO GRATUITO!",
    images: ["https://www.ooasys.com/fiestas-frutas-og.png"],
    creator: "@ooasys",
    site: "@ooasys",
  },
  
  // Robots avanzados
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
  
  // Verificación para Google Search Console
  verification: {
    google: "OBYw5lH6K7WSL2FDIJyNnq9oKEsYHJndvLUQmPjZWrc", // Agrega tu código de Ooasys
  },
  
  // Categoría
  category: "eventos culturales",
  
  // Apple y móviles
  appleWebApp: {
    capable: true,
    title: "Fiestas de las Frutas",
    statusBarStyle: "black-translucent",
  },
  
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
};

// ============================================================
// 📅 ARTISTAS CONFIRMADOS
// ============================================================

const performersList = [
  { name: "Arelys Henao", day: "Viernes 26 de Junio", genre: "Música popular", time: "10:00 PM", stage: "Tarima Principal" },
  { name: "El Combo de las Estrellas", day: "Sábado 27 de Junio", genre: "Salsa y tropical", time: "08:00 PM", stage: "Tarima Principal" },
  { name: "Alex Manga", day: "Domingo 28 de Junio", genre: "Vallenato", time: "08:30 PM", stage: "Tarima Principal" },
  { name: "Tropinova", day: "Viernes 26 de Junio", genre: "Tropipop", time: "08:00 PM", stage: "Tarima Principal" },
  { name: "Grupo Caneo", day: "Domingo 28 de Junio", genre: "Salsa", time: "07:00 PM", stage: "Tarima Principal" },
];

// ============================================================
// 🎯 SCHEMA PRINCIPAL: EVENTO - OOASYS
// ============================================================

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": "https://www.ooasys.com/eventos/fiestas-de-las-frutas-2026#event",
  "name": "Fiestas de las Frutas Sopetrán 2026",
  "description": "Semana de música, baile, desfiles y muestras frutícolas en Sopetrán, Antioquia. El evento cultural más importante del occidente antioqueño. CONCIERTOS GRATUITOS con artistas nacionales. Guía oficial de Ooasys.",
  "url": "https://www.ooasys.com/eventos/fiestas-de-las-frutas-2026",
  "startDate": "2026-06-23T09:00:00-05:00",
  "endDate": "2026-06-29T23:59:59-05:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Parque Principal de Sopetrán",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Carrera 10 # 8-25, Parque Principal",
      "addressLocality": "Sopetrán",
      "addressRegion": "Antioquia",
      "postalCode": "051440",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.500893,
      "longitude": -75.742225
    }
  },
  "image": [
    "https://www.ooasys.com/images/fiestas-frutas-2026-banner.png",
    "https://www.ooasys.com/images/fiestas-frutas-artistas.jpg"
  ],
  "performer": performersList.map(p => ({
    "@type": "MusicGroup",
    "name": p.name,
    "description": `${p.genre} - ${p.day} a las ${p.time}`
  })),
  "organizer": {
    "@type": "GovernmentOrganization",
    "name": "Alcaldía de Sopetrán",
    "url": "https://www.sopetran-antioquia.gov.co",
    "email": "contacto@sopetran-antioquia.gov.co"
  },
  "offers": {
    "@type": "Offer",
    "name": "Evento 100% gratuito",
    "description": "Todos los eventos son completamente GRATUITOS. Entrada libre y abierta al público.",
    "price": "0",
    "priceCurrency": "COP",
    "url": "https://www.ooasys.com/eventos/fiestas-de-las-frutas-2026",
    "availability": "https://schema.org/InStock"
  },
  "doorTime": "2026-06-23T08:00:00-05:00",
  "typicalAgeRange": "0-99",
  "isAccessibleForFree": true,
  "accessibilityInformation": "Rampas de acceso en el Parque Principal, zonas de descanso para adultos mayores."
};

// ============================================================
// ❓ FAQ SCHEMA (para featured snippets)
// ============================================================

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuándo son las Fiestas de las Frutas en Sopetrán 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las Fiestas de las Frutas Sopetrán 2026 se celebran del 23 al 29 de junio de 2026, según la guía oficial de Ooasys."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué artistas se presentan en las Fiestas de las Frutas 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Artistas confirmados: Arelys Henao (viernes 26), El Combo de las Estrellas (sábado 27), Alex Manga (domingo 28), Tropinova (viernes 26) y Grupo Caneo (domingo 28)."
      }
    },
    {
      "@type": "Question",
      "name": "¿Las Fiestas de las Frutas son gratis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, el 100% de los eventos son completamente gratuitos según la programación oficial de Ooasys."
      }
    },
    {
      "@type": "Question",
      "name": "¿Dónde queda el Parque Principal de Sopetrán?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El Parque Principal de Sopetrán está ubicado en el centro del municipio, en la Carrera 10 con Calle 8."
      }
    }
  ]
};

// ============================================================
// 🏢 ORGANIZATION SCHEMA - OOASYS
// ============================================================

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ooasys",
  "url": "https://www.ooasys.com",
  "logo": "https://www.ooasys.com/logo.png",
  "sameAs": [
    "https://www.facebook.com/ooasys",
    "https://www.instagram.com/ooasys"
  ],
  "description": "Directorio de negocios locales en el Occidente Antioqueño. Guía de eventos, restaurantes, hoteles y más."
};

// ============================================================
// 🎨 LAYOUT COMPONENT
// ============================================================

export default function FiestasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Schema 1: Evento principal */}
      <Script
        id="schema-event-fiestas"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      
      {/* Schema 2: FAQ para featured snippets */}
      <Script
        id="schema-faq-fiestas"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Schema 3: Organization para E-E-A-T */}
      <Script
        id="schema-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      {/* Link alternates */}
      <link rel="alternate" href="https://www.ooasys.com/eventos/fiestas-de-las-frutas-2026" hrefLang="es-co" />
      <link rel="alternate" href="https://www.ooasys.com/eventos/fiestas-de-las-frutas-2026" hrefLang="es" />
      <link rel="alternate" href="https://www.ooasys.com/eventos/fiestas-de-las-frutas-2026" hrefLang="x-default" />
      
      {/* Preconnect para velocidad */}
      <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google.com" />
      
      {/* H1 oculto para SEO */}
      <h1 className="sr-only">Fiestas de las Frutas Sopetrán 2026: Programación oficial con conciertos, desfile de silleteros y actividades para toda la familia | Guía Ooasys</h1>
      
      {/* Contenido de la página */}
      {children}
    </>
  );
}