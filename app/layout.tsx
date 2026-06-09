import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/lib/sanity/live";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
//@ts-ignore
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const plusJakarta = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"], display: "swap", weight: ["500", "600", "700", "800"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

// ✅ URL base centralizada
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ooasys.com";

export const metadata: Metadata = {
  title: {
    default: "Ooasys | Directorio Comercial de Sopetrán, Santa Fe y San Jerónimo",
    template: "%s | Ooasys",
  },
  description:
    "🌴 Encuentra los mejores negocios, restaurantes, hoteles y servicios en Sopetrán, Santa Fe de Antioquia y San Jerónimo. Tu guía local de confianza en el Occidente Antioqueño. 🗺️✨",

  // ✅ Verificación de Google
  verification: {
    google: "OBYw5lH6K7WSL2FDIJyNnq9oKEsYHJndvLUQmPjZWrc"
  },

  // ✅ Keywords basadas en tu cobertura REAL
  keywords: [
    // Marca
    "Ooasys", "Directorio Oasis",
    
    // Municipios que SÍ cubres (Sopetrán 90% + Santa Fe + San Jerónimo)
    "Sopetrán", "Santa Fe de Antioquia", "San Jerónimo",
    "Directorio Sopetrán", "Negocios en Sopetrán", "Restaurantes en Sopetrán",
    "Hoteles en Santa Fe de Antioquia", "Turismo San Jerónimo",
    "Guía comercial Occidente Antioqueño",
    
    // Keywords de búsqueda
    "Qué hacer en Sopetrán", "Domicilios Sopetrán", "Comercio local Sopetrán",
    "Fiestas de las Frutas Sopetrán 2026", "Occidente Antioqueño"
  ],
  
  authors: [{ name: "Ooasys - Directorio del Occidente Antioqueño" }],
  metadataBase: new URL(APP_URL),

  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Ooasys",
    title: "Ooasys | Directorio de Sopetrán, Santa Fe y San Jerónimo",
    description: "🌴 Encuentra negocios, restaurantes y servicios en Sopetrán, Santa Fe de Antioquia y San Jerónimo. ¡Tu guía local de confianza! 🗺️",
    images: [{ url: `${APP_URL}/oasis.png`, width: 1200, height: 630, alt: "Ooasys - Directorio de Negocios del Occidente Antioqueño" }],
    url: APP_URL,
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Ooasys | Directorio de Sopetrán, Santa Fe y San Jerónimo",
    description: "La guía definitiva de negocios en Sopetrán, Santa Fe y San Jerónimo.",
    images: [`${APP_URL}/oasis.png`]
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
    },
  },

  alternates: {
    canonical: APP_URL,
    languages: {
      'es-CO': APP_URL,
    },
  },

  category: "business",
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#FBF9F6" }, { media: "(prefers-color-scheme: dark)", color: "#2D2824" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ✅ Schema de LocalBusiness - SOLO con los municipios que SÍ cubres
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Ooasys",
    "alternateName": "Directorio Oasis",
    "description": "Plataforma líder de directorio comercial en Sopetrán, Santa Fe de Antioquia y San Jerónimo. Conectamos negocios locales con la comunidad del Occidente Antioqueño.",
    "url": APP_URL,
    "logo": `${APP_URL}/oasis.png`,
    "image": `${APP_URL}/oasis.png`,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sopetrán",
      "addressRegion": "Antioquia",
      "addressCountry": "CO"
    },
    "areaServed": [
      "Sopetrán",
      "Santa Fe de Antioquia", 
      "San Jerónimo"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Spanish", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61582100796538"
    ]
  };

  // ✅ Schema de WebSite con búsqueda
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ooasys",
    "url": APP_URL,
    "description": "Directorio de negocios en Sopetrán, Santa Fe de Antioquia y San Jerónimo. Encuentra restaurantes, hoteles, servicios y más.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${APP_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "es-CO",
    "keywords": "Sopetrán, Santa Fe de Antioquia, San Jerónimo, Occidente Antioqueño"
  };

  // ✅ Schema de Place para Sopetrán (tu municipio principal)
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "City",
    "name": "Sopetrán",
    "description": "Municipio del Occidente Antioqueño, conocido por las Fiestas de las Frutas y su turismo.",
    "containedInPlace": {
      "@type": "AdministrativeArea",
      "name": "Antioquia",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Antioquia",
        "addressCountry": "CO"
      }
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.500893",
      "longitude": "-75.742225"
    }
  };

  // ✅ Schema de Evento para Fiestas de las Frutas (fuente de tráfico)
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Fiestas de las Frutas Sopetrán 2026",
    "description": "🎉¡La celebración más esperada de Sopetrán! Del 23 al 29 de junio de 2026, Sopetrán se viste de fiesta con conciertos, desfiles, gastronomía y muestras frutícolas. ¡Evento 100% GRATUITO! Encuentra restaurantes, hoteles y servicios en Ooasys.",
    "url": `${APP_URL}/fiestas-de-las-frutas`,
    "startDate": "2026-06-23T00:00:00-05:00",
    "endDate": "2026-06-29T23:59:59-05:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Sopetrán - Casco Urbano y Parque Principal",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Parque Principal",
        "addressLocality": "Sopetrán",
        "addressRegion": "Antioquia",
        "postalCode": "051440",
        "addressCountry": "CO"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "6.500893",
        "longitude": "-75.742225"
      }
    },
    "image": [
      `${APP_URL}/oasis.png`
    ],
    "performer": [
      { "@type": "PerformingGroup", "name": "Arelys Henao", "description": "Música popular - Viernes 26" },
      { "@type": "PerformingGroup", "name": "El Combo de las Estrellas", "description": "Salsa y tropical - Sábado 27" },
      { "@type": "PerformingGroup", "name": "Alex Manga", "description": "Vallenato - Domingo 28" },
      { "@type": "PerformingGroup", "name": "Tropinova", "description": "Tropipop - Viernes 26" },
      { "@type": "PerformingGroup", "name": "Grupo Caneo", "description": "Salsa - Domingo 28" }
    ],
    "organizer": {
      "@type": "Organization",
      "name": "Alcaldía de Sopetrán",
      "url": "https://www.sopetran-antioquia.gov.co"
    },
    "offers": {
      "@type": "Offer",
      "name": "Evento 100% gratuito",
      "price": "0",
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock",
      "description": "Todos los conciertos y actividades son completamente GRATUITOS"
    },
    "isAccessibleForFree": true
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="canonical" href={APP_URL} />
        
        {/* Geo metas para SEO local */}
        <meta name="geo.region" content="CO-ANT" />
        <meta name="geo.placename" content="Sopetrán" />
        <meta name="geo.position" content="6.500893;-75.742225" />
        <meta name="ICBM" content="6.500893, -75.742225" />
        
        {/* Datos estructurados */}
        <Script
          id="schema-localbusiness"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="schema-place"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
        />
        <Script
          id="schema-event"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} font-body antialiased`}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme={false}>
            {children}
            <Toaster />
            <SanityLive />
          </ThemeProvider>
       // </ClerkProvider>
      </body>
    </html>
  );
}