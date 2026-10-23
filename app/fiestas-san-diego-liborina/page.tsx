import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Fiestas del Retorno y de San Isidro 2026 | San Diego, Liborina',
  description: 'Programación oficial Fiestas del Retorno y San Isidro en San Diego, Liborina del 30 oct al 2 nov de 2026. Shows, cabalgata, misas y Festival de Sancochos.',
  keywords: [
    'fiestas San Diego Liborina',
    'fiestas del retorno San Diego',
    'fiestas de San Isidro Liborina',
    'programación fiestas San Diego 2026',
    'fiestas San Diego Antioquia',
    'San Diego Liborina fiestas',
    'festival de sancochos Liborina',
  ],
  openGraph: {
    title: 'Fiestas del Retorno y de San Isidro 2026 | San Diego, Liborina',
    description: 'Vive las Fiestas del Retorno y de San Isidro del 30 de octubre al 2 de noviembre de 2026 en San Diego, Liborina. ¡Toda la programación oficial aquí!',
    url: 'https://www.ooasys.com/fiestas-san-diego-liborina', // Añadido para SEO
    images: ['/san_diego1.jpg'],
    type: 'website',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fiestas del Retorno y de San Isidro 2026 | San Diego, Liborina',
    description: 'Vive las fiestas del 30 oct al 2 nov de 2026. Cabalgata, sancochos y grandes shows.',
    images: ['/san_diego1.jpg'],
  },
  alternates: {
    canonical: 'https://www.ooasys.com/fiestas-san-diego-liborina',
  }
};

const programa = [
  {
    dia: 'Viernes',
    fecha: '30 de Octubre',
    color: 'bg-[#ff2d00]',
    eventos: [
      { hora: '3:00 PM', titulo: 'Desfile de disfraces', icon: '🎭' },
      { hora: '7:00 PM', titulo: 'Rumba aeróbica', icon: '💃' },
    ]
  },
  {
    dia: 'Sábado',
    fecha: '31 de Octubre',
    color: 'bg-[#ff2d00]',
    eventos: [
      { hora: '2:00 PM', titulo: 'Cabalgata', desc: 'Punto de encuentro: Danzante', icon: '🐴' },
      { hora: '6:00 PM', titulo: 'Santa Misa', icon: '⛪' },
      { hora: '7:00 PM', titulo: 'Apertura oficial de las fiestas', desc: 'SHOW MUSICAL: Los mismos bobos de siempre, Aniel Velásquez, Cristian Paniagua, Daniel Calderón y los Gigantes del Vallenato, DJ Felipe Villa', icon: '🎤', destacado: true },
    ]
  },
  {
    dia: 'Domingo',
    fecha: '1 de Noviembre - AM',
    color: 'bg-[#e11d00]',
    eventos: [
      { hora: '6:30 AM', titulo: 'Altar de San Isidro', desc: 'Inicio recolección de ofrendas, animales, productos del campo, anchetas y más.', icon: '🌽' },
      { hora: '8:00 AM', titulo: 'Santa Misa', icon: '⛪' },
      { hora: '11:00 AM', titulo: 'Santa Misa', icon: '⛪' },
      { hora: '12:00 M', titulo: 'Almuerzo comunitario', icon: '🍲' },
    ]
  },
  {
    dia: 'Domingo',
    fecha: '1 de Noviembre - PM',
    color: 'bg-[#e11d00]',
    eventos: [
      { hora: '1:00 PM', titulo: 'Altar de San Isidro: Gran remate', desc: '¡INVITADA TODA LA COMUNIDAD!', icon: '🎉' },
      { hora: '6:00 PM', titulo: 'Santa Misa', icon: '⛪' },
      { hora: '7:00 PM', titulo: 'SHOW MUSICAL', desc: 'Leonardo Jaramillo, Orquesta Aires Sabaneros, Francisco Gómez el Nuevo Rey, Orquesta Donaires, DJ Teban', icon: '🎶', destacado: true },
    ]
  },
  {
    dia: 'Lunes',
    fecha: '2 de Noviembre',
    color: 'bg-[#ff2d00]',
    eventos: [
      { hora: 'Todo el día', titulo: 'Festival de Sancochos', icon: '🥘' },
      { hora: 'Todo el día', titulo: 'Fiesta de desenguayave', icon: '🍻' },
      { hora: 'Noche', titulo: 'SHOW MUSICAL', desc: 'Andrés Parra, La Berríonda, Banda Diez, Cristian Peláez', icon: '🎸', destacado: true },
    ]
  }
];

