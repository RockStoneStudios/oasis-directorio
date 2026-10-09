import { cache } from "react";
import { AirVent, Briefcase, Car, CheckCircle2, MapPin, Phone, Plug, Waves, Wifi } from "lucide-react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Acciones y utilidades
import { getBusinessBySlug } from "@/actions/getBusinessBySlug";
import { getBusinesses } from "@/actions/getBusinesses";
import { formatAddress, getSlugValue, normalizeBusinessData, generateWhatsAppUrl } from "@/lib/formatBusinessData";
import { urlFor } from "@/lib/sanity/image";

// Componentes
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessHours } from "@/components/BusinessHours";
import { Map } from "@/components/Map";
import { RatingStars } from "@/components/RatingStars";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "@/components/business/ImageGallery";

interface BusinessDetailPageProps {
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

// Evita consultar Sanity dos veces (metadata + página)
const getBusiness = cache((slug: string) => getBusinessBySlug(slug));

// Mapeo de Amenidades
const AMENITY_MAP: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  pet_friendly: {
    label: "🐾 Pet Friendly",
    icon: <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />,
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  },
  air_conditioning: {
    label: "Aire Acondicionado",
    icon: <AirVent className="h-3 w-3 sm:h-4 sm:w-4" />,
    className: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
  },
  free_wifi: {
    label: "Wi-Fi Gratis",
    icon: <Wifi className="h-3 w-3 sm:h-4 sm:w-4" />,
    className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
  },
  coworking: {
    label: "Coworking",
    icon: <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />,
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  },
  power_outlets: {
    label: "Tomacorrientes",
    icon: <Plug className="h-3 w-3 sm:h-4 sm:w-4" />,
    className: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  },
  private_parking: {
    label: "Parqueadero",
    icon: <Car className="h-3 w-3 sm:h-4 sm:w-4" />,
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  },
  pool_access: {
    label: "Piscina",
    icon: <Waves className="h-3 w-3 sm:h-4 sm:w-4" />,
    className: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
  },
  // Corregido: coincide con el valor 'water_backup' del schema de Sanity
  water_backup: {
    label: "Tanque de Agua",
    icon: <Waves className="h-3 w-3 sm:h-4 sm:w-4" />,
    className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
  },
};

// Detección de nichos a partir del slug de la categoría
function detectNiche(categorySlug: string) {
  const slug = (categorySlug || "").toLowerCase();
  const isAccommodation =
    slug.includes("alojamiento") ||
    slug.includes("hotel") ||
    slug.includes("hospedaje") ||
    slug.includes("finca");
  const isRealEstate = !isAccommodation && (slug.includes("bienes-raices") || slug.includes("inmobiliaria"));
  const isRestaurant =
    slug.includes("donde-comer") || slug.includes("restaurante") || slug.includes("comida");
  return { isAccommodation, isRealEstate, isRestaurant };
}

// 🚀 METADATOS SEO
export async function generateMetadata({ params }: BusinessDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) {
    return {
      title: "Establecimiento no encontrado | Ooasys",
      robots: { index: false, follow: false },
    };
  }

  const businessName = business.name;
  const category = business.category?.name || "Comercio";
  const municipality = business.municipality?.name || "Occidente Antioqueño";
  const categorySlug = getSlugValue(business.category?.slug) || "";
  const { isAccommodation, isRealEstate } = detectNiche(categorySlug);

  // 1) Lo que escribas en Sanity manda. 2) Si está vacío, se usa un respaldo automático.
  let fallbackTitle = `${businessName} – ${category} en ${municipality}`;
  let fallbackDescription = `${businessName} en ${municipality}: dirección, teléfono, horarios y cómo llegar.${
    business.rating ? ` Calificación ${business.rating}/5.` : ""
  } Contacto directo por WhatsApp.`;

  if (isAccommodation) {
    fallbackTitle = `${businessName} – Alojamiento y Fincas en ${municipality}`;
    fallbackDescription = `Reserva o alquila ${businessName} en ${municipality}. Alojamiento y descanso en el Occidente Antioqueño. Contacto directo por WhatsApp.`;
  } else if (isRealEstate) {
    fallbackTitle = `${businessName} – Bienes Raíces en ${municipality}`;
    fallbackDescription = `Propiedades, casas, lotes y fincas con ${businessName} en ${municipality}. Asesoría inmobiliaria en el Occidente Antioqueño.`;
  }

  const seoTitle = business.seoTitle?.trim() || fallbackTitle;
  const seoDescription = business.seoDescription?.trim() || fallbackDescription;

  const ogSource = business.gallery?.[0]?.asset ? business.gallery[0] : business.logo?.asset ? business.logo : null;
  const imageUrl = ogSource
    ? urlFor(ogSource).width(1200).height(630).fit("crop").url()
    : `${baseUrl}/og-categories.png`;

  return {
    metadataBase: new URL(baseUrl),
    title: { absolute: `${seoTitle} | Ooasys` },
    description: seoDescription,
    authors: [{ name: "Ooasys", url: baseUrl }],
    alternates: {
      canonical: `${baseUrl}/business/${slug}`,
      languages: {
        "es-CO": `${baseUrl}/business/${slug}`,
        es: `${baseUrl}/business/${slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "geo.region": "CO-ANT",
      "geo.placename": municipality,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${baseUrl}/business/${slug}`,
      siteName: "Ooasys",
      locale: "es_CO",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${businessName} - ${category} en ${municipality}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
    },
  };
}

