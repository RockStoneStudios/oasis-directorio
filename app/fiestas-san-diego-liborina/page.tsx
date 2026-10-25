import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { getBusinesses } from '@/actions/getBusinesses';
import { BusinessCard } from '@/components/BusinessCard';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ooasys.com';
const pageUrl = `${baseUrl}/fiestas-san-diego-liborina`;
const ogImage = '/san_diego1.jpg'; // 1200x630, créala en /public

const WHATSAPP_URL = 'https://wa.me/573206209817?text=Hola%2C%20quiero%20inscribir%20mi%20negocio%20en%20Ooasys';
const MAPS_URL = 'https://www.google.com/maps?q=6.719627,-75.775277';

const title = 'Fiestas del Retorno y San Isidro 2026 | San Diego, Liborina';
const description =
  'Programación de las Fiestas del Retorno y San Isidro en San Diego, Liborina: 30 oct al 2 nov de 2026. Cabalgata, shows, misas y sancochos. Entrada libre.';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { absolute: title },
  description,
  alternates: {
    canonical: pageUrl,
    languages: { 'es-CO': pageUrl, es: pageUrl },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title,
    description:
      'Vive las Fiestas del Retorno y de San Isidro del 30 de octubre al 2 de noviembre de 2026 en San Diego, Liborina. Toda la programación día por día.',
    url: pageUrl,
    siteName: 'Ooasys',
    type: 'website',
    locale: 'es_CO',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Fiestas del Retorno y de San Isidro 2026 en San Diego, Liborina',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: 'Del 30 oct al 2 nov de 2026: cabalgata, sancochos, misas y grandes shows. Entrada libre.',
    images: [ogImage],
  },
};

// ============================================================================
// Datos
// ============================================================================
const programa = [
  {
    dia: 'Viernes',
    fecha: '30 de octubre',
    color: 'bg-[#c41200]',
    eventos: [
      { hora: '3:00 PM', titulo: 'Desfile de disfraces', icon: '🎭' },
      { hora: '7:00 PM', titulo: 'Rumba aeróbica', icon: '💃' },
    ],
  },
  {
    dia: 'Sábado',
    fecha: '31 de octubre',
    color: 'bg-[#c41200]',
    eventos: [
      { hora: '2:00 PM', titulo: 'Cabalgata', desc: 'Punto de encuentro: Danzante', icon: '🐴' },
      { hora: '6:00 PM', titulo: 'Santa Misa', icon: '⛪' },
      {
        hora: '7:00 PM',
        titulo: 'Apertura oficial de las fiestas',
        desc: 'Show musical: Los mismos bobos de siempre, Aniel Velásquez, Cristian Paniagua, Daniel Calderón y los Gigantes del Vallenato, DJ Felipe Villa',
        icon: '🎤',
        destacado: true,
      },
    ],
  },
  {
    dia: 'Domingo',
    fecha: '1 de noviembre',
    franja: 'Mañana',
    color: 'bg-[#a30e00]',
    eventos: [
      { hora: '6:30 AM', titulo: 'Altar de San Isidro', desc: 'Inicio de la recolección de ofrendas, animales, productos del campo, anchetas y más.', icon: '🌽' },
      { hora: '8:00 AM', titulo: 'Santa Misa', icon: '⛪' },
      { hora: '11:00 AM', titulo: 'Santa Misa', icon: '⛪' },
      { hora: '12:00 M', titulo: 'Almuerzo comunitario', icon: '🍲' },
    ],
  },
  {
    dia: 'Domingo',
    fecha: '1 de noviembre',
    franja: 'Tarde y noche',
    color: 'bg-[#a30e00]',
    eventos: [
      { hora: '1:00 PM', titulo: 'Altar de San Isidro: gran remate', desc: 'Toda la comunidad está invitada.', icon: '🎉' },
      { hora: '6:00 PM', titulo: 'Santa Misa', icon: '⛪' },
      {
        hora: '7:00 PM',
        titulo: 'Show musical',
        desc: 'Leonardo Jaramillo, Orquesta Aires Sabaneros, Francisco Gómez el Nuevo Rey, Orquesta Donaires, DJ Teban',
        icon: '🎶',
        destacado: true,
      },
    ],
  },
  {
    dia: 'Lunes',
    fecha: '2 de noviembre',
    color: 'bg-[#c41200]',
    eventos: [
      { hora: 'Todo el día', titulo: 'Festival de Sancochos', icon: '🥘' },
      { hora: 'Todo el día', titulo: 'Fiesta de desenguayave', icon: '🍻' },
      {
        hora: 'Noche',
        titulo: 'Show musical',
        desc: 'Andrés Parra, La Berríonda, Banda Diez, Cristian Peláez',
        icon: '🎸',
        destacado: true,
      },
    ],
  },
];

