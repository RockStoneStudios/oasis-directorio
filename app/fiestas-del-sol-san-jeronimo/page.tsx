import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { getBusinesses } from '@/actions/getBusinesses';
import { BusinessCard } from '@/components/BusinessCard';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ooasys.com';
const pageUrl = `${baseUrl}/fiestas-del-sol-san-jeronimo`;
const ogImage = '/fiestas-sol.jpg';

const WHATSAPP_URL = 'https://wa.me/573206209817?text=Hola%2C%20quiero%20inscribir%20mi%20negocio%20en%20Ooasys';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Parque+Principal+San+Jer%C3%B3nimo+Antioquia';
const title = 'Fiestas del Sol y el Agroturismo 2026 | San Jerónimo, Antioquia';
const description =
  'Programación Fiestas del Sol y el Agroturismo en San Jerónimo 2026: 13 al 15 de noviembre. Cabalgata del Sol, Festival de la Trova, Alex Manga, Luis Felipe González y más. Entrada libre.';

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
      'Vive las Fiestas del Sol y el Agroturismo del 13 al 15 de noviembre de 2026 en San Jerónimo. Cabalgata, trova, cafés especiales, mercados campesinos y grandes shows.',
    url: pageUrl,
    siteName: 'Ooasys',
    type: 'website',
    locale: 'es_CO',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Fiestas del Sol y el Agroturismo 2026 en San Jerónimo, Antioquia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: 'Del 13 al 15 nov 2026: Cabalgata del Sol, Festival de la Trova y shows con Alex Manga y Luis Felipe González. Entrada libre.',
    images: [ogImage],
  },
};

const programa = [
  {
    dia: 'Viernes',
    fecha: '13 de noviembre',
    color: 'bg-gradient-to-r from-[#FFD600] via-[#FFC107] to-[#1B5E20]',
    eventos: [
      { hora: '5:30 AM', titulo: 'Alborada', desc: 'Salida: Parque Principal', icon: '🎉' },
      { hora: '8:00 AM', titulo: 'Emprendimientos y Muestra Artesanal', desc: 'Parque Principal', icon: '🎨' },
      { hora: '2:30 PM', titulo: 'Torneo de Fútbol Sala', icon: '⚽' },
      { hora: '4:00 PM', titulo: 'Desfile Inaugural Carnaval del Sol - Encuentro de Bandas', desc: 'Salida: Leticia', icon: '🎭' },
      { hora: '6:00 PM', titulo: 'Eucaristía', desc: 'Iglesia Nuestra Señora de la Candelaria', icon: '⛪' },
      { hora: '7:00 PM', titulo: 'Presentación de Bandas', desc: 'Parque Principal', icon: '🎺' },
      {
        hora: '8:00 PM',
        titulo: 'Noche Juvenil - Show Musical',
        artistas: ['Antioquia en el Mapa Reggeton', 'Francisco Javier Vallenato', 'Francisco Gómez', 'DJ Ferre', 'Orquesta de la Policía'],
        icon: '🎤',
        destacado: true,
      },
    ],
  },
  {
    dia: 'Sábado',
    fecha: '14 de noviembre',
    color: 'bg-gradient-to-r from-[#FFD600] via-[#FFC107] to-[#1B5E20]',
    eventos: [
      { hora: '7:00 AM', titulo: 'Festival de Atletismo "Carrera del Sol"', icon: '🏃' },
      { hora: '8:00 AM', titulo: 'Mercados Campesino y Cafés Especiales', desc: 'Emprendimientos y Muestra Artesanal - Parque Principal', icon: '☕' },
      { hora: '10:00 AM', titulo: 'Artistas Locales', desc: 'Parque Principal', icon: '🎶' },
      { hora: '4:00 PM', titulo: 'Entre Sabores y Destinos', desc: 'Encuentro gastronómico y hotelero', icon: '🍲' },
      { hora: '6:00 PM', titulo: 'Eucaristía', desc: 'Iglesia Nuestra Señora de la Candelaria', icon: '⛪' },
      {
        hora: '8:00 PM',
        titulo: 'Show Musical',
        artistas: ['Luis Felipe González', 'Alex Manga', 'Junior Posada', 'Tropinova'],
        icon: '🎤',
        destacado: true,
      },
    ],
  },
  {
    dia: 'Domingo',
    fecha: '15 de noviembre',
    color: 'bg-gradient-to-r from-[#FFD600] via-[#FFC107] to-[#1B5E20]',
    eventos: [
      { hora: '8:00 AM', titulo: 'Cafés Especiales, Emprendimientos y Muestra Artesanal', desc: 'Parque Principal', icon: '☕' },
      { hora: '8:00 AM', titulo: 'Muestra de Patinaje', desc: 'Pista de Patinaje', icon: '⛸️' },
      { hora: '1:30 PM', titulo: 'Cabalgata del Sol', icon: '🐴' },
      { hora: '2:00 PM', titulo: 'Artistas Locales', desc: 'Parque Principal', icon: '🎶' },
      { hora: '3:00 PM', titulo: 'Festival de la Trova Sol de Oro', icon: '🎸' },
      { hora: '6:00 PM', titulo: 'Eucaristía', desc: 'Iglesia Nuestra Señora de la Candelaria', icon: '⛪' },
      {
        hora: '8:00 PM',
        titulo: 'Show Musical',
        artistas: ['Las Jefas del Despecho', 'Wilmer Saldarriaga', 'Andariego', 'Manbo Fernando González y su Combo Que Nota'],
        icon: '🎤',
        destacado: true,
      },
    ],
  },
];