export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) notFound();

  // Normalización de datos
  const normalized = normalizeBusinessData(business);
  const categorySlug = getSlugValue(business.category?.slug);
  const municipalitySlug = getSlugValue(business.municipality?.slug);

  // Tipo de Schema según el negocio
  const { isAccommodation, isRealEstate, isRestaurant } = detectNiche(categorySlug);
  const schemaType = isAccommodation
    ? "LodgingBusiness"
    : isRealEstate
    ? "RealEstateAgent"
    : isRestaurant
    ? "Restaurant"
    : "LocalBusiness";

  // Datos relacionados
  const { businesses: related } = await getBusinesses({
    category: categorySlug,
    municipality: municipalitySlug,
    pageSize: 6,
  });
  const relatedBusinesses = related.filter((item) => item._id !== business._id).slice(0, 4);

  // Link de WhatsApp
  const whatsappUrl = business.whatsapp
    ? generateWhatsAppUrl(business.whatsapp.replace(/\D/g, ""), `Hola, vi ${business.name} en Ooasys.`)
    : null;

  // Enlaces sociales para sameAs
  const socialLinks = [business.facebook, business.instagram, business.tiktok, business.website].filter(Boolean);

  // Imágenes para el schema
  const schemaImages: string[] = (business.gallery || [])
    .filter((img: any) => img?.asset)
    .map((img: any) => urlFor(img).width(1200).url());
  if (schemaImages.length === 0 && business.logo?.asset) {
    schemaImages.push(urlFor(business.logo).width(600).url());
  }

  const schemaDescription =
    business.seoDescription?.trim() || business.description || `Información de contacto de ${business.name}`;

  // 🚀 SCHEMA 1: negocio local (sin datos inventados)
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${baseUrl}/business/${slug}#business`,
    name: business.name,
    description: schemaDescription,
    url: `${baseUrl}/business/${slug}`,
    ...((business.phone || business.whatsapp) && { telephone: business.phone || business.whatsapp }),
    ...(schemaImages.length > 0 && { image: schemaImages }),
    ...(business.logo?.asset && { logo: urlFor(business.logo).width(300).height(300).url() }),
    ...(socialLinks.length > 0 && { sameAs: socialLinks }),
    areaServed: {
      "@type": "City",
      name: business.municipality?.name || "Occidente Antioqueño",
    },
    // Solo se muestra si algún día guardas reseñas reales (campo reviewCount en Sanity)
    ...(typeof business.rating === "number" &&
      typeof business.reviewCount === "number" &&
      business.reviewCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: business.rating,
          reviewCount: business.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    address: {
      "@type": "PostalAddress",
      streetAddress: normalized.addressLabel || "Dirección comercial",
      addressLocality: business.municipality?.name || "Occidente Antioqueño",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    ...(business.location?.lat &&
      business.location?.lng && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: business.location.lat,
          longitude: business.location.lng,
        },
      }),
  };

  // 🚀 SCHEMA 2: migas de pan
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Categorías", item: `${baseUrl}/categorias` },
      {
        "@type": "ListItem",
        position: 3,
        name: business.category?.name || "Comercio",
        item: `${baseUrl}/categorias/${categorySlug}`,
      },
      { "@type": "ListItem", position: 4, name: business.name, item: `${baseUrl}/business/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#0f1217] transition-colors duration-300 relative">
      {/* Schemas JSON-LD */}
      <script
        id="business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        id="breadcrumb-business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Header & Hero */}
      <div className="relative pt-8 sm:pt-12 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2 items-center"
          >
            <Link href="/" className="hover:underline">Inicio</Link>
            <span>/</span>
            <Link href="/categorias" className="hover:underline">Categorías</Link>
            <span>/</span>
            <Link href={`/categorias/${categorySlug}`} className="hover:underline">
              {business.category?.name || "Comercio"}
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{business.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
            <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 overflow-hidden rounded-full border-4 border-[#e0e5ec] dark:border-[#0f1217] shadow-[10px_10px_20px_#aab1bc,-10px_-10px_20px_#ffffff] dark:shadow-[10px_10px_20px_#05070a,-10px_-10px_20px_#19212a] flex-shrink-0">
              {business.logo?.asset && (
                <Image
                  src={urlFor(business.logo).width(300).height(300).url()}
                  alt={`Logo oficial de ${business.name}`}
                  fill
                  priority
                  className="object-cover"
                />
              )}
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 break-words">
                {business.name}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 mt-3 sm:mt-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1 font-medium text-sm sm:text-base">
                  <RatingStars rating={business.rating} />
                </div>
                <span className="flex items-center text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
                  <span className="break-words">{normalized.addressLabel}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          {/* Columna izquierda */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8 md:space-y-10">
            <ImageGallery images={business.gallery || []} title={business.name} />

            <section className="bg-[#e0e5ec] dark:bg-[#151a20] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-[12px_12px_24px_#aab1bc,-12px_-12px_24px_#ffffff] dark:shadow-[12px_12px_24px_#05070a,-12px_-12px_24px_#25303a]">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
                Sobre {business.name} en {business.municipality?.name || "Occidente Antioqueño"}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {business.description ||
                  `Bienvenido a ${business.name}. Estamos ubicados en ${
                    business.municipality?.name || "el Occidente Antioqueño"
                  } para prestarte la mejor atención en ${business.category?.name || "nuestros servicios"}.`}
              </p>
            </section>

            {business.amenities && business.amenities.length > 0 && (
              <section className="bg-[#e0e5ec] dark:bg-[#151a20] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-[12px_12px_24px_#aab1bc,-12px_-12px_24px_#ffffff] dark:shadow-[12px_12px_24px_#05070a,-12px_-12px_24px_#25303a]">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                  Servicios e Instalaciones
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {business.amenities.map((amenitySlug: string) => {
                    const amenity = AMENITY_MAP[amenitySlug];
                    if (!amenity) return null;
                    return (
                      <Badge
                        key={amenitySlug}
                        className={`${amenity.className} px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border`}
                      >
                        {amenity.icon}
                        <span className="ml-1.5 sm:ml-2">{amenity.label}</span>
                      </Badge>
                    );
                  })}
                </div>
              </section>
            )}

            {business.location && (
              <section className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-[8px_8px_16px_#aab1bc,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#05070a,-8px_-8px_16px_#25303a]">
                <h3 className="sr-only">Ubicación exacta en el mapa</h3>
                <Map location={business.location} title={business.name} address={formatAddress(business.address)} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-5 xl:col-span-4 space-y-6 sm:space-y-8">
            <div className="sticky top-6">
              <BusinessHours
                hours={business.hours ?? []}
                isAlwaysOpen={business.hours?.some((h: any) => h.isOpen === true && !h.day)}
              />
            </div>
          </aside>
        </div>

        {/* Negocios relacionados */}
        {relatedBusinesses.length > 0 && (
          <section className="mt-12 sm:mt-16 md:mt-20">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-white">
              Otros establecimientos recomendados en {business.municipality?.name || "la zona"}
            </h3>
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {relatedBusinesses.map((b) => (
                <BusinessCard key={b._id} business={b} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Botones flotantes de contacto */}
      <div className="fixed right-2 sm:right-3 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col gap-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] shadow-[8px_8px_16px_#b0b6c0,_-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#080b0f,_-8px_-8px_16px_#222a33] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              title={`Contactar a ${business.name} por WhatsApp`}
            >
              <SiWhatsapp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </a>
          )}
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] shadow-[8px_8px_16px_#b0b6c0,_-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#080b0f,_-8px_-8px_16px_#222a33] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              title={`Llamar a ${business.name}`}
            >
              <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </a>
          )}
          {business.facebook && (
            <a
              href={business.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] shadow-[8px_8px_16px_#b0b6c0,_-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#080b0f,_-8px_-8px_16px_#222a33] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              title="Facebook"
            >
              <SiFacebook className="h-5 w-5 text-[#1877F2]" />
            </a>
          )}
          {business.instagram && (
            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] shadow-[8px_8px_16px_#b0b6c0,_-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#080b0f,_-8px_-8px_16px_#222a33] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              title="Instagram"
            >
              <SiInstagram className="h-5 w-5 text-[#E4405F]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}