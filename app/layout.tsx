import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/lib/sanity/live";
import { ThemeProvider } from "@/components/theme-provider";
//@ts-ignore
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const plusJakarta = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"], display: "swap", weight: ["500", "600", "700", "800"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

// ============================================================
// CONFIGURACIÓN DE VIEWPORT
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
  { name: "Sopetrán", lat: "6.500893", lng: "-75.742225", description: "Municipio del Occidente Antioqueño, conocido por sus fincas de alquiler, restaurantes y turismo de descanso." },
  { name: "Santa Fe de Antioquia", lat: "6.556944", lng: "-75.827778", description: "Ciudad colonial patrimonio de Colombia, destino gastronómico, hotelero y cultural." },
  { name: "San Jerónimo", lat: "6.442222", lng: "-75.726944", description: "Centro turístico y de alquiler de fincas de recreo en el Occidente Antioqueño." },
  { name: "Liborina", lat: "6.677778", lng: "-75.812222", description: "Municipio del Occidente Antioqueño famoso por su tradición cafetera, paisajes y turismo ecológico." },
  { name: "Olaya", lat: "6.627778", lng: "-75.812500", description: "Tradicional municipio antioqueño en las riberas del Río Cauca con destinos turísticos poco conocidos." }
];

// ============================================================
// METADATA GLOBAL OPTIMIZADA (SEO MEJORADO)
// ============================================================
export const metadata: Metadata = {
  title: {
    default: "Ooasys | Fincas, Restaurantes y Directorio del Occidente Antioqueño",
    template: "%s | Ooasys",
  },
  description: "Descubre el Occidente Antioqueño en Ooasys: fincas para alquilar, restaurantes en Sopetrán, hospedajes en San Jerónimo y comercios en Santa Fe de Antioquia. ¡Conecta por WhatsApp!",
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
    title: "Ooasys | Fincas, Restaurantes y Guía del Occidente Antioqueño",
    description: "Encuentra fincas para alquilar, los mejores restaurantes donde comer en Sopetrán y potencia la visibilidad digital de tu negocio rural.",
    images: [
      {
        url: `${APP_URL}/ooasys-banner.jpeg`,
        width: 1200,
        height: 630,
        alt: "Ooasys - Guía Comercial y Turística del Occidente Antioqueño",
      },
    ],
    url: APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ooasys | Directorio y Guía Turística del Occidente Antioqueño",
    description: "Explora fincas para alquilar, gastronomía típica y comercios locales con conexión directa por WhatsApp.",
    images: [`${APP_URL}/ooasys-banner.jpeg`],
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
      "logo": `${APP_URL}/ooasys-banner.jpeg`,
      "description": "Plataforma digital y directorio comercial para impulsar la visibilidad digital de pymes y turismo en el Occidente Antioqueño.",
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
          "name": "¿Qué puedo encontrar en la plataforma Ooasys?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "En Ooasys puedes encontrar fincas para alquilar, donde comer en Sopetrán, hoteles, restaurantes y negocios locales del Occidente Antioqueño con contacto directo por WhatsApp."
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
          "name": "¿Cómo registrar mi negocio o finca en el directorio de Ooasys?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Puedes registrar tu comercio o finca de alquiler en Ooasys para mejorar la visibilidad digital de tu negocio rural en Antioquia y recibir clientes directamente a tu WhatsApp."
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
          <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://www.google.com" />
        </head>
        <body 
          className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} font-body antialiased`}
          suppressHydrationWarning
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(unifiedGraphSchema) }}
          />
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange 
            enableColorScheme={false}
          >
            {children}
            <Toaster />
            <SanityLive />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}