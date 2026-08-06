import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import React from 'react';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Fiestas Patronales de Sopetrán 2026 | Programación Oficial, Misas y Procesiones",
  description: "Consulta la programación oficial de las Fiestas Patronales de Sopetrán 2026: misas, novenas, procesiones, Rosario de Aurora, horarios completos y actividades religiosas del 6 al 15 de agosto.",
  authors: [{ name: "Ooasys - Directorio Occidente" }],
  alternates: {
    canonical: "https://www.ooasys.com/fiestas-patronales-sopetran-2026",
    languages: {
      'es-CO': "https://www.ooasys.com/fiestas-patronales-sopetran-2026",
      'x-default': "https://www.ooasys.com/fiestas-patronales-sopetran-2026",
    },
  },
  openGraph: {
    title: "Fiestas Patronales Sopetrán 2026 | Virgen Morena | Misas y Procesiones",
    description: "Del 6 al 15 de agosto: Celebración de la Virgen Morena de Sopetrán. Conoce los horarios de misas, rosarios y procesiones día por día.",
    url: "https://www.ooasys.com/fiestas-patronales-sopetran-2026",
    type: "website",
    images: [{ url: "https://www.ooasys.com/images/virgen-morena.jpg", alt: "Imagen de la Virgen Morena de Sopetrán", width: 1200, height: 630 }],
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

const alferesList = [
  { name: "Familia Parra Londoño", day: "Jueves 6", date: "2026-08-06" },
  { name: "Comercio Unido de Sopetrán", day: "Viernes 7", date: "2026-08-07" },
  { name: "Yeison Paniagua y Dayana Montoya", day: "Sábado 8", date: "2026-08-08" },
  { name: "Luis Gabriel Lezcano y Dra. Tatiana Alexandra Carballo", day: "Domingo 9", date: "2026-08-09" },
  { name: "Familia Araque Carrillo", day: "Lunes 10", date: "2026-08-10" },
  { name: "Vereda Chagualal", day: "Martes 11", date: "2026-08-11" },
  { name: "Luis Gabriel Giraldo Carvajal", day: "Miércoles 12", date: "2026-08-12" },
  { name: "Vereda El Rodeo", day: "Jueves 13", date: "2026-08-13" },
  { name: "Vereda La Miranda", day: "Viernes 14", date: "2026-08-14" },
  { name: "Vereda Llano de Montaña", day: "Sábado 15", date: "2026-08-15" }
];

const LUGAR_PRINCIPAL = {
  "@type": "Place",
  "@id": "https://www.ooasys.com/fiestas-patronales-sopetran-2026#lugar-principal",
  "name": "Parroquia Nuestra Señora de la Asunción / Basílica Menor",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle 10 #11-12",
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
};

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Fiestas Patronales Virgen Morena de Sopetrán 2026",
  "description": "Programación oficial de las festividades religiosas en honor a Nuestra Señora de la Asunción (Virgen Morena) en Sopetrán, Antioquia. Del 6 al 15 de agosto de 2026. Misas, Rosarios de Aurora, Novenas y Procesiones.",
  "url": "https://www.ooasys.com/fiestas-patronales-sopetran-2026",
  "inLanguage": "es-CO",
  "startDate": "2026-08-06T06:00:00-05:00",
  "endDate": "2026-08-15T23:59:59-05:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": LUGAR_PRINCIPAL,
  "image": {
    "@type": "ImageObject",
    "url": "https://www.ooasys.com/images/virgen-morena.jpg",
    "width": 1200,
    "height": 630
  },

  "subEvent": alferesList.map((p) => ({
    "@type": "Event",
    "name": `Novena y Misa - ${p.day} (Alférez: ${p.name})`,
    // 👇 campo agregado para resolver el warning de Search Console
    "description": `Novena en honor a la Virgen Morena de Sopetrán correspondiente al ${p.day} de agosto de 2026, con la Santa Misa y el acompañamiento del alférez ${p.name}. Actividad religiosa gratuita y abierta a toda la comunidad.`,
    "startDate": `${p.date}T18:00:00-05:00`,
    "endDate": `${p.date}T20:00:00-05:00`,
    "location": LUGAR_PRINCIPAL,
    "organizer": {
      "@type": "Organization",
      "name": "Parroquia Nuestra Señora de la Asunción"
    },
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "isAccessibleForFree": true,
    "sponsor": {
      "@type": "Organization",
      "name": p.name
    }
  })),

  "sponsor": alferesList.map(p => ({
    "@type": "Organization",
    "name": p.name,
    "description": `Alférez del día ${p.day}`
  })),

  "organizer": {
    "@type": "Organization",
    "name": "Parroquia Nuestra Señora de la Asunción de Sopetrán",
    "url": "https://www.diocesisdesantafe.org/",
    "email": "parroquiasopetran@diocesisdesantafe.org",
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61582100796538",
      "https://www.instagram.com/directoriosope/"
    ]
  },
  "offers": {
    "@type": "Offer",
    "name": "Evento 100% gratuito",
    "description": "¡Todos los eventos religiosos, misas y procesiones son completamente GRATUITOS! Entrada libre.",
    "price": "0",
    "priceCurrency": "COP",
    "url": "https://www.ooasys.com/fiestas-patronales-sopetran-2026",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-01-01T00:00:00-05:00",
    "validThrough": "2026-08-15T23:59:59-05:00"
  },
  "doorTime": "2026-08-06T05:30:00-05:00",
  "typicalAgeRange": "0-99",
  "isAccessibleForFree": true,
  "accessibilityInformation": "El parque principal y las iglesias cuentan con acceso para sillas de ruedas."
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
      "name": "Fiestas Patronales Sopetrán 2026",
      "item": "https://www.ooasys.com/fiestas-patronales-sopetran-2026"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuándo son las Fiestas Patronales de Sopetrán 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las Fiestas Patronales de Sopetrán 2026 se celebran del 6 al 15 de agosto en honor a Nuestra Señora de la Asunción, conocida como la Virgen Morena de Sopetrán."
      }
    },
    {
      "@type": "Question",
      "name": "¿Dónde se realizan las Fiestas Patronales de Sopetrán?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las celebraciones religiosas se realizan principalmente en la Basílica Menor Nuestra Señora de la Asunción y en el Parque Principal del municipio de Sopetrán, Antioquia."
      }
    },
    {
      "@type": "Question",
      "name": "¿Las actividades son gratuitas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Todas las misas, novenas, rosarios, procesiones y actividades religiosas tienen entrada libre y son completamente gratuitas."
      }
    },
    {
      "@type": "Question",
      "name": "¿Dónde puedo consultar la programación oficial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En esta página encontrarás la programación oficial actualizada con los horarios de misas, novenas, procesiones, Rosario de Aurora y demás actividades religiosas de cada día."
      }
    },
    {
      "@type": "Question",
      "name": "¿Quién es la Virgen Morena de Sopetrán?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La Virgen Morena es una de las advocaciones más veneradas de Nuestra Señora de la Asunción en Antioquia y es considerada la patrona del municipio de Sopetrán, atrayendo miles de peregrinos cada año."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo llegar a la Basílica de Sopetrán?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La Basílica Menor Nuestra Señora de la Asunción se encuentra ubicada en el Parque Principal de Sopetrán, Antioquia. Se puede llegar fácilmente desde Medellín por la vía al Túnel de Occidente."
      }
    },
    {
      "@type": "Question",
      "name": "¿A qué hora comienzan las actividades religiosas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cada día cuenta con una programación diferente que incluye Rosario de Aurora, Eucaristías, Novenas y Procesiones. Consulta el cronograma completo publicado en esta página."
      }
    },
    {
      "@type": "Question",
      "name": "¿Pueden asistir niños y adultos mayores?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Las celebraciones están abiertas para personas de todas las edades y la Basílica cuenta con acceso para personas con movilidad reducida."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué es un alférez durante las fiestas patronales?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El alférez es la persona, familia, empresa o comunidad encargada de acompañar y apoyar la organización de la celebración religiosa correspondiente a un día específico de la novena."
      }
    },
    {
      "@type": "Question",
      "name": "¿Dónde hospedarse durante las Fiestas Patronales de Sopetrán?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sopetrán cuenta con hoteles, hosterías, fincas turísticas y alojamientos cercanos al Parque Principal. Debido a la alta afluencia de visitantes durante las fiestas patronales, se recomienda reservar con anticipación."
      }
    }
  ]
};

export default function FiestasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-event-patronales"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <Script
        id="schema-breadcrumb-patronales"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Script
        id="schema-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="fiestas-patronales-wrapper">
        {children}
      </div>
    </>
  );
}