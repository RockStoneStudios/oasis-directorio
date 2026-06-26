import { AirVent, Briefcase, Car, CheckCircle2, Globe, MapPin, Phone, Plug, Store, Waves, Wifi } from "lucide-react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import type { Metadata } from "next";
import Image from "next/image";
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

// Mapeo de Amenidades
const AMENITY_MAP: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  pet_friendly: { 
    label: "🐾 Pet Friendly", 
    icon: <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />, 
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" 
  },
  air_conditioning: { 
    label: "Aire Acondicionado", 
    icon: <AirVent className="h-3 w-3 sm:h-4 sm:w-4" />, 
    className: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20" 
  },
  free_wifi: { 
    label: "Wi-Fi Gratis", 
    icon: <Wifi className="h-3 w-3 sm:h-4 sm:w-4" />, 
    className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20" 
  },
  coworking: { 
    label: "Coworking", 
    icon: <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />, 
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" 
  },
  power_outlets: { 
    label: "Tomacorrientes", 
    icon: <Plug className="h-3 w-3 sm:h-4 sm:w-4" />, 
    className: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20" 
  },
  private_parking: { 
    label: "Parqueadero", 
    icon: <Car className="h-3 w-3 sm:h-4 sm:w-4" />, 
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" 
  },
  pool_access: { 
    label: "Piscina", 
    icon: <Waves className="h-3 w-3 sm:h-4 sm:w-4" />, 
    className: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20" 
  },
  water_tank: { 
    label: "Tanque Agua", 
    icon: <Waves className="h-3 w-3 sm:h-4 sm:w-4" />, 
    className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20" 
  },
};

