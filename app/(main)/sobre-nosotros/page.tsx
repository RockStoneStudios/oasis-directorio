// 📁 ooasys/app/nosotros/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import { 
  ArrowRight, 
  Sparkles, 
  Target,
  Eye
} from 'lucide-react';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

export const metadata: Metadata = {
  title: "Nosotros | Ooasys - La Evolución del Directorio Sopetrán y el Occidente Antioqueño",
  description: "🚀 Conoce la historia de Ooasys, la plataforma de transformación digital que conecta negocios en Sopetrán, Santa Fe de Antioquia, San Jerónimo y Liborina.",
  keywords: [
    "Ooasys nosotros",
    "Directorio Sopetrán",
    "evolución digital",
    "Occidente Antioqueño",
    "transformación digital",
    "directorio de negocios",
    "Sopetrán",
    "Santa Fe de Antioquia",
    "San Jerónimo",
    "Liborina"
  ].join(", "),
  authors: [{ name: "Ooasys", url: APP_URL }],
  alternates: {
    canonical: `${APP_URL}/nosotros`,
  },
  openGraph: {
    title: "Nosotros | Ooasys - Transformación Digital en el Occidente Antioqueño",
    description: "Conoce la historia detrás de Ooasys, la evolución natural del Directorio Sopetrán hacia toda la región del Occidente Antioqueño.",
    url: `${APP_URL}/nosotros`,
    type: "website",
    siteName: "Ooasys",
    locale: "es_CO",
    images: [
      {
        url: `${APP_URL}/ooasys-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Ooasys - Evolución del Directorio Sopetrán",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosotros | Ooasys - La Red de Negocios del Occidente",
    description: "La evolución digital de nuestra tierra. Conectamos Sopetrán, Santa Fe, San Jerónimo y Liborina.",
    images: [`${APP_URL}/ooasys-og.jpg`],
    creator: "@ooasys",
    site: "@ooasys",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  category: "tecnologia y negocios",
};

// Schemas...
const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "Sobre Nosotros - Ooasys",
  "description": "Historia, misión y visión de Ooasys como la evolución del Directorio Sopetrán en la región del Occidente Antioqueño.",
  "url": `${APP_URL}/nosotros`,
  "mainEntity": {
    "@type": "Organization",
    "name": "Ooasys",
    "url": APP_URL,
    "logo": `${APP_URL}/ooasys.webp`,
    "description": "Directorio comercial y turístico regional que impulsa la transformación digital en el Occidente Antioqueño."
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
      "name": "Nosotros",
      "item": `${APP_URL}/nosotros`
    }
  ]
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ooasys - Directorio del Occidente Antioqueño",
  "url": APP_URL,
  "logo": `${APP_URL}/ooasys.webp`,
  "sameAs": ["https://www.facebook.com/profile.php?id=61582100796538"],
  "description": "Plataforma y directorio digital de referencia para conectar comunidades, turistas y comercios locales en el Occidente de Antioquia.",
  "areaServed": [
    { "@type": "City", "name": "Sopetrán" },
    { "@type": "City", "name": "Santa Fe de Antioquia" },
    { "@type": "City", "name": "San Jerónimo" },
    { "@type": "City", "name": "Liborina" }
  ],
  "foundingLocation": {
    "@type": "Place",
    "name": "Sopetrán, Antioquia, Colombia"
  }
};

// ============================================================
// ✅ PÁGINA NOSOTROS - COMPLETA CON DARK MODE
// ============================================================

export default function NosotrosPage() {
  return (
    <>
      {/* Schemas JSON-LD */}
      <Script
        id="schema-about-ooasys"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <Script
        id="schema-breadcrumb-nosotros"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-organization-nosotros"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <meta name="geo.region" content="CO-ANT" />
      <meta name="geo.placename" content="Occidente Antioqueño" />

      <h1 className="sr-only">Ooasys: Conoce la Evolución e Historia del Directorio de Sopetrán</h1>

      {/* ================================ */}
      {/* CONTENIDO - CON DARK MODE */}
      {/* ================================ */}
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        

        {/* HERO */}
        {/* ================================ */}
        <section className="relative px-4 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-100/40 dark:bg-emerald-900/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-teal-100/40 dark:bg-teal-900/40 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/70 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Historia de Transformación Digital</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Ooasys
              </span>
            </h1>
            
            <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto font-medium">
              La evolución natural del Directorio Sopetrán
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-400 max-w-2xl mx-auto mt-4">
              De un sueño local a una realidad regional.
            </p>
            
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30 dark:shadow-emerald-900/50"
              >
                <span>Explorar Ooasys</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================================ */}
        {/* HISTORIA */}
        {/* ================================ */}
<section className="px-4 py-16 md:py-20 border-t border-gray-200 dark:border-gray-800">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-emerald-700 text-center mb-8">
      Nuestra historia
    </h2>
    
    <div className="space-y-5 text-lg leading-relaxed">
      <p className="text-gray-700 dark:text-gray-600">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Directorio Sopetrán</span> nació con la misión de visibilizar los negocios locales de Sopetrán. Lo que comenzó como un proyecto pequeño, creció rápidamente gracias al apoyo de la comunidad y los emprendedores de la región.
      </p>
      
      <p className="text-gray-700 dark:text-gray-600">
        Hoy, <span className="font-semibold text-emerald-600 dark:text-emerald-400">Ooasys</span> es la evolución natural de ese sueño, expandiendo su alcance a todo el <span className="font-semibold text-teal-600 dark:text-teal-400">Occidente Antioqueño</span>. Conectamos Sopetrán, Santa Fe de Antioquia, San Jerónimo, Liborina y toda la región.
      </p>
      
      <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900/50 mt-6">
        <p className="text-gray-800 dark:text-gray-200 text-lg italic font-medium text-center">
          "Somos el puente digital entre los negocios locales y las personas que los necesitan."
        </p>
      </div>
    </div>
  </div>
</section>

        {/* ================================ */}
        {/* MUNICIPIOS */}
        {/* ================================ */}
        <section className="px-4 py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-green-700 text-center mb-4">
              Conectamos toda la región
            </h2>
            <p className="text-center text-gray-600 dark:text-emerald-700 mb-10">
              Más de 100 negocios en 4 municipios del Occidente Antioqueño
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-2">🏪</div>
                <p className="font-semibold text-gray-900 dark:text-white">Sopetrán</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nuestro origen</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-2">🏛️</div>
                <p className="font-semibold text-gray-900 dark:text-white">Santa Fe</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Patrimonio histórico</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-2">🌴</div>
                <p className="font-semibold text-gray-900 dark:text-white">San Jerónimo</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Turismo y naturaleza</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-2">🌄</div>
                <p className="font-semibold text-gray-900 dark:text-white">Liborina</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Paisajes únicos</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================ */}
        {/* MISIÓN + VISIÓN */}
        {/* ================================ */}
        <section className="px-4 py-16 md:py-20 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Misión 
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/60 rounded-xl flex items-center justify-center shrink-0">
                    <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Misión</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Conectar a los emprendedores y negocios del Occidente Antioqueño con las personas que buscan sus productos y servicios, impulsando la economía local y fortaleciendo el tejido social de la región.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/60 rounded-xl flex items-center justify-center shrink-0">
                    <Eye className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Visión</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Ser el directorio digital de referencia en el Occidente Antioqueño, transformando la manera en que las comunidades locales se conectan, descubren y apoyan sus negocios y servicios regionales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================ */}
        {/* VALORES */}
        {/* ================================ */}
        <section className="px-4 py-16 md:py-20 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Nuestros valores
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                <div className="text-4xl mb-3">🌱</div>
                <h4 className="text-white font-semibold">Autenticidad</h4>
                <p className="text-emerald-50/80 text-sm mt-1">Conectar lo real</p>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                <div className="text-4xl mb-3">🤝</div>
                <h4 className="text-white font-semibold">Confianza</h4>
                <p className="text-emerald-50/80 text-sm mt-1">Construir comunidad</p>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                <div className="text-4xl mb-3">💡</div>
                <h4 className="text-white font-semibold">Innovación</h4>
                <p className="text-emerald-50/80 text-sm mt-1">Evolucionar siempre</p>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                <div className="text-4xl mb-3">❤️</div>
                <h4 className="text-white font-semibold">Pasión</h4>
                <p className="text-emerald-50/80 text-sm mt-1">Por nuestra tierra</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================ */}
        {/* CIFRAS */}
        {/* ================================ */}
        <section className="px-4 py-16 md:py-20 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400">+70</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Negocios</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-teal-600 dark:text-teal-400">+4</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Municipios</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Compromiso local</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-teal-600 dark:text-teal-400">2026</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Evolución</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================ */}
        {/* CTA FINAL */}
        {/* ================================ */}
        <section className="px-4 py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Quieres ser parte de <span className="text-emerald-600 dark:text-emerald-400">Ooasys</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Registra tu negocio y conecta con miles de personas en la región.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/registro"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30 dark:shadow-emerald-900/50"
              >
                Registrar mi negocio
              </Link>
              <Link
                href="/contacto"
                className="w-full sm:w-auto text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-3"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}