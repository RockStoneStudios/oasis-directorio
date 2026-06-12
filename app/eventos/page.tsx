import { client } from "@/lib/sanity/client";
import { UPCOMING_EVENTS_QUERY } from "@/lib/sanity/queries"; // Asegúrate de exportar la query desde tu archivo de queries
import Link from "next/link";

export default async function EventosPage() {
  // Realizamos el fetch de los eventos próximos
  const eventos = await client.fetch(UPCOMING_EVENTS_QUERY);

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Próximos Eventos en el Occidente</h1>
      
      {eventos.length === 0 ? (
        <p>No hay eventos próximos en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento: any) => (
            <div key={evento._id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-semibold mb-2">{evento.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {new Date(evento.date).toLocaleDateString("es-CO", {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm mb-4">Lugar: {evento.venueName}</p>
              
              {/* Botón hacia la página individual */}
              <Link 
                href={`/eventos/${evento.slug.current}`}
                className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                Ver más información
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}