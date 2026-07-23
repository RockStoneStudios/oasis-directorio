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
// CONFIGURACIÓN DE VIEWPORT (Next.js 14+)
// ============================================================
export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ============================================================
// CIUDADES COBERTERA
// ============================================================
const CITIES = [
  { name: "Sopetrán", lat: "6.500893", lng: "-75.742225", description: "Municipio del Occidente Antioqueño, conocido por su clima cálido y turismo de descanso." },
  { name: "Santa Fe de Antioquia", lat: "6.556944", lng: "-75.827778", description: "Ciudad colonial patrimonio de Colombia, destino gastronómico y hotelero." },
  { name: "San Jerónimo", lat: "6.442222", lng: "-75.726944", description: "Centro turístico y de fincas de recreo en el Occidente Antioqueño." },
  { name: "Liborina", lat: "6.677778", lng: "-75.812222", description: "Municipio del Occidente Antioqueño famoso por su tradición cafetera y paisajes." },
  { name: "Olaya", lat: "6.627778", lng: "-75.812500", description: "Tradicional municipio antioqueño en las riberas del Río Cauca." }
];

// ============================================================
// METADATA GLOBAL OPTIMIZADA
// ============================================================
export const metadata: Metadata = {
  title: {
    default: "Ooasys | Guía y Directorio Comercial del Occidente Antioqueño",
    template: "%s | Ooasys",
  },
  description: "🌴 Descubre y contacta los mejores hoteles, restaurantes, fincas, tiendas y servicios en Sopetrán, Santa Fe de Antioquia, San Jerónimo, Liborina y Olaya.",

  authors: [{ name: "Ooasys", url: APP_URL }],
  metadataBase: new URL(APP_URL),
  category: "Business Directory",

  alternates: {
    canonical: "/",
    languages: {
      'es-CO': "/",
      'es': "/",
      'x-default': "/",
    },
  },

  other: {
    "geo.region": "CO-ANT",
    "geo.placename": "Sopetrán, Santa Fe de Antioquia, San Jerónimo, Liborina, Olaya",
    "geo.position": "6.500893;-75.742225",
    "ICBM": "6.500893, -75.742225",
  },

  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Ooasys",
    title: "Ooasys | Guía Comercial y Turística del Occidente Antioqueño",
    description: "Encuentra teléfonos, ubicaciones y servicios de comercios en Sopetrán, Santa Fe de Antioquia y San Jerónimo.",
    images: [
      {
        url: `${APP_URL}/ooasys.webp`,
        width: 1200,
        height: 630,
        alt: "Ooasys - Guía Comercial y Turística del Occidente Antioqueño",
      },
    ],
    url: APP_URL,
  },

  twitter: {
    card: "summary_large_image",
    title: "Ooasys | Directorio de Negocios Occidente Antioqueño",
    description: "Conecta con los mejores comercios, alojamientos y servicios de la región.",
    images: [`${APP_URL}/ooasys.webp`],
    creator: "@ooasys",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: "OBYw5lH6K7WSL2FDIJyNnq9oKEsYHJndvLUQmPjZWrc",
  },
};

// ============================================================
// SCHEMA UNIFICADO CON @GRAPH
// ============================================================
const unifiedGraphSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      "name": "Ooasys",
      "url": APP_URL,
      "logo": `${APP_URL}/ooasys.webp`,
      "description": "Plataforma digital y directorio comercial del Occidente Antioqueño.",
      "areaServed": CITIES.map(c => c.name),
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61582100796538",
        "https://www.instagram.com/directoriosope/"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "info@ooasys.com",
        "contactType": "customer service",
        "availableLanguage": "Spanish"
      }
    },
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      "name": "Ooasys",
      "url": APP_URL,
      "inLanguage": "es-CO",
      "publisher": { "@id": `${APP_URL}/#organization` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${APP_URL}/business?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${APP_URL}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es Ooasys?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ooasys es la guía comercial y directorio digital interactivo que conecta comercios, turismo y servicios en el Occidente Antioqueño."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué municipios del Occidente Antioqueño cubre Ooasys?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cubre los municipios de Sopetrán, Santa Fe de Antioquia, San Jerónimo, Liborina y Olaya."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cómo puedo registrar mi negocio en el directorio de Ooasys?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Puedes registrar tu establecimiento ingresando a la plataforma de Ooasys y completando la información básica de tu comercio."
          }
        }
      ]
    },
    ...CITIES.map(city => ({
      "@type": "City",
      "name": city.name,
      "description": city.description,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": city.lat,
        "longitude": city.lng
      }
    }))
  ]
};

// ============================================================
// COMPONENTE ROOT LAYOUT
// ============================================================
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <head>
          {/* Preconexión de dominios críticos para optimizar performance (Core Web Vitals) */}
          <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://www.google.com" />

          {/* Script JSON-LD inyectado de forma estática para indexación inmediata */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(unifiedGraphSchema) }}
          />
        </head>
        <body className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} font-body antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme={false}>
            {children}
            <Toaster />
            <SanityLive />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}