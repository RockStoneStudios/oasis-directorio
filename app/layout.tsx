import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/lib/sanity/live";
import { ThemeProvider } from "@/components/theme-provider";
//@ts-ignore
import "./globals.css";

// Body font - highly readable
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Heading font - modern, friendly geometric
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

// Mono font for code
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Oasis | Directorio de Negocios del Occidente Antioqueño 🌴",
    template: "%s | Oasis",
  },
  description:
    "🌴 El directorio comercial del Occidente Antioqueño. 🚀 Encuentra negocios, turismo, hoteles y eventos en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina.",
  
  verification: {
    google: "OBYw5lH6K7WSL2FDIJyNnq9oKEsYHJndvLUQmPjZWrc"
  },

  keywords: [
    "directorio comercial occidente antioqueño",
    "negocios en sopetran",
    "turismo santa fe de antioquia",
    "hoteles en san jeronimo",
    "comercio liborina",
    "directorio local antioquia",
    "occidente antioqueño municipios",
    "restaurantes occidente antioqueño",
    "oasis directorio",
    "directorio de negocios locales",
    "que hacer en sopetran",
    "guias comerciales antioquia"
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
    title: "Oasis | Directorio de Negocios del Occidente Antioqueño 🌴",
    description:
      "🌴 El directorio comercial del Occidente Antioqueño. 🚀 Encuentra los mejores negocios, turismo y eventos en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oasis | Directorio de Negocios del Occidente Antioqueño 🌴",
    description:
      "🌴 El directorio comercial del Occidente Antioqueño. 🚀 Encuentra los mejores negocios, turismo y eventos en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina.",
  },
  robots: {
    index: true,
    follow: true,
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