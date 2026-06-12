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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

// ============================================================
// 🎯 METADATA OPTIMIZADA
// ============================================================

export const metadata: Metadata = {
  title: {
    default: "Ooasys | Directorio de Negocios en Sopetrán, Santa Fe, San Jerónimo y Liborina",
    template: "%s | Ooasys",
  },
  description: "🌴 Encuentra restaurantes, hoteles, restaurantes, tiendas y servicios profesionales en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina. Teléfonos, horarios, ubicación y contacto directo. ¡Tu guía local de confianza! 🗺️✨",
  
  keywords: [
    "Ooasys",
    "Directorio Oasis",
    "Sopetrán",
    "Santa Fe de Antioquia",
    "San Jerónimo",
    "Liborina",
    "Negocios en Sopetrán",
    "Restaurantes en Sopetrán",
    "Hoteles en Santa Fe de Antioquia",
    "Turismo San Jerónimo",
    "Qué hacer en Sopetrán",
    "Occidente Antioqueño",
    "Directorio de negocios Antioquia",
    "Negocios en Liborina",
    "Negocios en Santa fe de antioquia",
    "Negocios San jeronimo",
    "Negocios Occidente"
  ].join(", "),
  
  authors: [{ name: "Ooasys", url: APP_URL }],
  metadataBase: new URL(APP_URL),

  alternates: {
    canonical: APP_URL,
    languages: {
      'es-CO': APP_URL,
      'es': APP_URL,
    },
  },

  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Ooasys",
    title: "Ooasys | Directorio de Negocios en Sopetrán, Santa Fe, San Jerónimo y Liborina",
    description: "🌴 La guía comercial más completa del Occidente Antioqueño. Encuentra restaurantes, hoteles y servicios en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina.",
    images: [
      { 
        url: `${APP_URL}/ooasys.webp`, 
        width: 1200, 
        height: 630, 
        alt: "Ooasys - Directorio de Negocios del Occidente Antioqueño" 
      }
    ],
    url: APP_URL,
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Ooasys | Directorio de Negocios en Sopetrán, Santa Fe, San Jerónimo y Liborina",
    description: "Encuentra restaurantes, hoteles y servicios en el Occidente Antioqueño.",
    images: [`${APP_URL}/ooasys.webp`],
    creator: "@ooasys",
    site: "@ooasys",
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

  verification: {
    google: "OBYw5lH6K7WSL2FDIJyNnq9oKEsYHJndvLUQmPjZWrc",
  },

  category: "business",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#14B8A6" },
    { media: "(prefers-color-scheme: dark)", color: "#0F766E" }
  ],
  width: "device-width",
  initialScale: 1,
};

// ============================================================
// 🚀 SCHEMAS (SIN EVENT)
// ============================================================

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${APP_URL}#localbusiness`,
  "name": "Ooasys",
  "alternateName": "Directorio Oasis",
  "description": "Plataforma de directorio comercial en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina.",
  "url": APP_URL,
  "logo": `${APP_URL}/ooasys.webp`,
  "areaServed": ["Sopetrán", "Santa Fe de Antioquia", "San Jerónimo", "Liborina"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "info@ooasys.com",
    "availableLanguage": ["Spanish"]
  },
  "sameAs": ["https://www.facebook.com/profile.php?id=61582100796538"]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${APP_URL}#website`,
  "name": "Ooasys",
  "url": APP_URL,
  "description": "Directorio de negocios en el Occidente Antioqueño.",
  "inLanguage": "es-CO",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${APP_URL}/business?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

const sopetranCitySchema = {
  "@context": "https://schema.org",
  "@type": "City",
  "name": "Sopetrán",
  "description": "Municipio del Occidente Antioqueño.",
  "containedInPlace": {
    "@type": "AdministrativeArea",
    "name": "Antioquia"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "6.500893",
    "longitude": "-75.742225"
  }
};

const liborinaCitySchema = {
  "@context": "https://schema.org",
  "@type": "City",
  "name": "Liborina",
  "description": "Municipio del Occidente Antioqueño.",
  "containedInPlace": {
    "@type": "AdministrativeArea",
    "name": "Antioquia"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "6.677778",
    "longitude": "-75.812222"
  }
};

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
      "name": "Negocios",
      "item": `${APP_URL}/business`
    }
  ]
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${APP_URL}#organization`,
  "name": "Ooasys",
  "url": APP_URL,
  "logo": `${APP_URL}/ooasys.webp`,
  "sameAs": ["https://www.facebook.com/profile.php?id=61582100796538"],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "info@ooasys.com",
    "contactType": "customer service"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="canonical" href={APP_URL} />
        <link rel="alternate" href={APP_URL} hrefLang="es-co" />
        
        <meta name="geo.region" content="CO-ANT" />
        <meta name="geo.placename" content="Sopetrán" />
        
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
          id="schema-sopetran-city"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sopetranCitySchema) }}
        />
        <Script
          id="schema-liborina-city"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(liborinaCitySchema) }}
        />
        <Script
          id="schema-breadcrumb"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} font-body antialiased`}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme={false}>
            {children}
            <Toaster />
            <SanityLive />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}