export async function generateMetadata({
  params,
}: BusinessDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return {
      title: "Negocio no encontrado | Ooasys",
      robots: { index: false },
    };
  }

  const businessName = business.name;
  const category = business.category?.name || "Comercio";
  const municipality = business.municipality?.name || "Antioquia";
  const description = business.description || `Información y contacto de ${businessName} en ${municipality}.`;
  
  const keywords = [
    businessName,
    category,
    municipality,
    `${businessName} ${municipality}`,
    `${category} en ${municipality}`,
    business.address,
    business.phone,
    business.whatsapp,
    "directorio local",
    "negocios cerca de mí",
    "ooasys",
  ].filter(Boolean).join(", ");

  const seoTitle = `${businessName} | ${category} en ${municipality} | Teléfono y Horarios | Ooasys`;
  const seoDescription = `${businessName} en ${municipality}. ${description.slice(0, 150)} Ubicación, teléfono ${business.phone || ""}, horarios y contacto.`;

  const imageUrl = business.logo?.asset?.url || "https://www.ooasys.com/ooasys.webp";

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords,
    authors: [{ name: "Ooasys", url: "https://www.ooasys.com" }],
    alternates: {
      canonical: `https://www.ooasys.com/business/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://www.ooasys.com/business/${slug}`,
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
      creator: "@ooasys",
      site: "@ooasys",
    },
  };
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  
  
  if (!business) notFound();

  // Normalización de datos
  const normalized = normalizeBusinessData(business);
  const categorySlug = getSlugValue(business.category?.slug);
  const municipalitySlug = getSlugValue(business.municipality?.slug);

  // Datos relacionados
  const { businesses: related } = await getBusinesses({ 
    category: categorySlug, 
    municipality: municipalitySlug, 
    pageSize: 6 
  });
  const relatedBusinesses = related.filter((item) => item._id !== business._id).slice(0, 4);

  // WhatsApp link
  const whatsappUrl = business.whatsapp 
    ? generateWhatsAppUrl(business.whatsapp.replace(/\D/g, ""), `Hola, vi ${business.name} en Oasis.`) 
    : null;

  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description || `Información de contacto de ${business.name}`,
    "url": `https://www.ooasys.com/business/${slug}`,
    "telephone": business.phone || business.whatsapp || "",
    "priceRange": "$$",
    "image": business.logo?.asset?.url || [],
    ...(business.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": business.rating,
        "reviewCount": "1",
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": normalized.addressLabel || "Dirección conocida",
      "addressLocality": business.municipality?.name || "Antioquia",
      "addressCountry": "CO"
    },
    ...(business.location?.lat && business.location?.lng && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": business.location.lat,
        "longitude": business.location.lng
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#0f1217] transition-colors duration-300 relative">
      
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <div className="relative pt-8 sm:pt-12 pb-12 sm:pb-20">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
            <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 overflow-hidden rounded-full border-4 border-[#e0e5ec] dark:border-[#0f1217] shadow-[10px_10px_20px_#aab1bc,-10px_-10px_20px_#ffffff] dark:shadow-[10px_10px_20px_#05070a,-10px_-10px_20px_#19212a] flex-shrink-0">
              {business.logo?.asset && (
                <Image 
                  src={urlFor(business.logo).width(300).height(300).url()} 
                  alt={business.name} 
                  fill 
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
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                  <span className="break-words">{normalized.addressLabel}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="container px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
          
          {/* Columna Izquierda */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            <ImageGallery images={business.gallery || []} title={business.name} />
            
            <section className="bg-[#e0e5ec] dark:bg-[#151a20] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-[12px_12px_24px_#aab1bc,-12px_-12px_24px_#ffffff] dark:shadow-[12px_12px_24px_#05070a,-12px_-12px_24px_#25303a]">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">Sobre nosotros</h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {business.description}
              </p>
            </section>

            {business.amenities && business.amenities.length > 0 && (
              <section>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">Servicios ofrecidos</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {business.amenities.map((slug: string) => {
                    const amenity = AMENITY_MAP[slug];
                    if (!amenity) return null;
                    return (
                      <Badge key={slug} className={`${amenity.className} px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border`}>
                        {amenity.icon}
                        <span className="ml-1.5 sm:ml-2">{amenity.label}</span>
                      </Badge>
                    );
                  })}
                </div>
              </section>
            )}

            {business.location && (
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-[8px_8px_16px_#aab1bc,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#05070a,-8px_-8px_16px_#25303a]">
                <Map location={business.location} title={business.name} address={formatAddress(business.address)} />
              </div>
            )}
          </div>

          {/* Columna Derecha: Sidebar */}
          <aside className="space-y-6 sm:space-y-8">
            <BusinessHours 
              hours={business.hours ?? []} 
              isAlwaysOpen={business.hours?.some((h: any) => h.isOpen === true && !h.day)} 
            />
          </aside>
        </div>

        {relatedBusinesses.length > 0 && (
          <section className="mt-12 sm:mt-16 md:mt-20">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-white">
              Otros lugares en {business.municipality?.name}
            </h3>
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {relatedBusinesses.map((b) => (
                <BusinessCard key={b._id} business={b} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ============================================================ */}
      {/* BOTONES FLOTANTES FIJOS - MÁS PROFUNDIDAD Y RELIEVE */}
      {/* ============================================================ */}
      <div className="fixed right-0 sm:right-0.5 md:right-1 lg:right-1.5 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-3.5">
           {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] shadow-[8px_8px_16px_#b0b6c0,_-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#080b0f,_-8px_-8px_16px_#222a33] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 active:shadow-[inset_4px_4px_10px_#b0b6c0,inset_-4px_-4px_10px_#ffffff] dark:active:shadow-[inset_4px_4px_10px_#080b0f,inset_-4px_-4px_10px_#222a33]"
              title="WhatsApp"
            >
              <SiWhatsapp className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
            </a>
          )}
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] shadow-[8px_8px_16px_#b0b6c0,_-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#080b0f,_-8px_-8px_16px_#222a33] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 active:shadow-[inset_4px_4px_10px_#b0b6c0,inset_-4px_-4px_10px_#ffffff] dark:active:shadow-[inset_4px_4px_10px_#080b0f,inset_-4px_-4px_10px_#222a33]"
              title="Teléfono"
            >
              <Phone className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
            </a>
          )}
          
          {business.facebook && (
            <a
              href={business.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] shadow-[8px_8px_16px_#b0b6c0,_-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#080b0f,_-8px_-8px_16px_#222a33] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 active:shadow-[inset_4px_4px_10px_#b0b6c0,inset_-4px_-4px_10px_#ffffff] dark:active:shadow-[inset_4px_4px_10px_#080b0f,inset_-4px_-4px_10px_#222a33]"
              title="Facebook"
            >
              <SiFacebook className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 text-[#1877F2]" />
            </a>
          )}
          
          {business.instagram && (
            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] shadow-[8px_8px_16px_#b0b6c0,_-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#080b0f,_-8px_-8px_16px_#222a33] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 active:shadow-[inset_4px_4px_10px_#b0b6c0,inset_-4px_-4px_10px_#ffffff] dark:active:shadow-[inset_4px_4px_10px_#080b0f,inset_-4px_-4px_10px_#222a33]"
              title="Instagram"
            >
              <SiInstagram className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 text-[#E4405F]" />
            </a>
          )}
          
         
        </div>
      </div>
    </div>
  );
}