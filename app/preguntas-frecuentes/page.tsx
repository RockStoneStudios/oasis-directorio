import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ShieldCheck, Store, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { sanityFetch } from "@/lib/sanity/live";
import { MUNICIPALITIES_LIST_QUERY } from "@/lib/sanity/queries";
import { Button } from "@/components/ui/button";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";
const CONTACT_WHATSAPP = "https://wa.me/573206209817?text=Hola,%20quiero%20publicar%20mi%20negocio%20en%20Ooasys";

// ============================================================
// METADATOS SEO OPTIMIZADOS CON INTENCIÓN DE BÚSQUEDA Y AUTORIDAD
// ============================================================
export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Fincas, Glamping, Restaurantes 100% Seguros | Ooasys",
  description: "Resuelve tus dudas sobre alquiler de fincas 100% confiables, zonas de glamping, restaurantes y domicilios en Sopetrán, San Jerónimo y Santa Fe de Antioquia. Evita estafas reservando con comercios verificados.",
  alternates: {
    canonical: `${APP_URL}/preguntas-frecuentes`,
  },
  other: {
    "geo.region": "CO-ANT",
    "geo.placename": "Occidente Antioqueño, Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina, Olaya",
    "geo.position": "6.500893;-75.742225",
    "ICBM": "6.500893, -75.742225",
  },
  openGraph: {
    title: "Preguntas Frecuentes | Fincas y Glamping Confiables en Occidente Antioqueño",
    description: "Encuentra fincas, glamping y gastronomía sin intermediarios ni estafas. Negocios y hospedajes 100% verificados en Sopetrán, San Jerónimo y Santa Fe de Antioquia.",
    url: `${APP_URL}/preguntas-frecuentes`,
    siteName: "Ooasys",
    locale: "es_CO",
    type: "website",
    images: [{ url: `${APP_URL}/ooasys-banner.jpeg`, width: 1200, height: 630, alt: "Fincas y Glamping Confiables en Occidente Antioqueño" }],
  },
};

// ============================================================
// DATOS DE PREGUNTAS (SEO + CONFIANZA Y ANTI-ESTAFAS)
// ============================================================
const FAQS = [
  {
    category: "Turismo, Fincas y Glamping Seguro",
    questions: [
      {
        q: "¿Es seguro alquilar fincas y glamping en Ooasys? ¿Cómo se evitan las estafas?",
        a: "Sí, todos los negocios de alquiler de fincas, glampings y hospedajes en Ooasys son 100% confiables. Verificamos la legitimidad de cada establecimiento e información de contacto directamente en la región para garantizar que reservas con propietarios o administradores reales, protegiendo tu dinero y evitando fraudes."
      },
      {
        q: "¿Cómo alquilar fincas o glamping en Sopetrán o San Jerónimo sin intermediarios?",
        a: "En Ooasys accedes directamente al número oficial de WhatsApp de cada finca o espacio de glamping. Puedes consultar disponibilidad, pedir fotos reales y cotizar sin pagar tarifas extra por intermediarios."
      },
      {
        q: "¿Dónde encontrar glamping y fincas baratas o para grupos en el Occidente Antioqueño?",
        a: "En nuestra plataforma puedes filtrar hospedajes por municipio (Sopetrán, San Jerónimo, Santa Fe de Antioquia, Olaya y Liborina) para comparar opciones de glamping romántico o fincas de recreo para grupos familiares ajustadas a tu presupuesto."
      }
    ]
  },
  {
    category: "Gastronomía, Comidas Rápidas y Domicilios",
    questions: [
      {
        q: "¿Dónde pedir comidas rápidas, postres o antojos a domicilio?",
        a: "En Ooasys encuentras restaurantes, reposterías y locales de comidas rápidas (hamburguesas, pizzas, perros calientes) con atención directa por WhatsApp para coordinar tus domicilios rápido en Sopetrán y zonas vecinas."
      },
      {
        q: "¿Dónde comer los mejores platos típicos en Sopetrán y Santa Fe de Antioquia?",
        a: "Explora nuestra lista de restaurantes, estaderos tradicionales y fondas típicas con su ubicación en mapa, menús y contacto directo para reservas o consultas."
      },
      {
        q: "¿Hay opciones de restaurantes con piscina o día de sol en San Jerónimo?",
        a: "Sí, contamos con comercios verificados que ofrecen pasadías, áreas recreativas, piscinas y barra de snacks. Consulta los servicios detallados en la ficha de cada negocio."
      }
    ]
  },
  {
    category: "Para Negocios y Comerciantes Locales",
    questions: [
      {
        q: "¿Cómo puedo publicar mi finca, glamping, restaurante o negocio en Ooasys?",
        a: "Es muy sencillo. Escríbenos directamente por WhatsApp al 320 620 9817. Validaremos los datos de tu comercio (fotos, ubicación, catálogo) para verificar tu propiedad y realizar la publicación oficial."
      },
      {
        q: "¿Qué beneficios tiene registrar mi comercio rural o turístico en la plataforma?",
        a: "Posicionas tu negocio en las primeras búsquedas de Google en el Occidente Antioqueño, ganas un sello de confianza para tus clientes al certificar tu canal directo y recibes cotizaciones directamente en tu WhatsApp."
      }
    ]
  }
];

// ============================================================
// SCHEMA JSON-LD STRUCTURAL DATA CON AUTORIDAD GEOGRÁFICA
// ============================================================
const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${APP_URL}/preguntas-frecuentes#faq`,
      "areaServed": [
        "Occidente Antioqueño",
        "Sopetrán",
        "San Jerónimo",
        "Santa Fe de Antioquia",
        "Liborina",
        "Olaya"
      ],
      "mainEntity": FAQS.flatMap((cat) =>
        cat.questions.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a,
          },
        }))
      )
    }
  ]
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
              Centro de Ayuda, Confianza y Preguntas Frecuentes
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#1C1917] dark:text-white tracking-tight">
              Preguntas Frecuentes sobre{" "}
              <span className="bg-linear-to-r from-[#14B8A6] to-[#0F766E] bg-clip-text text-transparent">
                Ooasys
              </span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-[#44403C] dark:text-[#D6D3D1]">
              Resuelve tus dudas sobre fincas, glamping 100% confiable, domicilios, restaurantes y cómo registrar tu negocio en el directorio líder del Occidente Antioqueño.
            </p>

            {/* Banner de Garantía y Anti-Estafas */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/20 p-4 text-emerald-900 dark:text-emerald-200 text-sm md:text-base font-medium">
              <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Reservas 100% Seguras:</strong> Todos los establecimientos de fincas y glamping en Ooasys son verificados de primera mano para evitar estafas y cobros de intermediarios.
              </span>
            </div>
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
                ¿Tienes un comercio, restaurante, glamping o finca en el Occidente Antioqueño?
              </h2>
              <p className="mt-2 text-sm text-[#44403C] dark:text-[#D6D3D1] max-w-xl mx-auto">
                Certifica la autenticidad de tu establecimiento y aumenta tus reservas. Escríbenos al <strong>320 620 9817</strong> para publicar tu negocio de forma segura.
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