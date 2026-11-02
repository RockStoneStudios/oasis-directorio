import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { getBusinesses } from '@/actions/getBusinesses';
import { BusinessCard } from '@/components/BusinessCard';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ooasys.com';
const pageUrl = `${baseUrl}/fiestas-campesino-progreso-llanadas-olaya`;
const ogImage = 'llanadas.jpg';

const WHATSAPP_URL = 'https://wa.me/573206209817?text=Hola%2C%20quiero%20inscribir%20mi%20negocio%20en%20Ooasys';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Parque+Corregimiento+Llanadas+Olaya+Antioquia';

// 1. TÍTULO OPTIMIZADO
const title = 'Fiestas del Campesino y el Progreso Llanadas Olaya 2026: Programación Oficial';
// 2. META DESCRIPTION
const description =
  'Programación oficial Fiestas del Campesino y el Progreso en Llanadas, Olaya 2026 del 13 al 15 de noviembre. Concurso de Sancochos, Día del Campesino, Bingo, Noche Campesina con Gato Negro, Hebert Vargas y Rikarena.';

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
      'Vive las Fiestas del Campesino y el Progreso del 13 al 15 de noviembre de 2026 en Llanadas, Olaya. Concurso de Sancochos, Día del Campesino, Bingo, cultura y conciertos con Gato Negro, Manuel Alcaraz, Hebert Vargas y Rikarena.',
    url: pageUrl,
    siteName: 'Ooasys',
    type: 'website',
    locale: 'es_CO',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Fiestas del Campesino y el Progreso 2026 en Llanadas, Olaya, Antioquia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: 'Del 13 al 15 nov 2026: Programación oficial, Concurso de Sancochos, Día del Campesino, Gran Bingo y noche con Gato Negro, Manuel Alcaraz, Hebert Vargas y Rikarena. Entrada libre.',
    images: [ogImage],
  },
};

const programa = [
  {
    dia: 'Viernes',
    fecha: '13 de noviembre',
    color: 'bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#81C784]',
    eventos: [
      { hora: '7:00 PM', titulo: 'Noche Cultural "Cultura Olayense"', desc: 'Parque, Corregimiento de Llanadas', icon: '🎭' },
      { hora: '9:00 PM', titulo: 'Talento Local - Alex Caro', desc: 'Parque, Corregimiento de Llanadas', icon: '🎤' },
    ],
  },
  {
    dia: 'Sábado',
    fecha: '14 de noviembre',
    color: 'bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#81C784]',
    eventos: [
      { hora: '9:00 AM', titulo: 'Encuentro Deportivo', desc: 'Coliseo, Corregimiento de Llanadas', icon: '⚽' },
      { hora: '2:00 PM', titulo: 'Reconocimiento Líderes J.A.C', desc: 'Parque, Corregimiento de Llanadas', icon: '🤝' },
      { hora: '3:00 PM', titulo: 'Presentación El Enamorado del Despecho', desc: 'Parque, Corregimiento de Llanadas', icon: '🎶' },
      { hora: '4:00 PM', titulo: 'Gran Bingo Proparroquia', desc: 'Parque, Corregimiento de Llanadas', icon: '🎱' },
      {
        hora: '8:00 PM',
        titulo: 'Noche de Fiesta',
        desc: 'Parque, Corregimiento de Llanadas',
        artistas: ['8:00 PM - Talento Local', '10:00 PM - Yo Me Llamo "RIKARENA"', '12:00 AM - Yo Me Llamo "HEBERT VARGAS"'],
        icon: '🎉',
        destacado: true,
      },
    ],
  },
  {
    dia: 'Domingo',
    fecha: '15 de noviembre',
    color: 'bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#81C784]',
    eventos: [
      { hora: '7:00 AM', titulo: 'Concurso de Sancochos', desc: 'Apertura - Parque, Corregimiento de Llanadas', icon: '🍲' },
      { hora: '1:00 PM', titulo: 'Celebración Día del Campesino', desc: 'Entrega de detalles a los Campesinos - Parque', icon: '🌽' },
      { hora: '1:00 PM', titulo: 'Premiación Concurso de Sancochos', desc: 'Parque, Corregimiento de Llanadas', icon: '🏆' },
      { hora: '3:00 PM', titulo: 'Presentación Los Rumberos Montañeros', desc: 'Parque, Corregimiento de Llanadas', icon: '🎸' },
      {
        hora: '8:00 PM',
        titulo: 'Noche Campesina',
        desc: 'Parque, Corregimiento de Llanadas',
        artistas: ['8:00 PM - Talento Local', '10:00 PM - GATO NEGRO', '12:00 AM - Manuel Alcaraz y su Conjunto'],
        icon: '🌾',
        destacado: true,
      },
    ],
  },
];

