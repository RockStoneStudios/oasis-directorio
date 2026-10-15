import { Metadata } from "next";
import MapaClient from "../../components/map/MapaClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ooasys.com"),
  title: "Mapa de Negocios en Sopetrán, Antioquia",
  description: "Mapa interactivo de Sopetrán con más de 200 negocios locales. Filtra por restaurantes, salud, hospedaje y encuentra lo que necesitas a 500m o 1km de ti.",
  alternates: {
    canonical: "/mapa",
  },
  openGraph: {
    title: "Mapa Interactivo de Sopetrán - Restaurantes, Salud, Hospedaje",
    description: "Explora todos los negocios de Sopetrán en un solo mapa. Filtra por categoría y distancia.",
    url: "/mapa",
    siteName: "Ooasys",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/mapa.PNG",
        width: 1200,
        height: 630,
        alt: "Mapa de negocios en Sopetrán, Antioquia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapa de Negocios en Sopetrán | Ooasys",
    description: "Encuentra restaurantes, hoteles y servicios cerca de ti.",
    images: ["/mapa.PNG"],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mapa Local de Negocios en Sopetrán",
    description: "Directorio geolocalizado de comercios en Sopetrán, Antioquia",
    url: "https://www.ooasys.com/mapa",
    isPartOf: {
      "@type": "WebSite",
      name: "Ooasys",
      url: "https://www.ooasys.com",
    },
    about: {
      "@type": "Place",
      name: "Sopetrán, Antioquia, Colombia",
      geo: {
        "@type": "GeoCoordinates",
        latitude: 6.500962,
        longitude: -75.742505,
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.ooasys.com" },
        { "@type": "ListItem", position: 2, name: "Mapa", item: "https://www.ooasys.com/mapa" },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MapaClient />
    </>
  );
}