const FAQS = [
  { q: '¿Cuándo son las Fiestas del Sol y el Agroturismo en San Jerónimo 2026?', a: 'Del viernes 13 al domingo 15 de noviembre de 2026 en el Parque Principal de San Jerónimo, Antioquia.' },
  { q: '¿Dónde queda San Jerónimo?', a: 'Es un municipio del Occidente de Antioquia, a 1 hora de Medellín, ideal para ir y volver el mismo día o quedarse en hoteles y hospedaje.' },
  { q: '¿Hay que pagar entrada a las Fiestas de San Jerónimo?', a: 'No. Todos los eventos de las Fiestas del Sol y el Agroturismo son de entrada libre.' },
  { q: '¿Qué artistas vienen a las Fiestas de San Jerónimo 2026?', a: ' Alex Manga, Luis Felipe González, Junior Posada, Tropinova, Las Jefas del Despecho, Wilmer Saldarriaga, Andariego y más.' },
  { q: '¿Dónde me quedo en San Jerónimo para las fiestas?', a: 'Puedes buscar hoteles, hospedaje y glamping en San Jerónimo en el directorio de Ooasys. Reserva con anticipación porque se llenan.' },
  { q: '¿Dónde se hace la Cabalgata del Sol?', a: 'El domingo 15 de noviembre a la 1:30 PM. Es el evento insignia de las Fiestas del Sol en San Jerónimo.' },
];

