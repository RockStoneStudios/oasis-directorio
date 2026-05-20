 import { Footer } from "@/components/layout/Footer";
 import { Navbar } from "@/components/layout/Navbar";

 export default function MainLayout({
  children,
 }: {
   children: React.ReactNode;
 }) {
   return (
     <div className="min-h-screen flex flex-col">
       <Navbar />
       <main id="main" className="flex-1">
         {children}
       </main>
       <Footer />
     </div>
   );
 }

// // app/(main)/layout.tsx
// import { ClerkProvider } from "@clerk/nextjs";
// import { Toaster } from "@/components/ui/sonner";
// import { SanityLive } from "@/lib/sanity/live";
// import { Navbar } from "@/components/layout/Navbar"; // O donde los tengas importados
// import { Footer } from "@/components/layout/Footer";

// export default function MainLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ClerkProvider>
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <main id="main" className="flex-1">
//           <a href="#main" className="skip-link sr-only">
//             Saltar al contenido principal
//           </a>
//           {children}
//         </main>
//         <Footer />
//       </div>
//       <Toaster />
//       <SanityLive />
//     </ClerkProvider>
//   );
// }


// // app/(main)/layout.tsx
// import { ClerkProvider } from "@clerk/nextjs";
// import type { Metadata, Viewport } from "next";
// import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
// import { Toaster } from "@/components/ui/sonner";
// import { SanityLive } from "@/lib/sanity/live";
// import { Navbar } from "@/components/layout/Navbar";
// import { Footer } from "@/components/layout/Footer";

// // Configuración de tus fuentes (Se cargan solo en la web pública)
// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
//   display: "swap",
// });

// const plusJakarta = Plus_Jakarta_Sans({
//   variable: "--font-plus-jakarta",
//   subsets: ["latin"],
//   display: "swap",
//   weight: ["500", "600", "700", "800"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
//   display: "swap",
// });

// // 🎯 EL HPTA SEO VA AQUÍ:
// export const metadata: Metadata = {
//   title: {
//     default: "Oasis | Directorio de negocios locales",
//     template: "%s | Oasis",
//   },
//   description: "Descubre negocios, eventos y noticias locales por categoría y municipio.",
//   keywords: ["directorio local", "negocios", "municipios", "eventos", "noticias"],
//   authors: [{ name: "Oasis" }],
//   creator: "Oasis",
//   metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
//   openGraph: {
//     type: "website",
//     locale: "es_CO",
//     siteName: "Oasis",
//     title: "Oasis | Directorio de negocios locales",
//     description: "Descubre negocios, eventos y noticias locales por categoría y municipio.",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Oasis | Directorio de negocios locales",
//     description: "Descubre negocios, eventos y noticias locales por categoría y municipio.",
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
// };

// export const viewport: Viewport = {
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "#FBF9F6" },
//     { media: "(prefers-color-scheme: dark)", color: "#2D2824" },
//   ],
//   width: "device-width",
//   initialScale: 1,
// };

// export default function MainLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ClerkProvider>
//       {/* Aplicamos las variables de las fuentes en este contenedor general de la app */}
//       <div className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} font-body antialiased min-h-screen flex flex-col`}>
//         <Navbar />
//         <main id="main" className="flex-1">
//           <a href="#main" className="skip-link sr-only">
//             Saltar al contenido principal
//           </a>
//           {children}
//         </main>
//         <Footer />
//       </div>
//       <Toaster />
//       <SanityLive />
//     </ClerkProvider>
//   );
// }