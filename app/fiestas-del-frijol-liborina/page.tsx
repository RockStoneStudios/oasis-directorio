import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { getBusinesses } from '@/actions/getBusinesses';
import { BusinessCard } from '@/components/BusinessCard';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ooasys.com';
const pageUrl = `${baseUrl}/fiestas-del-frijol-liborina`;
const ogImagePath = '/liborina.jpg';
const ogImageAbsolute = `https://www.ooasys.com${ogImagePath}`;

const WHATSAPP_URL = 'https://wa.me/573206209817?text=Hola%2C%20quiero%20inscribir%20mi%20negocio%20en%20Ooasys';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Parque+Principal+Liborina+Antioquia';

const title = 'Fiestas del Frijol Liborino Liborina 2026: Programación Oficial del 12 al 15 de Nov';
const description =
  'Programación oficial Fiestas del Frijol Liborino 2026 en Liborina del 12 al 15 de noviembre. Festival Gastronómico, Cabalgata, Copa Frijolera del Millón, Eucaristía campal y conciertos con Los Corraleros, Sinú Orquesta, Banda 10, Alex Rojas y más.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ooasys.com'),
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
      'Vive las Fiestas del Frijol Liborino del 12 al 15 de noviembre de 2026 en Liborina, Antioquia. 7.º Festival Gastronómico, degustación del frijol liborino, cabalgata, copa frijolera del millón y grandes conciertos.',
    url: pageUrl,
    siteName: 'Ooasys',
    type: 'website',
    locale: 'es_CO',
    images: [{ url: ogImageAbsolute, width: 1200, height: 630, alt: 'Fiestas del Frijol Liborino 2026 en Liborina, Antioquia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: 'Del 12 al 15 nov 2026: Programación oficial, Festival Gastronómico, Degustación del Frijol, Cabalgata y conciertos con Los Corraleros Dinastía Gutiérrez, Sinú Orquesta, Banda 10 y más. Entrada libre.',
    images: [ogImageAbsolute],
  },
};

