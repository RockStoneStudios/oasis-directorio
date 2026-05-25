import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/lib/sanity/live";
import { ThemeProvider } from "@/components/theme-provider";
//@ts-ignore
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// 🔥 CONFIGURACIÓN SEO MAESTRA (Nivel Avanzado)
export const metadata: Metadata = {
  title: {
    default: "Oasis 🌴 Directorio Comercial del Occidente Antioqueño",
    template: "%s | Oasis 🌴",
  },
  description:
    "🌴 Encuentra negocios cerca de ti en el Occidente Antioqueño. 🚀 El directorio local definitivo: comercio, turismo y servicios en Sopetrán. ¡Próximamente expandiéndonos a Santa Fe de Antioquia, San Jerónimo y Liborina! 🗺️✨",
  icons: {
    icon: "/oasis.png", 
    apple: [{ url: "/oasis.png" }],
  },
  verification: {
    google: "OBYw5lH6K7WSL2FDIJyNnq9oKEsYHJndvLUQmPjZWrc"
  },

  // 📈 Keywords genéricas, regionales y semánticas para dominar el buscador sin penalizaciones
  keywords: [
    // --- 1. Autoridad de la Marca ---
    "oasis",
    "oasis directorio",
    "directorio oasis",
    "oasis occidente antioqueño",
    
    // --- 2. Intención de Búsqueda General (Alta conversión) ---
    "directorio comercial",
    "directorio de negocios locales",
    "buscar negocios cerca de mi",
    "guia comercial y de servicios",
    "empresas y comercios locales",
    "paginas amarillas antioquia",
    
    // --- 3. Enfoque Geográfico Regional (Para captar todo el tráfico de la zona) ---
    "occidente antioqueño",
    "comercio occidente antioqueño",
    "turismo occidente antioqueño",
    "municipios del occidente antioqueño",
    "guia turistica antioquia",
    
    // --- 4. Enfoque Local Activo (Donde ya eres fuerte) ---
    "negocios en sopetran",
    "comercio sopetran antioquia",
    "que hacer en sopetran",
    "directorio local sopetran",
    "restaurantes en sopetran",
    
    // --- 5. Palabras Semánticas de Expansión Futura (Ganando terreno desde ya) ---
    "comercio santa fe de antioquia",
    "directorio san jeronimo",
    "negocios en liborina",
    "hoteles y turismo antioquia"
  ],
  authors: [{ name: "Oasis" }],
  creator: "Oasis",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Oasis",
    title: "Oasis 🌴 Directorio Comercial del Occidente Antioqueño",
    description:
      "🌴 Encuentra negocios cerca de ti en el Occidente Antioqueño. 🚀 El directorio local definitivo: comercio, turismo y servicios en Sopetrán. ¡Próximamente expandiéndonos a Santa Fe de Antioquia, San Jerónimo y Liborina! 🗺️✨",
    images: [
      {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/oasis.png`, // ✅ URL absoluta
      width: 1200,
      height: 630,
      alt: "Oasis - Directorio de Negocios",

      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oasis 🌴 Directorio Comercial del Occidente Antioqueño",
    description:
      "🌴 Encuentra negocios cerca de ti en el Occidente Antioqueño. 🚀 El directorio local definitivo: comercio, turismo y servicios en Sopetrán. ¡Próximamente expandiéndonos a Santa Fe de Antioquia, San Jerónimo y Liborina! 🗺️✨",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/oasis.png`]
  },
  robots: {
    index: true,
    follow: true,
    // Le indica a los buscadores que hagan un snippet completo y visualmente grande
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF9F6" },
    { media: "(prefers-color-scheme: dark)", color: "#2D2824" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} font-body antialiased`}
      >
        <ClerkProvider>
          <a href="#main" className="skip-link">
            Saltar al contenido principal
          </a>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          
          <Toaster />
          <SanityLive />
        </ClerkProvider>
      </body>
    </html>
  );
}