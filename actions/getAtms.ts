// src/actions/getAtms.ts
import { client } from "@/lib/sanity/client";

export async function getAtms(municipalitySlug?: string) {
  // Consulta Groq para traer los cajeros y expandir la referencia del municipio
  const query = `*[_type == "atm" ${municipalitySlug ? '&& municipality->slug.current == $municipalitySlug' : ''}] {
    _id,
    title,
    location,
    recommendation,
    bankName,
    is24Hours,
    address {
      street,
      neighborhood,
      state,
      directionDetails
    },
    "municipalityName": municipality->name
  }`;

  try {
    const atms = await client.fetch(query, municipalitySlug ? { municipalitySlug } : {});
    return atms;
  } catch (error) {
    console.error("Error cargando cajeros de Sanity:", error);
    return [];
  }
}