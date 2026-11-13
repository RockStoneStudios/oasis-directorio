import { Metadata } from "next";
import MapaClient from "../../components/map/MapaClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ooasys.com"),
  title: "Mapa Interactivo y AR de Negocios del Occidente Antioqueño",
  description:
    "Explora los 19 municipios del Occidente Antioqueño: Santa Fe de Antioquia, Sopetrán, San Jerónimo y más. Mapa interactivo con vista previa AR de comercios locales, filtrable por categoría y distancia.",
  alternates: {
    canonical: "/mapa",
  },
  openGraph: {
    title: "Mapa Interactivo y AR del Occidente Antioqueño",
    description:
      "Descubre restaurantes, hospedaje, salud y turismo en el Occidente Antioqueño con mapa interactivo y experiencia AR.",
    url: "/mapa",
    siteName: "Ooasys",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/mapa-occidente.jpg",
        width: 1200,
        height: 630,
        alt: "Mapa interactivo y AR de negocios del Occidente Antioqueño",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapa Interactivo y AR del Occidente Antioqueño | Ooasys",
    description:
      "Explora comercios y turismo del Occidente Antioqueño en mapa interactivo y AR.",
    images: ["/mapa-occidente.jpg"],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mapa Interactivo y AR de Negocios del Occidente Antioqueño",
    description:
      "Directorio geolocalizado con mapa interactivo y vista previa AR de comercios y servicios turísticos en los 19 municipios del Occidente Antioqueño, Antioquia, Colombia.",
    url: "https://www.ooasys.com/mapa",
    isPartOf: {
      "@type": "WebSite",
      name: "Ooasys",
      url: "https://www.ooasys.com",
    },
    about: {
      "@type": "AdministrativeArea",
      name: "Occidente Antioqueño",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Antioquia, Colombia",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 6.556,
        longitude: -75.828,
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://www.ooasys.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Mapa del Occidente Antioqueño",
          item: "https://www.ooasys.com/mapa",
        },
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