const FAQS = [
  { q: '¿Cuándo son las Fiestas del Campesino y el Progreso en Llanadas 2026?', a: 'Del viernes 13 al domingo 15 de noviembre de 2026 en el Parque del Corregimiento de Llanadas, Olaya, Antioquia.' },
  { q: '¿Dónde queda Llanadas, Olaya?', a: 'Llanadas es un corregimiento de Olaya, en el Occidente de Antioquia, a 2 horas aproximadamente de Medellín, reconocido por su cultura cafetera y campesina.' },
  { q: '¿Hay que pagar entrada a las Fiestas de Llanadas?', a: 'No. Todos los eventos de las Fiestas del Campesino y el Progreso son de entrada libre, organizados por la Alcaldía de Olaya.' },
  { q: '¿Qué artistas vienen a las Fiestas de Llanadas 2026?', a: 'Gato Negro, Manuel Alcaraz y su Conjunto, Yo Me Llamo Hebert Vargas, Yo Me Llamo Rikarena, El Enamorado del Despecho, Los Rumberos Montañeros, Alex Caro y talento local.' },
  { q: '¿Qué es el Concurso de Sancochos en Llanadas?', a: 'Es el evento tradicional del domingo 15 de noviembre a las 7:00 AM en el parque de Llanadas, donde familias campesinas compiten por el mejor sancocho.' },
  { q: '¿Dónde me quedo en Olaya para las fiestas?', a: 'Puedes buscar hoteles, fincas y hospedaje en Olaya y Llanadas en el directorio de Ooasys. Reserva con anticipación.' },
];