const programa = [
  {
    dia: 'Jueves',
    fecha: '12 de noviembre',
    color: 'bg-gradient-to-r from-[#6D0000] via-[#A40000] to-[#D32F2F]',
    eventos: [
      { hora: '4:00 PM', titulo: 'Cabalgata Infantil', desc: 'Salida: Casa de la Cultura', icon: '🐴' },
      { hora: '11:30 PM', titulo: 'Alborada', desc: 'Salida: Casa de la Cultura', icon: '🎆' },
      { hora: '12:00 AM', titulo: 'Merienda Comunitaria', desc: 'Lugar: Alcaldía Municipal', icon: '☕' },
    ],
  },
  {
    dia: 'Viernes',
    fecha: '13 de noviembre',
    color: 'bg-gradient-to-r from-[#6D0000] via-[#A40000] to-[#D32F2F]',
    eventos: [
      { hora: '6:00 AM', titulo: 'Caminata Ecológica', desc: 'Salida: Hospital San Lorenzo', icon: '🌿' },
      { hora: '11:00 AM', titulo: 'Copa Frijolera del Millón', desc: 'Lugar: Coliseo Municipal', icon: '⚽' },
      {
        hora: '8:00 PM',
        titulo: 'Presentaciones Artísticas',
        desc: 'Parque Principal',
        artistas: ['8:00 PM - Antioquia en el Mapa', '10:30 PM - Banda 10 Orquesta'],
        icon: '🎤',
        destacado: true,
      },
    ],
  },
  {
    dia: 'Sábado',
    fecha: '14 de noviembre',
    color: 'bg-gradient-to-r from-[#6D0000] via-[#A40000] to-[#D32F2F]',
    eventos: [
      { hora: '8:00 AM', titulo: 'Feria de Emprendimiento y Mercado Campesino', desc: 'Lugar: Parque Principal', icon: '🧺' },
      { hora: '11:00 AM', titulo: 'Reconocimiento a los Frijoleros', desc: 'Lugar: Parque Principal', icon: '🏅' },
      { hora: '2:00 PM', titulo: 'Remates Altar de San Isidro', desc: 'Lugar: Atrio del Templo Parroquial', icon: '🙏' },
      {
        hora: '8:30 PM',
        titulo: 'Noche de Fiesta',
        desc: 'Parque Principal - Liborina',
        artistas: [
          '8:30 PM - Herencia Flow',
          '10:00 PM - Chelo Ramírez',
          '11:30 PM - Esteban y Wilson',
          '1:00 AM - Sinú Orquesta',
        ],
        icon: '🎉',
        destacado: true,
      },
    ],
  },
  {
    dia: 'Domingo',
    fecha: '15 de noviembre',
    color: 'bg-gradient-to-r from-[#6D0000] via-[#A40000] to-[#D32F2F]',
    eventos: [
      { hora: '10:00 AM', titulo: 'Eucaristía Campal', desc: 'Lugar: Parque Principal', icon: '⛪' },
      { hora: '11:00 AM', titulo: '7.º Festival Gastronómico', desc: 'Lugar: Parque Principal', icon: '🍲' },
      { hora: '12:30 PM', titulo: 'Degustación del Frijol Liborino', desc: 'Parque Principal', icon: '🫘' },
      { hora: '2:00 PM', titulo: 'Cabalgata', desc: 'Liborina', icon: '🐎' },
      {
        hora: '2:00 PM',
        titulo: 'Presentaciones Artísticas - Tarde',
        desc: 'Parque Principal',
        artistas: ['2:00 PM - Nueva Revelación', '3:30 PM - Impacto Paisa', '5:00 PM - Chelo JL'],
        icon: '🎶',
      },
      {
        hora: '9:00 PM',
        titulo: 'Gran Cierre',
        desc: 'Parque Principal - Liborina',
        artistas: ['9:00 PM - Maleja', '10:30 PM - Los Corraleros Dinastía Gutiérrez', '12:00 AM - Alex Rojas'],
        icon: '🎊',
        destacado: true,
      },
    ],
  },
];

const FAQS = [
  { q: '¿Cuándo son las Fiestas del Frijol Liborino 2026?', a: 'Del jueves 12 al domingo 15 de noviembre de 2026 en el Parque Principal de Liborina, Antioquia.' },
  { q: '¿Dónde queda Liborina?', a: 'Liborina es un municipio del Occidente de Antioquia, a 80 km de Medellín, reconocido como la capital del frijol liborino y por su chiva.' },
  { q: '¿Hay que pagar entrada a las Fiestas del Frijol?', a: 'No. Todos los eventos de las Fiestas del Frijol Liborino son de entrada libre, organizados por la Alcaldía de Liborina.' },
  { q: '¿Qué artistas vienen a las Fiestas del Frijol 2026?', a: 'Los Corraleros Dinastía Gutiérrez, Sinú Orquesta, Banda 10 Orquesta, Alex Rojas, Esteban y Wilson, Chelo Ramírez, Herencia Flow, Antioquia en el Mapa, Impacto Paisa, Nueva Revelación, Chelo JL y Maleja.' },
  { q: '¿Qué es la degustación del frijol liborino?', a: 'Es el evento central del domingo 15 de noviembre a las 12:30 p.m. en el Parque Principal, donde se degusta el frijol cargamanto típico de Liborina.' },
  { q: '¿Dónde me quedo en Liborina para las fiestas?', a: 'Puedes buscar hoteles, fincas y hospedaje en Liborina en el directorio de Ooasys. Reserva con anticipación porque se llena.' },
];

