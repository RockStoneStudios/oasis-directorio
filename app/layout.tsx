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
// CIUDADES
// ============================================================

const CITIES = [
  { name: "Sopetrán", lat: "6.500893", lng: "-75.742225", description: "Municipio del Occidente Antioqueño, conocido por las Fiestas de las Frutas." },
  { name: "Santa Fe de Antioquia", lat: "6.556944", lng: "-75.827778", description: "Ciudad colonial, patrimonio histórico de Antioquia." },
  { name: "San Jerónimo", lat: "6.442222", lng: "-75.726944", description: "Municipio del Occidente Antioqueño, destino turístico." },
  { name: "Liborina", lat: "6.677778", lng: "-75.812222", description: "Municipio del Occidente Antioqueño, tierra de café." },
  { name: "Olaya", lat: "6.627778", lng: "-75.812500", description: "Municipio del Occidente Antioqueño, reconocido por su tradición agrícola." }
];

// ============================================================
// METADATA
// ============================================================

export const metadata: Metadata = {
  title: {
    default: "Ooasys - Directorio de Negocios Occidente Antioqueño",
    template: "%s | Ooasys",
  },
  description: "🌴 Encuentra los mejores restaurantes, hoteles, tiendas y servicios en Sopetrán, Santa Fe de Antioquia, San Jerónimo, Liborina y Olaya. El directorio comercial más completo del Occidente Antioqueño.",

  authors: [{ name: "Ooasys", url: APP_URL }],
  metadataBase: new URL(APP_URL),
  category: "Local Business",

  alternates: {
    canonical: APP_URL,
    languages: { 'es-CO': APP_URL, 'es': APP_URL },
  },

  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Ooasys",
    title: "Ooasys - Directorio de Negocios del Occidente Antioqueño",
    description: "La guía comercial más completa de Sopetrán, Santa Fe y toda la región.",
    images: [{ url: `${APP_URL}/ooasys.webp`, width: 1200, height: 630, alt: "Ooasys - Directorio Occidente Antioqueño" }],
    url: APP_URL,
  },

  twitter: {
    card: "summary_large_image",
    title: "Ooasys - Directorio Occidente Antioqueño",
    description: "Encuentra y conecta con los mejores negocios de la región.",
    images: [`${APP_URL}/ooasys.webp`],
    creator: "@ooasys",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },

  verification: {
    google: "OBYw5lH6K7WSL2FDIJyNnq9oKEsYHJndvLUQmPjZWrc",
  },
};

// ============================================================
// SCHEMAS
// ============================================================

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${APP_URL}#organization`,
  "name": "Ooasys",
  "url": APP_URL,
  "logo": `${APP_URL}/ooasys.webp`,
  "description": "Directorio de negocios del Occidente Antioqueño",
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
  },
  "foundingDate": "2024"
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${APP_URL}#localbusiness`,
  "name": "Ooasys",
  "alternateName": "Directorio Sopetrán | Ooasys",
  "description": "Directorio de negocios, restaurantes, hoteles y servicios en Sopetrán, Santa Fe de Antioquia, San Jerónimo, Liborina y Olaya.",
  "url": APP_URL,
  "logo": `${APP_URL}/ooasys.webp`,
  "image": `${APP_URL}/ooasys.webp`,
  "areaServed": CITIES.map(c => c.name),
  "address": { "@type": "PostalAddress", "addressRegion": "Antioquia", "addressCountry": "CO" },
  "geo": { "@type": "GeoCoordinates", "latitude": "6.500893", "longitude": "-75.742225" },
  "telephone": "+57 3206209817",
  "priceRange": "$$",
  "foundingDate": "2024",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "08:00",
    "closes": "18:00"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${APP_URL}#website`,
  "name": "Ooasys",
  "url": APP_URL,
  "inLanguage": "es-CO",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${APP_URL}/business?search={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

const citySchemas = CITIES.map(city => ({
  "@context": "https://schema.org",
  "@type": "City",
  "name": city.name,
  "description": city.description,
  "geo": { "@type": "GeoCoordinates", "latitude": city.lat, "longitude": city.lng }
}));

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "¿Qué es Ooasys?", "acceptedAnswer": { "@type": "Answer", "text": "Ooasys es un directorio de negocios en línea que conecta a emprendedores y clientes en el Occidente Antioqueño." }},
    { "@type": "Question", "name": "¿Cómo puedo agregar mi negocio a Ooasys?", "acceptedAnswer": { "@type": "Answer", "text": "Puedes agregar tu negocio registrándote en Ooasys y completando el formulario de registro." }},
    { "@type": "Question", "name": "¿Qué municipios cubre Ooasys?", "acceptedAnswer": { "@type": "Answer", "text": "Ooasys cubre Sopetrán, Santa Fe de Antioquia, San Jerónimo, Liborina y Olaya." }},
    { "@type": "Question", "name": "¿Es gratis registrar mi negocio en Ooasys?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, el registro básico es gratuito. También tenemos planes premium." }},
    { "@type": "Question", "name": "¿Ooasys tiene aplicación móvil?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, es totalmente responsive y funciona perfectamente en móviles." }}
  ]
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${APP_URL}/sobre-nosotros`,
  "name": "Sobre Ooasys",
  "description": "Conoce más sobre Ooasys, el directorio de negocios líder en el Occidente Antioqueño.",
  "url": `${APP_URL}/sobre-nosotros`
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Directorio de Negocios",
  "provider": { "@type": "Organization", "name": "Ooasys" },
  "areaServed": CITIES.map(c => c.name),
  "description": "Directorio de negocios y servicios en el Occidente Antioqueño.",
  "availableChannel": { "@type": "ServiceChannel", "serviceUrl": APP_URL }
};

const allSchemas = [
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  ...citySchemas,
  faqSchema,
  aboutPageSchema,
  serviceSchema
];

// ============================================================
// LAYOUT
// ============================================================

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
 <head>
  <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
  <link rel="preconnect" href="https://www.google.com" />

  <link rel="canonical" href="https://www.ooasys.com/" />

  <link rel="alternate" href="https://www.ooasys.com/" hrefLang="es-co" />
  <link rel="alternate" href="https://www.ooasys.com/" hrefLang="es" />
  <link rel="alternate" href="https://www.ooasys.com/" hrefLang="x-default" />

  {/* Geo Meta Tags */}
  <meta name="geo.region" content="CO-ANT" />
  <meta 
    name="geo.placename" 
    content="Sopetrán, Santa Fe de Antioquia, San Jerónimo, Liborina, Olaya" 
  />
  <meta name="geo.position" content="6.500893;-75.742225" />
  <meta name="ICBM" content="6.500893,-75.742225" />

  {/* Structured Data - Schemas */}
  {allSchemas.map((schema, index) => (
    <Script
      key={`schema-${index}`}
      id={`schema-${index}`}
      type="application/ld+json"
      strategy="afterInteractive"        
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  ))}
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