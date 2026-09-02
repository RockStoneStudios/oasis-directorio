import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ArrowRight, PhoneCall, Store, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { sanityFetch } from "@/lib/sanity/live";
import { MUNICIPALITIES_LIST_QUERY } from "@/lib/sanity/queries";
import { Button } from "@/components/ui/button";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";
const CONTACT_WHATSAPP = "https://wa.me/573206209817?text=Hola,%20quiero%20publicar%20mi%20negocio%20en%20Ooasys";

// ============================================================
// METADATOS SEO OPTIMIZADOS CON INTENCIÓN DE BÚSQUEDA REAL
// ============================================================
export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Fincas, Comidas Rápidas, Restaurantes y Turismo en Occidente Antioqueño",
  description: "Resuelve tus dudas sobre alquiler de fincas, comidas rápidas a domicilio, restaurantes, postres y snacks en Sopetrán, San Jerónimo y Santa Fe de Antioquia. ¡Publica tu negocio por WhatsApp!",
  alternates: {
    canonical: `${APP_URL}/preguntas-frecuentes`,
  },
  openGraph: {
    title: "Preguntas Frecuentes sobre el Occidente Antioqueño | Ooasys",
    description: "Todo lo que necesitas saber sobre hospedaje, comidas rápidas, gastronomía y comercios en Sopetrán, San Jerónimo y Santa Fe de Antioquia.",
    url: `${APP_URL}/preguntas-frecuentes`,
    siteName: "Ooasys",
    locale: "es_CO",
    type: "website",
    images: [{ url: `${APP_URL}/ooasys-banner.jpeg`, width: 1200, height: 630 }],
  },
};

// ============================================================
// DATOS DE LAS PREGUNTAS (ENFOCADAS EN ANSWER THE PUBLIC)
// ============================================================
const FAQS = [
  {
    category: "Turismo y Alquiler de Fincas",
    questions: [
      {
        q: "¿Cómo alquilar fincas en Sopetrán o San Jerónimo sin intermediarios?",
        a: "En Ooasys puedes explorar el catálogo de fincas para alquilar en el Occidente Antioqueño y contactar directamente al propietario o administrador a través de su número de WhatsApp oficial, evitando comisiones o intermediarios."
      },
      {
        q: "¿Dónde encontrar fincas baratas o para grupos en el Occidente Antioqueño?",
        a: "En nuestra sección de municipios y categorías puedes filtrar por tipo de hospedaje en municipios como Sopetrán, San Jerónimo, Santa Fe de Antioquia, Olaya y Liborina para comparar opciones según tu presupuesto."
      }
    ]
  },
  {
    category: "Gastronomía, Comidas Rápidas y Antojos",
    questions: [
      {
        q: "¿Dónde pedir comidas rápidas a domicilio, postres o snacks en Sopetrán y municipios cercanos?",
        a: "En Ooasys encuentras una sección dedicada a restaurantes, locales de comidas rápidas a domicilio (hamburguesas, pizzas, perros calientes), reposterías con postres artesanales, heladerías , snacks y antojos directo a WhatsApp para tus domicilios."
      },
      {
        q: "¿Dónde comer los mejores platos típicos en Sopetrán y Santa Fe de Antioquia?",
        a: "En nuestro directorio encuentras restaurantes, estaderos, picaderos y fondas tradicionales con su ubicación exacta, menú recomendado y enlace directo para pedir a domicilio o hacer reservas."
      },
      {
        q: "¿Hay opciones de restaurantes con piscina o para pasar el día en San Jerónimo?",
        a: "Sí, muchos establecimientos y estaderos registrados ofrecen servicio de día de sol, restaurante, barra de snacks y áreas recreativas. Puedes consultar los detalles directamente en la ficha del comercio."
      }
    ]
  },
  {
    category: "Para Negocios y Comerciantes",
    questions: [
      {
        q: "¿Cómo puedo publicar mi finca, restaurante o negocio en Ooasys?",
        a: "Es muy sencillo. Escríbenos directamente a nuestro WhatsApp oficial al 3206209817. Allí te solicitaremos los datos e información de tu negocio (fotos, ubicación, menú o catálogo) para realizar la publicación en la plataforma."
      },
      {
        q: "¿Qué beneficios tiene registrar mi comercio rural en la plataforma?",
        a: "Aumentas la visibilidad digital de tu negocio en Google sin necesidad de tener un sitio web propio, recibes tráfico de clientes calificados interesados en el Occidente Antioqueño y recibes contactos directamente a tu WhatsApp."
      }
    ]
  }
];

