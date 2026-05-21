import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/lib/sanity/live";
//@ts-ignore
import "./globals.css";
// import "leaflet/dist/leaflet.css"; // A

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
    default: "Oasis | Directorio de negocios locales",
    template: "%s | Oasis",
  },
  description:
    "Descubre negocios, eventos y noticias locales por categoria y municipio.",
  
    verification : {
       google : "OBYw5lH6K7WSL2FDIJyNnq9oKEsYHJndvLUQmPjZWrc"
    },

    keywords: [
    "directorio local",
    "negocios",
    "municipios",
    "eventos",
    "noticias",
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
    title: "Oasis | Directorio de negocios locales",
    description:
      "Descubre negocios, eventos y noticias locales por categoria y municipio.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oasis | Directorio de negocios locales",
    description:
      "Descubre negocios, eventos y noticias locales por categoria y municipio.",
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
    // Movimos el html al nivel más externo
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
        {/* Colocamos ClerkProvider dentro del body envolviendo todo */}
        <ClerkProvider>
          <a href="#main" className="skip-link">
            Saltar al contenido principal
          </a>
          
          {children}
          
          <Toaster />
          <SanityLive />
        </ClerkProvider>
      </body>
    </html>
  );
}

// app/layout.tsx
// @ts-ignore
// import "./globals.css";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="es" suppressHydrationWarning>
//       <body>
//         {children}
//       </body>
//     </html>
//   );
// }