function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default async function FiestasLlanadasOlayaPage() {
  let negociosOlaya: any[] = [];
  try {
    const result = await getBusinesses({ municipality: 'olaya', pageSize: 4 } as any);
    negociosOlaya = (result?.businesses ?? []).slice(0, 4);
  } catch {
    negociosOlaya = [];
  }

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    '@id': `${pageUrl}#evento`,
    name: 'Fiestas del Campesino y el Progreso 2026 - Llanadas, Olaya, Antioquia',
    description: 'Fiestas del Campesino y el Progreso en el Corregimiento de Llanadas, Olaya, Antioquia, del 13 al 15 de noviembre de 2026. Concurso de Sancochos, Día del Campesino, Encuentro Deportivo, Reconocimiento J.A.C, Gran Bingo y noches con Gato Negro, Manuel Alcaraz, Hebert Vargas y Rikarena.',
    startDate: '2026-11-13T19:00:00-05:00',
    endDate: '2026-11-15T23:59:00-05:00',
    url: pageUrl,
    inLanguage: 'es-CO',
    isAccessibleForFree: true,
    image: [`${baseUrl}${ogImage}`],
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Parque del Corregimiento de Llanadas, Olaya',
      address: { '@type': 'PostalAddress', streetAddress: 'Parque, Corregimiento de Llanadas', addressLocality: 'Olaya', addressRegion: 'Antioquia', addressCountry: 'CO' },
      geo: { '@type': 'GeoCoordinates', latitude: 6.632, longitude: -75.817 },
    },
    organizer: [
      { '@type': 'Organization', name: 'Alcaldía de Olaya', url: 'https://www.olaya-antioquia.gov.co/' },
      { '@type': 'Person', name: 'Jesús David Hernández - Alcalde Municipal' },
    ],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP', availability: 'https://schema.org/InStock', url: pageUrl },
    performer: [
      { '@type': 'Person', name: 'Gato Negro' },
      { '@type': 'MusicGroup', name: 'Manuel Alcaraz y su Conjunto' },
      { '@type': 'Person', name: 'Hebert Vargas - Yo Me Llamo' },
      { '@type': 'Person', name: 'Rikarena - Yo Me Llamo' },
      { '@type': 'Person', name: 'El Enamorado del Despecho' },
      { '@type': 'MusicGroup', name: 'Los Rumberos Montañeros' },
      { '@type': 'Person', name: 'Alex Caro' },
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
      { '@type': 'ListItem', position: 2, name: 'Fiestas de Llanadas Olaya 2026', item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(eventJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />

      <main className="min-h-screen bg-[#F6F9F2] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors font-sans">
        {/* HERO - VERDE CAFÉ LLANADAS */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#E8F5E9] via-[#A5D6A7] to-[#1B5E20] text-[#0D2810]">
          <div className="absolute top-6 left-4 md:left-8 z-50">
            <Link href="/" className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-4 py-2.5 rounded-full text-sm font-bold transition-all border border-white/30 shadow-lg group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              Volver al Inicio
            </Link>
          </div>

          <div className="absolute inset-0 bg-linear-to-b from-black/5 to-[#1B5E20]/20 z-10" />

          <div className="relative z-20 max-w-7xl mx-auto px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-[#1B5E20] text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest mb-4">
                <span aria-hidden="true">🌾</span> LLANADAS • OLAYA • ANTIOQUIA
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                <span className="inline-block text-xl font-serif italic font-normal mb-3 bg-[#1B5E20] text-white px-4 py-1 rounded-full -rotate-2">
                  Fiestas del
                </span>
                <span className="block text-[#1B3A1B] drop-shadow-sm">CAMPESINO Y EL PROGRESO 2026</span>
                <span className="block mt-3 text-2xl lg:text-3xl font-bold tracking-normal text-white drop-shadow-md">
                  en Llanadas, Olaya, Antioquia
                </span>
              </h1>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="bg-white text-[#1B5E20] font-black px-6 py-3 rounded-full text-xl shadow-xl">
                  13 AL 15 NOV
                </div>
                <div className="bg-black text-white px-6 py-3 rounded-full font-bold">¡ENTRADA LIBRE!</div>
              </div>

              <p className="mt-6 text-lg text-[#1B3A1B] font-medium max-w-xl leading-relaxed">
                Tres días pa celebrar al campesino olayense. Concurso de Sancochos, Día del Campesino, Gran Bingo, encuentro deportivo, cultura y noches con Gato Negro, Manuel Alcaraz, Hebert Vargas y Rikarena. ¡Pura verraquera en Llanadas!
              </p>

              <div className="mt-8 flex gap-4">
                <a href="#programacion" className="bg-[#1B5E20] text-white px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition shadow-lg">
                  VER PROGRAMACIÓN <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative mt-12 lg:mt-0">
              <div className="relative aspect-4/5 rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)] border-8 border-white/60 rotate-1 bg-[#E8F5E9]">
                <Image src={ogImage} alt="Fiestas del Campesino y el Progreso 2026 en Llanadas, Olaya, Antioquia" fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#FFD600] text-black font-black px-6 py-3 rounded-2xl -rotate-4 shadow-xl z-30">
                <span aria-hidden="true">🍲</span> CONCURSO DE SANCOCHOS
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-[#1B5E20] font-black px-6 py-3 rounded-2xl rotate-6 shadow-xl z-30">
                <span aria-hidden="true">🌽</span> DÍA DEL CAMPESINO
              </div>
            </div>
          </div>
        </section>

        {/* INFO RÁPIDA */}
        <section aria-label="Resumen de las fiestas" className="max-w-7xl mx-auto px-4 -mt-8 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: 'Concurso de Sancochos', d: 'Domingo 15 nov - 7:00 AM Parque', i: '🍲' },
            { t: 'Día del Campesino', d: 'Domingo 15 nov - Entrega de detalles 1 PM', i: '🌽' },
            { t: 'Noche Campesina', d: 'Gato Negro, Manuel Alcaraz, Hebert Vargas', i: '🎤' },
          ].map((item) => (
            <div key={item.t} className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-5 shadow-xl border border-[#A5D6A7] flex gap-4">
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
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight">PROGRAMACIÓN LLANADAS</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-lg">Todo lo que va a pasar en Llanadas, Olaya, día por día. Guarda esta página.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {programa.map((dia) => (
              <article key={`${dia.fecha}`} className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-lg border border-zinc-100 flex flex-col">
                <div className={`${dia.color} text-white p-5 drop-shadow-sm`}>
                  <h3>
                    <span className="block text-2xl font-black leading-none mt-1 drop-shadow-md">{dia.dia === 'Viernes' ? 'VIERNES' : dia.dia === 'Sábado' ? 'SÁBADO' : 'DOMINGO'}</span>
                    <span className="block text-xl font-black leading-none mt-1 drop-shadow-md">{dia.fecha}</span>
                  </h3>
                </div>
                <ul className="p-5 space-y-5 flex-1">
                  {dia.eventos.map((ev, j) => (
                    <li key={j} className={ev.destacado ? 'bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#66BB6A] text-white -mx-5 px-5 py-4 rounded-xl shadow-md' : ''}>
                      <div className="flex gap-3">
                        <div className="text-2xl" aria-hidden="true">{ev.icon}</div>
                        <div className="flex-1">
                          <div className={`font-bold ${ev.destacado ? 'text-[#C8E6C9]' : 'text-[#1B5E20] dark:text-green-400'}`}>{ev.hora}</div>
                          <div className={`font-black leading-tight ${ev.destacado ? 'text-white' : ''}`}>{ev.titulo}</div>
                          {ev.desc && (<div className={`text-sm mt-1 leading-snug ${ev.destacado ? 'text-green-100' : 'text-zinc-600 dark:text-zinc-300'}`}>{ev.desc}</div>)}
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

        {/* CÓMO LLEGAR Y DÓNDE QUEDARSE */}
        <section className="max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
          <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-3xl border border-zinc-100 shadow-lg p-6 md:p-10">
            <h2 className="text-3xl font-black tracking-tight">Cómo llegar y dónde quedarte</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <div>
                <h3 className="font-black text-lg text-zinc-900 dark:text-white">Cómo llegar a Llanadas, Olaya</h3>
                <p className="mt-2">Llanadas es un corregimiento de Olaya, en el Occidente de Antioquia. El evento principal es en el <strong>parque del corregimiento de Llanadas</strong>.</p>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] px-5 py-2.5 font-bold text-white hover:opacity-90 transition">
                  <MapPin className="h-4 w-4" aria-hidden="true" /> Ver ubicación en Google Maps
                </a>
              </div>
              <div>
                <h3 className="font-black text-lg text-zinc-900 dark:text-white">Dónde quedarte</h3>
                <p className="mt-2">Si vienes de otra ciudad, busca hoteles, fincas y hospedaje en la <Link href="/municipios/olaya" className="font-bold text-[#1B5E20] dark:text-green-400 hover:underline">guía de Olaya</Link> o explora todas las <Link href="/categorias" className="font-bold text-[#1B5E20] dark:text-green-400 hover:underline">categorías del directorio</Link>.</p>
              </div>
            </div>

            {negociosOlaya.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-black">Negocios en Olaya</h3>
                <div className="mt-4 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {negociosOlaya.map((b) => (<BusinessCard key={b._id} business={b} showDescription={false} />))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* TEXTO + FAQ */}
        <section className="bg-[#1B5E20] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black">¿Por qué ir a las Fiestas de Llanadas?</h2>
              <div className="mt-4 space-y-4 text-green-100 leading-relaxed">
                <p>Las <strong>Fiestas del Campesino y el Progreso en Llanadas, Olaya</strong>, organizadas por la Alcaldía de Olaya y el alcalde Jesús David Hernández, son el homenaje más grande al campesino olayense.</p>
                <p>Vivirás <strong>Concurso de Sancochos, Celebración del Día del Campesino con entrega de detalles, Premiación, Presentación de Los Rumberos Montañeros, Encuentro Deportivo, Reconocimiento a líderes J.A.C, Gran Bingo Proparroquia, Noche Cultural con Cultura Olayense y Noche Campesina</strong>.</p>
                <p>En tarima estarán <strong>Gato Negro, Manuel Alcaraz y su Conjunto, Yo Me Llamo Hebert Vargas, Yo Me Llamo Rikarena, El Enamorado del Despecho y Alex Caro</strong>, más talento local. La entrada es libre.</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-3xl p-8 border border-white/20">
              <h2 className="font-black text-xl">Preguntas frecuentes</h2>
              <dl className="mt-6 space-y-4 text-sm text-green-100">
                {FAQS.map((faq) => (
                  <div key={faq.q}>
                    <dt className="font-bold text-white">{faq.q}</dt>
                    <dd className="mt-1">{faq.a}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 bg-[#C8E6C9] text-[#1B3A1B] rounded-xl p-4 font-black text-center">¡NOS VEMOS EN LLANADAS, OLAYA!</div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-12 px-4 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Página informativa de Ooasys - Directorio del Occidente Antioqueño</p>
          <h2 className="font-black text-2xl mt-2">¿Tienes un negocio en Olaya? ¡Inscríbelo en Ooasys!</h2>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">Escríbenos por WhatsApp: 320 620 9817</a>
        </section>
      </main>
    </>
  );
}
