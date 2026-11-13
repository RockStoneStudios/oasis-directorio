import Link from "next/link";
import { PartyPopper, Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ooasys.com"),
  title: "Fiestas y Eventos este Fin de Semana en el Occidente Antioqueño | Ooasys",
  description: "Descubre la programación y eventos de las Fiestas del Sol en San Jerónimo, Fiestas del Fríjol en Liborina y Fiestas del Campesino en Llanadas (Olaya). Planes para hoy y este fin de semana.",
  alternates: {
    canonical: "/fiestas-fin-de-semana",
  },
  openGraph: {
    title: "Fiestas y Eventos este Fin de Semana | Occidente Antioqueño",
    description: "Conoce la agenda de eventos: Fiestas del Sol, Fiestas del Fríjol y más celebraciones en el Occidente de Antioquia.",
    url: "https://www.ooasys.com/fiestas-del-fin-de-semana",
    siteName: "Ooasys",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "https://www.ooasys.com/fiestas.jpg",
        width: 1200,
        height: 630,
        alt: "Fiestas tradicionales en el Occidente Antioqueño",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiestas y Eventos en el Occidente Antioqueño | Ooasys",
    description: "Agenda de eventos y fiestas tradicionales este fin de semana.",
    images: ["https://www.ooasys.com/fiestas.jpg"],
  },
};

const FESTIVALS = [
  {
    title: "Fiestas del Sol y Agroturismo",
    municipality: "San Jerónimo",
    description: "Disfruta de la gran programación cultural, tablados musicales, feria artesanal y el mejor clima del Occidente Antioqueño.",
    href: "/fiestas-del-sol-san-jeronimo",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25",
    gradient: "from-emerald-500/20 via-yellow-500/10 to-transparent",
  },
  {
    title: "Fiestas del Fríjol",
    municipality: "Liborina",
    description: "Tradición, cultura cafetera y agrícola, muestras gastronómicas, fondas y conciertos imperdibles en Liborina.",
    href: "/fiestas-del-frijol-liborina",
    badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    buttonColor: "bg-red-600 hover:bg-red-700 shadow-red-600/25",
    gradient: "from-red-500/20 via-orange-500/10 to-transparent",
  },
  {
    title: "Fiestas del Campesino y El Progreso",
    municipality: "Llanadas (Olaya)",
    description: "Homenaje a nuestra labor rural, cabalgatas, música en vivo y un ambiente familiar único en Llanadas.",
    href: "/fiestas-llanadas",
    badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    buttonColor: "bg-orange-600 hover:bg-orange-700 shadow-orange-600/25",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
  },
];

export default function WeekendFestivalsPage() {
  // SEO: Datos estructurados JSON-LD para indicar a Google que es una lista de eventos
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fiestas y Eventos del Fin de Semana en el Occidente Antioqueño",
    description: "Agenda de festivales y celebraciones tradicionales en los municipios del Occidente de Antioquia.",
    url: "https://www.ooasys.com/fiestas-fin-de-semana",
    itemListElement: FESTIVALS.map((fest, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Festival",
        name: fest.title,
        description: fest.description,
        location: {
          "@type": "Place",
          name: fest.municipality,
          address: {
            "@type": "PostalAddress",
            addressLocality: fest.municipality,
            addressRegion: "Antioquia",
            addressCountry: "CO",
          },
        },
        url: `https://www.ooasys.com${fest.href}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-zinc-50 dark:bg-[#1C1917] py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          
          {/* Cabecera */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Agenda Especial del Fin de Semana
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
              Fiestas Tradicionales en el Occidente Antioqueño
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
              El Occidente se viste de fiesta. Conoce las celebraciones programadas para este fin de semana y vive lo mejor de nuestra región.
            </p>
          </div>

          {/* Tarjetas de Fiestas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FESTIVALS.map((fest, idx) => (
              <div 
                key={idx}
                className={`relative bg-white dark:bg-[#292524] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between overflow-hidden shadow-xl shadow-zinc-950/5 group hover:border-amber-500/50 transition-all duration-300`}
              >
                {/* Fondo degradado sutil */}
                <div className={`absolute top-0 right-0 left-0 h-32 bg-gradient-to-b ${fest.gradient} pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${fest.badgeColor}`}>
                      {fest.municipality}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 group-hover:scale-110 transition-transform">
                      <PartyPopper className="h-5 w-5" />
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10">
                    {fest.title}
                  </h2>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 relative z-10 leading-relaxed">
                    {fest.description}
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <Link
                    href={fest.href}
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow-lg ${fest.buttonColor} transition-all duration-200 hover:brightness-110 active:scale-95`}
                  >
                    <span>Ver programación completa</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Botón Volver al Home */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              ← Volver al inicio de Ooasys
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}