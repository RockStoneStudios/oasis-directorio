import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import ArtistList from "@/components/ArtistList";

// Esta página SOLO funciona para Fiestas de las Frutas
// Si necesitas datos dinámicos de Sanity, descomenta las líneas con client.fetch

export default async function FiestasDeLasFrutasPage() {
  // Datos estáticos para Fiestas de las Frutas (ya que es una página fija)
  const event = {
    title: "Fiestas de las Frutas Sopetrán 2026",
    description: "Semana de música, baile, desfiles y muestras frutícolas en Sopetrán, Antioquia. El evento cultural más importante del occidente antioqueño. Conciertos gratuitos, desfile de silleteros, festival del sancocho y mucho más.",
    date: "2026-06-23",
    endDate: "2026-06-29",
    venueName: "Parque Principal de Sopetrán",
    municipality: { name: "Sopetrán" },
    isFree: true,
    price: "0",
    organizer: "Alcaldía de Sopetrán"
  };

  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const start = new Date(event.date).toLocaleDateString("es-CO", dateOptions);
  const end = event.endDate ? new Date(event.endDate).toLocaleDateString("es-CO", dateOptions) : null;

  // Schema específico para Fiestas de las Frutas
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.date,
    "endDate": event.endDate || event.date,
    "location": {
      "@type": "Place",
      "name": event.venueName,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": event.municipality?.name,
        "addressCountry": "CO"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "COP"
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 sm:py-12 px-4 sm:px-6">
      <Script id="event-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      
      <div className="container mx-auto max-w-5xl">
        {/* Botón volver */}
        <Link 
          href="/eventos" 
          className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-semibold mb-6 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Volver al calendario de eventos
        </Link>

        {/* Contador regresivo (usa tu componente existente) */}
        <CountdownTimer targetDate={event.date} title={event.title} />

        {/* Badge de evento */}
        <div className="mb-4 sm:mb-6">
          <span className="inline-block bg-emerald-100 dark:bg-emerald-900/40 rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            🎟️ Evento Gratuito
          </span>
        </div>

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
          {event.title}
        </h1>

        {/* Descripción */}
        <div className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8 max-w-3xl">
          {event.description}
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {/* Fechas */}
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Fechas</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              {start} {end && <span> al {end}</span>}
            </p>
          </div>

          {/* Ubicación */}
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Ubicación</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              {event.venueName}, {event.municipality?.name}
            </p>
          </div>
        </div>

        {/* Lista de artistas (usa tu componente existente) */}
        <ArtistList />

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t-2 border-orange-200 dark:border-orange-800 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            📅 Información actualizada: {new Date().toLocaleDateString('es-CO', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            ¿Eres comerciante? <a href="/dashboard" className="text-orange-500 hover:underline">Registra tu negocio gratis</a>
          </p>
        </footer>
      </div>
    </main>
  );
}