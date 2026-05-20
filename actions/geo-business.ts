// app/actions/geo-business.ts
'use server';

import { client } from "@/lib/sanity/client";
import { getBoundingBox, filterVenuesByDistance } from "@/lib/utils-geo/distance"; // Ruta a tu archivo de distancias

// 1. Coordenadas fijas del punto de referencia (Ej: Parque Principal de Sopetrán)
const REF_LAT = 6.500703;
const REF_LNG = -75.7421951;





export async function getNearbyBusinessesAction(radiusKm: number = 0.5) {
  try {
    // 2. Calculamos el cuadrado (Bounding Box) con tu función exacta
    const box = getBoundingBox(REF_LAT, REF_LNG, radiusKm);

    // 3. GROQ Query: Sanity filtra en milisegundos usando comparaciones numéricas sencillas
    // OJO: Asegúrate de que tu esquema de Sanity tenga el campo 'location' como tipo 'geopoint'
    const query = `*[_type == "business" && 
      location.lat >= $minLat && location.lat <= $maxLat &&
      location.lng >= $minLng && location.lng <= $maxLng
    ]{
      _id,
      name,
      slug,
      location,
      categories[]->{ title },
      logo
    }`;

    const rawBusinesses = await client.fetch(query, {
      minLat: box.minLat,
      maxLat: box.maxLat,
      minLng: box.minLng,
      maxLng: box.maxLng,
    });

    // 4. Tu función genérica 'filterVenuesByDistance' espera la propiedad 'address.lat' y 'address.lng'
    // Mapeamos lo que viene de Sanity ('location') a lo que espera tu función ('address')
    const formattedVenues = rawBusinesses.map((business: any) => ({
      ...business,
      address: {
        lat: business.location?.lat,
        lng: business.location?.lng,
      },
    }));

    // 5. Usamos tu función para eliminar las esquinas del cuadro y ordenar de menor a mayor distancia
    const orderedResults = filterVenuesByDistance(
      formattedVenues,
      REF_LAT,
      REF_LNG,
      radiusKm
    );

    return { success: true, data: orderedResults };

  } catch (error) {
    console.error("Error al filtrar negocios por distancia:", error);
    return { success: false, error: "No se pudieron cargar los negocios cercanos" };
  }
}