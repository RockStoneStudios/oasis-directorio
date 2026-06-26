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
// 📍 CIUDADES DINÁMICAS PARA SCHEMAS
// ============================================================

const CITIES = [
  { 
    name: "Sopetrán", 
    lat: "6.500893", 
    lng: "-75.742225",
    description: "Municipio del Occidente Antioqueño, conocido por las Fiestas de las Frutas."
  },
  { 
    name: "Santa Fe de Antioquia", 
    lat: "6.556944", 
    lng: "-75.827778",
    description: "Ciudad colonial, patrimonio histórico de Antioquia."
  },
  { 
    name: "San Jerónimo", 
    lat: "6.442222", 
    lng: "-75.726944",
    description: "Municipio del Occidente Antioqueño, destino turístico."
  },
  { 
    name: "Liborina", 
    lat: "6.677778", 
    lng: "-75.812222",
    description: "Municipio del Occidente Antioqueño, tierra de café."
  }
];

// ============================================================
// 🎯 METADATA OPTIMIZADA (MEJORADA)
// ============================================================

export const metadata: Metadata = {
  title: {
    default: "Ooasys | Directorio de Negocios en Sopetrán, Santa Fe, San Jerónimo y Liborina",
    template: "%s | Ooasys",
  },
  description: "🌴 Encuentra restaurantes, hoteles, tiendas y servicios profesionales en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina. Teléfonos, horarios, ubicación y contacto directo. ¡Tu guía local de confianza! 🗺️✨",
  
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
    "Negocios Occidente",
    "Guía comercial Antioquia",
    "Directorio empresarial Occidente"
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
// 🚀 SCHEMAS MEJORADOS CON CIUDADES DINÁMICAS
// ============================================================

// 1. LocalBusiness
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${APP_URL}#localbusiness`,
  "name": "Ooasys",
  "alternateName": "Directorio Oasis",
  "description": "Plataforma de directorio comercial en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina.",
  "url": APP_URL,
  "logo": `${APP_URL}/ooasys.webp`,
  "areaServed": CITIES.map(c => c.name),
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "info@ooasys.com",
    "availableLanguage": ["Spanish"]
  },
  "sameAs": ["https://www.facebook.com/profile.php?id=61582100796538"],
  "foundingDate": "2024",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": "5",
    "unitCode": "E18"
  }
};

// 2. WebSite con búsqueda
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

// 3. City Schemas DINÁMICOS (mejora principal)
const citySchemas = CITIES.map(city => ({
  "@context": "https://schema.org",
  "@type": "City",
  "name": city.name,
  "description": city.description,
  "containedInPlace": {
    "@type": "AdministrativeArea",
    "name": "Antioquia"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": city.lat,
    "longitude": city.lng
  }
}));

// 4. BreadcrumbList mejorado
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
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Categorías",
      "item": `${APP_URL}/categories`
    }
  ]
};

// 5. Organization Schema mejorado
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${APP_URL}#organization`,
  "name": "Ooasys",
  "url": APP_URL,
  "logo": `${APP_URL}/ooasys.webp`,
  "sameAs": [
    "https://www.facebook.com/profile.php?id=61582100796538",
    "https://www.instagram.com/ooasys",
    "https://www.linkedin.com/company/ooasys"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "info@ooasys.com",
    "contactType": "customer service",
    "availableLanguage": ["Spanish"],
    "responseTime": "PT24H"
  },
  "foundingDate": "2024",
  "founder": {
    "@type": "Person",
    "name": "Fundador Ooasys"
  }
};

// 6. 🆕 FAQ Schema (NUEVO - para featured snippets)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es Ooasys?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ooasys es un directorio de negocios en línea que conecta a emprendedores y clientes en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo puedo agregar mi negocio a Ooasys?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Puedes agregar tu negocio registrándote en Ooasys y completando el formulario de registro de negocios en la sección 'Agregar Negocio'."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué municipios cubre Ooasys?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ooasys cubre los municipios de Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina en el Occidente Antioqueño."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es gratis registrar mi negocio en Ooasys?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, el registro básico en Ooasys es completamente gratuito. También ofrecemos planes premium con funcionalidades adicionales."
      }
    },
    {
      "@type": "Question",
      "name": "¿Ooasys tiene aplicación móvil?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, Ooasys cuenta con una aplicación móvil responsive que se adapta a todos los dispositivos para que puedas encontrar negocios desde tu celular."
      }
    }
  ]
};

// 7. 🆕 AboutPage Schema (NUEVO)
const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${APP_URL}/about`,
  "name": "Sobre Ooasys",
  "description": "Conoce más sobre Ooasys, el directorio de negocios líder en el Occidente Antioqueño."
};

// 8. 🆕 Service Schema (NUEVO)
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Directorio de Negocios",
  "provider": {
    "@type": "Organization",
    "name": "Ooasys"
  },
  "areaServed": CITIES.map(c => c.name),
  "description": "Directorio de negocios y servicios en el Occidente Antioqueño.",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": APP_URL
  }
};

// ============================================================
// 📦 FUNCIÓN PARA GENERAR TODOS LOS SCRIPTS DE SCHEMAS
// ============================================================

const allSchemas = [
  localBusinessSchema,
  websiteSchema,
  ...citySchemas,
  breadcrumbSchema,
  organizationSchema,
  faqSchema,
  aboutPageSchema,
  serviceSchema
];

// ============================================================
// 🎨 LAYOUT COMPONENT
// ============================================================

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnects optimizados */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.facebook.com" />
        
        {/* Canonical y alternates */}
        <link rel="canonical" href={APP_URL} />
        <link rel="alternate" href={APP_URL} hrefLang="es-co" />
        <link rel="alternate" href={APP_URL} hrefLang="es" />
        <link rel="alternate" href={APP_URL} hrefLang="x-default" />
        
        {/* Geo meta tags expandidos */}
        <meta name="geo.region" content="CO-ANT" />
        <meta name="geo.placename" content="Sopetrán, Santa Fe de Antioquia, San Jerónimo, Liborina" />
        <meta name="geo.position" content="6.500893;-75.742225" />
        <meta name="ICBM" content="6.500893, -75.742225" />
        
        {/* Schemas dinámicos */}
        {allSchemas.map((schema, index) => (
          <Script
            key={`schema-${index}`}
            id={`schema-${index}`}
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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