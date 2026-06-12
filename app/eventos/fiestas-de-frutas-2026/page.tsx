import Link from "next/link";
import { Calendar, MapPin, ArrowLeft, Bed, Utensils, Wine } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import ArtistList from "@/components/ArtistList";

// Datos del evento
const event = {
  title: "Fiestas de las Frutas Sopetrán 2026",
  description: "Semana de música, baile, desfiles y muestras frutícolas en Sopetrán, Antioquia. El evento cultural más importante del occidente antioqueño. Conciertos gratuitos, desfile de silleteros, festival del sancocho y mucho más.",
  date: "2026-06-23",
  endDate: "2026-06-29",
  venueName: "Parque Principal de Sopetrán",
  municipality: { name: "Sopetrán" },
};

const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
const start = new Date(event.date).toLocaleDateString("es-CO", dateOptions);
const end = event.endDate ? new Date(event.endDate).toLocaleDateString("es-CO", dateOptions) : null;

export default function FiestasDeLasFrutasPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* Navegación semántica */}
        <nav className="mb-4 sm:mb-6 md:mb-8" aria-label="Navegación">
          <Link 
            href="/eventos" 
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span>Volver al calendario de eventos</span>
          </Link>
        </nav>

        {/* Contador regresivo - Sección destacada */}
        <section aria-label="Contador regresivo" className="mb-8">
          <CountdownTimer targetDate={event.date} title={event.title} />
        </section>

        {/* Hero / Cabecera del evento */}
        <header className="mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <span className="inline-block bg-emerald-100 dark:bg-emerald-900/40 rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              🎟️ Evento Gratuito
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
            {event.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
            {event.description}
          </p>
        </header>

        {/* Grid de información del evento */}
        <section aria-label="Información del evento" className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
          
          {/* Tarjeta de Fechas */}
          <article className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-800 transition-all hover:shadow-xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" aria-hidden="true" />
              <h2 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Fechas del evento</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              <time dateTime={event.date}>{start}</time> {end && <span> al <time dateTime={event.endDate}>{end}</time></span>}
            </p>
          </article>

          {/* Tarjeta de Ubicación */}
          <article className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-800 transition-all hover:shadow-xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" aria-hidden="true" />
              <h2 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Ubicación</h2>
            </div>
            <address className="not-italic text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              {event.venueName}, {event.municipality?.name}
            </address>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              📍 Parque Principal - Zona urbana
            </p>
          </article>
        </section>

        {/* Lista de artistas */}
        <section aria-label="Artistas confirmados" className="mb-8 sm:mb-12">
          <ArtistList />
        </section>

        {/* ============================================================ */}
        {/* 🏨 SECCIÓN DE ENLACES PARA TURISTAS (SEO SEMÁNTICO) */}
        {/* ============================================================ */}
        
        <section aria-label="Planifica tu visita" className="mt-12 sm:mt-16">
          <header className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
              🏕️ Planifica tu visita a Sopetrán
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Descubre los mejores lugares para hospedarte, comer y disfrutar durante las Fiestas de las Frutas
            </p>
          </header>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Tarjeta 1: Alojamiento */}
            <article className="group bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden">
              <Link 
                href="/business?category=alojamiento-and-bienes-raices&municipality=sopetran&subcategory=hoteles-y-alojamiento"
                className="block p-4 sm:p-6 text-center"
                aria-label="Ver alojamientos en Sopetrán"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
                    <Bed className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-1">🏨 Alojamiento</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Hoteles, hostales y fincas en Sopetrán
                  </p>
                  <span className="mt-3 text-emerald-600 dark:text-emerald-400 text-sm font-semibold group-hover:underline inline-flex items-center gap-1">
                    Ver hospedajes <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>

            {/* Tarjeta 2: Restaurantes */}
            <article className="group bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden">
              <Link 
                href="/business?category=restaurantes&municipality=sopetran"
                className="block p-4 sm:p-6 text-center"
                aria-label="Ver restaurantes en Sopetrán"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                    <Utensils className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-1">🍽️ Dónde Comer</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Restaurantes y gastronomía local en Sopetrán
                  </p>
                  <span className="mt-3 text-orange-600 dark:text-orange-400 text-sm font-semibold group-hover:underline inline-flex items-center gap-1">
                    Ver restaurantes <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>

            {/* Tarjeta 3: Licoreras */}
            <article className="group bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden">
              <Link 
                href="/business?category=licoreras&municipality=sopetran"
                className="block p-4 sm:p-6 text-center"
                aria-label="Ver licoreras en Sopetrán"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                    <Wine className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-1">🥂 Dónde Comprar Licor</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Licoreras y tiendas especializadas en Sopetrán
                  </p>
                  <span className="mt-3 text-purple-600 dark:text-purple-400 text-sm font-semibold group-hover:underline inline-flex items-center gap-1">
                    Ver licoreras <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>
          </div>
        </section>

        {/* Footer con información adicional */}
        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t-2 border-orange-200 dark:border-orange-800">
          <div className="text-center space-y-2">
            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
              📅 Programación oficial actualizada: <time dateTime={new Date().toISOString()}>
                {new Date().toLocaleDateString('es-CO', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
              🍍 <strong>Fiestas de las Frutas Sopetrán 2026</strong> — Evento 100% gratuito
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
              ¿Eres comerciante? <Link href="/dashboard" className="text-orange-500 hover:underline">Registra tu negocio gratis</Link> y aparece en estas recomendaciones
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}