function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default async function FiestasSanJeronimoPage() {
  let negociosSanJeronimo: any[] = [];
  try {
    const result = await getBusinesses({ municipality: 'san-jeronimo', pageSize: 4 } as any);
    negociosSanJeronimo = (result?.businesses ?? []).slice(0, 4);
  } catch {
    negociosSanJeronimo = [];
  }

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    '@id': `${pageUrl}#evento`,
    name: 'Fiestas del Sol y el Agroturismo 2026 - San Jerónimo, Antioquia',
    description: 'Fiestas del Sol y el Agroturismo en San Jerónimo, Antioquia, del 13 al 15 de noviembre de 2026. Cabalgata del Sol, Festival de la Trova Sol de Oro, Mercados Campesinos, Cafés Especiales, Carrera del Sol y shows musicales.',
    startDate: '2026-11-13T05:30:00-05:00',
    endDate: '2026-11-15T23:59:00-05:00',
    url: pageUrl,
    inLanguage: 'es-CO',
    isAccessibleForFree: true,
    image: [`${baseUrl}${ogImage}`],
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Parque Principal de San Jerónimo',
      address: { '@type': 'PostalAddress', streetAddress: 'Parque Principal, San Jerónimo', addressLocality: 'San Jerónimo', addressRegion: 'Antioquia', addressCountry: 'CO' },
      geo: { '@type': 'GeoCoordinates', latitude: 6.4714, longitude: -75.7173 },
    },
    organizer: [
      { '@type': 'Organization', name: 'Municipio de San Jerónimo', url: 'https://www.sanjeronimo-antioquia.gov.co/' },
      { '@type': 'Organization', name: 'Comerciantes de San Jerónimo' ,url: pageUrl},
    ],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP', availability: 'https://schema.org/InStock', url: pageUrl },
    performer: [
      { '@type': 'Person', name: 'Alex Manga' },
      { '@type': 'Person', name: 'Luis Felipe González' },
      { '@type': 'Person', name: 'Junior Posada' },
      { '@type': 'MusicGroup', name: 'Tropinova' },
      { '@type': 'MusicGroup', name: 'Las Jefas del Despecho' },
      { '@type': 'Person', name: 'Wilmer Saldarriaga' },
      { '@type': 'MusicGroup', name: 'Andariego' },
      { '@type': 'MusicGroup', name: 'Manbo Fernando González y su Combo Que Nota' },
      { '@type': 'Person', name: 'Francisco Gómez' },
      { '@type': 'Person', name: 'Francisco Javier Vallenato' },
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
      { '@type': 'ListItem', position: 2, name: 'Fiestas de San Jerónimo 2026', item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(eventJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />

      <main className="min-h-screen bg-[#FFFBEB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors font-sans">
        {/* HERO - AMARILLO A VERDE SAN JERÓNIMO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFD600] via-[#FFC107] to-[#1B5E20] text-[#1B3A1B]">
          <div className="absolute top-6 left-4 md:left-8 z-50">
            <Link href="/" className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-4 py-2.5 rounded-full text-sm font-bold transition-all border border-white/30 shadow-lg group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              Volver al Inicio
            </Link>
          </div>

          <div className="absolute inset-0 bg-linear-to-b from-black/5 to-[#1B5E20]/10 z-10" />

          <div className="relative z-20 max-w-7xl mx-auto px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-[#1B5E20] text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest mb-4">
                <span aria-hidden="true">📍</span> SAN JERÓNIMO • ANTIOQUIA
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                <span className="inline-block text-xl font-serif italic font-normal mb-3 bg-[#1B5E20] text-white px-4 py-1 rounded-full -rotate-2">
                  Fiestas del
                </span>
                <span className="block text-[#1B3A1B] drop-shadow-sm">SOL Y EL AGROTURISMO 2026</span>
                <span className="block mt-3 text-2xl lg:text-3xl font-bold tracking-normal text-white drop-shadow-md">
                  en San Jerónimo, Antioquia
                </span>
              </h1>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="bg-white text-[#1B5E20] font-black px-6 py-3 rounded-full text-xl shadow-xl">
                  13 AL 15 NOV
                </div>
                <div className="bg-black text-white px-6 py-3 rounded-full font-bold">¡ENTRADA LIBRE!</div>
              </div>

              <p className="mt-6 text-lg text-[#1B3A1B] font-medium max-w-xl leading-relaxed">
                Tres días de sol, café, campo y música en el Occidente Antioqueño. Cabalgata del Sol, Festival de la Trova, mercados campesinos y grandes artistas. ¡Te espera San Jerónimo!
              </p>

              <div className="mt-8 flex gap-4">
                <a href="#programacion" className="bg-[#1B5E20] text-white px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition shadow-lg">
                  VER PROGRAMACIÓN <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative mt-12 lg:mt-0">
              <div className="relative aspect-4/5 rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)] border-8 border-white/60 rotate-1 bg-[#FFD600]">
                <Image src="/fiestas-sol.jpg" alt="Fiestas del Sol y el Agroturismo 2026 en San Jerónimo, Antioquia" fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-yellow-300 text-black font-black px-6 py-3 rounded-2xl -rotate-4 shadow-xl z-30">
                <span aria-hidden="true">🐴</span> CABALGATA DEL SOL
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-[#1B5E20] font-black px-6 py-3 rounded-2xl rotate-6 shadow-xl z-30">
                <span aria-hidden="true">🗣️</span> FESTIVAL DE LA TROVA
              </div>
            </div>
          </div>
        </section>

        {/* INFO RÁPIDA */}
        <section aria-label="Resumen de las fiestas" className="max-w-7xl mx-auto px-4 -mt-8 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: 'Cabalgata del Sol', d: 'Domingo 15 nov - 1:30 PM', i: '🐴' },
            { t: 'Festival de la Trova', d: 'Domingo 15 nov - 3 PM Sol de Oro', i: '🎸' },
            { t: 'Shows en vivo', d: 'Alex Manga, Luis Felipe González y más', i: '🎤' },
          ].map((item) => (
            <div key={item.t} className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-5 shadow-xl border border-[#FFC107] flex gap-4">
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
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight">PROGRAMACIÓN DE LAS FIESTAS</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-lg">Todo lo que va a pasar en San Jerónimo, día por día. Guarda esta página.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {programa.map((dia) => (
              <article key={`${dia.fecha}`} className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded- overflow-hidden shadow-lg border border-zinc-100 flex flex-col">
                <div className={`${dia.color} text-white p-5 drop-shadow-sm`}>
                  <h3>
                    <span className="block text-2xl font-black leading-none mt-1 drop-shadow-md">{dia.dia === 'Viernes' ? 'VIERNES' : dia.dia === 'Sábado' ? 'SÁBADO' : 'DOMINGO'}</span>
                    <span className="block text-xl font-black leading-none mt-1 drop-shadow-md">{dia.fecha}</span>
                  </h3>
                </div>
                <ul className="p-5 space-y-5 flex-1">
                  {dia.eventos.map((ev, j) => (
                    <li key={j} className={ev.destacado ? 'bg-gradient-to-r from-[#FFD600] via-[#FFC107] to-[#1B5E20] text-white -mx-5 px-5 py-4 rounded-xl shadow-md' : ''}>
                      <div className="flex gap-3">
                        <div className="text-2xl" aria-hidden="true">{ev.icon}</div>
                        <div className="flex-1">
                          <div className={`font-bold ${ev.destacado ? 'text-[#1B3A1B]' : 'text-[#1B5E20] dark:text-green-400'}`}>{ev.hora}</div>
                          <div className={`font-black leading-tight ${ev.destacado ? 'text-[#1B3A1B]' : ''}`}>{ev.titulo}</div>
                          {ev.desc && (<div className={`text-sm mt-1 leading-snug ${ev.destacado ? 'text-[#1B3A1B]' : 'text-zinc-600 dark:text-zinc-300'}`}>{ev.desc}</div>)}
                          {ev.artistas && (
                            <ul className="mt-2 space-y-1">
                              {ev.artistas.map((a) => (
                                <li key={a} className="text-sm font-semibold text-[#082c08] leading-snug">- {a}</li>
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

        {/* CÓMO LLEGAR Y DÓNDE QUEDARSE */}
        <section className="max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
          <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded- border border-zinc-100 shadow-lg p-6 md:p-10">
            <h2 className="text-3xl font-black tracking-tight">Cómo llegar y dónde quedarte</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <div>
                <h3 className="font-black text-lg text-zinc-900 dark:text-white">Cómo llegar a San Jerónimo</h3>
                <p className="mt-2">San Jerónimo es un municipio del Occidente de Antioquia, a 1 hora de Medellín. El evento principal es en el <strong>parque principal de San Jerónimo</strong>.</p>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFC107] to-[#1B5E20] px-5 py-2.5 font-bold text-white hover:opacity-90 transition">
                  <MapPin className="h-4 w-4" aria-hidden="true" /> Ver ubicación en Google Maps
                </a>
              </div>
              <div>
                <h3 className="font-black text-lg text-zinc-900 dark:text-white">Dónde quedarte</h3>
                <p className="mt-2">Si vienes de otra ciudad, busca hoteles, hospedaje y glamping en la <Link href="/municipios/san-jeronimo" className="font-bold text-[#1B5E20] dark:text-green-400 hover:underline">guía de San Jerónimo</Link> o explora todas las <Link href="/categorias" className="font-bold text-[#1B5E20] dark:text-green-400 hover:underline">categorías del directorio</Link>.</p>
              </div>
            </div>

            {negociosSanJeronimo.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-black">Negocios en San Jerónimo</h3>
                <div className="mt-4 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {negociosSanJeronimo.map((b) => (<BusinessCard key={b._id} business={b} showDescription={false} />))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* TEXTO + FAQ */}
        <section className="bg-[#1B5E20] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black">¿Por qué ir a las Fiestas de San Jerónimo?</h2>
              <div className="mt-4 space-y-4 text-green-100 leading-relaxed">
                <p>Las <strong>Fiestas del Sol y el Agroturismo en San Jerónimo</strong>, organizadas por el Municipio de San Jerónimo, son la fiesta más esperada del Occidente Antioqueño. Tres días para celebrar el campo, el café y la música.</p>
                <p>Vivirás <strong>Cabalgata del Sol, Festival de la Trova Sol de Oro, Carrera del Sol, mercados campesinos, cafés especiales, muestra artesanal, encuentro gastronómico y hotelero, y desfile inaugural Carnaval del Sol</strong>.</p>
                <p>En tarima estarán <strong>Alex Manga, Luis Felipe González, Junior Posada, Tropinova, Las Jefas del Despecho, Wilmer Saldarriaga, Andariego y Manbo Fernando González</strong>, entre otros. La entrada es libre.</p>
              </div>
            </div>

            <div className="bg-white/10 rounded- p-8 border border-white/20">
              <h2 className="font-black text-xl">Preguntas frecuentes</h2>
              <dl className="mt-6 space-y-4 text-sm text-green-100">
                {FAQS.map((faq) => (
                  <div key={faq.q}>
                    <dt className="font-bold text-white">{faq.q}</dt>
                    <dd className="mt-1">{faq.a}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 bg-[#FFD600] text-[#1B3A1B] rounded-xl p-4 font-black text-center">¡NOS VEMOS EN SAN JERÓNIMO!</div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-12 px-4 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Página informativa de Ooasys - Directorio del Occidente Antioqueño</p>
          <h2 className="font-black text-2xl mt-2">¿Tienes un negocio en San Jerónimo? ¡Inscríbelo en Ooasys!</h2>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">Escríbenos por WhatsApp: 320 620 9817</a>
        </section>
      </main>
    </>
  );
}