function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default async function FiestasFrijolLiborinaPage() {
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
    name: 'Fiestas del Frijol Liborino 2026 - Liborina, Antioquia',
    description: 'Fiestas del Frijol Liborino en Liborina, Antioquia, del 12 al 15 de noviembre de 2026. 7.º Festival Gastronómico, degustación del frijol liborino, cabalgata infantil y mayor, caminata ecológica, Copa Frijolera del Millón, feria de emprendimiento, mercado campesino, eucaristía campal y grandes conciertos.',
    startDate: '2026-11-12T16:00:00-05:00',
    endDate: '2026-11-15T23:59:00-05:00',
    url: pageUrl,
    inLanguage: 'es-CO',
    isAccessibleForFree: true,
    image: [ogImageAbsolute],
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Parque Principal de Liborina',
      address: { '@type': 'PostalAddress', streetAddress: 'Parque Principal', addressLocality: 'Liborina', addressRegion: 'Antioquia', addressCountry: 'CO' },
      geo: { '@type': 'GeoCoordinates', latitude: 6.678, longitude: -75.813 },
    },
    organizer: [
      { '@type': 'Organization', name: 'Alcaldía de Liborina', url: 'https://www.liborina-antioquia.gov.co/' },
      { '@type': 'Organization', name: 'E.S.E. Hospital San Lorenzo' },
      { '@type': 'Organization', name: 'Fábrica de Licores de Antioquia' },
      { '@type': 'Organization', name: 'IDEA' },
    ],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP', availability: 'https://schema.org/InStock', url: pageUrl },
    performer: [
      { '@type': 'MusicGroup', name: 'Los Corraleros Dinastía Gutiérrez' },
      { '@type': 'MusicGroup', name: 'Sinú Orquesta' },
      { '@type': 'MusicGroup', name: 'Banda 10 Orquesta' },
      { '@type': 'Person', name: 'Alex Rojas' },
      { '@type': 'MusicGroup', name: 'Esteban y Wilson' },
      { '@type': 'Person', name: 'Chelo Ramírez' },
      { '@type': 'Person', name: 'Herencia Flow' },
      { '@type': 'MusicGroup', name: 'Antioquia en el Mapa' },
      { '@type': 'MusicGroup', name: 'Impacto Paisa' },
      { '@type': 'Person', name: 'Nueva Revelación' },
      { '@type': 'Person', name: 'Chelo JL' },
      { '@type': 'Person', name: 'Maleja' },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Fiestas del Frijol Liborino 2026', item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(eventJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />

      <main className="min-h-screen bg-[#FFF8E7] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors font-sans">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF8E7] via-[#FFD180] to-[#8D1B1B] text-[#4A0D0D]">
          <div className="absolute top-6 left-4 md:left-8 z-50">
            <Link href="/" className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-4 py-2.5 rounded-full text-sm font-bold transition-all border border-white/30 shadow-lg group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              Volver al Inicio
            </Link>
          </div>

          <div className="absolute inset-0 bg-linear-to-b from-black/5 to-[#6D0000]/20 z-10" />

          <div className="relative z-20 max-w-7xl mx-auto px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-[#6D0000] text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest mb-4">
                <span aria-hidden="true">🫘</span> LIBORINA • OCCIDENTE ANTIOQUEÑO
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                <span className="inline-block text-xl font-serif italic font-normal mb-3 bg-[#6D0000] text-white px-4 py-1 rounded-full -rotate-2">
                  Fiestas del
                </span>
                <span className="block text-[#6D0000] drop-shadow-sm">FRIJOL LIBORINO 2026</span>
                <span className="block mt-3 text-2xl lg:text-3xl font-bold tracking-normal text-white drop-shadow-md">
                  en Liborina, Antioquia
                </span>
              </h1>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="bg-white text-[#6D0000] font-black px-6 py-3 rounded-full text-xl shadow-xl">
                  12 AL 15 NOV
                </div>
                <div className="bg-black text-white px-6 py-3 rounded-full font-bold">¡ENTRADA LIBRE!</div>
              </div>

              <p className="mt-6 text-lg text-[#4A0D0D] font-medium max-w-xl leading-relaxed">
                Cuatro días pa celebrar el frijol que nos dio fama en el mundo. Festival Gastronómico, degustación del cargamanto liborino, cabalgata, Copa Frijolera del Millón, mercado campesino, reconocimiento a los frijoleros y noches con Los Corraleros, Sinú Orquesta y Banda 10. ¡Pura tradición liborina!
              </p>

              <div className="mt-8 flex gap-4">
                <a href="#programacion" className="bg-[#6D0000] text-white px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition shadow-lg">
                  VER PROGRAMACIÓN <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative mt-12 lg:mt-0">
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)] border-8 border-white/60 rotate-1 bg-[#FFF8E7]">
                <Image src={ogImagePath} alt="Fiestas del Frijol Liborino 2026 en Liborina, Antioquia" fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#FFD600] text-black font-black px-6 py-3 rounded-2xl -rotate-4 shadow-xl z-30">
                <span aria-hidden="true">🫘</span> DEGUSTACIÓN DEL FRIJOL
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-[#6D0000] font-black px-6 py-3 rounded-2xl rotate-6 shadow-xl z-30">
                <span aria-hidden="true">🍲</span> FESTIVAL GASTRONÓMICO
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Resumen de las fiestas" className="max-w-7xl mx-auto px-4 -mt-8 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: 'Festival Gastronómico', d: 'Dom 15 nov - 11:00 AM Parque', i: '🍲' },
            { t: 'Copa Frijolera del Millón', d: 'Vie 13 nov - 11:00 AM Coliseo', i: '⚽' },
            { t: 'Los Corraleros', d: 'Sinú Orquesta, Banda 10, Alex Rojas', i: '🎤' },
          ].map((item) => (
            <div key={item.t} className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-5 shadow-xl border border-[#FFCC80] flex gap-4">
              <div className="text-3xl" aria-hidden="true">{item.i}</div>
              <div>
                <div className="font-black">{item.t}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{item.d}</div>
              </div>
            </div>
          ))}
        </section>

        <section id="programacion" className="max-w-7xl mx-auto px-4 py-16 lg:py-24 scroll-mt-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight">PROGRAMACIÓN LIBORINA</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-lg">Todo lo que va a pasar en Liborina, día por día. Guarda esta página.</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {programa.map((dia) => (
              <article key={`${dia.fecha}`} className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-lg border border-zinc-100 flex flex-col">
                <div className={`${dia.color} text-white p-5 drop-shadow-sm`}>
                  <h3>
                    <span className="block text-2xl font-black leading-none mt-1 drop-shadow-md">{dia.dia.toUpperCase()}</span>
                    <span className="block text-xl font-black leading-none mt-1 drop-shadow-md">{dia.fecha}</span>
                  </h3>
                </div>
                <ul className="p-5 space-y-5 flex-1">
                  {dia.eventos.map((ev, j) => (
                    <li key={j} className={ev.destacado ? 'bg-gradient-to-r from-[#6D0000] via-[#A40000] to-[#D32F2F] text-white -mx-5 px-5 py-4 rounded-xl shadow-md' : ''}>
                      <div className="flex gap-3">
                        <div className="text-2xl" aria-hidden="true">{ev.icon}</div>
                        <div className="flex-1">
                          <div className={`font-bold ${ev.destacado ? 'text-[#FFCC80]' : 'text-[#6D0000] dark:text-red-400'}`}>{ev.hora}</div>
                          <div className={`font-black leading-tight ${ev.destacado ? 'text-white' : ''}`}>{ev.titulo}</div>
                          {ev.desc && (<div className={`text-sm mt-1 leading-snug ${ev.destacado ? 'text-orange-100' : 'text-zinc-600 dark:text-zinc-300'}`}>{ev.desc}</div>)}
                          {ev.artistas && (
                            <ul className="mt-2 space-y-1">
                              {ev.artistas.map((a) => (
                                <li key={a} className="text-sm font-semibold text-white leading-snug">- {a}</li>
                              ))}
                            </ul>
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

        <section className="max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
          <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-3xl border border-zinc-100 shadow-lg p-6 md:p-10">
            <h2 className="text-3xl font-black tracking-tight">Cómo llegar y dónde quedarte</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <div>
                <h3 className="font-black text-lg text-zinc-900 dark:text-white">Cómo llegar a Liborina</h3>
                <p className="mt-2">Liborina está en el Occidente de Antioquia. El evento principal es en el <strong>Parque Principal de Liborina</strong>, frente a la Parroquia San Lorenzo.</p>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#A40000] to-[#6D0000] px-5 py-2.5 font-bold text-white hover:opacity-90 transition">
                  <MapPin className="h-4 w-4" aria-hidden="true" /> Ver ubicación en Google Maps
                </a>
              </div>
              <div>
                <h3 className="font-black text-lg text-zinc-900 dark:text-white">Dónde quedarte</h3>
                <p className="mt-2">Si vienes de otra ciudad, busca hoteles, fincas y hospedaje en la <Link href="/municipios/liborina" className="font-bold text-[#6D0000] dark:text-red-400 hover:underline">guía de Liborina</Link> o explora todas las <Link href="/categorias" className="font-bold text-[#6D0000] dark:text-red-400 hover:underline">categorías del directorio</Link>.</p>
              </div>
            </div>

            {negociosLiborina.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-black">Negocios en Liborina</h3>
                <div className="mt-4 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {negociosLiborina.map((b) => (<BusinessCard key={b._id} business={b} showDescription={false} />))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#6D0000] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black">¿Por qué ir a las Fiestas del Frijol?</h2>
              <div className="mt-4 space-y-4 text-orange-100 leading-relaxed">
                <p>Las <strong>Fiestas del Frijol Liborino en Liborina, Antioquia</strong>, organizadas por la Alcaldía de Liborina, la E.S.E. Hospital San Lorenzo y patrocinadores como FLA, Colanta e IDEA, son el homenaje más grande al frijol cargamanto que nos hizo famosos en el mundo.</p>
                <p>Vivirás <strong>7.º Festival Gastronómico, degustación del frijol liborino, cabalgata infantil y cabalgata mayor, caminata ecológica desde el Hospital San Lorenzo, Copa Frijolera del Millón, feria de emprendimiento, mercado campesino, reconocimiento a los frijoleros, remates Altar de San Isidro y eucaristía campal</strong>.</p>
                <p>En tarima estarán <strong>Los Corraleros Dinastía Gutiérrez, Sinú Orquesta, Banda 10 Orquesta, Alex Rojas, Esteban y Wilson, Chelo Ramírez, Herencia Flow, Antioquia en el Mapa, Impacto Paisa, Nueva Revelación, Chelo JL y Maleja</strong>. La entrada es libre.</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-3xl p-8 border border-white/20">
              <h2 className="font-black text-xl">Preguntas frecuentes</h2>
              <dl className="mt-6 space-y-4 text-sm text-orange-100">
                {FAQS.map((faq) => (
                  <div key={faq.q}>
                    <dt className="font-bold text-white">{faq.q}</dt>
                    <dd className="mt-1">{faq.a}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 bg-[#FFD600] text-black rounded-xl p-4 font-black text-center">¡NOS VEMOS EN LIBORINA, TIERRA DEL FRIJOL!</div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Página informativa de Ooasys - Directorio del Occidente Antioqueño</p>
          <h2 className="font-black text-2xl mt-2">¿Tienes un negocio en Liborina? ¡Inscríbelo en Ooasys!</h2>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold text-red-700 dark:text-red-400 hover:underline">Escríbenos por WhatsApp: 320 620 9817</a>
        </section>
      </main>
    </>
  );
}