// ============================================================
// SCHEMA JSON-LD STRUCTURAL DATA
// ============================================================
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.flatMap((cat) =>
    cat.questions.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    }))
  ),
};

export default async function FAQPage() {
  const { data: municipalities } = await sanityFetch({ query: MUNICIPALITIES_LIST_QUERY });
  const municipalitiesArray = Array.isArray(municipalities) ? municipalities : [];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAFAF9] to-[#F5F0E8] dark:from-[#1C1917] dark:to-[#292524]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar municipalities={municipalitiesArray} />

      <main id="main">
        {/* Header Hero */}
        <header className="relative overflow-hidden py-12 md:py-20 border-b border-[#E7E5E4] dark:border-[#44403C] bg-white/60 dark:bg-[#1C1917]/60 backdrop-blur-md">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#14B8A6]/10 dark:bg-[#14B8A6]/20 px-3 py-1 text-xs md:text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6]">
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              Centro de Ayuda y Preguntas Frecuentes
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#1C1917] dark:text-white tracking-tight">
              Preguntas Frecuentes sobre{" "}
              <span className="bg-linear-to-r from-[#14B8A6] to-[#0F766E] bg-clip-text text-transparent">
                Ooasys
              </span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-[#44403C] dark:text-[#D6D3D1]">
              Resuelve tus dudas sobre fincas para alquilar, comidas rápidas a domicilio, restaurantes, postres, snacks y cómo registrar tu negocio.
            </p>
          </div>
        </header>

        {/* Sección de Preguntas Organizadas */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
            {FAQS.map((category, idx) => (
              <div key={idx} className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-[#1C1917] dark:text-white border-b border-[#E7E5E4] dark:border-[#44403C] pb-2">
                  {category.category}
                </h2>
                <div className="grid gap-6">
                  {category.questions.map((faq, fIdx) => (
                    <article
                      key={fIdx}
                      className="rounded-2xl border border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#292524] p-6 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-[#1C1917] dark:text-white mb-3 flex items-start gap-2">
                        <span className="text-[#14B8A6] font-bold">Q.</span> {faq.q}
                      </h3>
                      <p className="text-sm md:text-base text-[#44403C] dark:text-[#D6D3D1] leading-relaxed">
                        {faq.a}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA Final para dueños de negocios con WhatsApp directo */}
            <div className="rounded-2xl border border-[#14B8A6]/30 bg-linear-to-r from-[#14B8A6]/10 to-transparent p-8 text-center mt-12">
              <Store className="mx-auto mb-3 h-10 w-10 text-[#14B8A6]" />
              <h2 className="text-xl font-bold text-[#1C1917] dark:text-white">
                ¿Tienes un comercio, restaurante o finca en el Occidente Antioqueño?
              </h2>
              <p className="mt-2 text-sm text-[#44403C] dark:text-[#D6D3D1] max-w-xl mx-auto">
                Aumenta tu visibilidad digital. Escríbenos al <strong>320 620 9817</strong> y publicamos tu negocio para que recibas clientes directo en tu WhatsApp.
              </p>
              <Button size="lg" className="mt-6 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold" asChild>
                <a href={CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Escribir al WhatsApp 320 620 9817
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}