export default function FiestasSanDiegoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    name: 'Fiestas del Retorno y de San Isidro 2026 - San Diego, Liborina',
    description: 'Fiestas del Retorno y de San Isidro en San Diego, Liborina, Antioquia. Del 30 de octubre al 2 de noviembre de 2026 con cabalgata, desfiles, misas, festival de sancochos y grandes shows musicales.',
    startDate: '2026-10-30',
    endDate: '2026-11-02',
    url: 'https://www.ooasys.com/fiestas-san-diego-liborina',
    location: {
      '@type': 'Place',
      name: 'Corregimiento de San Diego, Liborina',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Liborina',
        addressRegion: 'Antioquia',
        addressCountry: 'CO'
      }
    },
    image: 'https://www.ooasys.com/san_diego1.jpg',
    organizer: {
      '@type': 'Organization',
      name: 'Corregimiento de San Diego, Liborina',
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
      url: 'https://www.ooasys.com/fiestas-san-diego-liborina',
    },
    performer: [
      { '@type': 'MusicGroup', name: 'Daniel Calderón y los Gigantes del Vallenato' },
      { '@type': 'MusicGroup', name: 'Francisco Gómez el Nuevo Rey' },
      { '@type': 'MusicGroup', name: 'Orquesta Donaires' },
      { '@type': 'MusicGroup', name: 'Orquesta Aires Sabaneros' },
      { '@type': 'MusicGroup', name: 'Banda Diez' }
    ]
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Dónde queda San Diego, Liborina?',
        acceptedAnswer: { '@type': 'Answer', text: 'Es un corregimiento de Liborina, Occidente de Antioquia, a 2.5 horas de Medellín.' }
      },
      {
        '@type': 'Question',
        name: '¿Cuándo son las fiestas 2026?',
        acceptedAnswer: { '@type': 'Answer', text: 'Del viernes 30 de octubre al lunes 2 de noviembre de 2026.' }
      },
      {
        '@type': 'Question',
        name: '¿Hay que pagar entrada?',
        acceptedAnswer: { '@type': 'Answer', text: 'No, todos los eventos en tarima y la programación cultural son gratuitos.' }
      },
      {
        '@type': 'Question',
        name: '¿Dónde me quedo?',
        acceptedAnswer: { '@type': 'Answer', text: 'Puedes buscar fincas y hoteles en Liborina, Sopetrán o San José de la Montaña en el directorio de ooasys.com.' }
      }
    ]
  };

  return (
    <>
      {/* Scripts JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <main className="min-h-screen bg-[#fff8f0] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors font-sans">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#ff1a00] text-white">
          
          {/* BOTÓN ATRÁS AL HOME */}
          <div className="absolute top-6 left-4 md:left-8 z-50">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-4 py-2.5 rounded-full text-sm font-bold transition-all border border-white/20 shadow-lg group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver al Inicio
            </Link>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#ff1a00]/90 z-10" />
          <div className="absolute top-0 left-0 w-64 h-64 opacity-30 rotate-12">
            {/* decoracion floral via css */}
          </div>
          
          <div className="relative z-20 max-w-7xl mx-auto px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm font-bold tracking-widest mb-4">
                📍 SAN DIEGO, LIBORINA • ANTIOQUIA
              </div>
              <h1 
                className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tight"
                aria-label="Fiestas del Retorno y de San Isidro 2026 en San Diego, Liborina"
              >
                <span className="block text-xl font-serif italic font-normal mb-2 bg-white text-[#ff1a00] inline-block px-4 py-1 rounded-full -rotate-2">Fiestas del</span>
                RETORNO Y DE SAN ISIDRO 2026
              </h1>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="bg-white text-[#ff1a00] font-black px-6 py-3 rounded-full text-xl shadow-xl">
                  30 OCT AL 02 NOV
                </div>
                <div className="bg-black text-white px-6 py-3 rounded-full font-bold">
                  ¡ENTRADA LIBRE!
                </div>
              </div>
              <p className="mt-6 text-lg text-white/90 max-w-xl leading-relaxed">
                Regresa a tus raíces. 4 días de tradición campesina, fe, música, cabalgata y el mejor Festival de Sancochos del Occidente Antioqueño. ¡Te espera San Diego!
              </p>
              <div className="mt-8 flex gap-4">
                <a href="#programacion" className="bg-white text-[#ff1a00] px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition shadow-lg">
                  VER PROGRAMACIÓN ↓
                </a>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative mt-12 lg:mt-0">
              <div className="relative aspect-4/5 rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)] border-8 border-white/20 rotate-1">
                <Image 
                  src="/san_diego1.jpg" 
                  alt="Fiestas del Retorno y de San Isidro San Diego Liborina 2026 - Iglesia"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw" // Mejora de rendimiento
                />
              </div>
              {/* floating badges */}
              <div className="absolute -bottom-6 -left-6 bg-yellow-300 text-black font-black px-6 py-3 rounded-2xl rotate-[-4deg] shadow-xl z-30">
                🎸 VALLENATO + POPULAR
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-[#ff1a00] font-black px-6 py-3 rounded-2xl rotate-[6deg] shadow-xl z-30">
                🥘 FESTIVAL DE SANCOCHOS
              </div>
            </div>
          </div>
        </section>

        {/* QUICK INFO */}
        <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: 'Cabalgata', d: 'Sábado 31 oct - 2 PM desde Danzante', i: '🐴' },
            { t: 'Altar de San Isidro', d: 'Domingo 1 nov - ofrendas y gran remate', i: '🌽' },
            { t: 'Shows en vivo', d: 'Gigantes del Vallenato, Orq. Donaires y más', i: '🎤' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-5 shadow-xl border border-orange-100 flex gap-4">
              <div className="text-3xl">{item.i}</div>
              <div><div className="font-black">{item.t}</div><div className="text-sm text-zinc-600 dark:text-zinc-400">{item.d}</div></div>
            </div>
          ))}
        </section>

        {/* PROGRAMACION */}
        <section id="programacion" className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight">PROGRAMACIÓN OFICIAL</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-lg">Todo lo que va a pasar en San Diego, día por día. Guarda esta página.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {programa.map((dia, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-lg border border-zinc-100 flex flex-col">
                <div className={`${dia.color} text-white p-5`}>
                  <div className="text-sm font-bold tracking-widest opacity-80">{dia.dia.toUpperCase()}</div>
                  <div className="text-2xl font-black leading-none mt-1">{dia.fecha}</div>
                </div>
                <div className="p-5 space-y-5 flex-1">
                  {dia.eventos.map((ev, j) => (
                    <div key={j} className={`${ev.destacado ? 'bg-zinc-900 text-white -mx-5 px-5 py-4 rounded-xl' : ''}`}>
                      <div className="flex gap-3">
                        <div className="text-2xl">{ev.icon}</div>
                        <div>
                          <div className={`font-bold ${ev.destacado ? 'text-yellow-300' : 'text-[#ff1a00]'}`}>{ev.hora}</div>
                          <div className="font-black leading-tight">{ev.titulo}</div>
                          {ev.desc && <div className="text-sm mt-1 opacity-80 leading-snug">{ev.desc}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* SEO TEXT POTENTE */}
        <section className="bg-zinc-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black">¿Por qué ir a las Fiestas de San Diego, Liborina?</h2>
              <p className="mt-4 text-zinc-300 leading-relaxed">
                Las <strong>Fiestas del Retorno y de San Isidro en San Diego, Liborina</strong> son la celebración más importante del corregimiento. Cada año, familias que salieron del pueblo regresan para celebrar la cosecha, agradecer a San Isidro Labrador y reencontrarse. No son solo fiestas, es el retorno a casa.
                <br/><br/>
                Durante 4 días vivirás la tradición antioqueña pura: <strong>cabalgata por las calles de San Diego, altar de San Isidro con productos del campo, santas misas, desfile de disfraces, rumba aeróbica, almuerzo comunitario, festival de sancochos y fiesta de desenguayave</strong>.
                <br/><br/>
                En tarima: <strong>Daniel Calderón y los Gigantes del Vallenato, Francisco Gómez el Nuevo Rey, Orquesta Donaires, Orquesta Aires Sabaneros, Banda Diez, La Berríonda</strong> y DJs hasta el amanecer.
              </p>
              <p className="mt-6 text-zinc-300">
                Si vienes de otra ciudad, puedes buscar opciones de hospedaje en <Link href="https://www.ooasys.com/municipios/liborina" className="text-yellow-400 font-bold hover:underline">la guía turística de Liborina</Link>.
              </p>
            </div>
            <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10">
              <h3 className="font-black text-xl">Preguntas frecuentes</h3>
              <ul className="mt-6 space-y-4 text-sm text-zinc-300">
                <li><strong className="text-white">¿Dónde queda San Diego, Liborina?</strong><br/>Es un corregimiento de Liborina, Occidente de Antioquia, a 2.5 horas de Medellín.</li>
                <li><strong className="text-white">¿Cuándo son las fiestas 2026?</strong><br/>Del viernes 30 de octubre al lunes 2 de noviembre de 2026.</li>
                <li><strong className="text-white">¿Hay que pagar entrada?</strong><br/>No, todos los eventos en tarima y la programación cultural son gratuitos.</li>
                <li>
                  <strong className="text-white">¿Dónde me quedo?</strong><br/>
                  En Sopetrán o Liborina. Busca opciones en <Link href="https://www.ooasys.com/municipios/liborina" className="text-yellow-400 hover:underline">Liborina</Link> o en nuestra guía de ooasys.com.
                </li>
              </ul>
              <div className="mt-8 bg-[#ff1a00] rounded-xl p-4 font-black text-center">
                ¡NOS VEMOS EN SAN DIEGO!
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Página oficial creada por ooasys.com - Turismo del Occidente Antioqueño</p>
          <h4 className="font-black text-2xl mt-2">¿Tienes un negocio en San Diego? ¡Inscribete a ooasys.com!</h4>
          <span className="font-semibold text-emerald-700">
            Escribenos 3206209817
          </span>
        </section>
      </main>
    </>
  );
}