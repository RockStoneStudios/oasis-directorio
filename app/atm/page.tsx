// @/app/atm/page.tsx
import { client } from "@/lib/sanity/client";
import AtmMapaClient from "@/components/atms/AtmMapaClient";

async function getAtms() {
  const query = `*[_type == "atm"] {
    _id,
    title,
    location,
    recommendation,
    bankName,
    is24Hours,
    address {
      street,
      neighborhood,
      directionDetails
    }
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Error cargando cajeros en servidor:", error);
    return [];
  }
}

export default async function AtmMapaPage() {
  const atmsData = await getAtms();

  // Adaptamos los datos antes de enviarlos al componente cliente
  const adaptedAtms = atmsData.map((atm: any) => ({
    ...atm,
    name: atm.title,
    location: {
      lat: atm.location?.lat,
      lng: atm.location?.lng,
    },
    addressLabel: atm.address 
      ? `${atm.address.street || ""} ${atm.address.neighborhood || ""}`.trim() 
      : "Dirección no especificada"
  }));

  return <AtmMapaClient initialAtms={adaptedAtms} />;
}