// Las mismas FAQ se muestran en pantalla y se envían en el schema (Google lo exige)
const FAQS = [
  {
    q: '¿Dónde queda San Diego, Liborina?',
    a: 'Es un corregimiento de Liborina, en el Occidente de Antioquia, a unas 2,5 horas de Medellín.',
  },
  {
    q: '¿Cuándo son las fiestas 2026?',
    a: 'Del viernes 30 de octubre al lunes 2 de noviembre de 2026.',
  },
  {
    q: '¿Hay que pagar entrada?',
    a: 'No. Todos los eventos de las fiestas son de entrada libre.',
  },
  {
    q: '¿Dónde se realizan los eventos?',
    a: 'El lugar principal es el parque principal de San Diego. La cabalgata tiene su punto de encuentro en Danzante.',
  },
  {
    q: '¿Quién organiza las fiestas?',
    a: 'La parroquia y la alcaldía de Liborina.',
  },
  {
    q: '¿Dónde me quedo?',
    a: 'Puedes buscar fincas, hoteles y hospedajes en Liborina y en municipios cercanos como Sopetrán desde el directorio de Ooasys.',
  },
];

// Evita que un "<" dentro de los datos rompa el <script> del JSON-LD
function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

// ============================================================================
// Página
// ============================================================================
export default async function FiestasSanDiegoPage() {
  // Negocios de Liborina para enlazado interno (si falla, la página sigue funcionando)
  let negociosLiborina: any[] = [];
  try {
    const result = await getBusinesses({ municipality: 'liborina', pageSize: 4 } as any);
    negociosLiborina = (result?.businesses ?? []).slice(0, 4);
  } catch {
    negociosLiborina = [];
  }

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    '@id': `${pageUrl}#evento`,
    name: 'Fiestas del Retorno y de San Isidro 2026 - San Diego, Liborina',
    description:
      'Fiestas del Retorno y de San Isidro en San Diego, Liborina, Antioquia, del 30 de octubre al 2 de noviembre de 2026. Cabalgata, desfile de disfraces, misas, altar de San Isidro, festival de sancochos y shows musicales.',
    startDate: '2026-10-30T15:00:00-05:00',
    endDate: '2026-11-02T23:59:00-05:00',
    url: pageUrl,
    inLanguage: 'es-CO',
    isAccessibleForFree: true,
    image: [`${baseUrl}${ogImage}`, `${baseUrl}/san_diego1.jpg`],
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Parque principal San Diego',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Parque principal, San Diego',
        addressLocality: 'Liborina',
        addressRegion: 'Antioquia',
        addressCountry: 'CO',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 6.719627,
        longitude: -75.775277,
      },
    },
    organizer: [
      { '@type': 'Organization', name: 'Parroquia de Liborina',url: pageUrl },
      { '@type': 'GovernmentOrganization', name: 'Alcaldía de Liborina', url: 'https://www.liborina-antioquia.gov.co/' },
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
    },
    performer: [
      { '@type': 'PerformingGroup', name: 'Los mismos bobos de siempre' },
      { '@type': 'Person', name: 'Aniel Velásquez' },
      { '@type': 'Person', name: 'Cristian Paniagua' },
      { '@type': 'MusicGroup', name: 'Daniel Calderón y los Gigantes del Vallenato' },
      { '@type': 'Person', name: 'DJ Felipe Villa' },
      { '@type': 'Person', name: 'Leonardo Jaramillo' },
      { '@type': 'MusicGroup', name: 'Orquesta Aires Sabaneros' },
      { '@type': 'Person', name: 'Francisco Gómez el Nuevo Rey' },
      { '@type': 'MusicGroup', name: 'Orquesta Donaires' },
      { '@type': 'Person', name: 'DJ Teban' },
      { '@type': 'Person', name: 'Andrés Parra' },
      { '@type': 'MusicGroup', name: 'La Berríonda' },
      { '@type': 'MusicGroup', name: 'Banda Diez' },
      { '@type': 'Person', name: 'Cristian Peláez' },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Fiestas de San Diego, Liborina 2026', item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(eventJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />

      <main className="min-h-screen bg-[#fff8f0] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors font-sans">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#d91400] text-white">
          <div className="absolute top-6 left-4 md:left-8 z-50">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-4 py-2.5 rounded-full text-sm font-bold transition-all border border-white/20 shadow-lg group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              Volver al Inicio
            </Link>
          </div>

          <div className="absolute inset-0 bg-linear-to-b from-black/20 to-[#d91400]/90 z-10" />

          <div className="relative z-20 max-w-7xl mx-auto px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm font-bold tracking-widest mb-4">
                <span aria-hidden="true">📍</span> SAN DIEGO, LIBORINA • ANTIOQUIA
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                <span className="inline-block text-xl font-serif italic font-normal mb-3 bg-white text-[#c41200] px-4 py-1 rounded-full -rotate-2">
                  Fiestas del
                </span>
                <span className="block">RETORNO Y DE SAN ISIDRO 2026</span>
                <span className="block mt-3 text-2xl lg:text-3xl font-bold tracking-normal">
                  en San Diego, Liborina
                </span>
              </h1>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="bg-white text-[#c41200] font-black px-6 py-3 rounded-full text-xl shadow-xl">
                  30 OCT AL 02 NOV
                </div>
                <div className="bg-black text-white px-6 py-3 rounded-full font-bold">¡ENTRADA LIBRE!</div>
              </div>

              <p className="mt-6 text-lg text-white max-w-xl leading-relaxed">
                Regresa a tus raíces. Cuatro días de tradición campesina, fe, música, cabalgata y Festival de
                Sancochos en el Occidente Antioqueño. ¡Te espera San Diego!
              </p>

              <div className="mt-8 flex gap-4">
                <a
                  href="#programacion"
                  className="bg-white text-[#c41200] px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition shadow-lg"
                >
                  VER PROGRAMACIÓN <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative mt-12 lg:mt-0">
              <div className="relative aspect-4/5 rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)] border-8 border-white/20 rotate-1">
                <Image
                  src="/san_diego1.jpg"
                  alt="Iglesia de San Diego, Liborina, durante las Fiestas del Retorno y de San Isidro 2026"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-yellow-300 text-black font-black px-6 py-3 rounded-2xl -rotate-4 shadow-xl z-30">
                <span aria-hidden="true">🎸</span> VALLENATO + POPULAR
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-[#c41200] font-black px-6 py-3 rounded-2xl rotate-6 shadow-xl z-30">
                <span aria-hidden="true">🥘</span> FESTIVAL DE SANCOCHOS
              </div>
            </div>
          </div>
        </section>

        {/* INFO RÁPIDA */}
        <section
          aria-label="Resumen de las fiestas"
          className="max-w-7xl mx-auto px-4 -mt-8 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { t: 'Cabalgata', d: 'Sábado 31 oct - 2 PM desde Danzante', i: '🐴' },
            { t: 'Altar de San Isidro', d: 'Domingo 1 nov - ofrendas y gran remate', i: '🌽' },
            { t: 'Shows en vivo', d: 'Gigantes del Vallenato, Orq. Donaires y más', i: '🎤' },
          ].map((item) => (
            <div
              key={item.t}
              className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-5 shadow-xl border border-orange-100 flex gap-4"
            >
              <div className="text-3xl" aria-hidden="true">{item.i}</div>
              <div>
                <div className="font-black">{item.t}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{item.d}</div>
              </div>
            </div>
          ))}
        </section>

        {/* PROGRAMACIÓN */}
        <section id="programacion" className="max-w-7xl mx-auto px-4 py-16 lg:py-24 scroll-mt-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight">
              PROGRAMACIÓN DE LAS FIESTAS
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-lg">
              Todo lo que va a pasar en San Diego, día por día. Guarda esta página.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {programa.map((dia) => (
              <article
                key={`${dia.fecha}-${dia.franja ?? 'dia'}`}
                className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-lg border border-zinc-100 flex flex-col"
              >
                <div className={`${dia.color} text-white p-5`}>
                  <h3>
                    <span className="block text-sm font-bold tracking-widest">{dia.dia.toUpperCase()}</span>
                    <span className="block text-2xl font-black leading-none mt-1">{dia.fecha}</span>
                    {dia.franja && <span className="block text-sm font-semibold mt-1">{dia.franja}</span>}
                  </h3>
                </div>

                <ul className="p-5 space-y-5 flex-1">
                  {dia.eventos.map((ev, j) => (
                    <li
                      key={j}
                      className={ev.destacado ? 'bg-zinc-900 text-white -mx-5 px-5 py-4 rounded-xl' : ''}
                    >
                      <div className="flex gap-3">
                        <div className="text-2xl" aria-hidden="true">{ev.icon}</div>
                        <div>
                          <div className={`font-bold ${ev.destacado ? 'text-yellow-300' : 'text-[#c41200] dark:text-red-400'}`}>
                            {ev.hora}
                          </div>
                          <div className="font-black leading-tight">{ev.titulo}</div>
                          {ev.desc && (
                            <div
                              className={`text-sm mt-1 leading-snug ${
                                ev.destacado ? 'text-zinc-200' : 'text-zinc-600 dark:text-zinc-300'
                              }`}
                            >
                              {ev.desc}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* CÓMO LLEGAR Y DÓNDE QUEDARSE */}
        <section className="max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
          <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-[2rem] border border-zinc-100 shadow-lg p-6 md:p-10">
            <h2 className="text-3xl font-black tracking-tight">Cómo llegar y dónde quedarte</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <div>
                <h3 className="font-black text-lg text-zinc-900 dark:text-white">Cómo llegar a San Diego</h3>
                <p className="mt-2">
                  San Diego es un corregimiento de Liborina, en el Occidente de Antioquia, a unas 2,5 horas de
                  Medellín. El evento principal es en el <strong>parque principal de San Diego</strong>.
                </p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#c41200] px-5 py-2.5 font-bold text-white hover:bg-[#a30e00] transition-colors"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Ver ubicación en Google Maps
                </a>
              </div>
              <div>
                <h3 className="font-black text-lg text-zinc-900 dark:text-white">Dónde quedarte</h3>
                <p className="mt-2">
                  Si vienes de otra ciudad, busca fincas, hoteles y hospedajes en la{' '}
                  <Link href="/municipios/liborina" className="font-bold text-[#c41200] dark:text-red-400 hover:underline">
                    guía de Liborina
                  </Link>{' '}
                  o explora todas las{' '}
                  <Link href="/categorias" className="font-bold text-[#c41200] dark:text-red-400 hover:underline">
                    categorías del directorio
                  </Link>
                  .
                </p>
              </div>
            </div>

            {negociosLiborina.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-black">Negocios en Liborina</h3>
                <div className="mt-4 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {negociosLiborina.map((b) => (
                    <BusinessCard key={b._id} business={b} showDescription={false} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* TEXTO + FAQ */}
        <section className="bg-zinc-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black">¿Por qué ir a las Fiestas de San Diego, Liborina?</h2>
              <div className="mt-4 space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  Las <strong>Fiestas del Retorno y de San Isidro en San Diego, Liborina</strong>, organizadas por la
                  parroquia y la alcaldía de Liborina, reúnen cada año a familias que regresan al pueblo para
                  celebrar la cosecha, agradecer a San Isidro Labrador y reencontrarse. No son solo fiestas: es el
                  retorno a casa.
                </p>
                <p>
                  Durante cuatro días vivirás la tradición antioqueña:{' '}
                  <strong>
                    cabalgata, altar de San Isidro con productos del campo, santas misas, desfile de disfraces,
                    rumba aeróbica, almuerzo comunitario, festival de sancochos y fiesta de desenguayave
                  </strong>
                  .
                </p>
                <p>
                  En tarima estarán{' '}
                  <strong>
                    Daniel Calderón y los Gigantes del Vallenato, Francisco Gómez el Nuevo Rey, Orquesta Donaires,
                    Orquesta Aires Sabaneros, Banda Diez y La Berríonda
                  </strong>
                  , entre otros artistas y DJs. La entrada es libre.
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10">
              <h2 className="font-black text-xl">Preguntas frecuentes</h2>
              <dl className="mt-6 space-y-4 text-sm text-zinc-300">
                {FAQS.map((faq) => (
                  <div key={faq.q}>
                    <dt className="font-bold text-white">{faq.q}</dt>
                    <dd className="mt-1">{faq.a}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 bg-[#d91400] rounded-xl p-4 font-black text-center">
                ¡NOS VEMOS EN SAN DIEGO!
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-12 px-4 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Página informativa de Ooasys - Directorio del Occidente Antioqueño
          </p>
          <h2 className="font-black text-2xl mt-2">¿Tienes un negocio en San Diego? ¡Inscríbelo en Ooasys!</h2>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Escríbenos por WhatsApp: 320 620 9817
          </a>
        </section>
      </main>
    </>
  );
}